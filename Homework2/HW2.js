// https://d3-graph-gallery.com/graph/parallel_custom.html

// set the dimensions and margins of the graph
var margin = { top: 30, right: 50, bottom: 10, left: 50 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the my_dataviz of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Add the grey background that makes ggplot2 famous
svg
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("height", height)
  .attr("width", height)
  .style("fill", "white")


// Color scale: give me a class name, I return a color
var color = d3.scaleOrdinal()
  .domain(["Iris-setosa", "Iris-versicolor", "Iris-virginica"])
  .range(["#F8766D", "#00BA38", "#619CFF"])

// Add one dot in the legend for each name.
var legend = d3.select(".legend")
  .append("svg")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

var size = 20
var allgroups = ["Iris-setosa", "Iris-versicolor", "Iris-virginica"]
legend.selectAll("myrect")
  .data(allgroups)
  .enter()
  .append("rect")
  .attr("x", -10)
  .attr("y", function (d, i) { return i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("width", size)
  .attr("height", size)
  .style("fill", function (d) { return color(d) })

// Add labels beside legend dots
legend.selectAll("mylabels")
  .data(allgroups)
  .enter()
  .append("text")
  .attr("x", 0 + size * .8)
  .attr("y", function (d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
  .style("fill", function (d) { return color(d) })
  .text(function (d) { return d })
  .attr("text-anchor", "left")
  .style("alignment-baseline", "middle")


var iris = []
ori_dimensions = ["petal length", "petal width", "sepal length", "sepal width"]
//Read the data
d3.csv("http://vis.lab.djosix.com:2020/data/iris.csv", function (data) {
  // 151, 但實際只有150筆資料，用console可以發現最後一筆是undefined的
  // console.log("data.length: ", data.length)
  for (var i = 0; i < data.length - 1; i++) {
    iris.push(data[i])
    // console.log(data[i])
  }
  // 第一個參數是x軸 第二個參數是y軸
  draw(iris, ori_dimensions)
});


function draw(iris, dimensions) {

  // Here I set the list of dimension manually to control the order of axis:

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    label_name = dimensions[i]
    // console.log(label_name)
    y[label_name] = d3.scaleLinear()
      .domain([0, 8]) // --> Same axis range for each group
      // --> different axis range for each group --> .domain( [d3.extent(iris, function(d) { return +d[label_name]; })] )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

  // Highlight the specie that is hovered
  var highlight = function (d) {

    selected_specie = d.class
    // console.log(selected_specie)
    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_specie)
      .transition().duration(200)
      .style("stroke", color(selected_specie))
      .style("opacity", "1")
  }

  // Unhighlight
  var doNotHighlight = function (d) {
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function (d) { return (color(d.class)) })
      .style("opacity", "1")
  }

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
    // console.log(d)
    return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(iris)
    .enter()
    .append("path")
    .attr("class", function (d) { return "line " + d.class }) // 2 class for each line: 'line' and the group name
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function (d) { return (color(d.class)) })
    .style("opacity", 0.5)
    // .on("mouseover", highlight)
    // .on("mouseleave", doNotHighlight)

  var first_click = null, second_click = null;
  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    // I translate this element to its right position on the x axis
    .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function (d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
    // Add axis title
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) { return d; })
    .style("fill", "black")
    .on('click', function () {
      // console.log(this)
      if(first_click != null){
        second_click = this.textContent
        d3.select(".selecty").text(second_click)
        
        var one = ori_dimensions.indexOf(first_click)
        var two = ori_dimensions.indexOf(second_click)
        ori_dimensions[two] = first_click
        ori_dimensions[one] = second_click
        
        svg.selectAll("*").remove()
        d3.select(".selecty").text("?????")
        d3.select(".selectx").text("?????")
        draw(iris, ori_dimensions)
      }
      else {
        first_click = this.textContent
        d3.select(".selectx").text(first_click)
      }
      console.log(first_click)
      console.log(second_click)
    });
}

// const y_change = d3.select(".selecty")
//   .on("change", function () {
//     svg.selectAll("*").remove()
//     var x_name = d3.select(".selectx").node().value
//     var y_name = this.value
//     draw(iris, x_name, y_name)

//   })
// var x_change = d3.select(".selectx")
//   .on("change", function () {
//     svg.selectAll("*").remove()
//     var x_name = this.value
//     var y_name = d3.select(".selecty").node().value
//     draw(iris, x_name, y_name)
//   })
