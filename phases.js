//console.log("selectedStates");

var uninjuredDataByPhase;
    var injuredDataByPhase;
    var fatalDataByPhase;

var removedStates = [];
    var addedStates = ["AL", "GA", "ME", "VT", "MA", "NY", "CT", "RI", 
    	"NJ", "PA", "MD", "VA", "NC", "SC", "FL", "TN", "MS", "KY", "IN", 
    	"OH", "MI", "WV", "MO", "MN", "TX", "LA", "AR", "AZ", "UT", "WY", 
    	"CA", "OR", "WA", "ID", "ND", "SD", "IL", "NE", "KA", "HI", "AK", 
    	"CO", "PR", "NV", "NM", "GU", "Kauai", "IA", "DE", "NH", "OK", "WI"];

var xScale, yScale;
var g1, g2, g3, line, path1, path2, path3;

uninjuredDataByPhase = [];
injuredDataByPhase = [];
fatalDataByPhase = [];

var margin = {top: 60, right: 60, bottom: 100, left: 70},
    	width = 1000 - margin.left - margin.right,
    	height = 600 - margin.top - margin.bottom;

var graphOffset = 41;

var svg = d3.select("#phases-svg")
    		.attr("width", width)
    		.attr("height", height);


    //add states text input
    var addG = d3.select("#phases")
        .append('g')
    addG.append('p')
        .text('Add a State:')
        .append('input')
            .attr('class', 'add-input')
            .attr('type', 'text')
            .attr('value', '');

    // Add state button
		addG.append('p')
	        .append('button')
	        .text('ADD')
	        .on('click', function() {
	            var input = d3.select('.add-input').property('value');
	            /**
	            *
	            * This part adds the state selected to the addedStates array
	            * Only added states should be counted for the graph
	            * All states are shown in the beginning by default
	            */
	            if (input != '') {
	            	if (removedStates.includes(input)) {
	            		var a = removedStates.indexOf(input);
	            		removedStates.splice(a, 1);
	            		addedStates.push(input);
	            	}
	            }

	            d3.select('.add-input').property('value', '');
	        });

    //delete states text input
    var removeG = d3.select("#phases")
        .append('g')
    removeG.append('p')
        .text('Remove a State:')
        .append('input')
            .attr('class', 'remove-input')
            .attr('type', 'text')
            .attr('value', '');

    // Remove state button
		removeG.append('p')
	        .append('button')
	        .text('REMOVE')
	        .on('click', function() {
	            var input = d3.select('.remove-input').property('value');
	            if (input != '') {
	            	if (addedStates.includes(input)) {
	            		var a = addedStates.indexOf(input);
	            		addedStates.splice(a, 1);
	            		removedStates.push(input);
	            	}
	                drawGraph();
	            }
	            
	            d3.select('.remove-input').property('value', '');
	        });

     //Add all states button
    d3.select("#phases")
        .append('p')
        .append('button')
        .text('ADD ALL')
        .on('click', function() {
            removedStates.forEach((i) => {
            	addedStates.push(i);
            })
            removedStates = [];

            drawGraph();
        });

     //Remove all states button
    d3.select("#phases")
        .append('p')
        .append('button')
        .text('REMOVE ALL')
        .on('click', function() {
            addedStates.forEach((i) => {
            	removedStates.push(i);
            })
            addedStates = [];

            drawGraph();
        });

    //process data now
    //nest by phase, and then within each phase nest by state
	d3.csv("aircraft_incidents.csv", function(d) {
		console.log("loading data");
		//console.log(d);
		if (d.Injury_Severity != "Incident" 
				&& d.Injury_Severity != "Unavailable") {
			if (d.Country == "United States") {
				d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
				d.Total_Serious_Injuries = +d.Total_Serious_Injuries;
				d.Total_Uninjured = +d.Total_Uninjured;
				var location = d.Location.split(",");
				if (location[1] != undefined) {
          			d.Location = location[1].trim();
					return d;
        		}
			}
		}
	}, function(error, csv) {
		uninjuredDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Uninjured;
			}) })
			.entries(csv);
		uninjuredDataByPhase = reorder(uninjuredDataByPhase);

		injuredDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Serious_Injuries;
			}) })
			.entries(csv);

		injuredDataByPhase = reorder(injuredDataByPhase);

		fatalDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Fatal_Injuries;
			}) })
			.entries(csv);

		fatalDataByPhase = reorder(fatalDataByPhase);

	var injuryExtent = d3.extent(fatalDataByPhase,
			(d) => {
				return d3.sum(d.values, (datum) => {
					return datum.value;
				});
			});
		injuryExtent[1] += 100;
		injuryExtent[0] = 0;

		yScale = d3.scaleLinear().domain(injuryExtent)
			.range([height, margin.bottom]);
		xScale = d3.scaleBand().domain(
				["STANDING", "TAXI", "TAKEOFF", "CLIMB", "CRUISE",
				"MANEUVERING", "DESCENT", "APPROACH", "LANDING", 
				"OTHER"])
			.range([0, width-margin.right]);

		var xAxis = d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale);

		svg.append("g")
			.attr("class", "x-axis")
			.attr("transform", "translate("+margin.left+","+(height-margin.bottom)+")")
			.call(xAxis)

		var text_g = svg.append("g")

		text_g.append("text")
			.attr("class", "label")
			.attr("transform", "translate("+width/2+","+(height-margin.bottom/4)+")")
			.text("Broad Phase of Flight")
			.style("text-anchor", "middle");
		//svg_x.append()

		svg.append("g")
			.attr("class", "y-axis")
			.attr("transform", "translate("+margin.left+","+ -margin.bottom+")")
			.call(yAxis)

		text_g.append("text")
			.attr("class", "label")
			.attr("transform", "translate("+margin.left/4+","+height/2+"), rotate(-90)")
			.text("Number per Injury Category")
			.style("text-anchor", "middle");

		//drawGraph();
		var filtered_uninjured = [];
		uninjuredDataByPhase.forEach((d) => {
			var sum = 0;
			d.values.forEach((datum) => {
				if (addedStates.includes(datum.key)) {
					sum += datum.value;
				}
			});
			var key = d.key;
			filtered_uninjured.push({key, sum});
		});
		filtered_uninjured[9].sum += filtered_uninjured[10].sum;
		filtered_uninjured[9].sum += filtered_uninjured[11].sum;
		filtered_uninjured.pop();
		filtered_uninjured.pop();

		var filtered_injured = [];
		injuredDataByPhase.forEach((d) => {
			var sum = 0;
			d.values.forEach((datum) => {
				if (addedStates.includes(datum.key)) {
					sum += datum.value;
				}
			});
			var key = d.key;
			filtered_injured.push({key, sum});
		});
		filtered_injured[9].sum += filtered_injured[10].sum;
		filtered_injured[9].sum += filtered_injured[11].sum;
		filtered_injured.pop();
		filtered_injured.pop();

		var filtered_fatal = [];
		fatalDataByPhase.forEach((d) => {
			var sum = 0;
			d.values.forEach((datum) => {
				if (addedStates.includes(datum.key)) {
					sum += datum.value;
				}
			});
			var key = d.key;
			filtered_fatal.push({key, sum});
		});
		filtered_fatal[9].sum += filtered_fatal[10].sum;
		filtered_fatal[9].sum += filtered_fatal[11].sum;
		filtered_fatal.pop();
		filtered_fatal.pop();

		/*console.log(filtered_uninjured);
		console.log(filtered_injured);
		console.log(filtered_fatal);*/

		line = d3.line()
				.x((d) => {return xScale(d.key) + margin.left +graphOffset;})
				.y((d) => {
					return yScale(d.sum) - margin.bottom;
				})
				//.curve(d3.curveMonotoneX);

		path1 = svg.append('path')
			.datum(filtered_injured)
			.attr('d', line)
			.attr("class", "injured");
		/*path2 = svg.append('path')
			.datum(filtered_uninjured)
			.attr('d', line)
			.attr("class", "uninjured");*/
		path3 = svg.append('path')
			.datum(filtered_fatal)
			.attr('d', line)
			.attr("class", "fatal");

		/*g1 = svg.append("g");

		g1.selectAll("circle")
			.data(filtered_uninjured)
			.enter()
			.append("circle")
			.attr("class", "uninjured-circle")
			.attr("cx", (d) => {
				return xScale(d.key) + margin.left +graphOffset;
			})
			.attr("cy", (d) => {
				return yScale(d.sum) - margin.bottom;
			})
			.attr("r", 3);*/

		g2 = svg.append("g");

		g2.selectAll("circle")
			.data(filtered_injured)
			.enter()
			.append("circle")
			.attr("class", "injured-circle")
			.attr("cx", (d) => {
				return xScale(d.key) + margin.left +graphOffset;
			})
			.attr("cy", (d) => {
				return yScale(d.sum) - margin.bottom;
			})
			.attr("r", 3);


		g3 = svg.append("g");

		g3.selectAll("circle")
			.data(filtered_fatal)
			.enter()
			.append("circle")
			.attr("class", "fatal-circle")
			.attr("cx", (d) => {
				return xScale(d.key) + margin.left +graphOffset;
			})
			.attr("cy", (d) => {
				return yScale(d.sum) - margin.bottom;
			})
			.attr("r", 3);

		var label_g = svg.append("g");
		label_g.append("text")
			.attr("class", "point-label")
			.attr("transform", "translate("+margin.left/8+"," + (height - margin.bottom/1.5)+")")
			.text("Total Uninjured:");

		filtered_uninjured.forEach((d) => {
			label_g.append("text")
				.attr("class", "point-label")
				/*.attr("transform", (x) => {
					var index = filtered_uninjured.indexOf(d);
					var y = filtered_injured[index].sum;
					console.log(d.sum);
					return "translate("+(xScale(d.key) + margin.left +graphOffset)+","+(yScale(y) - margin.bottom)+")"
				})*/
				.attr("transform", "translate(" + (xScale(d.key) + margin.left + graphOffset) + "," + (height - margin.bottom/1.5) + ")")
				.text("(" + d.sum+")")
				.style("text-anchor", "middle");
		});
		console.log(label_g);

	});

//This is separate because I wanted to call it in the filter function too
function drawGraph() {

	d3.csv("aircraft_incidents.csv", function(d) {
		//console.log(d);
		if (d.Injury_Severity != "Incident" 
				&& d.Injury_Severity != "Unavailable") {
			if (d.Country == "United States") {
				d.Total_Fatal_Injuries = +d.Total_Fatal_Injuries;
				d.Total_Serious_Injuries = +d.Total_Serious_Injuries;
				d.Total_Uninjured = +d.Total_Uninjured;
				var location = d.Location.split(",");
				if (location[1] != undefined) {
          			d.Location = location[1].trim();
					return d;
        		}
			}
		}
	}, function(error, csv) {

		uninjuredDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Uninjured;
			}) })
			.entries(csv);

		injuredDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Serious_Injuries;
			}) })
			.entries(csv);

		injuredDataByPhase = reorder(injuredDataByPhase);

		fatalDataByPhase = d3.nest()
			.key((d) => {return d.Broad_Phase_of_Flight;})
			.key((d) => {return d.Location;})
			.rollup((d) => {
				return d3.sum(d, (datum) => {
					return datum.Total_Fatal_Injuries;
			}) })
			.entries(csv);

		fatalDataByPhase = reorder(fatalDataByPhase);

	var injuryExtent = d3.extent(fatalDataByPhase,
			(d) => {
				return d3.sum(d.values, (datum) => {
					return datum.value;
				});
			});
		injuryExtent[1] += 100;
		injuryExtent[0] = 0;

		yScale = d3.scaleLinear().domain(injuryExtent)
			.range([height, margin.bottom]);
		xScale = d3.scaleBand().domain(
				["STANDING", "TAXI", "TAKEOFF", "CLIMB", "CRUISE",
				"MANEUVERING", "DESCENT", "APPROACH", "LANDING", 
				"OTHER"])
			.range([0, width-margin.right]);

		var xAxis = d3.axisBottom(xScale);
		var yAxis = d3.axisLeft(yScale);
	});
	
	var filtered_uninjured = [];
	uninjuredDataByPhase.forEach((d) => {
		var sum = 0;
		d.values.forEach((datum) => {
			if (addedStates.includes(datum.key)) {
				sum += datum.value;
			}
		});
		var key = d.key;
		filtered_uninjured.push({key, sum});
	})
	filtered_uninjured[9].sum += filtered_uninjured[10].sum;
	filtered_uninjured[9].sum += filtered_uninjured[11].sum;
	filtered_uninjured.pop();
	filtered_uninjured.pop();

	var filtered_injured = [];
	injuredDataByPhase.forEach((d) => {
		var sum = 0;
		d.values.forEach((datum) => {
			if (addedStates.includes(datum.key)) {
				sum += datum.value;
			}
		});
		var key = d.key;
		filtered_injured.push({key, sum});
	})
	filtered_injured[9].sum += filtered_injured[10].sum;
	filtered_injured[9].sum += filtered_injured[11].sum;
	filtered_injured.pop();
	filtered_injured.pop();

	var filtered_fatal = [];
	fatalDataByPhase.forEach((d) => {
		var sum = 0;
		d.values.forEach((datum) => {
			if (addedStates.includes(datum.key)) {
				sum += datum.value;
			}
		});
		var key = d.key;
		filtered_fatal.push({key, sum});
	})
	filtered_fatal[9].sum += filtered_fatal[10].sum;
	filtered_fatal[9].sum += filtered_fatal[11].sum;
	filtered_fatal.pop();
	filtered_fatal.pop();

	svg.select(".injured")
		.datum(filtered_injured)
		.transition()
		.duration(750)
		.attr('d', line);
		

	/*svg.select(".uninjured")
		.datum(filtered_uninjured)
		.transition()
		.duration(750)
		.attr('d', line);*/
		

	svg.select(".fatal")
		.datum(filtered_fatal)
		.transition()
		.duration(750)
		.attr('d', line);
		

	//console.log()
	svg.selectAll(".injured-circle")
		.data(filtered_injured)
		.transition()
		.duration(750)
		.attr("cy", (d) => {
			return yScale(d.sum) - margin.bottom;
		})

	/*svg.selectAll(".uninjured-circle")
		.data(filtered_uninjured)
		.transition()
		.duration(750)
		.attr("cy", (d) => {
			return yScale(d.sum) - margin.bottom;
		})*/

	svg.selectAll(".fatal-circle")
		.data(filtered_fatal)
		.transition()
		.duration(750)
		.attr("cy", (d) => {
			return yScale(d.sum) - margin.bottom;
		})

}

function reorder(array) {
	var newArray = [];
	array.forEach((i) => {
		if (i.key == "STANDING") {
			newArray[0] = i;
		} else if (i.key == "TAXI") {
			newArray[1] = i;
		} else if (i.key == "TAKEOFF") {
			newArray[2] = i;
		} else if (i.key == "CLIMB") {
			newArray[3] = i;
		} else if (i.key == "CRUISE") {
			newArray[4] = i;
		} else if (i.key == "MANEUVERING") {
			newArray[5] = i;
		} else if (i.key == "DESCENT") {
			newArray[6] = i;
		} else if (i.key == "APPROACH") {
			newArray[7] = i;
		} else if (i.key == "LANDING") {
			newArray[8] = i;
		} else if (i.key == "OTHER") {
			newArray[9] = i;
		} else if (i.key == "") {
			newArray[10] = i;
		} else if (i.key == "UNKNOWN") {
			newArray[11] = i;
		}
	})
	return newArray;
}