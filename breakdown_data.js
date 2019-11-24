/*act - 8 (3,3,2)
tec - 1228 (410,819)
edu - 911 (304,607)
ent - 11895 (3965, 7930)
lif - 3984 (1328, 2656)
new - 1254 (418,836)*/ 
var secFlag;

function bd_dataclean()
{
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
        
       for(i=0;i < 3;i++){
                actArray_low =actArray_low.concat(actArray_nested[i]);
            } 
        for(i=3;i < 6;i++){
                actArray_med =actArray_med.concat(actArray_nested[i]);
        }  
        for(i=6;i < 8;i++){
                actArray_hig =actArray_hig.concat(actArray_nested[i]);
        } 
        
        
        
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

/*    actArray.forEach(function(d){
        if(secFlag == "a"){
            for(i=0;i < 3;i++){
                console.log(actArray_nested[i]);
                actArray_low =actArray_low.concat(actArray_nested[i]);
            }  
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (actArray[10].likes/actArray[10].dislikes)){
                actArray_low =actArray.concat(d);
            } else if ((d.likes/d.dislikes) > (actArray[20].likes/actArray[10].dislikes)){
                actArray_hig = actArray_hig.concat(d);
            } else {
                actArray_med = actArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < actArray[10].comment_count){
                actArray_low =actArray.concat(d);
            } else if (d.comment_count > actArray[20].comment_count){
                actArray_hig = actArray_hig.concat(d);
            } else {
                actArray_med = actArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < actArray[10].views){
                actArray_low =actArray.concat(d);
            } else if (d.view > actArray[20].views){
                actArray_hig = actArray_hig.concat(d);
            } else {
                actArray_med = actArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature < actArray[10].temperature){
                actArray_low =actArray.concat(d);
            } else if (d.temperature > actArray[20].temperature){
                actArray_hig = actArray_hig.concat(d);
            } else {
                actArray_med = actArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < actArray[10].views){
                actArray_low =actArray.concat(d);
            } else if (d.view > actArray[20].views){
                actArray_hig = actArray_hig.concat(d);
            } else {
                actArray_med = actArray_med.concat(d);
            }
        }
    });*/
    
    /*tecArray.forEach(function(d){
        if(secFlag == "a"){
            if(d.views < tecArray[410].views){
                tecArray_low =tecArray.concat(d);
            } else if (d.view > tecArray[819].views){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (tecArray[410].likes/tecArray[410].dislikes)){
                tecArray_low =tecArray.concat(d);
            } else if ((d.likes/d.dislikes) > (tecArray[819].likes/tecArray[819].dislikes)){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < tecArray[410].comment_count){
                tecArray_low =tecArray.concat(d);
            } else if (d.comment_count > tecArray[819].comment_count){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < tecArray[410].views){
                tecArray_low =tecArray.concat(d);
            } else if (d.view > tecArray[819].views){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature < tecArray[410].temperature){
                tecArray_low =tecArray.concat(d);
            } else if (d.temperature > tecArray[819].temperature){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < tecArray[410].views){
                tecArray_low =tecArray.concat(d);
            } else if (d.view > tecArray[819].views){
                tecArray_hig = tecArray_hig.concat(d);
            } else {
                tecArray_med = tecArray_med.concat(d);
            }
        }
    });
        
    eduArray.forEach(function(d){
        if(secFlag == "a"){
            if(d.views < eduArray[304].views){
                eduArray_low =eduArray.concat(d);
            } else if (d.view > eduArray[607].views){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (eduArray[304].likes/eduArray[304].dislikes)){
                eduArray_low =eduArray.concat(d);
            } else if ((d.likes/d.dislikes) > (eduArray[607].likes/eduArray[607].dislikes)){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < eduArray[304].comment_count){
                eduArray_low =eduArray.concat(d);
            } else if (d.comment_count > eduArray[607].comment_count){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < eduArray[304].views){
                eduArray_low =eduArray.concat(d);
            } else if (d.view > eduArray[607].views){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature <eduArray[304].temperature){
                eduArray_low =eduArray.concat(d);
            } else if (d.temperature > eduArray[607].temperature){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < eduArray[304].views){
                eduArray_low =eduArray.concat(d);
            } else if (d.view > eduArray[607].views){
                eduArray_hig = eduArray_hig.concat(d);
            } else {
                eduArray_med = eduArray_med.concat(d);
            }
        }
    });
        
    entArray.forEach(function(d){
        if(secFlag == "a"){
            if(d.views < entArray[3965].views){
                entArray_low =entArray.concat(d);
            } else if (d.view > entArray[7930].views){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (entArray[3965].likes/entArray[3965].dislikes)){
                entArray_low =entArray.concat(d);
            } else if ((d.likes/d.dislikes) > (entArray[7930].likes/entArray[7930].dislikes)){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < entArray[3965].comment_count){
                entArray_low =entArray.concat(d);
            } else if (d.comment_count > entArray[7930].comment_count){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < entArray[3965].views){
                entArray_low =entArray.concat(d);
            } else if (d.view > entArray[7930].views){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature < entArray[3965].temperature){
                entArray_low =entArray.concat(d);
            } else if (d.temperature > entArray[7930].temperature){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < entArray[3965].views){
                entArray_low =entArray.concat(d);
            } else if (d.view > entArray[7930].views){
                entArray_hig = entArray_hig.concat(d);
            } else {
                entArray_med = entArray_med.concat(d);
            }
        }
    });
        
    lifArray.forEach(function(d){
        if(secFlag == "a"){
            if(d.views < lifArray[1328].views){
                lifArray_low =lifArray.concat(d);
            } else if (d.view > lifArray[2656].views){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (lifArray[1328].likes/lifArray[1328].dislikes)){
                lifArray_low =lifArray.concat(d);
            } else if ((d.likes/d.dislikes) > (lifArray[2656].likes/lifArray[2656].dislikes)){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < lifArray[1328].comment_count){
                lifArray_low =lifArray.concat(d);
            } else if (d.comment_count > lifArray[2656].comment_count){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < lifArray[1328].views){
                lifArray_low =lifArray.concat(d);
            } else if (d.view > lifArray[2656].views){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature < lifArray[1328].temperature){
                lifArray_low =lifArray.concat(d);
            } else if (d.temperature > lifArray[2656].temperature){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < lifArray[1328].views){
                lifArray_low =lifArray.concat(d);
            } else if (d.view > lifArray[2656].views){
                lifArray_hig = lifArray_hig.concat(d);
            } else {
                lifArray_med = lifArray_med.concat(d);
            }
        }
    });
        
        
      newArray.forEach(function(d){
        if(secFlag == "a"){
            if(d.views < newArray[418].views){
                newArray_low = newArray.concat(d);
            } else if (d.view > newArray[836].views){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med = newArray_med.concat(d);
            }
        } else if(secFlag == "b"){
            if((d.likes/d.dislikes) < (newArray[418].likes/newArray[418].dislikes)){
                newArray_low = newArray.concat(d);
            } else if ((d.likes/d.dislikes) > (newArray[836].likes/newArray[836].dislikes)){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med =newArray_med.concat(d);
            }
        } else if(secFlag == "c"){
             if(d.comment_count < newArray[418].comment_count){
                newArray_low =newArray.concat(d);
            } else if (d.comment_count > newArray[836].comment_count){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med = newArray_med.concat(d);
            }
        } else if(secFlag == "d"){
            if(d.views < newArray[418].views){
                newArray_low =newArray.concat(d);
            } else if (d.view > newArray[836].views){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med = newArray_med.concat(d);
            }
        } else if(secFlag == "e"){
            if(d.temperature < newArray[418].temperature){
                newArray_low =newArray.concat(d);
            } else if (d.temperature > newArray[836].temperature){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med = newArray_med.concat(d);
            }
            
        } else if(secFlag == "f"){
            if(d.views < newArray[418].views){
                newArray_low =newArray.concat(d);
            } else if (d.view > newArray[836].views){
                newArray_hig = newArray_hig.concat(d);
            } else {
                newArray_med = newArray_med.concat(d);
            }
        }
    }); */ 
        
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
                    console.log(actArray_med);
                            console.log(actArray_hig);


            console.log(newroot);

});
    
}