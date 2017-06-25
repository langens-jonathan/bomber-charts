import Ember from 'ember';
import layout from '../templates/components/simple-bar-chart';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { transition } from 'd3-transition';
import { axisLeft } from 'd3-axis';
import { max } from 'd3-array';

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

    animate: false,

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
	var maxYValue = max(dataArray, function(d) { return d.data; });
	var yAxisPadding = (11 * ("" + maxYValue).length);
	if(this.get('showYAxis') !== true)
	{
	    yAxisPadding = 0;
	}
	var maxLabelLength = max(dataArray, function(d) {return d.label.length; });
	Ember.Logger.log("max label length: " + maxLabelLength);
	var xAxisSize = Math.floor(6.5 * maxLabelLength); //(11 * (2 * Math.log(maxLabelLength)) + 4);
	if(this.get('showXAxis') !== true) {
	    xAxisSize = 0;
	}
	var title = this.get("title");
	var showTitle = title.length > 0;
	var titleHeight = (showTitle) ? 25 : 0;
	var width = this.get('width');
	var height = this.get('height');
	var effectiveWidth = width - yAxisPadding;
	var effectiveHeight = height - titleHeight - xAxisSize;
	var barPadding = this.get('barPadding');
	var barWidth = (effectiveWidth - barPadding)/dataArray.length;
	var title = this.get('title');
	var animate = this.get('animate');
	var showLabels = ((barWidth > 25) || this.get('forceShowLabels')) && !this.get('hideLabels');
	var showTitle = true;
	var yScale = scaleLinear()
	    .domain([0, maxYValue])
	    .range([0, effectiveHeight]);
	var yAxisScale = scaleLinear()
	    .domain([0, maxYValue])
	    .range([effectiveHeight, 0]);
	var xAxisTextScale = scaleLinear()
	    .domain([0, maxLabelLength])
	    .range([0, Math.floor(xAxisSize)]);

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
	select("#" + id).selectAll("*").remove();
    	var svg = select("#" + id).append("svg")
          .attr("height", height)
          .attr("width", width);

	svg.selectAll("rect")
	    .data(dataArray)
	    .enter().append("rect")
	    .attr("class", "simple-bar-chart-bar")
	    .attr("width", barWidth - barPadding)
	    .attr("x", function(d, i) {return (yAxisPadding + (i * barWidth) + (barPadding/2))})
	    .style("fill", function(d, i) {if('fill' in d){ return d.fill; }})
	    .style("stroke", function(d, i) {if('stroke' in d){return d.stroke; }})
	    .style("stroke-width", function(d, i){if('stroke-width' in d){return d.stroke-width;}})
	    .on("mouseover", function(d) {
		if('hover' in d)
		{
		    select(this).style("fill", d.hover);
		}
		select(this).append("svg:title")
		    .text(function(d) { return d.label; });
	    })
	    .on("mouseout", function(d) {
		if('fill' in d)
		{
		    select(this).style("fill", d.fill);
		}})
	    .attr("height", function(d, i) {if(animate){return 0;} else { return (yScale(d.data));}})
	    .attr("y", function(d, i) {if(animate){return effectiveHeight + titleHeight;} else { return effectiveHeight - yScale(d.data) + titleHeight; }})
	    .transition()
	    .duration(350)
	    .attr("height", function(d, i) {return (yScale(d.data))})
	    .attr("y", function(d, i) {return effectiveHeight - yScale(d.data) + titleHeight;});

	if(showLabels)
	{
	    svg.selectAll("text")
	    .data(dataArray)
	    .enter().append("text")
		.text(function(d) { return d.data; })
	    .attr("class", "simple-bar-chart-text")
		.attr("x", function(d, i) {
		    var digitsInData = d.data.toString().length;
		    var displacements = Math.floor(digitsInData * 4);
		    var barPos = Math.floor((i * barWidth) + barPadding + yAxisPadding);
		    var bbwidth = Math.floor(this.getBBox().width / 2);
		    var pos = barPos + bbwidth - displacements;
		    return pos;})
		.attr("y", function(d, i) {var h = effectiveHeight - (yScale(d.data)) + this.getBBox().height + titleHeight;
					   if(yScale(d.data) < 18) { h = h - this.getBBox().height - 2;
								   }
								     return h;});
	}

	if(this.get("showYAxis") === true) {
	    var yAxis = axisLeft()
	    	.scale(yAxisScale)
	    	.ticks(Math.floor(effectiveHeight/50));
	    
	    svg.append("g")
	    	// .attr("transform", "translate(22,0)")
	        .attr("height", effectiveHeight)
	    	.attr("transform", "translate(" + yAxisPadding + "," + titleHeight + ")")
	    	.call(yAxis);
	}

	if(showTitle === true) {
	    svg.append("text")
		.attr("class", "simple-bar-chart-title")
		.text(title)
		.attr("font-family", "sans-serif")
		.attr("font-size", "20px")
		.attr("y", (titleHeight / 2) + 2);
	}

	
	if(this.get("showXAxis") === true) {
	    svg.append("g").selectAll("text")
		.data(dataArray)
		.enter().append("text")
		.attr("class", "simple-bar-chart-x-axis")
		.text(function(d) {return d.label;})
	    	.attr("y", function(d, i) {return (i * barWidth) + barPadding + yAxisPadding - (("" + d.data).length * 4) + (this.getBBox().height / 2) + 10;})
		.attr("x", function(d, i) {return ((-1) * (height));})
		.attr("font-size", function(d, i) { if((d.label.length/maxLabelLength) > 85) { return "10" ; } else { return "12" ;}})
		.attr("transform", "rotate(-90)");
	}
    }
});
