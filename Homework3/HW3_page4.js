var page4_dataviz = d3.select("#page4_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

var tooltip4 = d3.select(".labels")
    .append("div")
    .style("opacity", 0)
    .style("display", "flex")
    .attr("class", "tooltip4")
    .style("background-color", "black")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("width", "100%")
    // .style("margin-left", "40px")
    .style("padding-left", "10px")
// const lables = d3.select(".labels")

for (var i = 0; i < track_genre_types.length; i++) {
    var opt = new Add_options(track_genre_types[i], "selectTrackType4")
}

function draw_page4(spotify_tracks, x_name, tracktype) {

    datas = []
    var Xmax = -100000,
        Xmin = 100000;
    // for (var i = 0; i < spotify_tracks.length; i++) {
    //     datas.push({ x_name: spotify_tracks[i][x_name] })
    //     if (Number(spotify_tracks[i][x_name]) > Xmax) Xmax = Number(spotify_tracks[i][x_name])
    //     if (Number(spotify_tracks[i][x_name]) < Xmin) Xmin = Number(spotify_tracks[i][x_name])
    // }
    var hashmap = new Map();
    for (var i = 0; i < spotify_tracks.length; i++) {
        if(tracktype=="All"){
            // console.log(spotify_tracks[i][x_name])
            var key_name = spotify_tracks[i][x_name]
            if (hashmap.has(key_name)) {
                // console.log("dup")
                var cnt = Number(hashmap.get(key_name))
                cnt = Math.max(cnt, spotify_tracks[i]['popularity'])
                // console.log(cnt)
                hashmap.set(key_name, cnt);
                continue;
            }
            hashmap.set(key_name, spotify_tracks[i]['popularity']);
        }
        else if(spotify_tracks[i]['track_genre']==tracktype){
            // console.log(spotify_tracks[i][x_name])
            var key_name = spotify_tracks[i][x_name]
            if (hashmap.has(key_name)) {
                // console.log("dup")
                var cnt = Number(hashmap.get(key_name))
                cnt = Math.max(cnt, spotify_tracks[i]['popularity'])
                // console.log(cnt)
                hashmap.set(key_name, cnt);
                continue;
            }
            hashmap.set(key_name, spotify_tracks[i]['popularity']);
        }
    }
    // console.log(hashmap)
    // console.log(spotify_tracks)
    var len = 10
    hashmap.forEach(function (value, key) {
        sub_key = key.length > len ? key.substr(0, len) + "..." : key
        datas.push({ x_name: key, cnt: Number(value), subStr: sub_key})
    })
    var datas_sorted = datas.sort(function (a, b) {
        return (Number(a.cnt) < Number(b.cnt)) ? 1 : ((Number(b.cnt) < Number(a.cnt)) ? -1 : 0)
    });
    var datas = []
    // var str_add_show = ""
    var check_substr = []
    for (var i = 0; i < datas_sorted.length; i++) {
        if (datas.length >= 20) break
        // str_add_show = str_add_show + (i + 1).toString() + ": " + datas_sorted[i].x_name + " p = " + "<br>"
        // datas_sorted[i].x_name = datas_sorted[i].x_name.length > 5 ? datas_sorted[i].x_name.substr(0, 10) + "..." : key
        // Avoid duplicate key for x-axis
        while(check_substr.includes(datas_sorted[i]['subStr'])) {
            datas_sorted[i]['subStr'] = datas_sorted[i]['subStr'] + "."
        }
        check_substr.push(datas_sorted[i]['subStr'])
        datas.push(datas_sorted[i])
        if (Number(datas_sorted[i].cnt) > Xmax) Xmax = Number(datas_sorted[i].cnt)
        if (Number(datas_sorted[i].cnt) < Xmin) Xmin = Number(datas_sorted[i].cnt)
    }
    // console.log(datas)
    // console.log(Xmax)
    // console.log(Xmin)
    // lables.html(str_add_show)
    // X axis
    var x = d3.scaleBand()
        .range([0, width])
        .domain(datas.map(function (d) { return d.subStr; }))
        .padding(0.2);
    page4_dataviz.append("g")
        .attr("transform", "translate(0," + height + ")")
        .transition().duration(1000)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
    // .style("font-size", "8px")

    // Add Y axis
    Xmin = Xmin<=10? Xmin:Xmin-10
    var y = d3.scaleLinear()
        .domain([Xmin, Xmax])
        .range([height, 0]);
    page4_dataviz.append("g")
        .transition().duration(1000)
        .call(d3.axisLeft(y));
    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var showTooltip = function (d) {
        tooltip4
            .transition()
            .duration(100)
            .style("opacity", 1)
        tooltip4
            .html("Name: " + d.x_name + "<br>Popularity: " + d.cnt)
            .style("left", (d3.mouse(this)[0] - 10) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var moveTooltip = function (d) {
        tooltip4
            .style("left", (d3.mouse(this)[0] + 10) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var hideTooltip = function (d) {
        tooltip4
            .transition()
            .duration(100)
            .style("opacity", 0)
    }
    // Bars
    page4_dataviz.selectAll("mybar")
        .data(datas)
        .enter()
        .append("rect")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .transition()
        .duration(1000)
        .attr("x", function (d) { return x(d.subStr); })
        .attr("y", function (d) { return y(d.cnt); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {return height - y(d.cnt); })
        .attr("fill", "#70D6FF")

}



const page4_type_change = d3.select(".selectType4")
    .on("change", function () {
        page4_dataviz.selectAll("*").remove()
        var type = this.value
        var track_type = d3.select(".selectTrackType4").node().value
        draw_page4(spotify_tracks, type, track_type)
    })

const page4_Tracktype_change = d3.select(".selectTrackType4")
    .on("change", function () {
        page4_dataviz.selectAll("*").remove()
        var type = d3.select(".selectType4").node().value
        var track_type = this.value
        draw_page4(spotify_tracks, type, track_type)
    })