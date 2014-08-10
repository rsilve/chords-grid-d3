(function() {
	
	var size = 92,
	    chords = d3.functor(""),
		style = undefined, 
		attr = undefined;
	
	
	function grid() {
		var js = GridParser.parse(chords())
		var i = 0, g = []
		js.forEach(function(item) {
			g.push({data : item, row : i++ })
		})
		console.log("Grid", g)
		return g
	}
	
	grid.chords = function(x) {
		if (!arguments.length) return chords;
		chords = d3.functor(x);
		return grid;
    };

	/***********************************************************/
	
	var chordRenderer = function(selection) {
		return selection.append("text").text(function(d) { 
			console.log("Chord", d)
			return d.chord
		})
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
	
	var measureRenderer = function(selection) {
		var translate = function(d) {
			return "translate("+[d.cell*size, 0] +")"
		}
		return selection.append("g").attr("transform", translate).selectAll("g").data(function(d) { 
			console.log("Measure", d)
			return d.chords
		}).enter().call(chord)
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
		//console.log(selection)
		//return selection.append("text").text("OK")
		var translate = function(d) {
			return "translate("+[0, d.row*size+12] +")"
		}
		return selection.append("g").attr("transform", translate).selectAll("g").data(function(d) { 
			console.log("Row", d)
			var i = 0
			d.data.forEach(function(item) {
				item.cell = i++
			})
			return d.data
		}).enter().call(measure)
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
		.attr("height", data.length * size)
		.selectAll("g").data(data).enter().call(row)
	}
	
	grid.render = render
	
	

	// export commonjs module or add to d3 layout
	if (typeof module === "object" && module.exports) module.exports = grid;
	else (d3.chords || (d3.chords = {})).grid = grid;
	  
})()