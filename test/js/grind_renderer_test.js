'use strict';

var d3 = require('d3'),
grid = require('../../js/d3-grid'),
jsdom = require('jsdom'),
htmlStub = '<html><body></body></html>' // html file skull with a container div for the d3 dataviz
	
exports.grid_render = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  
  render : function (test) {
    test.expect(3);
	jsdom.env({ features : { QuerySelector : true }, html : htmlStub, done : function(errors, window) {
	    	var g = grid.chords("A | B\nA")
			var body = window.document.querySelector('body')
			var res = d3.select(body).append('svg:svg')
	    	res.call(g.render)
			//test.ok(res)
			test.equals(res.selectAll(".grid-row").size(), 2) // 2 lines
			test.equals(res.selectAll(".grid-row").selectAll(".grid-measure").size(), 3) // 2 lines
			test.equals(res.selectAll(".grid-row").selectAll(".grid-measure").selectAll(".grid-chord").size(), 3) // 2 lines
			test.done();
		}
	})
	
  },
  
}