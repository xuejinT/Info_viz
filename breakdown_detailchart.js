function bddetailchart(rootdata){
    document.getElementById("bddetailchart").innerHTML = "";
 
let data_act = [];
let features = ["views","ratio","comment_count","income","temperature","trending_length"];
//generate the data
/*for (var i = 0; i < 3; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    data.push(point);
}
console.log(data);
    */
    var viewsMax = 0, ratioMax = 0, commentMax = 0, incomeMax = 0, tempMax =0, tlMax=0;
     for (var i = 0; i < rootdata.children.length; i ++){

        for (var j = 0; j < 3; j ++){
                console.log(rootdata.children[i].children[j]);


            for (var k = 0; k < rootdata.children[i].children[j].value; k ++){
                let dIndex = rootdata.children[i].children[j].data.value[k].values.length - 1;
                let d = rootdata.children[i].children[j].data.value[k].values[dIndex];
                        

                if (d.views - viewsMax > 0){
                    viewsMax = d.views;
                }
                if (d.ratio - ratioMax > 0) {
                    ratioMax = d.ratio;
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
     }
      
    var svg = d3.select("#bddetailchart").append("svg")
    .attr("width", 800)
    .attr("height", 600);
    let radialScale = d3.scaleLinear()
    .domain([0,1])
    .range([0,250]);
let ticks = [0.25,0.5,0.75,1];
    ticks.forEach(t =>
    svg.append("circle")
    .attr("cx", 300)
    .attr("cy", 300)
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
    function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 300 + x, "y": 300 - y};
}
    for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 1);
    let label_coordinate = angleToCoordinate(angle, 1.05);

    //draw axis line
    svg.append("line")
    .attr("x1", 300)
    .attr("y1", 300)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","white");

    //draw axis label
    svg.append("text")
    .attr("x", function(){
        if(ft_name == "Like:Dislike" || ft_name == "Comment"){
            return label_coordinate.x-70;
        } else if(ft_name == "View" || ft_name == "Income"){
            return label_coordinate.x-20;
        }
        else { 
            return label_coordinate.x;
        }})
    .attr("y", label_coordinate.y)
    .style('fill', 'white')
    .text(ft_name);
}
    let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
/*let colors = ["darkorange", "gray", "navy"];*/
    function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        var newdata_point;
        if (ft_name == "views"){
            newdata_point = data_point[ft_name]/viewsMax;
        } else if(ft_name == "ratio"){
            newdata_point = data_point[ft_name]/ratioMax;
        } else if(ft_name == "comment_count"){
            newdata_point = data_point[ft_name]/commentMax;
        } else if(ft_name == "income"){
            newdata_point = data_point[ft_name]/incomeMax;
        } else if(ft_name == "temperature"){
            newdata_point = data_point[ft_name]/tempMax;
        } else if(ft_name == "trending_length"){
            newdata_point = data_point[ft_name]/tlMax;
        }
        coordinates.push(angleToCoordinate(angle, newdata_point));
    }
    return coordinates;
}
    for (var i = 0; i < rootdata.children.length; i ++){

        for (var j = 0; j < 3; j ++){

            for (var k = 0; k < rootdata.children[i].children[j].value; k ++){
                    let color = rootdata.children[i].children[j].data.color;
                    let dIndex = rootdata.children[i].children[j].data.value[k].values.length - 1;
                    let d = rootdata.children[i].children[j].data.value[k].values[dIndex];
                    let coordinates = getPathCoordinates(d);
                

                
                    //draw the path element
                    svg.append("path")
                    .datum(coordinates)
                    .attr("d",line)
                    .attr("stroke", color)
                    .attr("stroke-width", 3)
                    .attr("fill", color)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.5);


            }
        }
   
    }
}