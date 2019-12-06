function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const key = new Map([
    ['views', 'Number of Views'],
    ['likes', 'Number of Likes'],
    ['dislikes', 'Number of Dislikes'],
    ['ratio', 'Likes Ratio(%)'],
    ['comment_count', 'Number of Commetns'],
    ['income', 'Income (Dollar)'],
    ['temperature', 'Temperature'],
    ['trending_length', 'Trending Length (Day)']
]);

var cluster_map ={
	0:"Activisim",
	1:"Education",
	2:"Entertainment",
	3:"Lifestyle",
	4:"News",
	5:"Technology"
}
var svg = d3.select('svg');
var curr_y = "views";
var highlighted_id = ""
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
var tooltip = d3.select(".overview-tooltip");
var logo = d3.select("logo");

var g = svg
    .append('g');


// Load the data
d3.dsv('\\', './data/US_final.csv').then(function(data) {
    data.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });

    videos = data;
    all_videos = data;
    var viewExtent = d3.extent(videos, function(d) {
        return +d['views'];
    });
    yScale.domain(viewExtent);
    var dateExtent = d3.extent(videos, function(d) {
        return +d['trending_date'];
    });
    xScale.domain(dateExtent);

    brush = d3.brush()
        .extent([
            [100, 50],
            [1000, 550]
        ])
        .on('brush end', updateBrush);

    // attach the brush to the chart
    var gBrush = g.append('g')
        .attr('class', 'brush')
        .call(brush);

    // Create a d3 selection for the videos
    quadtree = d3.quadtree()
        .x(d => xScale(d.trending_date))
        .y(d => yScale(d.views))
        .addAll(data);

    g.selectAll('.video')
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
        .on("click", function(d) {
            highlighted_id = d.video_id;
            highlight_single_video();
            connect_dots();
        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d["title"] + "<br/>" + key.get(curr_y) + " : " + d[curr_y])
                .style("margin-left", (d3.event.pageX - 100) + "px")
                .style("margin-top", (d3.event.pageY - 100) + "px")
                .style("cursor", "pointer");
            highlight_all(d, this);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            // var curr_color = this.attr("fill");

            reset_all_circles(this);
        });

    // Create axes for both the y- and x-scale
    svg.append('g') // Append a g element for the scale
        .attr('class', 'x axis axis-top') // Use a class to css style the axes together
        .attr('transform', 'translate(0,30)') // Position the axis
        .call(d3.axisTop(xScale)); // Call the axis function

    svg.append('g')
        .attr('class', 'x axis axis-bottom')
        .attr('transform', 'translate(0,570)')
        .call(d3.axisBottom(xScale));

    svg.append('g')
        .attr('class', 'y axis axis-left')
        .attr('transform', 'translate(90,0)')
        .call(d3.axisLeft(yScale));

    svg.append('g')
        .attr('class', 'y axis axis-right')
        .attr('transform', 'translate(1020,0)')
        .call(d3.axisRight(yScale));

    // left y axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "translate(10,300)rotate(-90)")
        .attr("dy", "0.3em")
        .text(key.get(curr_y));

    // right y axis label
    svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform", "translate(1100,300)rotate(90)")
        .attr("dy", "0.3em")
        .text(key.get(curr_y));

    // FOR DATEPICKER
    $('input[name="daterange"]').daterangepicker({
        opens: 'left',
        drops: "up",
        startDate: d3.min(all_videos, d => d.trending_date),
        endDate: d3.max(all_videos, d => d.trending_date),
        minDate: d3.min(all_videos, d => d.trending_date),
        maxDate: d3.max(all_videos, d => d.trending_date)
    }, function(start, end, label) {
        //set up date range in breakdown
        bd_start = start;
        bd_end = end;
        update_plot("date", [bd_start, bd_end]);
        document.getElementById("bd-date").innerHTML = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
        console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
});



d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

function updateBrush() {
    var ref = d3.event;
    var selection = ref.selection;
    var brushedNodes = new Set();
    // if we have no selection, just reset the brush highlight to no nodes
    if (!selection) {
        highlightBrushed(brushedNodes);
        return;
    }

    // begin an array to collect the brushed nodes


    // traverse the quad tree, skipping branches where we do not overlap
    // with the brushed selection box
    quadtree.visit(function(node, x1, y1, x2, y2) {
        // check that quadtree node intersects
        var overlaps = rectIntersects(selection, [
            [x1, y1],
            [x2, y2]
        ]);

        // skip if it doesn't overlap the brush
        if (!overlaps) {
            return true;
        }

        // if this is a leaf node (node.length is falsy), verify it is within the brush
        // we have to do this since an overlapping quadtree box does not guarantee
        // that all the points within that box are covered by the brush.
        if (!node.length) {
            var d = node.data;
            var dx = xScale(d.trending_date);
            var dy = yScale(d.views);
            if (rectContains(selection, [dx, dy])) {
                brushedNodes.add(d.video_id);
            }
        }

        // return false so that we traverse into branch (only useful for non-leaf nodes)
        return false;
    });

    // update the highlighted brushed nodes
    highlightBrushed(brushedNodes);
}

function highlightBrushed(brushedNodes) {
    // console.log(brushedNodes)
    g.selectAll('.video-clicked').attr('class', 'video');
    svg.selectAll('.line').remove();
    if (brushedNodes.size <= 1) {
        $("#dashboardbutton").attr('disabled', 'disabled');
    } else {
        $("#dashboardbutton").removeAttr('disabled');
    }
    brushedNodes_str = setToStr(brushedNodes);
    localStorage.setItem("detail_ids", brushedNodes_str);

    if (brushedNodes.size > 0) {
        g.selectAll('.brushed')
            .attr('class', 'video');
        g.selectAll('.video')
            .filter(function(d, i) {
                return brushedNodes.has(d.video_id);
            })
            .attr('class', 'brushed');
    } else {
        var circles = g
            .selectAll('.brushed')
            .attr('class', 'video');
    }

}

function setToStr(set) {
    var list = [];
    set.forEach(function(value1, value2, set) {
        list.push(value1);
    });
    return list.join("||");
}

var X = 0;
var Y = 1;
var TOP_LEFT = 0;
var BOTTOM_RIGHT = 1;

function rectIntersects(rect1, rect2) {
    return (
        rect1[TOP_LEFT][X] <= rect2[BOTTOM_RIGHT][X] &&
        rect2[TOP_LEFT][X] <= rect1[BOTTOM_RIGHT][X] &&
        rect1[TOP_LEFT][Y] <= rect2[BOTTOM_RIGHT][Y] &&
        rect2[TOP_LEFT][Y] <= rect1[BOTTOM_RIGHT][Y]
    );
}

/**
 * Determines if a point is inside a rectangle. The rectangle is
 * defined by two points [[rx1, ry1], [rx2, ry2]]
 */
function rectContains(rect, point) {
    return (
        rect[TOP_LEFT][X] <= point[X] &&
        point[X] <= rect[BOTTOM_RIGHT][X] &&
        rect[TOP_LEFT][Y] <= point[Y] &&
        point[Y] <= rect[BOTTOM_RIGHT][Y]
    );
}

function connect_dots() {
    data = []
    videos.forEach(function(element, i) {
        if (element.video_id == highlighted_id) {
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
            return yScale(d[curr_y]);
        });
    svg.append("path")
        .data([data])
        .attr("d", valueline)
        .attr("class", "line")
}

function remove_path() {
    if (g.selectAll(".video-clicked").size() == 0) {
        svg.selectAll(".line")
            .transition()
            .duration(200)
            .remove();
    }

}



function highlight_all(video_obj, curr_element) {
    g.selectAll('.video-hovered').attr('class', "video");

    // g.selectAll('.video-clicked').attr('class',"video");

    var curr_class = curr_element.className;
    var final_class = curr_class;
    if (curr_class != "video-clicked") {
        if (curr_class == "brushed") {
            final_class = "was-brushed video-hovered";
        } else {
            final_class = "video-hovered";
        }
    }
    // var final_class = (curr_class == "brushed" ? "was-brushed video-hovered" : "video-hovered");
    svg.selectAll(".video")
        .filter(function(d, i) {
            return d.video_id === video_obj.video_id;
        })
        .transition()
        .duration(200)
        .attr("class", final_class)
        .attr("r", radius);
}

function reset_all_circles(curr_element) {
    var curr_class = curr_element.className;
    // console.log("reset_all_circles", curr_class);
    var final_class = (curr_class == "was-brushed video-hovered" ? "brushed" : "video");
    svg.selectAll(".video-hovered")
        .transition()
        .duration(200)
        .attr("class", final_class)
        .attr("r", radius);
}

//highlight one video
function highlight_single_video() {
    svg.selectAll(".brush").call(brush.move, null)
    svg.selectAll('.line').remove();
    g.selectAll('.video-clicked,video-hovered,brushed').attr('class', "video");

    g.selectAll('.video-hovered')
        .filter(function(d, i) {
            return d.video_id === highlighted_id;
        })
        .moveToFront()
        .transition()
        .duration(200)
        .attr("class", "video-clicked");
}



// FOR TAGS SELECTION
$('.ui-choose').ui_choose();
var uc_02 = $('#uc_02').data('ui-choose');
uc_02.click = function(value, item) {
    console.log('click', value);

};
uc_02.change = function(value, item) {
    bd_sortfunc();
    console.log('change', value);
    tag_change(value);
};



//FOR SEARCH
function related(data, keyword) {
    return data.title.toLowerCase().includes(keyword.toLowerCase()) ||
        data.description.toLowerCase().includes(keyword.toLowerCase()) ||
        data.channel_title.toLowerCase().includes(keyword.toLowerCase());
}


function search() {
    update_plot("search", null);
}

function tag_change(value) {
    if (value != curr_y) {
        curr_y = value;
        update_plot("tag_change", null);
    }
}

function checkBox_update(){
	all = document.getElementById("all").checked;
	c1_act = document.getElementById("c1").checked;
    c2_edu = document.getElementById("c2").checked;
    c3_ent = document.getElementById("c3").checked;
    c4_lif = document.getElementById("c4").checked;
    c5_new = document.getElementById("c5").checked;
    c6_tec = document.getElementById("c6").checked;
	update_plot("cluster_filter",[c1_act,c2_edu,c3_ent,c4_lif,c5_new,c6_tec,all]);
}

function update_plot(caller, args) {
    if (caller === "tag_change") {
        //do nothing at this point
    } else if (caller === "search") {
        var keyword = $('#keyword').val();
        videos = all_videos.filter(function(d) {
            return related(d, keyword);
        });
    } else if (caller === "detail_page") {

    } else if (caller === "cluster_filter") {
    	var checked_category = [];
    	args.forEach(function(item,i){
    		if(i<6 && item){
    			checked_category.push(cluster_map[i]);
    		}else if(i==6 && item){
    			checked_category = ["Activisim","Education","Entertainment","Lifestyle","News","Technology"]
    		}
    	});
    	console.log(checked_category);
    	videos = all_videos.filter(function(d) {
    		return checked_category.includes(d.cluster);
    	})
    } else if (caller === "date") {
        var start = args[0];
        var end = args[1];
        videos = all_videos.filter(function(d) {
            return d.trending_date > start && d.trending_date < end;
        });
    }

    if (videos.length > 0) {
        $("#result").text(videos.length + " Results Found!");
        $("#result").css("display", "");
        //clear brush and line
        svg.selectAll(".line").remove();
        svg.selectAll(".brush").remove();

        var yExtent = d3.extent(videos, function(d) {
            return +d[curr_y];
        });
        var dateExtent = d3.extent(videos, function(d) {
            return +d["trending_date"];
        });
        xScale.domain(dateExtent);
        yScale.domain(yExtent);


        //update quadtree and brush
        quadtree = d3.quadtree()
            .x(d => xScale(d.trending_date))
            .y(d => yScale(d[curr_y]))
            .addAll(videos);

        function updateBrush() {
            var ref = d3.event;
            var selection = ref.selection;
            var brushedNodes = new Set();
            // if we have no selection, just reset the brush highlight to no nodes
            if (!selection) {
                highlightBrushed(brushedNodes);
                return;
            }

            // begin an array to collect the brushed nodes


            // traverse the quad tree, skipping branches where we do not overlap
            // with the brushed selection box
            quadtree.visit(function(node, x1, y1, x2, y2) {
                // check that quadtree node intersects
                var overlaps = rectIntersects(selection, [
                    [x1, y1],
                    [x2, y2]
                ]);

                // skip if it doesn't overlap the brush
                if (!overlaps) {
                    return true;
                }

                // if this is a leaf node (node.length is falsy), verify it is within the brush
                // we have to do this since an overlapping quadtree box does not guarantee
                // that all the points within that box are covered by the brush.
                if (!node.length) {
                    var d = node.data;
                    var dx = xScale(d.trending_date);
                    var dy = yScale(d[curr_y]);
                    if (rectContains(selection, [dx, dy])) {
                        brushedNodes.add(d.video_id);
                    }
                }

                // return false so that we traverse into branch (only useful for non-leaf nodes)
                return false;
            });

            // update the highlighted brushed nodes
            highlightBrushed(brushedNodes);
        }

        brush = d3.brush()
            .extent([
                [100, 50],
                [1000, 550]
            ])
            .on('brush end', updateBrush);

        // attach the brush to the chart
        var gBrush = g.append('g')
            .attr('class', 'brush')
            .call(brush);

        svg.selectAll(".axis-left")
            .transition()
            .duration(200)
            .call(d3.axisLeft(yScale));
        svg.selectAll(".axis-right")
            .transition()
            .duration(200)
            .call(d3.axisRight(yScale));
        svg.selectAll(".axis-bottom")
            .transition()
            .duration(200)
            .call(d3.axisBottom(xScale));
        svg.selectAll(".axis-top")
            .transition()
            .duration(200)
            .call(d3.axisTop(xScale));
        svg.selectAll(".axisLabel")
            .transition()
            .duration(200)
            .text(key.get(curr_y));

        var existing_circles = g.selectAll('circle')
            .data(videos);
        var enter = existing_circles.enter()
            .append('circle')
            .attr('class', 'video') // Add the classname that we selected on
            .attr('r', radius)
            .attr('cx', function(d) {
                return xScale(d.trending_date);
            })
            .attr('cy', function(d) {
                return yScale(d[curr_y]);
            })
            .on("click", function(d) {
                highlighted_id = d.video_id;
                highlight_single_video();
                connect_dots();
            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["title"] + "<br/>" + key.get(curr_y) + " : " + d[curr_y])
                    .style("margin-left", (d3.event.pageX - 100) + "px")
                    .style("margin-top", (d3.event.pageY - 100) + "px")
                    .style("cursor", "pointer");
                highlight_all(d, this);
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 0);
                // var curr_color = this.attr("fill");

                reset_all_circles(this);
            });
        connect_dots();

        var merge = existing_circles.merge(enter)
            .transition()
            .duration(200)
            .attr('cx', function(d) {
                return xScale(d.trending_date);
            })
            .attr('cy', function(d) {
                return yScale(d[curr_y]);
            });
        var exit = existing_circles.exit().remove();

        //need to fix:
        g.selectAll('circle').moveToFront();
    } else {
        $("#result").text("No Results Found!");
        $("#result").css("display", "");
        g.selectAll('circle').remove();
    }

}

//Press Enter to Search
$('#keyword').keypress(function(e) {
    if (e.which == 13) { //Enter key pressed
        $('#search-button').click(); //Trigger search button click event
    }
});