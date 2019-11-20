var svg = d3.select('svg');

// Original lab3 codes
// Create x-scale for positioning the circles
var radius = 3;
var xScale = d3.scaleTime()
    .range([100, 1000]);

// Create y-scale for positioning the circles
var yScale = d3.scaleLinear()
    .range([550, 50]);

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Create a quantize scale for the three habital zone bins
// var colorScale = d3.scaleQuantize()
//     .range(['#d64d3f', '#96ac3d', '#208d8d']);
var color = "rgb(128, 168, 180)"
var tooltip = d3.select(".tooltip");

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
                return xScale(d.trending_date);
            })
        return ret;
    }
    var valueline = basicy()
        .y(function(d) {
            return yScale(d.views);
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
    svg.selectAll("circle")
        .filter(function(d, i) {
            return d.video_id === video_obj.video_id;
        })
        .moveToFront()
        .transition()
        .duration(200)
        .style("fill", "#FF5A5F")
        .style("opacity", "1")
        .attr("r", 3.5);
    // svg.selectAll("circle")
    //     .filter(function(d, i) { return d.video_id != video_obj.video_id; })
    //     .transition()
    //     .duration(200)
    //       .style("opacity","0.1");
}

function reset_all_circles() {
    svg.selectAll("circle")
        .transition()
        .duration(200)
        .style("fill", color)
        .style("opacity", "0.5")
        .attr("r", radius);
}

// Load the dataset
d3.dsv('\\', './data/US_final.csv').then(function(dataset) {
    dataset.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });

    videos = dataset;
    console.log(videos);

    // // Use extent and max to compute the input domain for the scales

    var viewExtent = d3.extent(videos, function(d) {
        return +d['views'];
    });
    yScale.domain(viewExtent);
    var dateExtent = d3.extent(videos, function(d) {
        return +d['trending_date'];
    });
    // colorScale.domain(hzdExtent);
    xScale.domain(dateExtent);

    // Create a d3 selection for the videos
    svg.selectAll('.video')
        .data(videos) // Data-bind the videos array to the d3-selection
        .enter() // Enter - selects incoming data-bound elements
        .append('circle')
        .attr('class', 'video') // Add the classname that we selected on
        .attr('r', function(d) {
            // Set the radius attribute based on the planet's radius
            return radius;
        })
        .attr('cx', function(d) {
            // Set the x-position based on the hzd value
            return xScale(d.trending_date);
        })
        .attr('cy', function(d) {
            // Set the y-position based on the mass value
            return yScale(d.views);
        })
        .style('fill', function(d) {
            // Set the fill color based on the hzd value
            return color;
        })
        .style('opacity', function(d) {
            return 0.5;
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["title"] + "<br/>" + d["views"] + " views")
                .style("left", (d3.event.pageX - 70) + "px")
                .style("top", (d3.event.pageY - 60) + "px")
                .style("cursor", "pointer");
            connect_dots(dataset, d);
            show_all(d);

            // var hovered = d3.select(this);
            // hovered
            //     .style('stroke-width', 2)
            //     .style('fill', 'orange')
            //     .style('stroke', '#333');
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            reset_all_circles();
            remove_path();
            // var hovered = d3.select(this);
            // hovered
            //     .style('stroke-width', 0)
            //     .style('fill', null)
            //     .style('stroke', 'none');
        });

    // Create axes for both the y- and x-scale
    svg.append('g') // Append a g element for the scale
        .attr('class', 'x axis') // Use a class to css style the axes together
        .attr('transform', 'translate(0,40)') // Position the axis
        .call(d3.axisTop(xScale)); // Call the axis function

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,570)')
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(70,0)')
        .call(d3.axisLeft(yScale));

    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(1050,0)')
        .call(d3.axisRight(yScale));

    // left y axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "translate(20,50)rotate(0)")
        .attr("dy", "0.3em")
        .text("Views");

    // right y axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "translate(1150,50)rotate(0)")
        .attr("dy", "0.3em")
        .text("Views");
});


$('input[name="daterange"]').daterangepicker({
    opens: 'left',
    drops: "up"
}, function(start, end, label) {
    console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});