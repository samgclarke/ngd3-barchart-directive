.directive('ngd3Barchart', function () {
  /*
  Based on the blog post by Nicholas Thompson.

  http:// cloudspace.com/blog/2014/03/25/creating-d3.js-charts-using-angularjs-directives/
  */

  return {
    restrict: 'E',
    scope: {
      data: '=',
      yaxiskey: '@',
      yaxistitle: "@"
    },
    link: function (scope, element) {
      var margin, svg, height, width, x, y, xAxis, yAxis, bars;

      margin = {top: 20, right: 20, bottom: 30, left: 40};
      width = 330 - margin.left - margin.right;
      height = 150 - margin.top - margin.bottom;

      svg = d3.select(element[0])
        .append("svg")
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
      y = d3.scale.linear().range([height, 0]);

      xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

      yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

      // Render graph based on 'data'
      scope.render = function(data) {
        // Set our scale's domains
        x.domain(data.map(function(d) { return d[scope.yaxiskey]; }));
        y.domain([d3.min(data, function(d) { return d.val; }), d3.max(data, function(d) { return d.val; })]);
        
        // Redraw the axes
        svg.selectAll('g.axis').remove();
        // X axis
        svg.append("g")
            .attr("class", "x axis")
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '0.5px'})
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
            
        // Y axis
        svg.append("g")
            .attr("class", "y axis")
            .style({ 'stroke': 'Black', 'fill': 'none', 'stroke-width': '0.5px'})
            .call(yAxis)
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", -35) //  position of y-axis legend
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(scope.yaxistitle);
            
        bars = svg.selectAll(".bar").data(data);
        bars.enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d[scope.yaxiskey]); })
          .attr("width", x.rangeBand())
          .attr("fill", "orange");

        // Animate bars
        bars
            .transition()
            .duration(1000)
            .attr('height', function(d) { return height - y(d.val); })
            .attr("y", function(d) { return y(d.val); })
      };

     // Watch 'data' and run scope.render(newVal) whenever it changes
     // Use true for 'objectEquality' property so comparisons are done on equality and not reference
      scope.$watch('data', function(){
          scope.render(scope.data);
      }, true);  
    }
  };
});