var client = new $.es.Client({
  hosts: 'localhost:9200'
});

$(function(){

  client.search({
    "body":{
      "aggs":{
        "types_count":{
          "terms": {"field": "state.keyword", "size":53}
        }
      }
    }
  })
  .then(function(body){
    var stateCount = body.aggregations.types_count.buckets;

    var svg = d3.select("body").append("svg").attr("width", "960").attr("height", "960"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
        y = d3.scaleLinear().rangeRound([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(stateCount.map(function(d) { return d.key; }));
    y.domain([0, d3.max(stateCount, function(d) { return d.doc_count; })]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

      g.selectAll(".bar")
      .data(stateCount)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("y", function(d) { return y(d.doc_count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.doc_count); });
  })

})
