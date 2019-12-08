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
        document.getElementById("bdlegendtext").innerHTML = secFlag; 
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

        var newroot = {
            name: "TOTAL",
        color: "#282828",
        children: []
        };
        
        if(c3_ent == true){
            newroot.children.push({
                "name": "Entertainment",
                "color": "#6D72E7",
                "children": [
                    {"name": "High", 
                    "size": entArray_hig.length, 
                    "color": "#999cee",
                    "average":find_ave(entArray_hig),
                    "maximum":find_max(entArray_hig),
                    "medium": find_med(entArray_hig),
                    "value": entArray_hig
                    },
                    {"name": "Med", 
                     "size": entArray_med.length,
                     "color":"#c5c6f5",
                     "average":find_ave(entArray_med),
                     "maximum":find_max(entArray_med),
                     "medium": find_med(entArray_med),
                     "value": entArray_med},
                    {"name": "Low", 
                     "size": entArray_low.length, 
                     "color":"#dbdbf9",
                     "average":find_ave(entArray_low),
                     "maximum":find_max(entArray_low),
                     "medium": find_med(entArray_low),
                     "value": entArray_low}
            ]});
        }
        if(c4_lif == true){
            newroot.children.push({
                "name": "Lifestyle",
                "color": "#DEB75B",
                "children": [
                    {"name": "High", 
                     "size": lifArray_hig.length, 
                     "color": "#decd5b",
                     "average":find_ave(lifArray_hig),
                     "maximum":find_max(lifArray_hig),
                     "medium": find_med(lifArray_hig),
                     "value": lifArray_hig},
                    {"name": "Med", 
                     "size": lifArray_med.length, 
                     "color": "#e7da85",
                     "average":find_ave(lifArray_med),
                     "maximum":find_max(lifArray_med),
                     "medium": find_med(lifArray_med),
                     "value": lifArray_med},
                    {"name": "Low", 
                     "size": lifArray_low.length, 
                     "color": "#efe7b0",
                     "average":find_ave(lifArray_low),
                     "maximum":find_max(lifArray_low),
                     "medium": find_med(lifArray_low),
                     "value": lifArray_low}
            ]});
        }
        if(c5_new == true){
            newroot.children.push({
                "name": "News",
                "color": "#26BDD2",
                "children": [
                    {"name": "High", 
                     "size": newArray_hig.length, 
                     "color": "#4ccddf", 
                     "average":find_ave(newArray_hig),
                     "maximum":find_max(newArray_hig),
                     "medium": find_med(newArray_hig),
                     "value": newArray_hig},
                    {"name": "Med", 
                     "size": newArray_med.length, 
                     "color": "#77d9e7", 
                     "average":find_ave(newArray_med),
                     "maximum":find_max(newArray_med),
                     "medium": find_med(newArray_med),
                     "value": newArray_med},
                    {"name": "Low", 
                     "size": newArray_low.length, 
                     "color": "#a2e5ef", 
                     "average":find_ave(newArray_low),
                     "maximum":find_max(newArray_low),
                     "medium": find_med(newArray_low),
                     "value": newArray_low}
            ]
            });
        }
        if(c6_tec == true){
            newroot.children.push({
                "name": "Technology",
                "color": "#B155DE",
                "children": [
                    {"name": "High", 
                     "size": tecArray_hig.length, 
                     "color": "#c580e6",  
                     "average":find_ave(tecArray_hig),
                     "maximum":find_max(tecArray_hig),
                     "medium": find_med(tecArray_hig),
                     "value": tecArray_hig},
                    {"name": "Med", 
                     "size": tecArray_med.length, 
                     "color": "#d8abee",  
                     "average":find_ave(tecArray_med),
                     "maximum":find_max(tecArray_med),
                     "medium": find_med(tecArray_med),
                     "value": tecArray_med},
                    {"name": "Low", 
                     "size": tecArray_low.length, 
                     "color": "#ecd5f7",  
                     "average":find_ave(tecArray_low),
                     "maximum":find_max(tecArray_low),
                     "medium": find_med(tecArray_low),
                     "value": tecArray_low}
            ]});
        }
        if(c2_edu == true){
            newroot.children.push({
                "name": "Education",
                "color": "#DE5555",
                "children": [
                    {"name": "High", 
                     "size": eduArray_hig.length, 
                     "color": "#e68080",  
                     "average":find_ave(eduArray_hig,secFlag),
                     "maximum":find_max(eduArray_hig,secFlag),
                     "medium": find_med(eduArray_hig,secFlag),
                     "value": eduArray_hig},
                    {"name": "Med", 
                     "size": eduArray_med.length, 
                     "color": "#eeabab",  
                     "average":find_ave(eduArray_med,secFlag),
                     "maximum":find_max(eduArray_med,secFlag),
                     "medium": find_med(eduArray_med,secFlag),
                     "value": eduArray_med},
                    {"name": "Low", 
                     "size": eduArray_low.length, 
                     "color": "#f7d5d5",  
                     "average":find_ave(eduArray_low,secFlag),
                     "maximum":find_max(eduArray_low,secFlag),
                     "medium": find_med(eduArray_low,secFlag),
                     "value": eduArray_low}
            ]});
        }
        if(c1_act == true){
            newroot.children.push({
                "name": "Activisim",
                "color": "#7CC237",
                "children": [
                    {"name": "High", 
                     "size": actArray_hig.length, 
                     "color": "#96d15b",  
                     "average":find_ave(actArray_hig,secFlag),
                     "maximum":find_max(actArray_hig,secFlag),
                     "medium": find_med(actArray_hig,secFlag),
                     "value": actArray_hig},
                    {"name": "Med", 
                     "size": actArray_med.length, 
                     "color": "#b0dc83",  
                     "average":find_ave(actArray_med,secFlag),
                     "maximum":find_max(actArray_med,secFlag),
                     "medium": find_med(actArray_med,secFlag),
                     "value": actArray_med},
                    {"name": "Low", 
                     "size": actArray_low.length, 
                     "color": "#c9e7ab",  
                     "average":find_ave(actArray_low,secFlag),
                     "maximum":find_max(actArray_low,secFlag),
                     "medium": find_med(actArray_low,secFlag),
                     "value": actArray_low}
            ]});
        }



        console.log(newroot);
        bdchartchart(newroot);

    
    function low_data(Array_nested, Array_low){
         for(i=0;i < Math.floor(Array_nested.length/3);i++){
                Array_low =Array_low.concat(Array_nested[i]);
            } 
        return Array_low;
    }
    
    function med_data(Array_nested, Array_med){
         for(i=Math.floor(Array_nested.length/3);i < Math.floor(Array_nested.length/3*2);i++){
                Array_med =Array_med.concat(Array_nested[i]);
        }
        return Array_med;
    }
    function hig_data(Array_nested, Array_hig){
          for(i=Math.floor(Array_nested.length/3*2);i < Array_nested.length;i++){
                Array_hig =Array_hig.concat(Array_nested[i]);
        } 
        return Array_hig;
    }
    function find_ave(Array){
        var sum_view=0, sum_likes=0, sum_comment=0, sum_income=0, sum_temperature=0, sum_tl=0;
        var avg = {};
        
        for(i=0; i< Array.length; i++){
            sum_view += parseInt(Array[i].values[Array[i].values.length-1].views,10);
            sum_likes += parseInt(Array[i].values[Array[i].values.length-1].likes,10);
            sum_comment += parseInt(Array[i].values[Array[i].values.length-1].comment_count,10);
            sum_income += parseInt(Array[i].values[Array[i].values.length-1].income,10);
            sum_temperature += parseInt(Array[i].values[Array[i].values.length-1].temperature,10);
            sum_tl += parseInt(Array[i].values[Array[i].values.length-1].trending_length,10);
        }

        avg.views = sum_view/Array.length;
        avg.likes = sum_likes/Array.length;
        avg.comment_count = sum_comment/Array.length;
        avg.income = sum_income/Array.length;
        avg.temperature = sum_temperature/Array.length;
        avg.trending_length = sum_tl/Array.length;

        return avg;
    }
    function find_max(Array){
        var max_view = 0, max_likes = 0, max_comment = 0, max_income = 0, max_temperature = 0, max_tl = 0;
        var max = {};
        for(i=0; i<Array.length; i++){
            if(Array[i].values[Array[i].values.length-1].views > max_view){
                max_view = Array[i].values[Array[i].values.length-1].views;
            } if(Array[i].values[Array[i].values.length-1].likes > max_likes){
                max_likes = Array[i].values[Array[i].values.length-1].likes;
            } if(Array[i].values[Array[i].values.length-1].comment_count > max_comment){
                max_comment = Array[i].values[Array[i].values.length-1].comment_count;
            } if(Array[i].values[Array[i].values.length-1].income > max_income){
                max_income = Array[i].values[Array[i].values.length-1].income;
            } if(Array[i].values[Array[i].values.length-1].temperature > max_temperature){
                max_temperature = Array[i].values[Array[i].values.length-1].temperature;
            } if(Array[i].values[Array[i].values.length-1].trending_length > max_tl){
                max_tl = Array[i].values[Array[i].values.length-1].trending_length;
            }  
        }
        max.views = parseInt(max_view,10);
        max.likes = parseInt(max_likes,10);
        max.comment_count = parseInt(max_comment,10);
        max.income = parseInt(max_income,10);
        max.temperature = parseInt(max_temperature,10);
        max.trending_length = parseInt(max_tl,10);
        return max;
    }
    function find_med(Array){
        return Array[Math.floor(Array.length/2)].values[Array[Math.floor(Array.length/2)].values.length-1];
    }
});
}

