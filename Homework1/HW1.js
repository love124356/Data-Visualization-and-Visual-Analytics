// https://d3-graph-gallery.com/graph/custom_theme.html

// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 40, left: 50 },
  width = 520 - margin.left - margin.right,
  height = 520 - margin.top - margin.bottom;

// append the svg object to the my_dataviz of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")

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
  .append("circle")
  .attr("cx", 0)
  .attr("cy", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
  .attr("r", 5)
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
//Read the data
d3.csv("http://vis.lab.djosix.com:2020/data/iris.csv", function (data) {
  // 151, 但實際只有150筆資料，用console可以發現最後一筆是undefined的
  // console.log("data.length: ", data.length)
  for (var i = 0; i < data.length - 1; i++) {
    iris.push(data[i])
    // console.log(data[i])
  }
  // 第一個參數是x軸 第二個參數是y軸
  draw(iris, "sepal length", "petal length")
});



function draw(iris, x_name, y_name) {

  // console.log(iris.length)
  // console.log(iris)
  // console.log(x_name)
  // console.log(y_name)

  var Xmax = Number(d3.max(iris, function (d) { return d[x_name] })),
    Xmin = Number(d3.min(iris, function (d) { return d[x_name] })),
    Ymax = Number(d3.max(iris, function (d) { return d[y_name] })),
    Ymin = Number(d3.min(iris, function (d) { return d[y_name] }));

  // console.log(Xmax)
  // console.log(Xmin)
  // console.log(Ymax)
  // console.log(Ymin)
  // Add X axis
  var xScale = d3.scaleLinear()
    .domain([Xmin - .1, Xmax + .1])
    .range([0, width])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickSize(-height * 1.3).ticks(10))
    .select(".domain").remove()

  // Add Y axis
  var yScale = d3.scaleLinear()
    .domain([Ymin - .1, Ymax + .1])
    .range([height, 0])
    .nice()
  svg.append("g")
    .call(d3.axisLeft(yScale).tickSize(-width * 1.3).ticks(7))
    .select(".domain").remove()

  // Customization
  svg.selectAll(".tick line").attr("stroke", "gray")

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + margin.left)
    .attr("y", height + margin.top + 20)
    .text(x_name);

  // Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 20)
    .attr("x", -margin.top - height / 2 + 20)
    .text(y_name)

  // Add dots
  var node = svg.append('g')
    .selectAll("dot")
    .data(iris)
    .enter()

  node.append("circle")
    .attr("cx", function (d) { return xScale(d[x_name]); })
    .attr("cy", function (d) { return yScale(d[y_name]); })
    .attr("r", 5)
    .style("fill", function (d) { return color(d.class) })
}

const y_change = d3.select(".selecty")
  .on("change", function () {
    svg.selectAll("*").remove()
    var x_name = d3.select(".selectx").node().value
    var y_name = this.value
    draw(iris, x_name, y_name)

  })
var x_change = d3.select(".selectx")
  .on("change", function () {
    svg.selectAll("*").remove()
    var x_name = this.value
    var y_name = d3.select(".selecty").node().value
    draw(iris, x_name, y_name)
  })
