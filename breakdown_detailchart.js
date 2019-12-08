
function bddetailchart(tempdata){
    console.log(tempdata);
    document.getElementById("bddetailchart").innerHTML = "";
        anaFlag = document.getElementById("bd_math").value;



let data_act = [];
let features = ["views","likes","comment_count","income","temperature","trending_length"];
    var viewsMax = 0, likesMax = 0, commentMax = 0, incomeMax = 0, tempMax =0, tlMax=0;
     for (var i = 0; i < tempdata.data.children.length; i ++){

        for (var j = 0; j < 3; j ++){
            let d = tempdata.data.children[i].children[j][anaFlag];
            if (d.views - viewsMax > 0){
                viewsMax = d.views;
            }
            if (d.likes - likesMax > 0) {
                likesMax = d.likes;
            }
            if (d.comment_count - commentMax > 0){
                commentMax = d.comment_count;
            }
            if (d.income - incomeMax > 0){
                incomeMax = d.income;
            }
            if (d.temperature - tempMax > 0){
                tempMax = d.temperature;
            }
            if (d.trending_length - tlMax > 0){
                tlMax = d.trending_length;
            }
            
        }
     }
    var viewlogScale = d3.scaleLog().domain([1,viewsMax]).range([0,1]);
    var likeslogScale = d3.scaleLog().domain([1,likesMax]).range([0,1]);
    var commentlogScale = d3.scaleLog().domain([1,commentMax]).range([0,1]);
    var incomelogScale = d3.scaleLog().domain([1,incomeMax]).range([0,1]);

    
    var numChart = tempdata.data.children.length *3;
   
    for (i = 0; i< tempdata.data.children.length; i++){
        for(j=0; j<3; j++){
            var newdata = tempdata.data.children[i].children[j][anaFlag];
            newdata.views = viewlogScale(newdata.views);
            newdata.likes = likeslogScale(newdata.likes);
            newdata.comment_count = commentlogScale(newdata.comment_count);
            newdata.income = incomelogScale(newdata.income);
            
            var rcolor = tempdata.data.children[i].children[j].color;
            drawRadar(newdata,rcolor,tempdata.children[i].children[j]);
        }
    }
     //**********************
//        TOOLTIP
//**********************

// define tooltip
var detailtooltip = d3.select('#bddetailchart') // select element in the DOM with id 'chart'
  .append('div').classed('tooltip', true).style('display', 'none');
detailtooltip.append('div') // add divs to the tooltip defined above 
  .attr('class', 'title');                 
detailtooltip.append('div')              
  .attr('class', 'detail'); 
    detailtooltip.append('div')              
  .attr('class', 'nviews'); 
        detailtooltip.append('div')              
  .attr('class', 'nlikes'); 
        detailtooltip.append('div')              
  .attr('class', 'ncomments'); 
        detailtooltip.append('div')              
  .attr('class', 'nincome'); 
        detailtooltip.append('div')              
  .attr('class', 'ntemperature'); 
        detailtooltip.append('div')              
  .attr('class', 'ntl'); 
            
    function drawRadar(rdata, color, odata){
        var svg = d3.select("#bddetailchart").append("svg")
        .attr("width", 350)
        .attr("height", 400);
        let radialScale = d3.scaleLinear()
        .domain([0,1])
        .range([0,80]);
    let ticks = [0.333,0.666,1];
        ticks.forEach(t =>
        svg.append("circle")
        .attr("cx", 175)
        .attr("cy", 200)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
    );
        /*ticks.forEach(t =>
        svg.append("text")
        .attr("x", 305)
        .attr("y", 300 - radialScale(t))
        .text(t.toString())
    );*/
        svg.append("text")
            .attr("x", 175)
            .attr("y", 50)
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text(function(){
            if(secFlag == undefined){
                 if(anaFlag == "average"){
                return "Average data in " + odata.data.name + ' likes';
            } else if (anaFlag == "maximum"){
                return "Max data in " + odata.data.name + ' likes';

            } else if (anaFlag == "medium"){
                return "Medium video data in " + odata.data.name + ' likes';
            }
            } else{
            if(anaFlag == "average"){
                return "Average data in " + odata.data.name + ' '+ secFlag;
            } else if (anaFlag == "maximum"){
                return "Max data in " + odata.data.name + ' '+ secFlag;

            } else if (anaFlag == "medium"){
                return "Medium video data in " + odata.data.name + ' '+ secFlag;
            }
            }
        });
        svg.append("text")
            .attr("x", 175)
            .attr("y", 70)
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text(function(){
                return "within " + odata.parent.data.name;
        });

        function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": 175 + x, "y": 200 - y};
    }
        for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 1);
        let label_coordinate = angleToCoordinate(angle, 1.05);

        //draw axis line
        svg.append("line")
        .attr("x1", 175)
        .attr("y1", 200)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","white");

        //draw axis label
        svg.append("text")
        .attr("x", function(){
            if(ft_name == "likes" || ft_name == "comment_count"){
                return label_coordinate.x-60;
            } else if(ft_name == "views" || ft_name == "income"){
                return label_coordinate.x-20;
            }
            else { 
                return label_coordinate.x;
            }})
        .attr("y", function(){ 
            if(ft_name == "income"){
                return label_coordinate.y+10;
            }
            else {
            return label_coordinate.y;}})
        .style('fill', 'white')
        .style("font-size", "12px")
        .text(function(){
            if(ft_name == "views"){
                return "Views";
            } else if(ft_name == "likes"){
                return "Likes";
            }else if(ft_name == "comment_count"){
                return "Comments";
            }else if(ft_name == "income"){
                return "Income";
            }else if(ft_name == "temperature"){
                return "Temperature";
            }else if(ft_name == "trending_length"){
                return "Trend Length";
            }
           });
    }
        let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
        function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            var newdata_point;
            if (ft_name == "views"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "likes"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "comment_count"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "income"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "temperature"){
                newdata_point = data_point[ft_name]/tempMax;
            } else if(ft_name == "trending_length"){
                newdata_point = data_point[ft_name]/tlMax;
            }
            coordinates.push(angleToCoordinate(angle, newdata_point));
        }
        return coordinates;
    }
            let d = rdata;
            let coordinates = getPathCoordinates(d);

            //draw the path element
            svg.append("path")
            .datum(coordinates)
            .attr("d",line)
            .attr("stroke-width", 3)
            .attr("stroke", color)
            .attr("fill", color)
            .attr("stroke-opacity", 1)
            .attr("opacity", 0);
           
        svg.select("path")
            .transition()
            .duration(500)
            .attr("opacity", 0.5);
            
            svg.select("path").on('mouseover', function(d) {
                // Use this to select the hovered element
            d3.select(this).attr("opacity", 0.8);
      detailtooltip.select('.title').html(function(){  
    return odata.parent.data.name;
    }); 
      detailtooltip.select('.detail').html(function(){  
    return odata.data.name + ' ' + secFlag;
    });   
        detailtooltip.select('.nviews').html(function(){  
    return 'Views ' + d3.format(".0f")(viewlogScale.invert(odata.data[anaFlag].views));
    }); 
                 detailtooltip.select('.nlikes').html(function(){  
    return 'Likes ' + d3.format(".0f")(likeslogScale.invert(odata.data[anaFlag].likes));
    }); 
                 detailtooltip.select('.ncomments').html(function(){  
    return 'Comments ' + d3.format(".0f")(commentlogScale.invert(odata.data[anaFlag].comment_count));
    }); 
                 detailtooltip.select('.nincome').html(function(){  
    return 'Income $' + d3.format(".0f")(incomelogScale.invert(odata.data[anaFlag].income));
    }); 
                 detailtooltip.select('.ntemperature').html(function(){  
    return 'Temperature ' + d3.format(".0f")(odata.data[anaFlag].temperature);
    }); 
                 detailtooltip.select('.ntl').html(function(){  
    return 'Trending Length ' + d3.format(".0f")(odata.data[anaFlag].trending_length);
    }); 
      detailtooltip.style('display', 'block'); // set display   
    })
    .on('mouseout', function() { // when mouse leaves div 
                            d3.select(this).attr("opacity", 0.5);
      detailtooltip.style('display', 'none'); // hide tooltip for that element
    })
    .on('mousemove', function(d) { // when mouse moves                  
      detailtooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
      detailtooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });
        
        
    }
}

// FOR SELECTION
$('.ui-choose').ui_choose();
var bd_math = $('#bd_math').data('ui-choose');
bd_math.change = function(value, item) {
    bd_dataclean();
    console.log('change', value);
};







function bdcatchart(tempdata){
    document.getElementById("bddetailchart").innerHTML = "";
        anaFlag = document.getElementById("bd_math").value;


let data_act = [];
let features = ["views","likes","comment_count","income","temperature","trending_length"];
    var viewsMax = 0, likesMax = 0, commentMax = 0, incomeMax = 0, tempMax =0, tlMax=0;
     for (var i = 0; i < tempdata.data.children.length; i ++){

        for (var j = 0; j < 3; j ++){
            let d = tempdata.data.children[i].children[j][anaFlag];
            if (d.views - viewsMax > 0){
                viewsMax = d.views;
            }
            if (d.likes - likesMax > 0) {
                likesMax = d.likes;
            }
            if (d.comment_count - commentMax > 0){
                commentMax = d.comment_count;
            }
            if (d.income - incomeMax > 0){
                incomeMax = d.income;
            }
            if (d.temperature - tempMax > 0){
                tempMax = d.temperature;
            }
            if (d.trending_length - tlMax > 0){
                tlMax = d.trending_length;
            }
            
        }
     }
    var viewlogScale = d3.scaleLog().domain([1,viewsMax]).range([0,1]);
    var likeslogScale = d3.scaleLog().domain([1,likesMax]).range([0,1]);
    var commentlogScale = d3.scaleLog().domain([1,commentMax]).range([0,1]);
    var incomelogScale = d3.scaleLog().domain([1,incomeMax]).range([0,1]);

    
    var numChart = tempdata.data.children.length *3;
   
    for (i = 0; i< tempdata.data.children.length; i++){
        var newdata = tempdata.data.children[i];

        for(j=0; j<3; j++){
            newdata.children[j][anaFlag].views = viewlogScale(newdata.children[j][anaFlag].views);
            newdata.children[j][anaFlag].likes = likeslogScale(newdata.children[j][anaFlag].likes);
            newdata.children[j][anaFlag].comment_count = commentlogScale(newdata.children[j][anaFlag].comment_count);
            newdata.children[j][anaFlag].income = incomelogScale(newdata.children[j][anaFlag].income);
            }
                   drawcatRadar(newdata, tempdata.data.children[i]);

    }
     //**********************
//        TOOLTIP
//**********************

// define tooltip
var detailtooltip = d3.select('#bddetailchart') // select element in the DOM with id 'chart'
  .append('div').classed('tooltip', true).style('display', 'none');
detailtooltip.append('div') // add divs to the tooltip defined above 
  .attr('class', 'title');                 
detailtooltip.append('div')              
  .attr('class', 'detail'); 
    detailtooltip.append('div')              
  .attr('class', 'nviews'); 
        detailtooltip.append('div')              
  .attr('class', 'nlikes'); 
        detailtooltip.append('div')              
  .attr('class', 'ncomments'); 
        detailtooltip.append('div')              
  .attr('class', 'nincome'); 
        detailtooltip.append('div')              
  .attr('class', 'ntemperature'); 
        detailtooltip.append('div')              
  .attr('class', 'ntl'); 
  
 
    
            
    function drawcatRadar(rdata, odata){
                console.log(rdata);
        var svg = d3.select("#bddetailchart").append("svg")
        .attr("width", 350)
        .attr("height", 400);
        let radialScale = d3.scaleLinear()
        .domain([0,1])
        .range([0,80]);
    let ticks = [0.333,0.666,1];
        ticks.forEach(t =>
        svg.append("circle")
        .attr("cx", 175)
        .attr("cy", 200)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
    );
        /*ticks.forEach(t =>
        svg.append("text")
        .attr("x", 305)
        .attr("y", 300 - radialScale(t))
        .text(t.toString())
    );*/
        svg.append("text")
            .attr("x", 175)
            .attr("y", 50)
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "14px")
            .text(function(){
            
            if(anaFlag == "average"){
                return "Average data in " + rdata.name;
            } else if (anaFlag == "maximum"){
                return "Max data in " + rdata.name;

            } else if (anaFlag == "medium"){
                return "Medium video data in " + rdata.name;
            }
            
        });
        
        function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": 175 + x, "y": 200 - y};
    }
        for (var i = 0; i < features.length; i++) {
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        let line_coordinate = angleToCoordinate(angle, 1);
        let label_coordinate = angleToCoordinate(angle, 1.05);

        //draw axis line
        svg.append("line")
        .attr("x1", 175)
        .attr("y1", 200)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","white");

        //draw axis label
        svg.append("text")
        .attr("x", function(){
            if(ft_name == "likes" || ft_name == "comment_count"){
                return label_coordinate.x-60;
            } else if(ft_name == "views" || ft_name == "income"){
                return label_coordinate.x-20;
            }
            else { 
                return label_coordinate.x;
            }})
        .attr("y", function(){ 
            if(ft_name == "income"){
                return label_coordinate.y+10;
            }
            else {
            return label_coordinate.y;}})
        .style('fill', 'white')
        .style("font-size", "12px")
        .text(function(){
            if(ft_name == "views"){
                return "Views";
            } else if(ft_name == "likes"){
                return "Likes";
            }else if(ft_name == "comment_count"){
                return "Comments";
            }else if(ft_name == "income"){
                return "Income";
            }else if(ft_name == "temperature"){
                return "Temperature";
            }else if(ft_name == "trending_length"){
                return "Trend Length";
            }
           });
    }
        let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
        function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i = 0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            var newdata_point;
            if (ft_name == "views"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "likes"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "comment_count"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "income"){
                newdata_point = data_point[ft_name];
            } else if(ft_name == "temperature"){
                newdata_point = data_point[ft_name]/tempMax;
            } else if(ft_name == "trending_length"){
                newdata_point = data_point[ft_name]/tlMax;
            }
            coordinates.push(angleToCoordinate(angle, newdata_point));
        }
        return coordinates;
    }
        for(var i =0; i<rdata.children.length; i++){
        
        
            let d = rdata.children[i][anaFlag];
            let color = rdata.children[i].color;
            let coordinates = getPathCoordinates(d);
            
            console.log(d);
            console.log(color);

            //draw the path element
            svg.append("path")
            .datum(coordinates)
            .attr("d",line)
            .attr("stroke-width", 3)
            .attr("stroke", color)
            .attr("fill", color)            
            .attr("opacity", 0.5)
            .attr("stroke-opacity", 1);
       /*    
        svg.select("path")
            .transition()
            .duration(500)
            .attr("opacity", 0.5);*/
        }
        
    
        svg.selectAll("path").on('mouseover', function(d) {
    detailtooltip.select('.title').html(function(){  
    return odata.name;
    }); 
        
            detailtooltip.select('.nviews').html(function(){  
    return 'Views ' + d3.format(".0f")(viewlogScale.invert(odata.children[1][anaFlag].views));
    }); 
                 detailtooltip.select('.nlikes').html(function(){  
    return 'Likes ' + d3.format(".0f")(likeslogScale.invert(odata.children[1][anaFlag].likes));
    }); 
                 detailtooltip.select('.ncomments').html(function(){  
    return 'Comments ' + d3.format(".0f")(commentlogScale.invert(odata.children[1][anaFlag].comment_count));
    }); 
                 detailtooltip.select('.nincome').html(function(){  
    return 'Income $' + d3.format(".0f")(incomelogScale.invert(odata.children[1][anaFlag].income));
    }); 
                 detailtooltip.select('.ntemperature').html(function(){  
    return 'Temperature ' + d3.format(".0f")(odata.children[1][anaFlag].temperature);
    }); 
                 detailtooltip.select('.ntl').html(function(){  
    return 'Trending Length ' + d3.format(".0f")(odata.children[1][anaFlag].trending_length);
    }); 
            
      detailtooltip.style('display', 'block'); // set display   
    })
    .on('mouseout', function() { // when mouse leaves div 
                            d3.select(this).attr("opacity", 0.5);
      detailtooltip.style('display', 'none'); // hide tooltip for that element
    })
    .on('mousemove', function(d) { // when mouse moves                  
      detailtooltip.style('top', (d3.event.layerY + 10) + 'px'); // always 10px below the cursor
      detailtooltip.style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
            });
        
    }
}