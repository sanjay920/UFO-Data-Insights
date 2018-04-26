
        var width = 960,
            height = 500;

        var colorNode = d3.scale.category20(),
            colorLink = d3.scale.category10();



        var force = d3.layout.force()
            .charge(-120)
            .linkDistance(35)
            .size([width, height]);

        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        d3.json("../data_files/relation.json", function(error, graph) {
            force
                .nodes(graph.nodes)
                .links(graph.links)
                .start();

            var link = svg.selectAll(".link")
                .data(graph.links)
              .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", 2)
                .style("stroke", function(d) { return colorLink(d.value); });

            var node = svg.selectAll(".node")
                .data(graph.nodes)
              .enter().append("circle")
                .attr("class", "node")
                .attr("r", 7)
                .style("fill", function(d) { return colorNode(d.group); })
                .call(force.drag);

            node.append("title")
                .text(function(d) { return d.name; });

           

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });
            

             
            var legend = svg.selectAll(".legend")
           .data(["UFO","US","UK","Meteor","Airports","Population","Metro","NER","Description","Caption","Classes"])
         // .data(function(d) { return d;})
          .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append('circle')
                .attr('class', 'legend-icon')
                .attr('r', 5)
                .style('fill', function(d, i) {
                    return d3.scale.category20()(d.group);
                });

            legend.append('text')
                .attr('dx', '1em')
                .attr('dy', '1em')
                .text(function(d) {
                    return d;
                });

        });

             



