var d_width = $(".scatterplot").width();
var d_height = $(".scatterplot").height();

var margin = {top: 20, right: 20, bottom: 110, left: 200},
    margin2 = {top: 20, right: 1060, bottom: 110, left: 100},
    width = d_width - margin.left - margin.right,
    width2 = d_width - margin2.left - margin2.right,
    height = d_height - margin.top - margin.bottom,
    height2 = d_height - margin2.top - margin2.bottom;

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width2]),
    y2 = d3.scaleLinear().range([height,0]),
    y = d3.scaleLinear().range([height,0]);

var xAxis = d3.axisBottom(x),
    yAxis2 = d3.axisLeft(y2),
    yAxis = d3.axisLeft(y);

var brush_flag = 0;
var brush = d3.brushY()
    .extent([[0, 0],[width2, height]]) 
    .on("brush", brushed);

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);
var color = "rgb(128, 168, 180)"
var tooltip = d3.select(".tooltip");
var radius = 3;
var svg = d3.select('svg');
svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.dsv('\\', './data/US_final.csv').then(function(data) {
  // if (error) throw error;
    data.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });

    var viewExtent = d3.extent(data, function(d) {
        return +d['views'];
    });
    
    var dateExtent = d3.extent(data, function(d) {
        return +d['trending_date'];
    });

    // console.log(dateExtent);
    x.domain(dateExtent);
    y.domain(viewExtent);
  x2.domain(x.domain());
  y2.domain(y.domain());

// append scatter plot to main chart area 
 var dots = focus.append("g");
    dots.attr("clip-path", "url(#clip)");
    dots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dotFocus')
        .attr('r',radius)
        .attr("cx", function(d) { return x(d.trending_date); })
        .attr("cy", function(d) { return y(d.views); })
        .style('fill', color) 
        .style('opacity', 0.5)
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["title"] + "<br/>" + d["views"] + " views")
                .style("left", (d3.event.pageX - 70) + "px")
                .style("top", (d3.event.pageY - 60) + "px")
                .style("cursor", "pointer");
            // connect_dots(data, d);
            show_all(d);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            reset_all_circles();
            remove_path();
        });
        
focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
      
// focus.append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 0 - margin.left)
//       .attr("x",0 - (height / 2))
//       .attr("dy", "1em")
//       .style("text-anchor", "middle")
//       .style("fill", "white")
//       .text("Views");  
      
// svg.append("text")             
//       .attr("transform",
//             "translate(" + ((width + margin.right + margin.left)/2) + " ," + 
//                            (height + margin.top + margin.bottom) + ")")
//       .style("text-anchor", "middle")
//       .text("Trending Date");
      
// append scatter plot to brush chart area      
 var dots = context.append("g");
     dots.attr("clip-path", "url(#clip)");
     dots.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr('class', 'dotContext')
        .attr("r",1)
        .style("opacity", .5)
        .style('fill', color)
        .attr("cx", function(d) { return x2(d.trending_date); })
        .attr("cy", function(d) { return y2(d.views); })
        
context.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate("+ width2+"," + 0 + ")")
      .call(yAxis2);

context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, y2.range());
    brush_flag = 1;
});

//create brush function redraw scatterplot with selection
function brushed() {
  var selection = d3.event.selection;
  var newDomain =[selection[1],selection[0]].map(y2.invert, y)
  y.domain(newDomain);
  // console.log(newDomain);
  if(brush_flag){
    focus.selectAll(".dotFocus")
        .attr("cx", function(d) { return x(d.trending_date); })
        .attr("cy", function(d) { return y(d.views); });
    focus.select(".axis--y").call(yAxis);
  }
}



d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

function connect_dots(all_videos, curr_video) {
    data = []
    all_videos.forEach(function(element, i) {
        if (element.video_id == curr_video.video_id) {
            data.push(element);
        }
    });

    function basicy() {
        var ret = d3.line()
            .x(function(d) {
                return x(d.trending_date);
            })
        return ret;
    }
    var valueline = basicy()
        .y(function(d) {
            return y(d.views);
        });

    svg.append("path")
        .data([data])
        .attr("d", valueline)
        .attr("class", "line")
}

function remove_path() {
    svg.selectAll(".line")
        .transition()
        .duration(200)
        .remove();
}

function show_all(video_obj) {
    svg.selectAll(".dotFocus")
        .filter(function(d, i) {
            return d.video_id === video_obj.video_id;
        })
        .moveToFront()
        .transition()
        .duration(200)
        .style("fill", "#FF5A5F")
        .style("opacity", "1")
        .attr("r", 3.5);
}

function reset_all_circles() {
    svg.selectAll(".dotFocus")
        .transition()
        .duration(200)
        .style("fill", color)
        .style("opacity", "0.5")
        .attr("r", radius);
}

$('input[name="daterange"]').daterangepicker({
    opens: 'left',
    drops: "up"
}, function(start, end, label) {
    //set up date range in breakdown
    bd_start = start;
    bd_end = end;
    document.getElementById("bd-date").innerHTML = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD') ;
    
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});
