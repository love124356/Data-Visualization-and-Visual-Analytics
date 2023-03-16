// append the svg object to the body of the page
var tooltip2 = d3.select("#forToolTip")
    .append("div")
    .style("opacity", 0)
    .style("display", "flex")
    .attr("class", "tooltip2")
    .style("background-color", "black")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("width", "75%")
    .style("margin-left", "40px")
    .style("padding-left", "10px")

var page2_dataviz = d3.select("#page2_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

function draw_page2_cloud(spotify_tracks, x_name) {
    // TODO: 文字雲現在只針對前100個隨機選
    var hashmap = new Map();
    for (var i = 0; i < spotify_tracks.length; i++) {
        // console.log(spotify_tracks[i][x_name])
        var key_name = spotify_tracks[i][x_name]
        if (hashmap.has(key_name)) {
            // console.log("dup")
            var cnt = hashmap.get(key_name)
            // console.log(cnt)
            hashmap.set(key_name, cnt + 1);
            continue;
        }
        hashmap.set(key_name, 1);
    }
    // console.log(hashmap)
    // console.log(hashmap.get("Cesária Evora"))
    // var myWords = [{word: "Running", size: "10"}, {word: "Surfing", size: "20"}, {word: "Climbing", size: "50"}, {word: "Kiting", size: "30"}, {word: "Sailing", size: "20"}, {word: "Snowboarding", size: "60"} ]
    var cloud_words = []
    var ccccnt = Math.random() * 115
    hashmap.forEach(function (value, key) {
        // if (cloud_words.length < 100)
        if (x_name == 'track_genre') {
            // console.log(ccccnt)
            cloud_words.push({ word: key, size: ccccnt.toString() })
            ccccnt = Math.random() * 115
        }
        else {
            cloud_words.push({ word: key, size: value.toString() })
        }
    });
    // console.log(cloud_words)
    var cloud_words_sorted = cloud_words.sort(function (a, b) {
        return (a.size < b.size) ? 1 : ((b.size < a.size) ? -1 : 0)
    });
    var cloud_words = []
    for (var i = 0; i < cloud_words_sorted.length; i++) {
        if (cloud_words.length >= 100) break
        cloud_words.push(cloud_words_sorted[i])
    }
    // console.log(cloud_words)
    var layout = d3.layout.cloud()
        .size([width, height])
        .words(cloud_words.map(function (d) { return { text: d.word, size: d.size }; }))
        .padding(5)        //space between words
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .fontSize(function (d) { return d.size; })      // font size of words
        .on("end", draw_cloud);
    layout.start();
    function draw_cloud(words) {
        page2_dataviz
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size; })
            .style("fill", "#69b3a2")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}


function draw_page2(spotify_tracks, x_name) {
    if (x_name == "artists" || x_name == "album_name" || x_name == "track_name" || x_name == "track_genre") {
        draw_page2_cloud(spotify_tracks, x_name)
        return;
    }
    datas = []
    var Xmax = -100000,
        Xmin = 100000;
    for (var i = 0; i < spotify_tracks.length; i++) {
        datas.push({ x_name: spotify_tracks[i][x_name] })
        if (Number(spotify_tracks[i][x_name]) > Xmax) Xmax = Number(spotify_tracks[i][x_name])
        if (Number(spotify_tracks[i][x_name]) < Xmin) Xmin = Number(spotify_tracks[i][x_name])
    }
    // console.log(datas)
    // console.log(Xmax)
    // console.log(Xmin)

    // Add X axis
    var xScale = d3.scaleLinear()
        .domain([Xmin, Xmax])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width])
        .nice()
    page2_dataviz
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .transition().duration(1000)
        .call(d3.axisBottom(xScale).ticks(10, "s"))
    // .selectAll("text")
    // .attr("y", 0)
    // .attr("x", 9)
    // .attr("dy", ".35em")
    // .attr("transform", "rotate(90)")
    // .style("text-anchor", "start");

    // TODO: 針對不同xname要更改他的thresholds 70-> 20之類 , 最後一筆都跑不出來
    var threshold = 70
    if (x_name == "key") threshold = 10
    if (x_name == "mode" || x_name == "explicit") threshold = 2
    if (x_name == "time_signature") threshold = 10

    // set the parameters for the histogram
    var histogram = d3.histogram()
        .value(function (d) { return d.x_name; })   // I need to give the vector of value
        .domain(xScale.domain())  // then the domain of the graphic
        .thresholds(xScale.ticks(threshold)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(datas);
    // console.log(bins)
    // console.log(bins[bins.length-2])
    // console.log(bins[bins.length-1])
    // 因為最後一筆的x0 x1相同(即臨界值)，並不會顯示在圖表上，因此將其加入前一個數量內
    for (var i = 0; i < bins[bins.length - 1].length; i++) {
        bins[bins.length - 2].push(bins[bins.length - 1][i])
    }
    // console.log(bins)
    // console.log(bins[bins.length-2])
    // console.log(bins[bins.length-1])

    // Y axis: scale and draw:
    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, function (d) { return d.length; })]);
    page2_dataviz.append("g")
        .transition().duration(1000)
        .call(d3.axisLeft(yScale));

    page2_dataviz.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text(x_name);



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var showTooltip = function (d) {
        tooltip2
            .transition()
            .duration(100)
            .style("opacity", 1)
        tooltip2
            .html("Range: " + d.x0 + " - " + d.x1 + "<br>Val: " + d.length)
            .style("left", (d3.mouse(this)[0] - 10) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var moveTooltip = function (d) {
        tooltip2
            .style("left", (d3.mouse(this)[0] + 10) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var hideTooltip = function (d) {
        tooltip2
            .transition()
            .duration(100)
            .style("opacity", 0)
    }

    // append the bar rectangles to the svg element
    page2_dataviz.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        // Show tooltip on hover
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)
        .transition()
        .duration(1000)
        .attr("x", 1)
        .attr("transform", function (d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function (d) { return xScale(d.x1) - xScale(d.x0); }) // - 1
        .attr("height", function (d) { return height - yScale(d.length); })
        .style("fill", "#70D6FF")

}


const page2_type_change = d3.select(".selectType2")
    .on("change", function () {
        page2_dataviz.selectAll("*").remove()
        var type = this.value
        draw_page2(spotify_tracks, type)
    })