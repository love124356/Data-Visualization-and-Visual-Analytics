for (var i = 0; i < track_genre_types.length; i++) {
    var opt = new Add_options(track_genre_types[i], "selectType3")
}

var tooltip3 = d3.select(".legend")
    .append("div")
    .style("opacity", 0)
    .style("display", "flex")
    .attr("class", "tooltip3")
    .style("background-color", "black")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("width", "50%")
    .style("height", "1.5em")
    .style("margin-left", "40px")
    .style("padding-left", "10px")

var legend = d3.select(".legend")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

var cnt_exps = d3.select(".legend").append("div")
// Draw Legend
var size = 20
legend.selectAll("myrect")
    .data(explicits)
    .enter()
    .append("rect")
    .attr("x", -10)
    .attr("y", function (d, i) { return i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d) { return color(d) })

// Add labels beside legend dots
legend.selectAll("mylabels")
    .data(explicits)
    .enter()
    .append("text")
    .attr("x", 0 + size * .8)
    .attr("y", function (d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) { return color(d) })
    .text(function (d) { return d })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")

// append the svg object to the page1_dataviz of the page
var page3_dataviz = d3.select("#page3_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right - 50)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

function draw_page3(spotify_tracks, x_name, y_name, type) {

    datas = []
    var Xmax = -100000,
        Xmin = 100000,
        Ymax = -100000,
        Ymin = 100000;

    for (var i = 0; i < spotify_tracks.length; i++) {
        if (spotify_tracks[i]['track_genre'] == type) {
            datas.push(spotify_tracks[i])
            if (Number(spotify_tracks[i][x_name]) > Xmax) Xmax = Number(spotify_tracks[i][x_name])
            if (Number(spotify_tracks[i][x_name]) < Xmin) Xmin = Number(spotify_tracks[i][x_name])
            if (Number(spotify_tracks[i][y_name]) > Ymax) Ymax = Number(spotify_tracks[i][y_name])
            if (Number(spotify_tracks[i][y_name]) < Ymin) Ymin = Number(spotify_tracks[i][y_name])
            // console.log(Number(spotify_tracks[i][x_name]))
        }
    }
    // console.log(datas)
    // var Xmax = Number(d3.max(datas, function (d) { return d[x_name] })),
    //   Xmin = Number(d3.min(datas, function (d) { return d[x_name] })),
    //   Ymax = Number(d3.max(datas, function (d) { return d[y_name] })),
    //   Ymin = Number(d3.min(datas, function (d) { return d[y_name] }));

    // console.log(Xmax)
    // console.log(Xmin)
    // console.log(Ymax)
    // console.log(Ymin)
    // Add X axis
    var xScale = d3.scaleLinear()
        .domain([Xmin - .1, Xmax + .1])
        .range([0, width - 20])
    page3_dataviz.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickSize(-height * 1.3).ticks(10, 's'))
        .select(".domain").remove()
        .transition().duration(1000)

    // Add Y axis
    var yScale = d3.scaleLinear()
        .domain([Ymin - .1, Ymax + .1])
        .range([height - 20, 0])
    page3_dataviz.append("g")
        .call(d3.axisLeft(yScale).tickSize(-width * 1.3).ticks(7, 's'))
        .select(".domain").remove()
        .transition().duration(1000)

    // Customization
    page3_dataviz.selectAll(".tick line").attr("stroke", "gray")

    // Add X axis label:
    page3_dataviz.append("text")
        .attr("text-anchor", "end")
        .attr("x", width / 2 + margin.left)
        .attr("y", height + margin.top + 20)
        .text(x_name);

    // Y axis label:
    page3_dataviz.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top - height / 2 + 20)
        .text(y_name)

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function (d) {
        tooltip3
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip3
            .html("X: " + d[x_name] + ", Y: " + d[y_name])
            .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip3
            .transition()
            .duration(200)
            .style("opacity", 0)
    }
    // Add dots
    var cnt_explicit_t = 0
    var cnt_explicit_f = 0
    var node = page3_dataviz.append('g')
        .selectAll("dot")
        .data(datas)
        .enter()
        .append("circle")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return xScale(d[x_name]); })
        .attr("cy", function (d) { return yScale(d[y_name]); })
        .attr("r", 3)
        .style("fill", function (d) { if(d.explicit==0) cnt_explicit_f++; else cnt_explicit_t++;  return color(d.explicit) })
    
    // Add cnt of true and false exp to legend
    // console.log(cnt_explicit_t)
    // console.log(cnt_explicit_f)
    cnt_exps
        .attr("class", "exp_cnt")
        .html("Explicit FALSE: " + cnt_explicit_f + "<br>Explicit TRUE: " + cnt_explicit_t)
}

// Listener
var x_change = d3.select(".selectx3")
    .on("change", function () {
        page3_dataviz.selectAll("*").remove()
        var x_name = this.value
        var y_name = d3.select(".selecty3").node().value
        var type = d3.select(".selectType3").node().value
        draw_page3(spotify_tracks, x_name, y_name, type)
    })

const y_change = d3.select(".selecty3")
    .on("change", function () {
        page3_dataviz.selectAll("*").remove()
        var x_name = d3.select(".selectx3").node().value
        var y_name = this.value
        var type = d3.select(".selectType3").node().value
        draw_page3(spotify_tracks, x_name, y_name, type)

    })

const type_change = d3.select(".selectType3")
    .on("change", function () {
        page3_dataviz.selectAll("*").remove()
        var x_name = d3.select(".selectx3").node().value
        var y_name = d3.select(".selecty3").node().value
        var type = this.value
        draw_page3(spotify_tracks, x_name, y_name, type)
    })