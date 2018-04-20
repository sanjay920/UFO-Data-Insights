var client = new $.es.Client({
  hosts: 'localhost:9200'
});


// TODO : Work in progress
// function loadUSMap(){
//   var width = 960,
//   height = 600;
//
//   var svg = d3.select("#mapContainer").append("svg")
//     .attr("width", width)
//     .attr("height", height);
//
//   var path = d3.geoPath();
//
//   d3.json("https://unpkg.com/us-atlas@1/us/10m.json", function(error, us) {
//     if (error) throw error;
//
//         svg.append("g")
//         .attr("class", "states")
//       .selectAll("path")
//       .data(topojson.feature(us, us.objects.states).features)
//       .enter().append("path")
//         .attr("d", path);
//
//     svg.append("path")
//         .attr("class", "state-borders")
//         .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
//
//     var projection = d3.geoMercator()
//       .scale((width - 3) / (2 * Math.PI))
//       .translate([width / 2, height / 2]);
//
//     client.search({
//       body: {
//         query:{
//           term: {"meteor_sighting": 1}
//         },
//         _source: ['geocoded_longitude', 'geocoded_latitude'],
//         size: 100
//       }
//     }).then(function(body){
//         var hits = body.hits.hits
//         var metoriteCoords = [];
//
//         _.forEach(hits, function(val){
//           console.log();
//           var resultObj = val['_source']
//           metoriteCoords.push([resultObj['geocoded_longitude'], resultObj['geocoded_latitude']]);
//         });
//
//         svg.selectAll("rect")
//     				.data(metoriteCoords).enter()
//     				.append("rect")
//     				.attr("x", function(d){ return projection(d)[0]; })
//     				.attr("y", function(d){ return projection(d)[1]; })
//     				.attr("width", "5px")
//     				.attr("height", "5px")
//     				.attr("fill", "green")
//       });
//   });
//
// }

// Function to load world map , need to make more modifications to this
function loadWorldMap(){
  var width = 480,
  height = 480;

  var svg = d3.select("#mapContainer").append("svg")
    .attr("width", width)
    .attr("height", height);

  var projection = d3.geoMercator()
    .scale((width - 3) / (2 * Math.PI))
    .translate([width / 2, height / 2]);

  var path = d3.geoPath()
    .projection(projection);

  var graticule = d3.geoGraticule();

  svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

  svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

  svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, world) {
    if (error) throw error;

    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);

    client.search({
      body: {
        query:{
          term: {"meteor_sighting": 1}
        },
        _source: ['geocoded_longitude', 'geocoded_latitude'],
        size: 100
      }
    }).then(function(body){
        var hits = body.hits.hits
        var metoriteCoords = [];

        _.forEach(hits, function(val){
          console.log();
          var resultObj = val['_source']
          metoriteCoords.push([resultObj['geocoded_longitude'], resultObj['geocoded_latitude']]);
        });

        svg.selectAll("rect")
    				.data(metoriteCoords).enter()
    				.append("rect")
    				.attr("x", function(d){ return projection(d)[0]; })
    				.attr("y", function(d){ return projection(d)[1]; })
    				.attr("width", "5px")
    				.attr("height", "5px")
    				.attr("fill", "green")
      });

    });

} //loadWorldMap

$(function(){
  loadWorldMap();
})
