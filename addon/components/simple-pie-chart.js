import Ember from 'ember';
import layout from '../templates/components/simple-pie-chart';

import { select } from 'd3-selection';
import { arc, pie } from 'd3-shape';
import { scaleOrdinal } from 'd3-scale';
import { easeLinear } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import { transition } from 'd3-transition';

export default Ember.Component.extend({
    layout,

    
    padding: 10,

    innerRadius: 0,

    outerRadius: Ember.computed("width", "height", function() {
	return (this.get('width') / 2) - this.get('padding');
    }),

    width: 500,

    height: Ember.computed.oneWay('width'),

    animate: false,

    colorScheme: ["#f4e04d", "#cee397", "#8db1ab", "#587792", "#f2ed6f", "#7d7e75", "#8d86c9", "#73a6ad", "#9b97b2", "#f4a261", "#2a9d8f", "#86cb92", "#71b48d", "#404e7c", "#9be564", "#d19c1d", "#7d451b"],
    
    init: function()
    {
	this._super(...arguments);
	this.set("id", "a" + Math.floor((1 + Math.random()) * 0x10000));
	Ember.Logger.log(this.get("id"));
    },

    didRender: function() {
    	// getting the id
	var id = this.get("id");

	var colorScheme = this.get("colorScheme");

	var color = scaleOrdinal().range(colorScheme);

	var innerRadius = this.get('innerRadius');

	var outerRadius = this.get('outerRadius');
	
	var width = this.get('width');

	var height = this.get('height');

	var animate = this.get('animate');

	var shapeArc = arc()
	    .outerRadius(outerRadius)
	    .innerRadius(innerRadius);

	var labelArc = arc()
	    .outerRadius(outerRadius - (innerRadius/2))
	    .innerRadius(innerRadius);

	var shapePie = pie()
	    .sort(null)
	    .value(function(d) { return d.data; });

	select("#" + id).selectAll("*").remove();

	var data = this.get('dataArray');
	
    	var svg = select("#" + id).append("svg")
          .attr("height", height)
            .attr("width", width)
	    .append("g")
	    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

	var g = svg.selectAll("arc")
	    .data(shapePie(data))
	    .enter().append("g")
	    .attr("class", "arc");

	g.append("path")
	    .attr("d", shapeArc)
	    .style("fill", function(d, i) { return color(d.data.label); })
	    .style("stroke", "#ffffff")
	    .on("mouseover", function(d, i) {
		    select(this).style("fill", "#E71D36");
	    })
	    .on("mouseout", function(d, i) {
		    select(this).style("fill", colorScheme[i]);
	    })
	    .transition()
	    .ease(easeLinear)
	    .duration(function() { if(animate === true) { return 2000; } else {return 0; }})
	    .attrTween("d", function(b) { b.innerRadius = 0;
					  var i = interpolate({startAngle: 0, endAngle: 0}, b);
					  return function (t) { return shapeArc(i(t)); }});


	g.append("text")
	    .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .text(function(d){return d.data.label;});
    }
    
});
