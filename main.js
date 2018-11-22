//$("acontent").empty();

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m").parse;

var y = d3.scale.ordinal().rangeRoundBands([height, 0], .05);

var x = d3.scale.linear().range([0, width]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
    //.tickFormat(d3.time.format("%Y-%m"));

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("aircraft_incidents.csv", function(error, data) {

  var states = {"AL" : {}, "AK" : {}, "AZ" : {}, "AR": {}, "CA" : {}, "CO" : {}, "CT" : {}, "DC" : {},
  "DE" : {},"FL" : {},"GA" : {},"HI" : {},"ID" : {},"IL" : {},"IN" : {},"IA" : {},"KS" : {},
  "KY" : {},"LA" : {},"ME" : {},"MD" : {},"MA" : {},"MI" : {},"MN" : {},"MS" : {},"MO" : {},
  "MT" : {},"NE" : {},"NV" : {},"NH" : {},"NJ" : {},"NM" : {},"NY" : {},"NC" : {},"ND" : {},
  "OH" : {},"OK" : {},"OR" : {},"PA" : {},"RI" : {},"SC" : {},"SD" : {},"TN" : {},"TX" : {},
  "UT" : {},"VT" : {},"VA" : {},"WA" : {},"WV" : {},"WI" : {},"WY" : {}};

  data.forEach(function(d) {
      var loc = d.Location;
      var abbr = loc.substring(loc.indexOf(",") + 2, loc.length);
      //console.log(loc.substring(loc.indexOf(",") + 2, loc.length));
      if(states[abbr] != null) {
        if(states[abbr]["fatalInjuries"] != null) {
          states[abbr]["fatalInjuries"] += parseInt(d.Total_Fatal_Injuries);
        } else {
          states[abbr]["fatalInjuries"] = 0;
        }
        if(states[abbr]["seriousInjuries"] != null) {
          states[abbr]["seriousInjuries"] += parseInt(d.Total_Serious_Injuries);
        } else {
          states[abbr]["seriousInjuries"] = 0;
        }
        //states[abbr] = 0;
        //console.log(d);
      }
  });

  console.log(states);
  var stateData = [], abbrData = [], seriousData = [], fatalData = [];
  Object.keys(states).forEach(function(d) {
    console.log(d);
    console.log(states[d]);
    if(Object.keys(states[d]) != 0) {
      stateData.push(states[d]["fatalInjuries"] + states[d]["seriousInjuries"]);
      seriousData.push(states[d]["seriousInjuries"]);
      fatalData.push(states[d]["fatalInjuries"]);
    } else {
      stateData.push(0);
      seriousData.push(0);
      fatalData.push(0);
    }
    abbrData.push(d);
  });
  console.log(stateData);

  var selectedStates = [];

  y.domain(Object.keys(states).reverse());
  x.domain([0, d3.max(abbrData, function(d, i) { 
    //return parseInt(d.Total_Fatal_Injuries) + parseInt(d.Total_Serious_Injuries); 
    //return d;
    if(d == "NY") {return 0;}
    return seriousData[i] + fatalData[i];
  })]);
  /*x.domain([0, d3.max(selectedStates, function(d) {
    return stateData[abbrData.indexOf(d)];
  })]);
*/

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
      //.text("Value ($)");

  svg.selectAll("bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .style("fill", "steelblue")
      .attr("id", function(d) {
        //return abbrData[i];
        return d;
      })
      .attr("x", function(d) {
        return 0;
      })
      .attr("width", function(d, i) {
        //return x(d);
        return x(seriousData[i]);
      })
      .attr("y", function(d, i) {
        return margin.top + (i * ((height - 2 * margin.top) / 51) );
        //return height - margin.top;
      })
      .attr("height", function(d) {
        return ((height - 2 * margin.top) / 51);
      })

  svg.selectAll("bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .style("fill", "red")
      .attr("id", function(d) {
        //return abbrData[i];
        return d;
      })
      .attr("x", function(d, i) {
        return x(seriousData[i]);
      })
      .attr("width", function(d, i) {
        //return x(d);
        return x(fatalData[i]);
      })
      .attr("y", function(d, i) {
        return margin.top + (i * ((height - 2 * margin.top) / 51) );
        //return height - margin.top;
      })
      .attr("height", function(d) {
        return ((height - 2 * margin.top) / 51);
      })

  d3.select("body")
        .append('p')
        .append('text')
        .text('State to be Removed: ')
        .append('input')
        .attr('id', 'removeValue');

  d3.select('body')
        .append('p')
        .append('button')
        .text('Remove State')
        .on('click', function(){
            console.log("clicked");
            //svg.selectAll(".bar").style('fill', 'red');
            svg.selectAll('.bar')
                .filter(function(d) {
                    //return d.frequency < document.getElementById("cutoffValue").value;
                    console.log(d);
                    console.log(document.getElementById("removeValue").value);
                    return d == document.getElementById("removeValue").value;
                })
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('width', function(d) {
                    return 0;
                });
        });

  d3.select("body")
        .append('p')
        .append('text')
        .text('State to be Added: ')
        .append('input')
        .attr('id', 'addValue');

  d3.select('body')
        .append('p')
        .append('button')
        .text('Add State')
        .on('click', function(){
            //console.log(d);
            //svg.selectAll(".bar").style('fill', 'red');
            //selectedStates.push(d);
            svg.selectAll('.bar')
                .filter(function(d) {
                    //return d.frequency < document.getElementById("cutoffValue").value;
                    console.log(d);
                    console.log(document.getElementById("addValue").value);
                    return d == document.getElementById("addValue").value;
                })
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('width', function(d) {
                  console.log(d);
                  selectedStates.push(d);
                    return x(stateData[abbrData.indexOf(d)]);
                });
        });

  d3.select('body')
        .append('p')
        .append('button')
        .text('Add All')
        .on('click', function(){
            svg.selectAll('.bar')
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('width', function(d) {
                  console.log(d);
                    return x(stateData[abbrData.indexOf(d)]);
                });
        }); 

  d3.select('body')
        .append('p')
        .append('button')
        .text('Remove All')
        .on('click', function(){
            console.log("clicked");
            //svg.selectAll(".bar").style('fill', 'red');
            selectedStates = [];
            svg.selectAll('.bar')
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('width', function(d) {
                    return 0;
                });
        });   

      /*.attr("x", function(d) { 
        console.log(d);
        return 1; 
      })
      .attr("width", 100)
      .attr("y", function(d) { 
        return 1; 
      })
      .attr("height", function(d) { 
        return 1; 
      });*/

    /*data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });
    
  y.domain(data.map(function(d) { return d.date; }));
  x.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });*/

});