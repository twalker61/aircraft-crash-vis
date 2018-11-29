//console.log("selectedStates");

var uninjuredDataByPhase;
    var injuredDataByPhase;
    var fatalDataByPhase;
var filtered_uninjured;
var filtered_injured;
var filtered_fatal;

var xScale, yScale;
	var g1, g2, g3, line, path1, path2, path3;

var margin = {top: 60, right: 60, bottom: 100, left: 70},
	    	width = 1200 - margin.left - margin.right,
	    	height = 600 - margin.top - margin.bottom;

	var graphOffset = 50;

	var p_svg = d3.select("#phases-svg")
	    		.attr("width", width)
	    		.attr("height", height);

function create() {

	    //process data now
	    //nest by phase, and then within each phase nest by state
		d3.csv("aircraft_incidents.csv", function(d) {
			//console.log("loading data");
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

			var removedStates = [];
		    var addedStates = ["AL", "GA", "ME", "VT", "MA", "NY", "CT", "RI", 
		    	"NJ", "PA", "MD", "VA", "NC", "SC", "FL", "TN", "MS", "KY", "IN", 
		    	"OH", "MI", "WV", "MO", "MN", "TX", "LA", "AR", "AZ", "UT", "WY", 
		    	"CA", "OR", "WA", "ID", "ND", "SD", "IL", "NE", "KA", "HI", "AK", 
		    	"CO", "PR", "NV", "NM", "GU", "Kauai", "IA", "DE", "NH", "OK", "WI"];

		    uninjuredDataByPhase = [];
			injuredDataByPhase = [];
			fatalDataByPhase = [];

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

			p_svg.append("g")
				.attr("class", "x-axis")
				.attr("transform", "translate("+margin.left+","+(height-margin.bottom)+")")
				.call(xAxis);

			var text_g = p_svg.append("g");

			text_g.append("text")
				.attr("class", "label")
				.attr("transform", "translate("+width/2+","+(height-margin.bottom/4)+")")
				.text("Phase of Flight")
				.style("text-anchor", "middle");
			//svg_x.append()

			p_svg.append("g")
				.attr("class", "y-axis")
				.attr("transform", "translate("+margin.left+","+ -margin.bottom+")")
				.call(yAxis);

			text_g.append("text")
				.attr("class", "label")
				.attr("transform", "translate("+margin.left/2+","+(height/2 - margin.top)+"), rotate(-90)")
				.text("Number of Injuries per Category")
				.style("text-anchor", "middle");

			filtered_uninjured = [];
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

			filtered_injured = [];
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

			filtered_fatal = [];
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

			line = d3.line()
					.x((d) => {return xScale(d.key) + margin.left +graphOffset;})
					.y((d) => {
						return yScale(d.sum) - margin.bottom;
					});
					//.curve(d3.curveMonotoneX);

			path1 = p_svg.append('path')
				.datum(filtered_injured)
				.attr('d', line)
				.attr("class", "injured");
			path3 = p_svg.append('path')
				.datum(filtered_fatal)
				.attr('d', line)
				.attr("class", "fatal");

			g2 = p_svg.append("g");

			g2.selectAll("circle")
				.data(filtered_injured)
				.enter()
				.append("circle")
				.attr("class", "serious-injury")
				.attr("cx", (d) => {
					return xScale(d.key) + margin.left +graphOffset;
				})
				.attr("cy", (d) => {
					return yScale(d.sum) - margin.bottom;
				})
				.attr("r", 6)
				.on("click", displayDetails);


			g3 = p_svg.append("g");

			g3.selectAll("circle")
				.data(filtered_fatal)
				.enter()
				.append("circle")
				.attr("class", "fatal-injury")
				.attr("cx", (d) => {
					return xScale(d.key) + margin.left +graphOffset;
				})
				.attr("cy", (d) => {
					return yScale(d.sum) - margin.bottom;
				})
				.attr("r", 6)
				.on("click", displayDetails);

			var label_g = p_svg.append("g");
			label_g.append("text")
				.attr("class", "point-label")
				.attr("transform", "translate("+margin.left/8+"," + (height - margin.bottom/1.5)+")")
				.text("Total Uninjured:")
				.attr("fill", "#7eb338");
				//.on("mouseover", displayDetails);

			filtered_uninjured.forEach((d) => {
				//console.log("index");
				label_g.append("text")
					.attr("class", "point-label")
					.attr("transform", "translate(" + (xScale(d.key) + margin.left + graphOffset) + "," + (height - margin.bottom/1.5) + ")")
					.text("(" + d.sum+")")
					.style("text-anchor", "middle")
					.on("mouseover", () => {
						var i = filtered_uninjured.indexOf(d);
						console.log(d);
						console.log(filtered_uninjured);
						console.log(filtered_uninjured.indexOf(d));
						document.getElementById('currentPhase').textContent = d.key;
					    document.getElementById('currFatal').textContent = filtered_fatal[i].sum;
					   	document.getElementById('currSerious').textContent = filtered_injured[i].sum;
					   	document.getElementById('currUninjured').textContent = filtered_uninjured[i].sum;
					})
					.on("mouseout", () => {
						document.getElementById('currentPhase').textContent = "";
					    document.getElementById('currFatal').textContent = "";
					   	document.getElementById('currSerious').textContent = "";
					   	document.getElementById('currUninjured').textContent = "";
					})
					.attr("fill", "#7eb338");
					//.on("hover", displayDetails);
					//.on("mouseout", hideDetails);
			});

		});
}

function displayDetails(d, i) {
	console.log(d);
	document.getElementById('currentPhase').textContent = d.key;
    document.getElementById('currFatal').textContent = filtered_fatal[i].sum;
   	document.getElementById('currSerious').textContent = filtered_injured[i].sum;
   	document.getElementById('currUninjured').textContent = filtered_uninjured[i].sum;
}
function hideDetails(d) {
	document.getElementById('currPhase').textContent = "";
    document.getElementById('currFatal').textContent = "";
   	document.getElementById('currSerious').textContent = "";
   	document.getElementById('currUninjured').textContent = "";
}

//This is separate because I wanted to call it in the filter function too
function drawGraph(addedStates) {

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
	//console.log(filtered_uninjured);
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

	d3.select(".injured")
		.datum(filtered_injured)
		.transition()
		.duration(750)
		.attr('d', line);
		

	d3.select(".fatal")
		.datum(filtered_fatal)
		.transition()
		.duration(750)
		.attr('d', line);
		

	//console.log()
	d3.selectAll(".serious-injury")
		.data(filtered_injured)
		.transition()
		.duration(750)
		.attr("cy", (d) => {
			return yScale(d.sum) - margin.bottom;
		})

	d3.selectAll(".fatal-injury")
		.data(filtered_fatal)
		.transition()
		.duration(750)
		.attr("cy", (d) => {
			//console.log("moving");
			console.log("Main: "+(yScale(d.sum) - margin.bottom))
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