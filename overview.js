var svg = d3.select('svg');

// Original lab3 codes
// Create x-scale for positioning the circles
var radius = 3;
var xScale = d3.scaleTime()
   .range([100,1000]);

// Create y-scale for positioning the circles
var yScale = d3.scaleLinear()
   .range([550,50]);

var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Create a quantize scale for the three habital zone bins
var colorScale = d3.scaleQuantize()
   .range(['#d64d3f', '#96ac3d', '#208d8d']);
var tooltip = d3.select(".tooltip");

// Load the dataset
d3.dsv('\\','./data/US_final.csv').then(function(dataset) {
	dataset.forEach(function(d) {
      d.publish_time = parseTime(d.publish_time);
      d.trending_date = parseTime(d.trending_date);
  });

	videos = dataset;
	console.log(videos);

	// // Use extent and max to compute the input domain for the scales
   
   var viewExtent = d3.extent(videos, function(d){
       return +d['views'];
   });
   yScale.domain(viewExtent);
   var dateExtent = d3.extent(videos, function(d){
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
       .attr('r', function(d){
           // Set the radius attribute based on the planet's radius
           return radius;
       })
       .attr('cx', function(d){
           // Set the x-position based on the hzd value
           return xScale(d.trending_date);
       })
       .attr('cy', function(d){
           // Set the y-position based on the mass value
           return yScale(d.views);
       })
       .style('fill', function(d){
           // Set the fill color based on the hzd value
           return colorScale(d.views);
       })
       .style('opacity', function(d){
       	return 0.5;
       })
       .on("mouseover", function(d) {		
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip.html(d["title"] + "<br/>"  + d["views"])
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px")
                .style("cursor","pointer");

            })					
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

   // Create axes for both the y- and x-scale
   svg.append('g') // Append a g element for the scale
       .attr('class', 'x axis') // Use a class to css style the axes together
       .attr('transform', 'translate(0,40)') // Position the axis
       .call(d3.axisTop(xScale)); // Call the axis function

   svg.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,550)')
       .call(d3.axisBottom(xScale));

   svg.append('g')
       .attr('class', 'y axis')
       .attr('transform', 'translate(70,0)')
       .call(d3.axisLeft(yScale));

   svg.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(1100,0)')
       .call(d3.axisRight(yScale));

   // Challenge Problems
   // Add a label for Earth, Mars, Venus Mercury

   // Create an additional data array with pointers to only the labeled planetes
   // planetLabels = videos.filter(function(d){
   //     return d['name'] == 'Earth' || d['name'] == 'Mars'
   //            || d['name'] == 'Venus' || d['name'] == 'Mercury';
   // });

   // Create a new d3-selection. And append a new text element for the data array.
   // svg.selectAll('.planet-label')
   //     .data(planetLabels)
   //     .enter()
   //     .append('text')
   //     .attr('class', 'planet-label')
   //     .attr('x', function(d){
   //         return xScale(d['habital_zone_distance']) + 10;
   //     })
   //     .attr('y', function(d){
   //         return yScale(d['mass']) + rScale(d['radius']);
   //     })
   //     .text(function(d){
   //         return d['name'];
   //     });

   // top x axis label
	   // svg.append("text")
	   //     .attr("class","axisLabel")
	   //     .attr("transform","translate(300,20)")
	   //     .attr("dy","0.3em")
	   //     .text("Date");

	   // // bottom x axis label
	   // svg.append("text")
	   //     .attr("class","axisLabel")
	   //     .attr("transform","translate(300,560)")
	   //     .attr("dy","0.3em")
	   //     .text("Date");

   // left y axis label
   svg.append("text")
       .attr("class","axisLabel")
       .attr("transform","translate(20,370)rotate(270)")
       .attr("dy","0.3em")
       .text("Views");

   // right y axis label
   svg.append("text")
       .attr("class","axisLabel")
       .attr("transform","translate(1150,370)rotate(270)")
       .attr("dy","0.3em")
       .text("Views");
});