var client = new $.es.Client({
 hosts: 'localhost:9200'
});

$(function(){
  client.search({
    "body":{
      "aggs":{
        "Class_1_Count":{
          "terms": {"field": "Class_1.keyword"}
        }
        // "Class_2_Count":{
        //   "terms": {"field": "Class_2.keyword"}
        // }
        // "Class_3_Count":{
        //   "terms": {"field": "Class_3.keyword"}
        // },
        // "Class_4_Count":{
        //   "terms": {"field": "Class_4.keyword"}
        // },
        // "Class_5_Count":{
        //   "terms": {"field": "Class_5.keyword"}
        // },
        // "Class_6_Count":{
        //   "terms": {"field": "Class_6.keyword"}
        // },
        // "Class_7_Count":{
        //   "terms": {"field": "Class_7.keyword"}
        // }
      }
    }
  })
 .then(function(body){

   var aggregations = body.aggregations;

   aggMap = {}
   count = 0;

   _.forEach(aggregations, function(value, key){
     var classData = aggregations[key]["buckets"];
     _.forEach(classData, function(val){
       if(val["key"] in aggMap){
         aggMap[val["key"]] += val["doc_count"];
       }else{
         aggMap[val["key"]] = val["doc_count"];
       }
     })
   });
   itemArr = []
   _.forEach(aggMap, function(val, key){
     itemArr.push({"text": key, "count": val});

   });


   var bubbleChart = new d3.svg.BubbleChart({
    supportResponsive: true,
    //container: => use @default
    size: 600,
    //viewBoxSize: => use @default
    innerRadius: 600 / 3.5,
    //outerRadius: => use @default
    radiusMin: 50,

    data: {

      items: itemArr,
      eval: function (item) { return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: {
          text: "(See more detail)",
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            alert("Here is more details!!");
          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "count",
              classed: {count: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "text",
              classed: {text: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
    });
  });
});

//Cental Click
d3.svg.BubbleChart.define("central-click", function (options) {
  var self = this;

  self.setup = (function (node) {
    var original = self.setup;
    return function (node) {
      var fn = original.apply(this, arguments);
      self.event.on("click", function(node) {
      });
      return fn;
    };
  })();

  self.reset = (function (node) {
    var original = self.reset;
    return function (node) {
      var fn = original.apply(this, arguments);
      node.select("text.central-click").remove();
      return fn;
    };
  })();

  self.moveToCentral = (function (node) {
    var original = self.moveToCentral;
    return function (node) {
      var fn = original.apply(this, arguments);
      var transition = self.getTransition().centralNode;
      transition.each("end", function() {
        node.append("text").classed({"central-click": true})
          .attr(options.attr)
          .style(options.style)
          .attr("x", function (d) {return d.cx;})
          .attr("y", function (d) {return d.cy;})
          .text(options.text)
          .style("opacity", 0).transition().duration(self.getOptions().transitDuration / 2).style("opacity", "0.8");
      });
      return fn;
    };
  })();
});
