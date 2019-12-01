/*act - 8 (3,3,2)
tec - 201 (67,134)
edu - 143 (48,96)
ent - 1901 (634, 1268)
lif - 597 (199, 398)
new - 265 (122,244)*/ 
var secFlag;
function bdchangesort()
{
    secFlag = document.getElementById("bd-secondlevel").value;
    bd_dataclean();
}
function bd_dataclean()
{
    //create 6 catgory clusters
    var actArray =[];
    var actArray_hig =[];
    var actArray_med =[];
    var actArray_low =[];

    var tecArray =[];
    var tecArray_hig =[];
    var tecArray_med =[];
    var tecArray_low =[];

    var eduArray =[];
    var eduArray_hig =[];
    var eduArray_med =[];
    var eduArray_low =[];

    var entArray =[];
    var entArray_hig =[];
    var entArray_med =[];
    var entArray_low =[];

    var lifArray =[];
    var lifArray_hig =[];
    var lifArray_med =[];
    var lifArray_low =[];
    
    var newArray =[];
    var newArray_hig =[];
    var newArray_med =[];
    var newArray_low =[];

    d3.dsv('\\', './data/US_final.csv').then(function(dataset) {
    dataset.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });
          console.log("secFlag");

    console.log(secFlag);
    dataset.forEach(function(d){
        if (d.category_id == "29"){
            actArray = actArray.concat(d);
        } else if (d.category_id == "28"){
            tecArray = tecArray.concat(d);
        } else if (d.category_id == "27"){
            eduArray = eduArray.concat(d);
        } else if (d.category_id == "1" || d.category_id == "10" || d.category_id == "15" || d.category_id == "17" || d.category_id == "20" || d.category_id == "23" || d.category_id == "24" || d.category_id == "43"){
            entArray = entArray.concat(d);
        } else if (d.category_id == "2" || d.category_id == "19" || d.category_id == "22"|| d.category_id == "26"){
            lifArray = lifArray.concat(d);
        } else if (d.category_id == "25"){
            newArray = newArray.concat(d);
        }
    });

        var actArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(actArray);
        var tecArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(tecArray);
        var eduArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(eduArray);
        var entArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(entArray);
        var lifArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(lifArray);
        var newArray_nested = d3.nest()
        .key(function(c){
             return c.video_id;
        }).entries(newArray);
       
    if(secFlag == "views"){                     //secondlevel - views
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    }); 
        tecArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    }); 
        eduArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    });         
        entArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    }); 
        lifArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    });
        newArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].views - b.values[b.values.length-1].views;
    });       
        
        } else if(secFlag == "likes"){          //secondlevel - like
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    }); 
        tecArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    }); 
        eduArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    });         
        entArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    }); 
        lifArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    }); 
        newArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].likes - b.values[b.values.length-1].likes;
    }); 
        } else if(secFlag == "dislikes"){          //secondlevel - dislike
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    }); 
        tecArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    }); 
        eduArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    });         
        entArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    }); 
        lifArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    }); 
        newArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].dislikes - b.values[b.values.length-1].dislikes;
    }); 
        } else if(secFlag == "ratio"){          //secondlevel - like:dislike
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    }); 
        tecArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    }); 
        eduArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    });         
        entArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    }); 
        lifArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    }); 
        newArray_nested.sort(function(a, b){
        return  a.values[a.values.length-1].ratio - b.values[b.values.length-1].ratio;
    }); 
        } else if(secFlag == "comment_count"){          //secondlevel - comment
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    }); 
        tecArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    }); 
        eduArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    });         
        entArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    }); 
        lifArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    }); 
        newArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].comment_count - b.values[b.values.length-1].comment_count;
    });    
        } else if(secFlag == "income"){          //secondlevel - income
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    }); 
        tecArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    }); 
        eduArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    });         
        entArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    }); 
        lifArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    }); 
        newArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].income - b.values[b.values.length-1].income;
    }); 
        } else if(secFlag == "temperature"){          //secondlevel - temperature
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    }); 
        tecArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    }); 
        eduArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    });         
        entArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    }); 
        lifArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    }); 
        newArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].temperature - b.values[b.values.length-1].temperature;
    }); 
        } else if(secFlag == "trending_length"){          //secondlevel - trending length
        actArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    }); 
        tecArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    }); 
        eduArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    });         
        entArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    }); 
        lifArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    }); 
        newArray_nested.sort(function(a, b){
        return a.values[a.values.length-1].trending_length - b.values[b.values.length-1].trending_length;
    }); 
        }
        
        actArray_low = low_data(actArray_nested, actArray_low); 
        actArray_med = med_data(actArray_nested, actArray_med);        
        actArray_hig = hig_data(actArray_nested, actArray_hig); 
        
        tecArray_low = low_data(tecArray_nested, tecArray_low); 
        tecArray_med = med_data(tecArray_nested, tecArray_med);        
        tecArray_hig = hig_data(tecArray_nested, tecArray_hig);
        
        eduArray_low = low_data(eduArray_nested, eduArray_low); 
        eduArray_med = med_data(eduArray_nested, eduArray_med);        
        eduArray_hig = hig_data(eduArray_nested, eduArray_hig);
        
        entArray_low = low_data(entArray_nested, entArray_low); 
        entArray_med = med_data(entArray_nested, entArray_med);        
        entArray_hig = hig_data(entArray_nested, entArray_hig);
        
        lifArray_low = low_data(lifArray_nested, lifArray_low); 
        lifArray_med = med_data(lifArray_nested, lifArray_med);        
        lifArray_hig = hig_data(lifArray_nested, lifArray_hig);
        
        newArray_low = low_data(newArray_nested, newArray_low); 
        newArray_med = med_data(newArray_nested, newArray_med);        
        newArray_hig = hig_data(newArray_nested, newArray_hig);

        
        var newroot ={
        name: "TOTAL",
        color: "#1E1E1E",
        children: [
            {
                "name": "Entertainment",
                "color": "#6D72E7",
                "children": [
                    {"name": "High", "size": entArray_hig.length, "color": "#999cee","value": entArray_hig},
                    {"name": "Med", "size": entArray_med.length, "color":"#c5c6f5","value": entArray_med},
                    {"name": "Low", "size": entArray_low.length, "color":"#dbdbf9","value": entArray_low}
            ]},
            {
                "name": "Lifestyle",
                "color": "#DEB75B",
                "children": [
                    {"name": "High", "size": lifArray_hig.length, "color": "#decd5b","value": lifArray_hig},
                    {"name": "Med", "size": lifArray_med.length, "color": "#e7da85","value": lifArray_med},
                    {"name": "Low", "size": lifArray_low.length, "color": "#efe7b0","value": lifArray_low}
            ]},
            {
                "name": "News",
                "color": "#26BDD2",
                "children": [
                    {"name": "High", "size": newArray_hig.length, "color": "#4ccddf", "value": newArray_hig},
                    {"name": "Med", "size": newArray_med.length, "color": "#77d9e7","value": newArray_med},
                    {"name": "Low", "size": newArray_low.length, "color": "#a2e5ef","value": newArray_low}
            ]
            },
            {
                "name": "Technology",
                "color": "#B155DE",
                "children": [
                    {"name": "High", "size": tecArray_hig.length, "color": "#c580e6", "value": tecArray_hig},
                    {"name": "Med", "size": tecArray_med.length, "color": "#d8abee","value": tecArray_med},
                    {"name": "Low", "size": tecArray_low.length, "color": "#ecd5f7","value": tecArray_low}
            ]},
            {
                "name": "Education",
                "color": "#DE5555",
                "children": [
                    {"name": "High", "size": eduArray_hig.length, "color": "#e68080","value": eduArray_hig},
                    {"name": "Med", "size": eduArray_med.length, "color": "#eeabab","value": eduArray_med},
                    {"name": "Low", "size": eduArray_low.length, "color": "#f7d5d5","value": eduArray_low}
            ]},
            {
                "name": "Activisim",
                "color": "#7CC237",
                "children": [
                    {"name": "High", "size": actArray_hig.length, "color": "#96d15b","value": actArray_hig},
                    {"name": "Med", "size": actArray_med.length, "color": "#b0dc83","value": actArray_med},
                    {"name": "Low", "size": actArray_low.length, "color": "#c9e7ab","value": actArray_low}
            ]}
            
            
        ]
        
    };
        console.log(newroot);
        bdchartchart(newroot);
    function low_data(catArray_nested, catArray_low){
         for(i=0;i < Math.floor(catArray_nested.length/3);i++){
                catArray_low =catArray_low.concat(catArray_nested[i]);
            } 
        return catArray_low;
    }
    
    function med_data(catArray_nested, catArray_med){
         for(i=Math.floor(catArray_nested.length/3);i < Math.floor(catArray_nested.length/3*2);i++){
                catArray_med =catArray_med.concat(catArray_nested[i]);
        }
        return catArray_med;
    }
    function hig_data(catArray_nested, catArray_hig){
          for(i=Math.floor(catArray_nested.length/3*2);i < catArray_nested.length;i++){
                catArray_hig =catArray_hig.concat(catArray_nested[i]);
        } 
        return catArray_hig;
    }
    
});
}

