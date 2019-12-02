function bdchartchart(root){
    // set width, height, and radius 
        document.getElementById("bdchart").innerHTML = "";

var width = 200,
    height = 200,
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
var tooltip = d3.select('body') // select element in the DOM with id 'chart'
  .append('div').classed('tooltip', true); // append a div element to the element we've selected 
tooltip.append('div') // add divs to the tooltip defined above 
  .attr('class', 'label'); // add class 'label' on the selection 
tooltip.append('div') // add divs to the tooltip defined above             
  .attr('class', 'count'); // add class 'count' on the selection
/* tooltip.append('div') // add divs to the tooltip defined above
  .attr('class', 'percent'); // add class 'percent' on the selection*/

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
    .attr("width", 300) // set width
    .attr("height", 250) // set height
  .append("g") // append g element
    .attr("transform", "translate(" + (width / 2+100) + "," + (height / 2) + ")");


// redraw(root);
var path = svg.selectAll("path")
      .data(partition(root).descendants()) // path for each descendant
    .enter().append("path")
      .attr("d", arc) // draw arcs
      .attr("class", "path")
      .style("fill", function (d) { 
          return d.data.color; })
    .attr("opacity","0.8")
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

//**********************
//        LEGEND
//**********************

// legend HTML
var legendContainer = d3.select("#bdlegend").append("div").classed("legends clearfix", true);

var legend = legendContainer.selectAll(".legend")
  .data(root.children)
  .enter()
  .append('div') // replace placeholders with g elements
  .attr('class', 'legend'); // each g is given a legend class

rect = legend.append('div').classed('rect', true) // append rectangle squares to legend
  .style('background-color', function(d) { return d.data.color; })
  .style('border', function (d) { return '1px solid'; })
  .on('click', function (d) {
    var rect = d3.select(this); // this refers to the colored squared just clicked
  
    var totalEnabled = d3.sum(root.children.map(function(d) {
      return (d.data.enabled ) ? 1 : 0; // return 1 for each enabled entry. and summing it up
     }));
  
    if (rect.classed('clicked')) {
      rect.classed('clicked', false)
        .style('background-color', function(d) { return d.data.color; });
        d.data.enabled = true;
      // filter data and rerender
    } else {
      rect.classed('clicked', true)
        .style('background-color', 'transparent');
        d.data.enabled = false;
    }

    var enabledCategory = Object.assign({}, d)
    enabledCategory = d3.hierarchy(enabledCategory.parent.data)
   enabledCategory.children = [];
    d.parent.children.forEach(function(child){
      if (child.data.enabled === true) {
        enabledCategory.children.push(child);
      }
    });
  
    enabledCategory.sum(function(d) {
      if (d.size) {
        total += d.size
      }
      return d.size; 
    });
  
    redraw(enabledCategory)
           
  
    }); // end legend onclick

// adding text to legend
legend.append('span')
  .text(function(d) { return d.data.name; })

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
        return Math.floor((d*6 * (PI/180))*1000)/1000;
      });

// redraw on disabled category
function redraw(d) {  
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
  
  d3.select(".total").text(d.value);
}
    bddetailchart(root);

// zoom on click
function click(d) {
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
  d3.select(".total").text(d.value);
}

// find ancestors
function getRootmostAncestorByWhileLoop(node) {
    while (node.depth > 1) node = node.parent;
    return node;
}
    
}