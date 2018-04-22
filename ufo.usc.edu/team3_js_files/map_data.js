var client = new $.es.Client({
  hosts: 'localhost:9200'
});

function loadUKMap(){
  var width = 960,
    height = 1160;

  var projection = d3.geo.albers()
      .center([0, 53.4])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(4000)
      .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection)
      .pointRadius(2);

  var svg = d3.select("#mapArea").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("uk.json", function(error, uk) {
    var subunits = topojson.object(uk, uk.objects.subunits)

    svg.selectAll(".subunit")
        .data(subunits.geometries)
      .enter().append("path")
        .attr("class", function(d) { return "subunit " + d.id; })
        .attr("d", path);

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary");

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function(a, b) { return a === b && a.id === "IRL"; }))
        .attr("d", path)
        .attr("class", "subunit-boundary IRL");

    svg.selectAll(".subunit-label")
        .data(subunits.geometries)
      .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.name; });
  });

  client.search({
    body: {
      query:{
        "exists" : { "field" : "lat" }
      },
      _source: ['lon', 'lat'],
      size: 4000
    }
  }).then(function(body){
    var hits = body.hits.hits;
    console.log(hits);
    ufo_coords = [];

    _.forEach(hits, function(val){
      console.log();
      var resultObj = val['_source']
      ufo_coords.push([resultObj['lon'], resultObj['lat']]);
    });

    svg.selectAll(".cities")
        .data(ufo_coords).enter()
        .append("circle")
        .attr("cx", function(d){ return projection(d)[0]; })
        .attr("cy", function(d){ return projection(d)[1]; })
        .attr("r", "3px")
        .attr('class', 'cities')


  })

}

function loadUSMap(){
  var width = 960,
	height = 500;

  var svg = d3.select('#mapArea').append('svg')
      .attr('width', width)
      .attr('height', height);

  var projection = d3.geo.albersUsa()
  	.scale(1000)
  	.translate([width / 2, height / 2]);

  var path = d3.geo.path()
  	.projection(projection);

  queue()
  	.defer(d3.json, 'states.json')
  	.defer(d3.json, 'cities.json')
  	.await(makeMyMap);

  function makeMyMap(error, states, cities) {
    if(error){
      console.log("Error is ",error);
    }

  	svg.append('path')
  		.datum(topojson.feature(states, states.objects.usStates))
  			.attr('d', path)
  			.attr('class', 'states');

      client.search({
        body: {
          query:{
            term: {"meteor_sighting": 1}
          },
          _source: ['geocoded_longitude', 'geocoded_latitude'],
          size: 2000
        }
      }).then(function(body){
        console.log(body);
          var hits = body.hits.hits
          var metoriteCoords = [];

          _.forEach(hits, function(val){
            console.log();
            var resultObj = val['_source']
            metoriteCoords.push([resultObj['geocoded_longitude'], resultObj['geocoded_latitude']]);
          });

          svg.selectAll(".cities")
              .data(metoriteCoords).enter()
              .append("circle")
              .attr("cx", function(d){ return projection(d)[0]; })
              .attr("cy", function(d){ return projection(d)[1]; })
              .attr("r", "3px")
              .attr('class', 'cities')
        });
  }
}

// Function to load world map , need to make more modifications to this
function loadWorldMap(){
  var width = 960,
  height = 600;

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
  // loading the us map by default
  loadUSMap();

  var selectOpt = window.parent.$("#countries")
  selectOpt.on('change', function(e){
    // Get the current selection and display the appropriate map
    var selection = selectOpt.val();
    switch (selection) {
      case 'us':
        d3.select("#mapArea").selectAll("svg").remove();
        loadUSMap();
        break;
      case 'uk':
        d3.select("#mapArea").selectAll("svg").remove();
        loadUKMap();
        break;
      default:

    }
  })
})
