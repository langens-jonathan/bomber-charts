import Ember from 'ember';
import layout from '../templates/components/simple-bar-chart';

export default Ember.Component.extend({
    layout,

    dataArray: [],

    id: "",

    width: 500,

    height: 500,

    barPadding: 4,

    title: "chart title",

    forceShowLabels: false,

    hideLabels: false,

    showXAxis: true,

    showYAxis: true,

    init: function()
    {
	this._super(...arguments);
	this.set("id", "a" + Math.floor((1 + Math.random()) * 0x10000));
    },

    didRender: function() {
    	// getting the id
	var id = this.get("id");
	
	// getting the data
	var dataArray = this.get('dataArray');

	// setting some other props
	var maxYValue = d3.max(dataArray, function(d) { return d.data; });
	var yAxisPadding = (11 * ("" + maxYValue).length);
	if(this.get('showYAxis') !== true)
	{
	    yAxisPadding = 0;
	}
	var width = this.get('width');
	var height = this.get('height');
	var effectiveWidth = width - yAxisPadding;
	var effectiveHeight = height;
	var barPadding = this.get('barPadding');
	var barWidth = (effectiveWidth - barPadding)/dataArray.length;
	var title = this.get('title');
	var showLabels = ((barWidth > 25) || this.get('forceShowLabels')) && !this.get('hideLabels');
	var showTitle = true;
	var yScale = d3.scaleLinear()
	    .domain([0, maxYValue])
	    .range([0, effectiveHeight]);
	var yAxisScale = d3.scaleLinear()
	    .domain([0, maxYValue])
	    .range([effectiveHeight, 0]);


	if(barPadding > barWidth)
	{
	    if(barWidth > 5) {
		barPadding = 2;
	    } else if(barWidth > 1) {
		barPadding = 1;
	    } else {
		barPadding = 0;
	    }
	}

	// do d3 stuff here...
	d3.select("#" + id).selectAll("*").remove();
    	var svg = d3.select("#" + id).append("svg")
          .attr("height", height)
          .attr("width", width);

	svg.selectAll("rect")
	    .data(dataArray)
	    .enter().append("rect")
	    .attr("class", "simple-bar-chart-bar")
	    .attr("height", function(d, i) {return (yScale(d.data))})
	    .attr("width", barWidth - barPadding)
	    .attr("x", function(d, i) {return (yAxisPadding + (i * barWidth) + (barPadding/2))})
	    .attr("y", function(d, i) {return effectiveHeight - yScale(d.data)})
	    .style("fill", function(d, i) {if('fill' in d){ return d.fill; }})
	    .style("stroke", function(d, i) {if('stroke' in d){return d.stroke; }})
	    .style("stroke-width", function(d, i){if('stroke-width' in d){return d.stroke-width;}})
	    .on("mouseover", function(d) {
		if('hover' in d)
		{
		    d3.select(this).style("fill", d.hover);
		}
	    })
	    .on("mouseout", function(d) {
		if('fill' in d)
		{
		    d3.select(this).style("fill", d.fill);
		}})
	    .append("svg:title")
	    .text(function(d) { return d.label; });


	if(showLabels)
	{
	    svg.selectAll("text")
	    .data(dataArray)
	    .enter().append("text")
		.text(function(d) { return d.data; })
	    .attr("class", "simple-bar-chart-text")
		.attr("x", function(d, i) {return (i * barWidth) + barPadding + yAxisPadding +  (this.getBBox().width / 2) - (("" + d.data).length * 4)})
		.attr("y", function(d, i) {var h = effectiveHeight - (yScale(d.data)) + this.getBBox().height;
					   if(yScale(d.data) < 18) { h = h - this.getBBox().height - 2;
								   }
								     return h;});
	}

	if(this.get("showYAxis") === true) {
	    var yAxis = d3.axisLeft()
		.scale(yAxisScale)
		.ticks(Math.floor(effectiveHeight/50));
	    
	    svg.append("g")
		.attr("transform", "translate(22,0)")
		.call(yAxis);
	}
    }
});
