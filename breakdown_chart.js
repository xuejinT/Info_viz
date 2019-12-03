function bdchartchart(root){
    document.getElementById("bdchart").innerHTML = "";

    // set width, height, and radius
var width = 325,
    height = 325,
    radius = (Math.min(width, height) / 2) - 10; // lowest number divided by 2. Then subtract 10

// legend dimensions
var legendRectSize = 15; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

var formatNumber = d3.format(",d"); // formats floats

var x = d3.scaleLinear() // continuous scale. preserves proportional differences
    .range([0, 2 * Math.PI]); // setting range from 0 to 2 * circumference of a circle

var y = d3.scaleSqrt() // continuous power scale 
    .range([0, radius]); // setting range from 0 to radius

var partition = d3.partition(); // subdivides layers

// define arcs
var arc = d3.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y0)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y1)); });

//**********************
//        TOOLTIP
//**********************

// define tooltip
var tooltip = d3.select('#bdchart') // select element in the DOM with id 'chart'
  .append('div').classed('tooltip', true); // append a div element to the element we've selected    
tooltip.append('div') // add divs to the tooltip defined above 
  .attr('class', 'label'); // add class 'label' on the selection                
tooltip.append('div') // add divs to the tooltip defined above             
  .attr('class', 'count'); // add class 'count' on the selection

//**********************
//        CHART
//**********************
// prep the data
var root = d3.hierarchy(root);

// calculate total
var total = 0;

// must call sum on the hierarchy first
// and as we're doing that, total up the sum of the chart
root.sum(function(d) {
  if (d.size) {
    total += d.size;
  }
  return d.size; 
});

// enable data as true true
root.data.children.forEach(function(d){
  d.enabled = true;
});

// define SVG element
var svg = d3.select("#bdchart").append("svg")
    .attr("width", width) // set width
    .attr("height", height) // set height
  .append("g") // append g element
    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");

// redraw(root);
var path = svg.selectAll("path")
      .data(partition(root).descendants()) // path for each descendant
    .enter().append("path")
      .attr("d", arc) // draw arcs
      .attr("class", "bdpath")
      .style("fill", function (d) { 
          return d.data.color; })
    .style("opacity", 0.8)
    .on("click", click)
    .on('mouseover', function(d) {
      var total = d.parent.value;

      var percent = Math.round(1000 * d.value / total) / 10; // calculate percent
      tooltip.select('.label').html(function(){
        if (d.parent.data.name != "TOTAL"){
            return d.data.name + ' ' + secFlag;
        } else {
            return d.data.name;
        }
    }); // set current label           
      tooltip.select('.count').html(d.value + ' videos'); // set current count            
      tooltip.style('display', 'block'); // set display   
    })
    .on('mouseout', function() { // when mouse leaves div                        
      tooltip.style('display', 'none'); // hide tooltip for that element
    })
    .on('mousemove', function(d) { // when mouse moves                  
      tooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
      tooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });

d3.select(self.frameElement).style("height", height + "px");

svg.append("text")
   .attr("class", "bdtotal")
   .attr("text-anchor", "middle")
    .style('fill', 'white')
	 .attr('font-size', '2em')
	 .attr('y', 5)
   .text(total);
    
    svg.append("text")
   .attr("class", "bdtotal")
   .attr("text-anchor", "middle")
    .style('fill', 'white')
	 .attr('font-size', '1em')
	 .attr('y', 20)
   .text("Videos");

//**********************
//       FUNCTIONS
//**********************

var drawArc = d3.arc()
      .innerRadius(function(d, i) {
        return  arcMin + i*(arcWidth) + arcPad;
      })
      .outerRadius(function(d, i) {
        return arcMin + (i+1)*(arcWidth);
      })
      .startAngle(0 * (Math.PI/180))
      .endAngle(function(d, i) {
        return Math.floor((d*6 * (Math.PI/180))*1000)/1000;
      });

bddetailchart(root);


// redraw on disabled category
function redraw(d) {
  console.log("function redraw");
  
  svg.transition()
      .duration(750)
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? (radius/2) : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
  
  d3.select(".bdtotal").text(d.value);
}

// zoom on click
function click(d) {
    console.log(d);

  svg.transition()
      .duration(750) // duration of transition
      .tween("scale", function() {
        var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]),
            yr = d3.interpolate(y.range(), [d.y0 ? (80) : 0, radius]);
        return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
      })
    .selectAll("path")
      .attrTween("d", function(d) { return function() { return arc(d); }; });
  d3.select(".bdtotal").text(d.value);
    if(d.depth == 0){
        bddetailchart(root);
    } else if(d.depth == 1){
        var newdata = {
            name: "TOTAL",
        color: "#1E1E1E",
        children: [d.data]
        };
        newdata = d3.hierarchy(newdata);
        newdata.sum(function(d) {
        if (d.size) {
            total += d.size;
        }
            return d.size; 
        });
        bddetailchart(newdata);
    } else if(d.depth == 2){
        /*var newChild = d.parent;
        newChild.data.children = [];
        newChild.data.children.concat(d.data);
        var newdata = {
            name: "TOTAL",
        color: "#1E1E1E",
        children: [newChild]
        };
        newdata = d3.hierarchy(newdata);
        newdata.sum(function(d) {
        if (d.size) {
            total += d.size;
        }
            return d.size; 
        });
        console.log(newdata);
        bddetailchart(newdata);*/
    }

}

// find ancestors
function getRootmostAncestorByWhileLoop(node) {
    while (node.depth > 1) node = node.parent;
    return node;
}
    
}