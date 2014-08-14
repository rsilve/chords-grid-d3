chords-grid-d3  [![Build Status](https://travis-ci.org/rsilve/chords-grid-d3.svg?branch=master)](https://travis-ci.org/rsilve/chords-grid-d3)

==============


This is a d3 extension that read a chords grid and render as SVG


	 var grid = d3.chords.grid.chords("Am7 Bdim |\n A  C  B _ |\n A _ B C | A B C D")
 	d3.select("#simple").call(grid.render)