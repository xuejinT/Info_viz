var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
var brushedvideosall = [];
var brushedvideos = []; //unique video id array
var categoryobject ={};
var categorydata = []; // object {category : count}
var tagarray = [];
var repeattimes = 0;
var tagdata = {}; // object {tag : count}, tag filtered by repeattimes
var attitudeobject ={};
var attitudedata = [];
var selectedattitudedata=[];
var selectedvideonum = 2; // supposed it is 2, no.x in slider, no.x-1 in array
var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");


// thumbnail slider
// add thumbnail to slider
function addthumbnail(){
	var carousel = document.getElementById("carousel");
	var childthumbnail = document.createElement("div");
	childthumbnail.className = "thumbnail"
	childthumbnail.innerHTML = "<img src= https://static.techspot.com/images2/news/bigimage/2019/07/2019-07-19-image.png>";
	carousel.appendChild(childthumbnail);
}
//init slider
function slickintial(){
	  $(document).on('ready', function() {
      $(".variable").slick({
        dots: true,
        infinite: false,
        variableWidth: true
      });
    });
}




//chart - category(c)
//add and count category
function addtocategoryobject(category_name){
	if (categoryobject.hasOwnProperty(category_name) == false){
		categoryobject[category_name] = 0
	}
	if (categoryobject.hasOwnProperty(category_name) == true){
		categoryobject[category_name] = categoryobject[category_name] + 1
	}
}
var svg_c = d3.select("#categorychart").append("svg")
										.attr("width", 766)
										.attr("height", 300);
var x_c = d3.scaleBand().rangeRound([0, 732]).padding(0.2);
var y_c = d3.scaleLinear().range([260, 20])
var xAxis_c = d3.axisBottom(x_c);
var yAxis_c = d3.axisLeft(y_c);





//chart - tag cloud (t)
var svg_t = d3.select("#wordle").append("svg")
				.attr("width", 766)
				.attr("height", 300)
				.append("g");
// set repeat times according to the number of brushed videos
function setrepeattimes(){
	if (brushedvideos.length < 10){
		repeattimes = 0;
	}
	if (10 <= brushedvideos.length < 50){
		repeattimes = 1;
	}
	if (50 <= brushedvideos.length < 100){
		repeattimes = 2;
	}
	if (100 <= brushedvideos.length ){
		repeattimes = 3;
	}
}
//get words with repeat times restriction
function getrepeattimes(array) {
    var map = new Map();
    array.forEach(a => map.set(a, (map.get(a) || 0) + 1));
    return array.filter(a => map.get(a) > repeattimes);
}
//remove duplicated tags and count repeating times
function gettagdata(){
	//setrepeattimes();
	//function setrepeattimes is to aviod too many tags | possibly give viewers options?
	var repeatedtag = getrepeattimes(tagarray);
	for(var i = 0; i < repeatedtag.length; ++i) {
    if(!tagdata[repeatedtag[i]])
        tagdata[repeatedtag[i]] = 0;
    ++tagdata[repeatedtag[i]];
	}
	tagdata = Object.keys(tagdata).map(key => ({tag: key, occurrence: tagdata[key]}));
}




//chart - attitude (a)
// id - view -like - dislike find views most
// use id to find all cases in the whole csv file
function geteachattitude(dataset, id) {
	dataset.forEach(function(d){
		if (d.video_id == id){
			attitudeobject.views = Math.max(attitudeobject.views,d.views);
			attitudeobject.likes = Math.max(attitudeobject.likes,d.likes);
			attitudeobject.dislikes = Math.max(attitudeobject.dislikes,d.dislikes);
		}
	})
	attitudedata.push(attitudeobject);
	attitudeobject = {};
}
function getallattitude(dataset, brushedvideos){
	for (i=0; i<brushedvideos.length; i++){
    	var id = brushedvideos[i];
    	attitudeobject = {video_id:id,views:0,likes:0,dislikes:0} // id - views - likes - dislikes
 		geteachattitude(dataset,id);
    }	
}
// set the dimensions and margins of the graph
var margin_a = {top: 24, right: 0, bottom: 0, left: 16},
  width_a = 766 - margin_a.left - margin_a.right,
  height_a = 300 - margin_a.top - margin_a.bottom;
// append the svg object to the body of the page
var svg_a = d3.select("#parallelcoordinate")
	.append("svg")
  		.attr("width", width_a + margin_a.left + margin_a.right)
  		.attr("height", height_a + margin_a.top + margin_a.bottom)
	.append("g")
  		.attr("transform",
        "translate(" + margin_a.left + "," + margin_a.top + ")");




//selected video attitude
function getselectedattitude(dataset,selectedvideonum){
		var id = brushedvideos[selectedvideonum];
		dataset.forEach(function(d){
				if (d.video_id == id){
					var selectedattitudeobject = {time:d.trending_date, views:d.views, likes:d.likes, dislikes:d.dislikes};
					selectedattitudedata.push(selectedattitudeobject);
			}	
		})
	return selectedattitudedata;
}
var margin_s = {top: 0, right: 0, bottom: 0, left: 0},
  width_s = 344 - margin_s.left - margin_s.right,
  height_s = 270- margin_s.top - margin_s.bottom;
// append the svg object to the body of the page
var svg_s = d3.select("#selectedattitude")
	.append("svg")
  		.attr("width", width_s + margin_s.left + margin_s.right)
  		.attr("height", height_s + margin_s.top + margin_s.bottom)
	.append("g")
  		.attr("transform",
        "translate(" + margin_s.left + "," + margin_s.top + ")");









//load brushed data
d3.dsv('\\', './data/US_sample100.csv').then(function(dataset) {
    dataset.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
        brushedvideosall.push(d.video_id);
    });

    videos = dataset;

    //remove duplicates
    $.each(brushedvideosall, function(i, el){
    if($.inArray(el, brushedvideos) === -1) brushedvideos.push(el);}	);



    //chart - category(c)
    //find categories of unique videos and add to categoryobject
    for (i=0; i<brushedvideos.length; i++){
    	var id = brushedvideos[i];
    	var videoobject = videos.find(o => o.video_id === id);
    	var videocategory = videoobject.category_name;
    	addtocategoryobject(videocategory);
    }
    //map category data
    categorydata = Object.keys(categoryobject).map(key => ({category: key, count: categoryobject[key]}));

    //set domains for category chart
    x_c.domain(categorydata.map(function(d){return d.category;}));
    y_c.domain([0, d3.max(categorydata, function(d){return d.count})]);

    //draw category chart
       //x axis
	  svg_c.append("g")
	      .attr("class", "x_c axis")
	      .attr("transform", "translate(24," + 260 + ")")
	      .call(xAxis_c)	
           .selectAll("text")	
               .style("text-anchor", "end")
               .attr("transform", function(d) {
                   return "rotate(-12)" 
                   });
	  //y axis
	  svg_c.append("g")
	      .attr("class", "y_c axis")
	      .attr("transform", "translate(24,0)")
	      .call(yAxis_c)
	  //bar
	  svg_c.selectAll(".bar")
	  	.data(categorydata)
	  	.enter()
	  	.append("rect")
	  	.attr("class","bar")
	  	.attr("x",function(d){return 24+x_c(d.category);})
	  	.attr("width", x_c.bandwidth())
	  	.attr("y",function(d){return y_c(d.count);})
	  	.attr("height",function(d){return 260 - y_c(d.count);});






	//chart - tag cloud (t)
	//get tags
    for (i=0; i<brushedvideos.length; i++){
    	var id = brushedvideos[i];
    	var videoobject = videos.find(o => o.video_id === id);
    	var videotags = videoobject.tags;
    	var split = videotags.split("|");
    	split.forEach(element => tagarray.push(element));
    }
	//find x times repeated tags
	gettagdata();
	//draw
 	var layout = d3.layout.cloud()
 		.size([766, 300])
 	    .words(tagdata.map(function(d) { return {text: d.tag, size: d.occurrence}; }))
 	    .rotate(function() { return ~~(Math.random() * 2) * 90; })
 	    .padding(2)
 	    .font("Impact")
 	    .fontSize(function(d) { return 8 * d.size })
 	    .on("end", draw)
 	layout.start();
 	function draw(words) {
 		svg_t.append("g")
 	      .attr("transform", "translate(380,154)")
     	  .selectAll("text")
     	  .data(words)
     	  .enter().append("text")
     	  .style("font-size", function(d) { return d.size; })
     	  .style("fill", "#85C0CE")
     	  .style("fill-opacity", ".3")
     	  .attr("text-anchor", "middle")
     	  .style("font-family", "Impact")
     	  .attr("transform", function(d) {
     	    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
     	  })
        .text(function(d) { return d.text; });
 	}

});




//load the whole dataset for attitude
d3.dsv('\\', './data/US_final.csv').then(function(dataset) {
	dataset.forEach(function(d) {
    d.publish_time = parseTime(d.publish_time);
    d.trending_date = parseTime(d.trending_date);
    });

	getallattitude(dataset, brushedvideos);
	getselectedattitude(dataset,selectedvideonum);

	//draw parallel coordinate
 	// Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
 	dimensions = d3.keys(attitudedata[0]).filter(function(d) { return d != "video_id" })
 	// For each dimension, I build a linear scale. I store all in a y object
 	var y_a = {}
 	for (i in dimensions) {
 	  name = dimensions[i]
 	  y_a[name] = d3.scaleLinear()
 	    .domain( d3.extent(attitudedata, function(d) { return +d[name]; }) )
 	    .range([height_a, 0])
 	}
 	// Build the X scale -> it find the best position for each Y axis
 	x_a = d3.scalePoint()
 	  .range([0, width_a])
 	  .padding(0.13)
 	  .domain(dimensions);
 	// The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
 	function path(d) {
 	    return d3.line()(dimensions.map(function(p) { return [x_a(p), y_a[p](d[p])]; }));
 	}
 	// Draw the lines
 	svg_a
 	  .selectAll("myPath")
 	  .data(attitudedata)
 	  .enter().append("path")
 	  .attr("d",  path)
 	  .attr("class","p_line")
 	// Draw the a_ais:
 	svg_a.selectAll("myAxis")
 	  // For each dimension of the dataset I add a 'g' element:
 	  .data(dimensions).enter()
 	  .append("g")
 	  // I translate this element to its right position on the x axis
 	  .attr("transform", function(d) { return "translate(" + x_a(d) + ")"; })
 	  .attr("class","axis")
 	  // And I build the axis with the call function
 	  .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y_a[d])); })
 	  // Add axis title
 	  .append("text")
 	    .style("text-anchor", "middle")
 	    .attr("y", -4)
 	    .text(function(d) { return d; })
 	    .style("fill", "#aaaaaa")
 	    .style("font-size",14)



 	//draw selected video attitude
 	//x axis
 	var dateExtent = d3.extent(selectedattitudedata, function(d) {
        return +d.time;
    });
 	var x_s = d3.scaleTime()
 				.range([20, 324])
 				.domain(dateExtent)
 	var timeaxis = d3.axisBottom(x_s)
 					.tickFormat(d3.timeFormat("%d %b"))
 					.ticks(selectedattitudedata.length);
 	svg_s.append('g')
    	.attr('class', 'x axis')
    	.attr('transform', 'translate(0,240)')
    	.call(timeaxis);
    //y axis
    var y_l = d3.scaleLinear()
    			.range([240,0])
    			.domain([0,d3.max(selectedattitudedata,function(d){return d.views})])
    var y_r = d3.scaleLinear()
    			.range([240,0])
    			.domain([0,d3.max(selectedattitudedata,function(d){return d.likes})])
 	svg_s.append('g')
    	.attr('class', 'y axis')
    	.attr('transform', 'translate(0,0)')
    	.call(d3.axisRight(y_l)); 
	svg_s.append('g')
    	.attr('class', 'y axis')
    	.attr('transform', 'translate(340,0)')
    	.call(d3.axisLeft(y_r)); 
    //line
    var viewsline = d3.line()
    			.x(d => x_s(d.time))
    			.y(d => y_l(d.views))
    var likesline = d3.line()
    			.x(d => x_s(d.time))
    			.y(d => y_r(d.likes))
    var dislikesline = d3.line()
    			.x(d => x_s(d.time))
    			.y(d => y_r(d.dislikes))
	svg_s.append('path')
    	.attr("id", 'viewsline')
    	.attr("d",viewsline(selectedattitudedata))
	svg_s.append('path')
    	.attr('id', 'likesline')
    	.attr("d",likesline(selectedattitudedata));
	svg_s.append('path')
    	.attr('id', 'dislikesline')
    	.attr("d",dislikesline(selectedattitudedata));
});


