var page5_dataviz = d3.select("#page5_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 70)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform",
        "translate(" + (margin.left + 70) + "," + margin.top + ")")
var svgForLegendStuff = d3.select(".legend5").append("svg")
    // .attr("width", 130)
    // .attr("height", 27);
var tooltip5 = d3.select(".labels5")
    .append("div")
    .style("opacity", 0)
    .style("display", "flex")
    .attr("class", "tooltip5")
    .style("background-color", "black")
    .style("color", "white")
    .style("border-radius", "5px")
    .style("width", "100%")
    // .style("margin-left", "40px")
    .style("padding-left", "10px")
// const lables = d3.select(".labels")

function draw_page5(spotify_tracks, names) {
    //  popularity, duration_ms, danceability, energy, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo 
    //  total: 11
    //  https://bl.ocks.org/HarryStevens/302d078a089caf5aeb13e480b86fdaeb

    data = []
    cols = names
    for (var i = 0; i < spotify_tracks.length; i++) {
        var obj = { index: i }
        cols.forEach(col => {
            obj[col] = Number(spotify_tracks[i][col])
        });
        data.push(obj)

    }

    console.log(data)
    console.log(cols)
    var corr = jz.arr.correlationMatrix(data, cols);
    console.log(corr)


    var Xmax = -100000,
        Xmin = 100000;
    for (var i = 0; i < corr.length; i++) {
        if (Number(corr[i]['correlation']) > Xmax) Xmax = Number(corr[i]['correlation'])
        if (Number(corr[i]['correlation']) < Xmin) Xmin = Number(corr[i]['correlation'])
    }
    console.log(Xmax)
    console.log(Xmin)
    // column_x: 'popularity', column_y: 'popularity', correlation: 1
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var myGroups = cols
    var myVars = cols

    console.log(myGroups)
    console.log(myVars)
    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.05);
    page5_dataviz.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(0))
        .select(".domain").remove()
    page5_dataviz.selectAll("text")
        .attr("transform", "rotate(-45)").style("text-anchor", "end")

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)
        .padding(0.05);
    page5_dataviz.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    // Build color scale
    var myColor = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([Xmin, Xmax])

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip5
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        tooltip5
            .html("X: " + d.column_x + "<br>Y: " + d.column_y + "<br>Correlation: " + d.correlation.toFixed(8))
            .style("left", (d3.mouse(this)[0] + 70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function (d) {
        tooltip5
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    // add the squares
    page5_dataviz.selectAll()
        .data(corr, function (d) { return d.column_x + ':' + d.column_y; })
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(d.column_x) })
        .attr("y", function (d) { return y(d.column_y) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) { return myColor(d.correlation) })
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)


    //  Add legend: https://codepen.io/davorjovanovic/details/OJRzPwq
    var linearGradient = svgForLegendStuff
        .append("linearGradient")
        .attr("id", "linear-gradient");
    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");
    //Append multiple color stops by using D3's data/enter step
    linearGradient
        .selectAll("stop")
        .data([
            { offset: "0%", color: myColor(Xmin) },
            { offset: "50%", color: myColor((Xmax + Xmin) / 2) },
            { offset: "100%", color: myColor(Xmax) },
        ])
        .enter()
        .append("stop")
        .attr("offset", function (d) {
            return d.offset;
        })
        .attr("stop-color", function (d) {
            return d.color;
        });
    var legendWidth = 130,
        legendHeight = 8;
    //Color Legend container
    // "translate(" + (margin.left + 70) + "," + margin.top + ")")
    var legendsvg = svgForLegendStuff
        .append("g")
        .attr("id", "legend")
        .attr(
            "transform",
            "translate(" + (20) + "," + (0) + ")"
        );
    //Draw the Rectangle
    legendsvg
        .append("rect")
        .attr("class", "legendRect")
        // .attr("x", -legendWidth / 2 + 0.5)
        // .attr("y", 10)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)")
        .style("stroke", "black")
        .style("stroke-width", "1px");
    // //Append title
    // legendsvg
    //     .append("text")
    //     .attr("class", "legendTitle")
    //     .attr("x", 0)
    //     .attr("y", 2)
    //     .text("Average Global Surface Temperature");
    //Set scale for x-axis
    var xScale2 = d3
        .scaleLinear()
        .range([0, legendWidth])
        .domain([Xmin, Xmax]);
    var sumMinMaxLegend = Xmax + Xmin
    var xAxis = legendsvg
        .append("g")
        .call(
            d3
                .axisBottom(xScale2)
                .tickValues([
                    Xmin,
                    (sumMinMaxLegend / 2 + Xmin) / 2,
                    sumMinMaxLegend / 2,
                    (sumMinMaxLegend / 2 + Xmax) / 2,
                    Xmax,
                ])
                .tickFormat((x) => x.toFixed(2))
        )
        .attr("class", "legendAxis")
        .attr("id", "legendAxis")
        .attr(
            "transform",
            "translate(" + (-0.5) + "," + (legendHeight) + ")"
        );
    // var linearGradient = page5_dataviz
    //     .append("linearGradient")
    //     .attr("id", "linear-gradient");
    // //Horizontal gradient
    // linearGradient
    //     .attr("x1", "0%")
    //     .attr("y1", "0%")
    //     .attr("x2", "100%")
    //     .attr("y2", "0%");
    // //Append multiple color stops by using D3's data/enter step
    // linearGradient
    //     .selectAll("stop")
    //     .data([
    //         { offset: "0%", color: myColor(Xmin) },
    //         { offset: "50%", color: myColor((Xmax + Xmin)/2) },
    //         { offset: "100%", color: myColor(Xmax) },
    //     ])
    //     .enter()
    //     .append("stop")
    //     .attr("offset", function (d) {
    //         return d.offset;
    //     })
    //     .attr("stop-color", function (d) {
    //         return d.color;
    //     });
    // var legendWidth = width + margin.right,    //160,
    //     legendHeight = 8;
    // //Color Legend container
    // // "translate(" + (margin.left + 70) + "," + margin.top + ")")
    // var legendsvg = page5_dataviz
    //     .append("g")
    //     .attr("id", "legend")
    //     .attr(
    //         "transform",
    //         "translate(" + (margin.left * 2 + 70) + "," + (-margin.top) + ")"
    //     );
    // //Draw the Rectangle
    // legendsvg
    //     .append("rect")
    //     .attr("class", "legendRect")
    //     .attr("x", -legendWidth / 2 + 0.5)
    //     .attr("y", 10)
    //     .attr("width", legendWidth)
    //     .attr("height", legendHeight)
    //     .style("fill", "url(#linear-gradient)")
    //     .style("stroke", "black")
    //     .style("stroke-width", "1px");
    // // //Append title
    // // legendsvg
    // //     .append("text")
    // //     .attr("class", "legendTitle")
    // //     .attr("x", 0)
    // //     .attr("y", 2)
    // //     .text("Average Global Surface Temperature");
    // //Set scale for x-axis
    // var xScale2 = d3
    //     .scaleLinear()
    //     .range([0, legendWidth])
    //     .domain([Xmin, Xmax]);
    // var sumMinMaxLegend = Xmax + Xmin
    // var xAxis = legendsvg
    //     .append("g")
    //     .call(
    //         d3
    //             .axisBottom(xScale2)
    //             .tickValues([
    //                 Xmin,
    //                 (sumMinMaxLegend / 2 + Xmin) / 2,
    //                 sumMinMaxLegend / 2,
    //                 (sumMinMaxLegend / 2 + Xmax) / 2,
    //                 Xmax,
    //             ])
    //             .tickFormat((x) => x.toFixed(2))
    //     )
    //     .attr("class", "legendAxis")
    //     .attr("id", "legendAxis")
    //     .attr(
    //         "transform",
    //         "translate(" + -legendWidth / 2 + "," + (10 + legendHeight) + ")"
    //     );

}



// const page5_type_change = d3.select(".selectType5")
//     .on("change", function () {
//         page5_dataviz.selectAll("*").remove()
//         var type = this.value
//         draw_page5(spotify_tracks, type)
//     })