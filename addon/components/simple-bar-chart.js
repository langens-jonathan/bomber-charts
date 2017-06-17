import Ember from 'ember';
import layout from '../templates/components/simple-bar-chart';

export default Ember.Component.extend({
    layout,
        dataArray: [],

    id: "",

    init: function()
    {
	this._super(...arguments);
	this.set("id", "a" + Math.floor((1 + Math.random()) * 0x10000));
	Ember.Logger.log(this.get("id"));

	var dataset = [];
	for (var i = 0; i < 12; i++) {           //Loop 25 times
	    var newNumber = (Math.random() * 30) + 1;  //New random number (0-30)
	    dataset.push(Math.floor(newNumber));             //Add new number to array
	}
	this.set("dataArray", dataset);
    },
    
    didRender: function() {
	// getting the id
	var id = this.get("id");

	// getting the data
	var dataArray = this.get('dataArray');

	// do d3 stuff here...
	var svg = d3.select("#" + id).append("svg")
          .attr("height","500px")
          .attr("width","775px;");

	svg.selectAll("rect")
	    .data(dataArray)
	    .enter().append("rect")
            .attr("class", "simple-bar")
            .attr("height", function(d, i) {return (d * 10)})
            .attr("width","40")
            .attr("x", function(d, i) {return (i * 60) + 25})
            .attr("y", function(d, i) {return 400 - (d * 10)});

	svg.selectAll("text")
	    .data(dataArray)
	    .enter().append("text")
	    .text(function(d) {return d})
            .attr("class", "simple-bar-text")
            .attr("x", function(d, i) {return (i * 60) + 36})
            .attr("y", function(d, i) {return 418 - (d * 10)});
    }   

});
