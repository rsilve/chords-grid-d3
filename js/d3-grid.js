(function (factory) {

    // Enable multiple loading tool

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["d3", "GridParser"], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node js
        var d3 = require("d3")
        var GridParser = require('grid-parser/grid/grid-commonjs')
        module.exports = factory(d3, GridParser)
    } else {
        // Browser globals
		
		(d3.chords || (d3.chords = {})).grid = factory(d3, GridParser);
    }
})(function(d3, GridParser) {
	
	var size = 92,
	    chords = d3.functor(""),
		style = undefined, 
		attr = undefined;
	
	
	function grid() {
		var str = chords()
		if (! str) return [];
		var js = GridParser.parse(str)
		var g = []
		js.forEach(function(item, k) {
			g.push({data : item, row : k })
		})
		return g
	}
	
	grid.chords = function(x) {
		if (!arguments.length) return grid;
		chords = d3.functor(x);
		return grid;
    };

	/***********************************************************/
	
	
	var chordRenderer = function(selection) {
		return selection.append("text")
		.attr("transform", function(d) { 
			return "translate("+d.p+")"
		})
		.style("font-family", "Helvetica")
		.text(function(d) { return d.chord })
		.attr("stroke-width", "0")
		.attr("stroke", "black")
		.style("text-anchor", "middle")
		.style("baseline-shift", "-0.5em")
		.attr("class", "grid-chord")
	}
	
	function chord(selection) {
		return chordRenderer(selection)
	}
	
	grid.chord = chord;
	
	grid.chord.style = function(style) {
		if (!arguments.length) return chord;
		var c = d3.functor(style);
		var oldRenderer = chordRenderer
		chordRenderer = function(selection) {
			return oldRenderer(selection).style(c())
		}
		return chord
	}
	
	/***********************************************************/
	
	
	var separatorRenderer = function(selection) {
		return selection.append("path")
		.attr("d", d3.svg.line())
		.attr("fill", "none")
		.attr("stroke-width",  "1")
		.attr("stroke", "black")
	}
	
	function separator(selection) {
		return separatorRenderer(selection)
	}
	
	grid.separator = separator;
	
	
	
	/***********************************************************/
	
	var measureRenderer = function(selection) {
		var translate = function(d) { return "translate("+[d.cell*size, 0] +")" }
		
		var g = selection.append("g").attr("transform", translate).attr("class", "grid-measure")
		
		g.append("line").attr({"x1" :0, "y1": 0, "x2": 0, "y2": size})
		g.append("line").attr({"x1" : size, "y1": 0,  "x2": size, "y2": size})
		
		
		var separators = function(d) { 
			var paths = []
			if (d.type === 1) {
				
			}
			if (d.type === 2) {
				paths.push([[size/2,0],[size/2, size/2],[0, size/2]])
			}
			if (d.type === 3) {
				paths.push([[0, size],[size, 0]])
			}
			if (d.type === 4) {
				paths.push([[size/2,size],[size/2, size/2],[size, size/2]])
			}
			if (d.type === 5) {
				paths.push([[size/2,0],[size/2, size/2],[0, size/2]])
				paths.push([[size/2,size/2],[size, size/2]])
			}
			if (d.type === 6) {
				paths.push([[0, size/2],[size, size/2]])
				paths.push([[size/2, size/2],[size/2, size]])
			}
			if (d.type === 7) {
				paths.push([[0, size/2],[size, size/2]])
				paths.push([[size/2, 0],[size/2, size]])
			}
			return paths 
		}
		
		g.selectAll("path").data(separators).enter().call(separator)
		
		var data = function(d) { 
			if (d.type === 1) {
				d.chords[0].p = [size/2, size/2] 
			}
			if (d.type === 2) {
				d.chords[0].p = [size/4, size/4] 
				d.chords[1].p = [size*2/3, size*3/4] 
			}
			if (d.type === 3) {
				d.chords[0].p = [size/3, size/4] 
				d.chords[1].p = [size*2/3, size*3/4] 
			}
			if (d.type === 4) {
				d.chords[0].p = [size/3, size/4] 
				d.chords[1].p = [size*3/4, size*3/4] 
			}
			if (d.type === 5) {
				d.chords[0].p = [size/4, size/4] 
				d.chords[1].p = [size*3/4, size/4] 
				d.chords[2].p = [size/2, size*3/4] 
			}
			if (d.type === 6) {
				d.chords[0].p = [size/2, size/4] 
				d.chords[1].p = [size/4, size*3/4] 
				d.chords[2].p = [size*3/4, size*3/4] 
			}
			if (d.type === 7) {
				d.chords[0].p = [size/4, size/4] 
				d.chords[1].p = [size*3/4, size/4] 
				d.chords[2].p = [size/4, size*3/4] 
				d.chords[3].p = [size*3/4, size*3/4] 
			}
			return d.chords 
		}
		
		return g.selectAll("g").data(data).enter().call(chord)
	}
	
	function measure(selection) {
		return measureRenderer(selection)
	}
	
	grid.measure = measure;
	
	grid.measure.style = function(style) {
		if (!arguments.length) return measure;
		var c = d3.functor(style);
		var oldRenderer = measureRenderer
		measureRenderer = function(selection) {
			return oldRenderer(selection).style(c())
		}
		return measure
	}
	
	
	/***********************************************************/

	var rowRenderer = function(selection) {
		var translate = function(d) {
			return "translate("+[0, d.row * size] +")"
		}
		var measures = function(d) { 
			d.data.forEach(function(item, k) { item.cell = k })
			return d.data
		}
		
		var g = selection.append("g").attr("transform", translate)
		.attr("stroke-width", "1")
		.attr("stroke", "black")
		.attr("class", "grid-row")
		
		
		g.append("line").attr({"x1" :0, "y1": 0, "y2": 0})
		.attr("x2", function(d) { return d.data.length * size; })
		
		g.append("line").attr({"x1" :0, "y1": size, "y2": size})
		.attr("x2", function(d) { return d.data.length * size; })
		
		return g.selectAll("g").data(measures).enter().call(measure)
	}
	
	function row(selection) {
		return rowRenderer(selection)
	}
	
	grid.row = row;
	
	grid.row.style = function(style) {
		if (!arguments.length) return row;
		var c = d3.functor(style);
		var oldRenderer = rowRenderer
		rowRenderer = function(selection) {
			return oldRenderer(selection).style(c())
		}
		return row
	}
	
	/***********************************************************/
	
	function render(selection) {	
		var data = grid()
		
		return selection
		.attr("height", data.length * size+4)
		.append("g")
		.attr("transform", "translate(2,2)")
		.selectAll("g").data(data).enter().call(row)
	}
	
	grid.render = render
	
	
	return grid  
	  
});