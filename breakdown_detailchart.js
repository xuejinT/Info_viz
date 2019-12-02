function bddetailchart(rootdata){
            document.getElementById("bddetailchart").innerHTML = "";

let data_act = [];
let features = ["View","Like:Dislike","Comment","Income","Temperature","Trending Length"];
//generate the data
/*for (var i = 0; i < 3; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    data.push(point);
}
console.log(data);
    */
    
    
    
    
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
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}
    for (var i = 0; i < data.length; i ++){
    let d = data[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    //draw the path element
    svg.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);
}
}