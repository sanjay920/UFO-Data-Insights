var client = new $.es.Client({
 hosts: 'localhost:9200'
});

$(function(){

  client.search({
    "body":{
      "query":{
        "exists": {"field": "closest_LARGE_airport_distance"}
      },
      "_source": ["closest_LARGE_airport_distance", "closest_MEDIUM_airport_distance", "closest_SMALL_airport_distance"],
      "size": 100
    }
  })
  .then(function(body){
    console.log(body);
    var hits = body.hits.hits;

    var margin = {top: 30, right: 50, bottom: 40, left:40};
  	var width = 960 - margin.left - margin.right;
  	var height = 500 - margin.top - margin.bottom;

    var svg = d3.select('body')
  		.append('svg')
  		.attr('width', width + margin.left + margin.right)
  		.attr('height', height + margin.top + margin.bottom)
  	.append('g')
  		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


      // The API for scales have changed in v4. There is a separate module d3-scale which can be used instead. The main change here is instead of d3.scale.linear, we have d3.scaleLinear.
  	var xScale = d3.scaleLinear()
  		.range([0, width]);

  	var yScale = d3.scaleLinear()
  		.range([height, 0]);

  	// square root scale.
  	var radius = d3.scaleSqrt()
  		.range([2,5]);

  	// the axes are much cleaner and easier now. No need to rotate and orient the axis, just call axisBottom, axisLeft etc.
  	var xAxis = d3.axisBottom()
  		.scale(xScale);

  	var yAxis = d3.axisLeft()
  		.scale(yScale);

  	// again scaleOrdinal
  	var color = d3.scaleOrdinal(d3.schemeCategory20);

    hits.forEach(function(d){
      d.closest_LARGE_airport_distance = d._source.closest_LARGE_airport_distance;
      d.closest_MEDIUM_airport_distance = d._source.closest_MEDIUM_airport_distance;
      d.closest_SMALL_airport_distance = d._source.closest_SMALL_airport_distance;
      if(d.closest_SMALL_airport_distance <= 10){
        d.category = "Close";
      }else if(d.closest_MEDIUM_airport_distance > 10 &&  d.closest_MEDIUM_airport_distance <= 20){
        d.category = "Medium";
      }else{
        d.category = "Far";
      }
    });

    xScale.domain(d3.extent(hits, function(d){
			return d.closest_LARGE_airport_distance;
		})).nice();

		yScale.domain(d3.extent(hits, function(d){
			return d.closest_SMALL_airport_distance;
		})).nice();

		radius.domain(d3.extent(hits, function(d){
			return d.closest_SMALL_airport_distance;
		})).nice();


    // adding axes is also simpler now, just translate x-axis to (0,height) and it's alread defined to be a bottom axis.
		svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.attr('class', 'x axis')
			.call(xAxis);

		// y-axis is translated to (0,0)
		svg.append('g')
			.attr('transform', 'translate(0,0)')
			.attr('class', 'y axis')
			.call(yAxis);

    var bubble = svg.selectAll('.bubble')
			.data(hits)
			.enter().append('circle')
			.attr('class', 'bubble')
			.attr('cx', function(d){return xScale(d.closest_LARGE_airport_distance);})
			.attr('cy', function(d){ return yScale(d.closest_MEDIUM_airport_distance); })
			.attr('r', function(d){ return radius(d.closest_SMALL_airport_distance); })
			.style('fill', function(d){ return color(d.category); });

    console.log(hits);

  })

})
