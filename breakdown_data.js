/*act - 8 (3,3,2)
tec - 201 (67,134)
edu - 143 (48,96)
ent - 1901 (634, 1268)
lif - 597 (199, 398)
new - 265 (122,244)*/ 
var secFlag;

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


    secFlag ="a";
    d3.dsv('\\', './data/US_final.csv').then(function(dataset) {
    dataset.forEach(function(d) {
        d.publish_time = parseTime(d.publish_time);
        d.trending_date = parseTime(d.trending_date);
    });
      
    nested = d3.nest()
        .key(function(c) {
            return c.category_id;
        })
        .entries(dataset);
    
    
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
       
    if(secFlag == "a"){                     //secondlevel - views
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
        
        } else if(secFlag == "b"){          //secondlevel - like:dislike
        actArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    }); 
        tecArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    }); 
        eduArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    });         
        entArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    }); 
        lifArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    }); 
        newArray.sort(function(a, b){
        return (a.likes/a.dislikes) - (b.likes/b.dislikes);
    }); 
        } else if(secFlag == "c"){          //secondlevel - comment
        actArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    }); 
        tecArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    }); 
        eduArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    });         
        entArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    }); 
        lifArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    }); 
        newArray.sort(function(a, b){
        return a.comment_count - b.comment_count;
    });    
        } else if(secFlag == "d"){          //secondlevel - income
        actArray.sort(function(a, b){
        return a.views - b.views;
    }); 
        tecArray.sort(function(a, b){
        return a.views - b.views;
    }); 
        eduArray.sort(function(a, b){
        return a.views - b.views;
    });         
        entArray.sort(function(a, b){
        return a.views - b.views;
    }); 
        lifArray.sort(function(a, b){
        return a.views - b.views;
    }); 
        newArray.sort(function(a, b){
        return a.views - b.views;
    }); 
        } else if(secFlag == "e"){          //secondlevel - temperature
        actArray.sort(function(a, b){
        return a.temperature - b.temperature;
    }); 
        tecArray.sort(function(a, b){
        return a.temperature - b.temperature;
    }); 
        eduArray.sort(function(a, b){
        return a.temperature - b.temperature;
    });         
        entArray.sort(function(a, b){
        return a.temperature - b.temperature;
    }); 
        lifArray.sort(function(a, b){
        return a.temperature - b.temperature;
    }); 
        newArray.sort(function(a, b){
        return a.temperature - b.temperature;
    }); 
        } else if(secFlag == "f"){          //secondlevel - trending length
        actArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
    }); 
        tecArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
    }); 
        eduArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
    });         
        entArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
    }); 
        lifArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
    }); 
        newArray.sort(function(a, b){
        return new Date(b.trending_date) - new Date(a.trending_date);
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
                "name": "Activisim",
                "color": "#7CC237",
                "children": [
                    {"name": "High", "size": actArray_hig.length, "children": actArray_hig},
                    {"name": "Med", "size": actArray_med.length, "children": actArray_med},
                    {"name": "Low", "size": actArray_low.length, "children": actArray_low}
            ]},
            {
                "name": "Technology",
                "color": "#B155DE",
                "children": [
                    {"name": "High", "size": tecArray_hig.length, "children": tecArray_hig},
                    {"name": "Med", "size": tecArray_med.length, "children": tecArray_med},
                    {"name": "Low", "size": tecArray_low.length, "children": tecArray_low}
            ]},
            {
                "name": "Education",
                "color": "#DE5555",
                "children": [
                    {"name": "High", "size": eduArray_hig.length, "children": eduArray_hig},
                    {"name": "Med", "size": eduArray_med.length, "children": eduArray_med},
                    {"name": "Low", "size": eduArray_low.length, "children": eduArray_low}
            ]},
            {
                "name": "Entertainment",
                "color": "#6D72E7",
                "children": [
                    {"name": "High", "size": entArray_hig.length, "children": entArray_hig},
                    {"name": "Med", "size": entArray_med.length, "children": entArray_med},
                    {"name": "Low", "size": entArray_low.length, "children": entArray_low}
            ]},
            {
                "name": "Lifestyle",
                "color": "#DEB75B",
                "children": [
                    {"name": "High", "size": lifArray_hig.length, "children": lifArray_hig},
                    {"name": "Med", "size": lifArray_med.length, "children": lifArray_med},
                    {"name": "Low", "size": lifArray_low.length, "children": lifArray_low}
            ]},
            {
                "name": "News",
                "color": "#26BDD2",
                "children": [
                    {"name": "High", "size": newArray_hig.length, "children": newArray_hig},
                    {"name": "Med", "size": newArray_med.length, "children": newArray_med},
                    {"name": "Low", "size": newArray_low.length, "children": newArray_low}
            ]
            }
        ]
    };
                    console.log(actArray_nested);
                            console.log(actArray_hig);
                                    console.log(actArray_med);
                            console.log(actArray_low);
                                    //console.log(newArray_nested);




            console.log(newroot);


  
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