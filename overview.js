//wait jQuery to load
var waitForJQuery = setInterval(function() {
    if (typeof $ != 'undefined') {

        // place your code here.

        clearInterval(waitForJQuery);
    }
}, 10);



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

$.getJSON("./data/sim_final_min.json", function(data) {
    similarity = data; //json output 
});
var filter = localStorage.getItem("filter");
var tag = localStorage.getItem("tag");



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
var t = d3.transition()
    .duration(200)
    .ease(d3.easeLinear);
var cluster_map = {
    0: "Activism",
    1: "Education",
    2: "Entertainment",
    3: "Lifestyle",
    4: "News",
    5: "Technology"
}

var colorMap = {
    "Activisim": "#7CC237",
    "Education": "#DE5555",
    "Entertainment": "#6D72E7",
    "Lifestyle": "#DEB75B",
    "News": "#26BDD2",
    "Technology": "#B155DE"
}
var svg = d3.select('svg');
var curr_y = "views";
var highlighted_id = ""
var sim_video_id = ""
var radius = 3;
var xScale = d3.scaleTime()
    .range([100, 1000]).nice();
var x2 = xScale.copy();

// Create y-scale for positioning the circles
var yScale = d3.scaleLinear()
    .range([550, 50]).nice();
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
    constantY = yScale;

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
        // .attr('fill',function(d){
        // 	return colorMap[d.category_name]
        // })
        .on("click", function(d) {
            highlighted_id = d.video_id;
            highlight_single_video();

        })
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            var x_offset = d3.event.pageX - 100
            var y_offset = d3.event.pageY - 200 < 200 ? d3.event.pageY : d3.event.pageY - 200;
            tooltip.html("<img src=" + d.thumbnail_link +
                    ">" +
                    "<br>" +
                    d["title"] +
                    "<br>" +
                    key.get(curr_y) + " : " + d[curr_y])
                .style("margin-left", x_offset + "px")
                .style("margin-top", y_offset + "px")
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

    var yAxis_L = d3.axisLeft(yScale);
    var yAxis_R = d3.axisRight(yScale)
    var y_axis_left = svg.append("g")
        .attr('class', 'y axis axis-left')
        .attr("id", "y_axis")
        .attr('transform', 'translate(90,0)')
        .call(yAxis_L)
        // .call(d3.zoom().on("zoom", zoom));

    var y_axis_right = svg.append("g")
        .attr('class', 'y axis axis-right')
        .attr("id", "y_axis_right")
        .attr('transform', 'translate(1020,0)')
        .call(yAxis_R)
        // .call(d3.zoom().on("zoom", zoom));

    var zoom_rect_left = svg.append("rect")
        .attr("class", "rect-zoom")
        .attr("x", 30)
        .attr("y", 50)
        .attr("opacity", 0)
        .attr("width", 60)
        .attr("height", 500)
    var zoom_rect_right = svg.append("rect")
        .attr("class", "rect-zoom")
        .attr("x", 1020)
        .attr("y", 50)
        .attr("opacity", 0)
        .attr("width", 60)
        .attr("height", 500)
    zoom_rect_left.call(d3.zoom().on("zoom", zoom));
    zoom_rect_right.call(d3.zoom().on("zoom", zoom));

    function zoom() {
        svg.selectAll(".line").remove();
        y_axis_left.transition()
            .duration(50)
            .call(yAxis_L.scale(d3.event.transform.rescaleY(yScale)));
        y_axis_right.transition()
            .duration(50)
            .call(yAxis_R.scale(d3.event.transform.rescaleY(yScale)));
        var new_yScale = d3.event.transform.rescaleY(yScale);
        yScale = new_yScale;
        var hidden_circle = g.selectAll("circle").filter(function(d) {
            var new_y = new_yScale(d[curr_y]);
            return new_y > 560 || new_y < 30;
        });
        var show_circle = g.selectAll("circle").filter(function(d) {
            var new_y = new_yScale(d[curr_y]);
            return new_y < 560 && new_y > 30;
        });
        hidden_circle.attr("class", "video-hidden")
        show_circle.attr("class", "video")
        g.selectAll("circle").attr("cy", function(d) {
            return new_yScale(d[curr_y]);
        });
    }

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

    if (filter != undefined || tag != undefined) {
        update_plot("detail_page", [filter, tag])
    }
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
    	g.selectAll('.video-clicked,.video-hovered,.video-similar').attr('class', 'video');
    	svg.selectAll('.line').remove();
    	$("#indiV").css("display", "none");
    	$("#similarbutton").attr('disabled','disabled')
    	highlighted_id = "";
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

    if (brushedNodes.size <= 1) {
        $("#dashboardbutton").attr('disabled', 'disabled');
    } else {
        $("#dashboardbutton").removeAttr('disabled');
    }

    // if (brushedNodes.size == 0) {
    // 	highlighted_id = "";
    // }
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
	if(highlighted_id!=""){
		$("#similarbutton").removeAttr('disabled')
	}
	
    svg.selectAll(".brush").call(brush.move, [
        [0, 0],
        [1, 1]
    ])
    svg.selectAll('.line').remove();
    g.selectAll('.video-clicked,video-hovered,brushed,.video-similar').attr('class', "video");

    g.selectAll('circle')
        .filter(function(d, i) {
            return d.video_id === highlighted_id;
        })
        .moveToFront()
        .attr("class", "video-clicked");
    connect_dots();
    
}

function showSimilar() {
    $("#indiV").css("display", "");
    $("#breakdownSection").css("display", "none");
    $("#breakdownbutton").text("View Breakdown");
    sim_ids = similarity[highlighted_id];
    var i = 0;
    var base_video = all_videos.find(o => o.video_id === highlighted_id)
    $("#selectedV").attr("src", base_video.thumbnail_link);
    $("#selectedT").text(base_video.title);
    $("#selectedU").text(base_video.channel_title);
    $("#selectedV-link").attr("href",base_video.video_url);

    Object.keys(sim_ids).forEach(key => {
        curr_sim_video = all_videos.find(o => o.video_id === key);
        $("#s" + i + "img").attr("src", curr_sim_video.thumbnail_link);
        $("#svtitle" + i).text(curr_sim_video.title);
        $("#svuploader" + i).text(curr_sim_video.channel_title);
        $("#svlink" + i).attr("href", curr_sim_video.video_url);
        $("#s" + i).attr("name", curr_sim_video.video_id);
        i++;
    });

}

function highlightSim(div) {
    sim_video_id = div.getAttribute("name");

    svg.selectAll(".video-similar")
        .attr("class", "video")

    svg.selectAll("circle")
        .filter(function(d) {
            return d.video_id === sim_video_id;
        })
        .attr("class", "video-similar")
        .moveToFront()
}

function highlight_single_video_tagchange() {
    svg.selectAll(".brush").call(brush.move, [
        [0, 0],
        [1, 1]
    ])
    svg.selectAll('.line').remove();
    g.selectAll('.video-clicked,video-hovered,brushed').attr('class', "video");

    g.selectAll('.video')
        .filter(function(d, i) {
            return d.video_id === highlighted_id;
        })
        .moveToFront()
        .transition()
        .duration(200)
        .attr("class", "video-clicked");
    connect_dots();
}





//FOR SEARCH
function related(data, keyword) {
    return data.title.toLowerCase().includes(keyword.toLowerCase()) ||
        data.description.toLowerCase().includes(keyword.toLowerCase()) ||
        data.tags.toLowerCase().includes(keyword.toLowerCase()) ||
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

function checkBox_update() {
    c1_act = document.getElementById("c1").checked;
    c2_edu = document.getElementById("c2").checked;
    c3_ent = document.getElementById("c3").checked;
    c4_lif = document.getElementById("c4").checked;
    c5_new = document.getElementById("c5").checked;
    c6_tec = document.getElementById("c6").checked;
    console.log(c1_act,c2_edu,c3_ent,c4_lif,c5_new,c6_tec)
    if (c1_act==false || c2_edu==false || c3_ent==false || c4_lif==false || c5_new==false || c6_tec==false) {
    	console.log("not all ")
        document.getElementById("all").checked = false;
    }else if(c1_act && c2_edu && c3_ent && c4_lif && c5_new && c6_tec){
    	console.log("all")
    	document.getElementById("all").checked = true;
    }
    var all = document.getElementById("all").checked;
    update_plot("cluster_filter", [c1_act, c2_edu, c3_ent, c4_lif, c5_new, c6_tec, all]);
}

function checkBox_update_all() {
	var all = document.getElementById("all").checked;
    document.getElementById("c1").checked = all;
    document.getElementById("c2").checked = all;
    document.getElementById("c3").checked = all;
    document.getElementById("c4").checked = all;
    document.getElementById("c5").checked = all;
    document.getElementById("c6").checked = all;
    // $("#c1").css("background-color","")
    checkBox_update();
}


function reload() {
    svg.selectAll(".brush").call(brush.move, [
        [0, 0],
        [1, 1]
    ])
    $("#indiV").css("display", "none");
    $(".selected").removeClass("selected");
    $("li[title='view']").addClass("selected");
    highlighted_id = "";
    $("#similarbutton").attr('disabled','disabled')
    curr_y = "views";
    document.getElementById("c1").checked = false;
    document.getElementById("c2").checked = false;
    document.getElementById("c3").checked = false;
    document.getElementById("c4").checked = false;
    document.getElementById("c5").checked = false;
    document.getElementById("c6").checked = false;
    $("#all").attr("checked", "");
    update_plot("reload", null);
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
        if (filter != "none"|| tag != "none") {
            videos = all_videos.filter(function(d) {
                return d.category_name === filter || related(d, tag);
            })
            $("#all").removeAttr("checked");
        } 
        //clear localStorage
        localStorage.clear();
    } else if (caller === "cluster_filter") {
        var checked_category = [];
        args.forEach(function(item, i) {
            if (i < 6 && item) {
                checked_category.push(cluster_map[i]);
            } 
            // else if (i == 6 && item) {
            //     checked_category = ["Activism", "Education", "Entertainment", "Lifestyle", "News", "Technology"]
            // }
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
    } else if (caller === "reload") {
        g.selectAll('circle').remove();
        videos = all_videos;
    }

    if (videos.length > 0) {

        var num_videos = d3.nest()
            .key(function(d) {
                return d.video_id;
            })
            .entries(videos).length;
        $("#result").text(num_videos + " Videos Found!");
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
    	g.selectAll('.video-clicked,.video-hovered,.video-similar').attr('class', 'video');
    	svg.selectAll('.line').remove();
    	$("#indiV").css("display", "none");
    	$("#similarbutton").attr('disabled','disabled')
    	highlighted_id = "";
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

        // svg.selectAll(".axis-left")
        //     .transition()
        //     .duration(200)
        //     .call(d3.axisLeft(yScale));
        // svg.selectAll(".axis-right")
        //     .transition()
        //     .duration(200)
        //     .call(d3.axisRight(yScale));
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

        var yAxis_L = d3.axisLeft(yScale);
        var yAxis_R = d3.axisRight(yScale)
        var y_axis_left = svg.selectAll(".axis-left")
            .call(yAxis_L)
            // .call(d3.zoom().on("zoom", zoom));

        var y_axis_right = svg.selectAll(".axis-right")
            .call(yAxis_R)
            // .call(d3.zoom().on("zoom", zoom));

        svg.selectAll("rect-zoom").call(d3.zoom().on("zoom", zoom));


        function zoom() {
            svg.selectAll(".line").remove();
            y_axis_left.transition()
                .duration(50)
                .call(yAxis_L.scale(d3.event.transform.rescaleY(yScale)));
            y_axis_right.transition()
                .duration(50)
                .call(yAxis_R.scale(d3.event.transform.rescaleY(yScale)));
            var new_yScale = d3.event.transform.rescaleY(yScale);
            yScale = new_yScale;
            var hidden_circle = g.selectAll("circle").filter(function(d) {
                var new_y = new_yScale(d[curr_y]);
                return new_y > 560 || new_y < 30;
            });
            var show_circle = g.selectAll("circle").filter(function(d) {
                var new_y = new_yScale(d[curr_y]);
                return new_y < 560 && new_y > 30;
            });
            hidden_circle.attr("class", "video-hidden")
            show_circle.attr("class", "video")
            g.selectAll("circle").attr("cy", function(d) {
                return new_yScale(d[curr_y]);
            });
        }


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
                console.log("click:", highlighted_id)
                highlight_single_video();

            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var x_offset = d3.event.pageX - 100
                var y_offset = d3.event.pageY - 200 < 200 ? d3.event.pageY : d3.event.pageY - 200;
                tooltip.html("<img src=" + d.thumbnail_link +
                        ">" +
                        "<br>" +
                        d["title"] +
                        "<br>" +
                        key.get(curr_y) + " : " + d[curr_y])
                    .style("margin-left", x_offset + "px")
                    .style("margin-top", y_offset + "px")
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


        var merge = existing_circles.merge(enter)
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
                console.log("click:", highlighted_id)
                highlight_single_video();

            })
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var x_offset = d3.event.pageX - 100
                var y_offset = d3.event.pageY - 200 < 200 ? d3.event.pageY : d3.event.pageY - 200;
                tooltip.html("<img src=" + d.thumbnail_link +
                        ">" +
                        "<br>" +
                        d["title"] +
                        "<br>" +
                        key.get(curr_y) + " : " + d[curr_y])
                    .style("margin-left", x_offset + "px")
                    .style("margin-top", y_offset + "px")
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

        var exit = existing_circles.exit().remove();

        //need to fix:
        g.selectAll('circle').moveToFront();
    } else {
        $("#result").text("No Results Found!");
        $("#result").css("display", "");
        g.selectAll('circle').remove();
    }


    highlight_single_video();
        svg.selectAll("circle")
        .filter(function(d) {
        	if(d.video_id === sim_video_id){
        		console.log(1)
        	}
            return d.video_id === sim_video_id;
        })
        .attr("class", "video-similar")
        .moveToFront();
}

//Press Enter to Search
$('#keyword').keypress(function(e) {
    if (e.which == 13) { //Enter key pressed
        $('#search-button').click(); //Trigger search button click event
    }
});