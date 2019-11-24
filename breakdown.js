//script for showing breakdown graph

var bd_isClick = false;
var c1_act;
var c2_edu;
var c3_ent;
var c4_lif;
var c5_new;
var c6_tec;
var bd_start;
var bd_end;
var bd_sort;

document.getElementById("breakdownSection").style.display = "none";

document.getElementById("bd-act").style.display = "none";
document.getElementById("bd-tec").style.display = "none";
document.getElementById("bd-edu").style.display = "none";
document.getElementById("bd-ent").style.display = "none";
document.getElementById("bd-lif").style.display = "none";
document.getElementById("bd-new").style.display = "none";
document.getElementById("bd-date").innerHTML = document.getElementById("slider").value;



function breakdown_click()
{
    bd_isClick = !bd_isClick;
    console.log("breakdown btn clicked");

    if (bd_isClick == true){
        bd_checkCategory();
        bd_sortfunc();
        document.getElementById("breakdownSection").style.display = "block";
    } else {
        document.getElementById("breakdownSection").style.display = "none";
    }
    
}

d3.dsv('\\', './data/US_final.csv').then(function(dataset) {
    dataset.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });
    console.log(dataset);
});
var root = {
 "name": "TOTAL",
 "color": "#FFF",
 "children": [
  {
   "name": "a",
   "color": '#DADFE1',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 410}
   ]
  },
  {
   "name": "b",
   "color": '#CF000F',
   "children": [
    {"name": "High", "size": 1701},
    {"name": "Med", "size": 584},
    {"name": "Low", "size": 606}
   ]
  },
  {
   "name": "c",
   "color": '#87D37C',
   "children": [
    {"name": "High", "size": 220},
    {"name": "Med", "size": 179},
    {"name": "Low", "size": 322}
   ]
  },
  {
   "name": "d",
   "color": '#4ECDC4',
   "children": [
    {"name": "High", "size": 883},
    {"name": "Med", "size": 132},
    {"name": "Low", "size": 1066}
   ]
  },
  {
   "name": "e",
   "color": '#90C695',
   "children": [
    {"name": "High", "size": 883},
    {"name": "Med", "size": 132},
    {"name": "Low", "size": 416}
   ]
  },
  {
   "name": "f",
   "color": '#4183D7',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 410}
   ]
  },
  {
   "name": "g",
   "color": '#DB0A5B',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 810}
   ]
  },
  {
   "name": "h",
   "color": '#5AD427',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 610}
   ]
  },
  {
   "name": "i",
   "color": '#81CFE0',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 1010}
   ]
  },
  {
   "name": "j",
   "color": '#86a531',
   "children": [
    {"name": "High", "size": 170},
    {"name": "Med", "size": 701},
    {"name": "Low", "size": 410}
   ]
  }
 ]
};

// set width, height, and radius
var width = 500,
    height = 500,
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
tooltip.append('div') // add divs to the tooltip defined above
  .attr('class', 'percent'); // add class 'percent' on the selection

//**********************
//        CHART
//**********************
// prep the data
var root = d3.hierarchy(root);

// calculate total
var total = 0

// must call sum on the hierarchy first
// and as we're doing that, total up the sum of the chart
root.sum(function(d) {
  if (d.size) {
    total += d.size
  }
  return d.size; 
});

// enable data as true true
root.data.children.forEach(function(d){
  d.enabled = true;
})

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
      .attr("class", "path")
      .style("fill", function (d) { return (d.children ? d : d.parent).data.color; })
    .on("click", click)
    .on('mouseover', function(d) {
      var total = d.parent.value;
      var percent = Math.round(1000 * d.value / total) / 10; // calculate percent
      tooltip.select('.label').html(d.data.name); // set current label           
      tooltip.select('.count').html(d.value); // set current count            
      tooltip.select('.percent').html(percent + '%'); // set percent calculated above          
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
var legendContainer = d3.select("#legend").append("div").classed("legends clearfix", true);

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
     }))
  
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
//     console.log('enabledCopy')

//     console.log(enabledCategory)
    
    enabledCategory.children = []
    // console.log('empty copy')
    // console.log(enabledCategory)
  
    d.parent.children.forEach(function(child){
      if (child.data.enabled === true) {
        enabledCategory.children.push(child);
      }
    })
  
    enabledCategory.sum(function(d) {
      if (d.size) {
        total += d.size
      }
      return d.size; 
    });
  
//     console.log('full copy')
//     console.log(enabledCategory)
  
    redraw(enabledCategory)
           
  
    }) // end legend onclick

// adding text to legend
legend.append('span')
  .text(function(d) { return d.data.name; })

svg.append("text")
   .attr("class", "total")
   .attr("text-anchor", "middle")
	 .attr('font-size', '4em')
	 .attr('y', 20)
   .text(total);

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
  
  d3.select(".total").text(d.value);
}

// zoom on click
function click(d) {
  console.log("function click");
  console.log("d.y0 = " + d.y0);
  
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


function bd_checkCategory(){
    c1_act = document.getElementById("c1").checked;
    c2_edu = document.getElementById("c2").checked;
    c3_ent = document.getElementById("c3").checked;
    c4_lif = document.getElementById("c4").checked;
    c5_new = document.getElementById("c5").checked;
    c6_tec = document.getElementById("c6").checked;
    
    if(c1_act == true){
            document.getElementById("bd-act").style.display = "inline";
        } else {
            document.getElementById("bd-act").style.display = "none";
        }
        if(c2_edu == true){
            document.getElementById("bd-edu").style.display = "inline";
        } else {
            document.getElementById("bd-edu").style.display = "none";
        }
        if(c3_ent == true){
            document.getElementById("bd-ent").style.display = "inline";
        } else {
            document.getElementById("bd-ent").style.display = "none";
        }
        if(c4_lif == true){
            document.getElementById("bd-lif").style.display = "inline";
        } else {
            document.getElementById("bd-lif").style.display = "none";
        }
        if(c5_new == true){
            document.getElementById("bd-new").style.display = "inline";
        } else {
            document.getElementById("bd-new").style.display = "none";
        }
        if(c6_tec == true){
            document.getElementById("bd-tec").style.display = "inline";
        } else {
            document.getElementById("bd-tec").style.display = "none";
        }
}

function bd_sortfunc() {
    document.getElementById("bd-secondlevel").options.length = 0;
    bd_sort = document.getElementById("uc_02").value;
    //var el = document.getElementById('display');
    var selectobject = document.getElementById("uc_02");
    for (var i=0; i<selectobject.length; i++) {
        if (selectobject.options[i].value != bd_sort){
            var option = document.createElement("option");
            option.text = selectobject.options[i].text;
            option.value = selectobject.options[i].value;
            document.getElementById("bd-secondlevel").add(option);
    }

    }
  
    
}