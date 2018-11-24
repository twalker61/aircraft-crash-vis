var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

//var x = d3.scale.ordinal().rangeRoundBands([width, 0], .05);
var x = d3.scaleBand().rangeRound([width, 0], .05);

//var y = d3.scale.linear().range([height, 0]);
var y = d3.scaleLinear().range([height, 0]);

/*var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");*/

var svg = d3.select("#states-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");



d3.csv("aircraft_incidents.csv", function(error, data) {

  var states = {"AK" : {}, "AL" : {}, "AR" : {}, "AZ": {}, "CA" : {}, "CO" : {}, "CT" : {}, "DC" : {},
  "DE" : {},"FL" : {},"GA" : {},"HI" : {},"IA" : {},"ID" : {},"IL" : {},"IN" : {},"KS" : {},
  "KY" : {},"LA" : {},"MA" : {},"MD" : {},"ME" : {},"MI" : {},"MN" : {},"MO" : {},"MS" : {},
  "MT" : {},"NC" : {},"ND" : {},"NE" : {},"NH" : {},"NJ" : {},"NM" : {},"NV" : {},"NY" : {},
  "OH" : {},"OK" : {},"OR" : {},"PA" : {},"RI" : {},"SC" : {},"SD" : {},"TN" : {},"TX" : {},
  "UT" : {},"VA" : {},"VT" : {},"WA" : {},"WI" : {},"WV" : {},"WY" : {}};

  var names = {"AL" : "Alabama", "AK" : "Alaska", "AZ" : "Arizona", "AR": "Arkansas", "CA" : "California", "CO" : "Colorado", "CT" : "Connecticut", "DC" : "District of Columbia",
  "DE" : "Delaware","FL" : "Florida","GA" : "Georgia","HI" : "Hawaii","ID" : "Idaho","IL" : "Illinois","IN" : "Indiana","IA" : "Iowa","KS" : "Kansas",
  "KY" : "Kentucky","LA" : "Louisiana","ME" : "Maine","MD" : "Maryland","MA" : "Massachusetts","MI" : "Michigan","MN" : "Minnesota","MS" : "Mississippi","MO" : "Missouri",
  "MT" : "Montana","NE" : "Nebraska","NV" : "Nevada","NH" : "New Hampshire","NJ" : "New Jersey","NM" : "New Mexico","NY" : "New York","NC" : "North Carolina","ND" : "North Dakota",
  "OH" : "Ohio","OK" : "Oklahoma","OR" : "Oregon","PA" : "Pennsylvania","RI" : "Rhode Island","SC" : "South Carolina","SD" : "South Dakota","TN" : "Tennessee","TX" : "Texas",
  "UT" : "Utah","VT" : "Vermont","VA" : "Virginia","WA" : "Washington","WV" : "West Virginia","WI" : "Wisconsin","WY" : "Wyoming"};

  data.forEach(function(d) {
      var loc = d.Location;
      var abbr = loc.substring(loc.indexOf(",") + 2, loc.length);
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
      }
  });

  //console.log(states);
  var stateData = [], abbrData = [], seriousData = [], fatalData = [];
  Object.keys(states).forEach(function(d) {
    //console.log(d);
    //console.log(states[d]);
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
  //console.log(stateData);

  /*var selectedStates = [];
  for(i = 0; i < Object.keys(states).length; i++) {
  	//adds 2 abbreviations per state (one per bar color)
    selectedStates[i*2] = Object.keys(states)[i];
    selectedStates[(i*2)+1] = Object.keys(states)[i];
  }
  console.log(selectedStates);*/
  //selectedStates = selected;

  var selectedStates;
  $.getScript("map.js", function() {
   selectedStates = getSelectedStates();
});

  x.domain(Object.keys(states).reverse());
  y.domain([0, d3.max(abbrData, function(d, i) { 
    if(d == "NY") {return 0;}
    return seriousData[i] + fatalData[i];
  })]);
  //y.domain([0,50]);
  

  var xAxisGroup = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
      .call(d3.axisBottom(x))
    .selectAll("text")
      .style("text-anchor", "middle")
      //.attr("dx", "0.8em")
      .attr("dy", ".71em");
      //.attr("transform", "rotate(-90)" );

  var yAxisGroup = svg.append("g")
      .attr("class", "y axis")
      //.call(yAxis)
      .call(d3.axisLeft(y))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
      //.text("Value ($)");

  //creates the bars for serious injuries (on bottom)
  svg.selectAll("bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .style("fill", "mediumpurple")
      .attr("id", function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return 15 + (i * ((width - 2 * 9) / 51));
      })
      .attr("width", function(d, i) {
        return 10;
      })
      .attr("y", function(d, i) {
        return y(seriousData[i]);
      })
      .attr("height", function(d, i) {
        return height - y(seriousData[i]);
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

     //creates bars for fatal injuries (on top of serious injury bars)
  svg.selectAll("bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'bar')
      .style("fill", "springgreen")
      .attr("id", function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return 15 + (i * ((width - 2 * 9) / 51));
      })
      .attr("width", function(d, i) {
        return 10;
      })
      .attr("y", function(d, i) {
        return y(fatalData[i]) - (height - y(seriousData[i]));
      })
      .attr("height", function(d, i) {
        return height - y(fatalData[i]);
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

      //these two functions handle hovering over the bars/labels
      function handleMouseOver(d, i) {
          document.getElementById('currentState').textContent = names[d] + " : ";
          document.getElementById('currentFatal').textContent = fatalData[abbrData.indexOf(d)] + " fatal injuries,";
          document.getElementById('currentSerious').textContent = seriousData[abbrData.indexOf(d)] + " serious injuries";
      }

      function handleMouseOut() {
          document.getElementById('currentState').textContent = '';
          document.getElementById('currentFatal').textContent = '';
          document.getElementById('currentSerious').textContent = '';
      }

  //console.log(d3.selectAll(".tick"));

  d3.selectAll(".tick")["_groups"][0].forEach(function(d1) {
    var data = d3.select(d1).data();
    //console.log(data);
    if(names[data[0]] == null) {return;}
    d3.select(d1)
      .on("mouseover", handleMouseOver)                  
      .on("mouseout", handleMouseOut);
  });

});

  //update which bars are visible based on selected states
  function updateBars(selected) {
    selectedStates = selected;
  	console.log(selectedStates);
  		//adds all selected states
  		svg.selectAll('.bar')
                .filter(function(d) {
                    return selectedStates.includes(d);
                })
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('width', function(d) {
                    return 10;
                });
         //removes all states that aren't currently selected
         svg.selectAll('.bar')
                .filter(function(d) {
                    return !selectedStates.includes(d);
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
  }

/*$.getScript("map.js", function() {
   mapstuff(sorted, names, selectedStates);
});*/

/*function map() {
  console.log("called map");
  $.getScript("map.js", function() {
   mapstuff(sorted, names, selectedStates);
});
}*/


		numberSort = function (a,b) {
            return a - b;
        };

        //updates the x axis, not currently in use, need to update to v4
        function updateStateAxis() {
            console.log(selectedStates);
            x.domain(selectedStates.reverse());
            /*xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");*/
            //svg.selectAll(".x.axis")
              //.call(xAxis);
            xAxisGroup.call(d3.axisBottom(x));

            var ticks = [];
            console.log(xAxisGroup);
            //d3.selectAll('g.tick')["_parents"][0].forEach(function(d) {
              //console.log(d.attributes[1].nodeValue);
              console.log(svg.selectAll('g.tick')["_parents"][0]);
              //var str = d.attributes[1].nodeValue;
              var str = d3.selectAll('g.tick')["_parents"][0].attributes[0].nodeValue;
              console.log(str.substring(str.indexOf("(") + 1, str.indexOf(",")));
              str = str.substring(str.indexOf("(") + 1, str.indexOf(","));
              if(parseInt(str) != 0) {
                ticks.push(parseInt(str));
              }
              //return str.substring(str.indexOf("(") + 1, str.indexOf(","));
            //});
            //console.log(ticks);
            ticks.sort(numberSort);
            console.log(ticks);
              
            svg.selectAll('.bar')
            .filter(function(d) {
                return selectedStates.includes(d);
            })
            .attr("x", function(d, i){
              console.log(i);
              if(i >= (selectedStates.length / 2)) {i -= (selectedStates.length / 2);}
              //return 15 + (i * ((width - 2 * 9) / selectedStates.length / 2));
              return ticks[i] - 5;
            })

            d3.selectAll(".tick")["_parents"][0].forEach(function(d1) {
              var data = d3.select(d1).data();
              console.log(data);
              if(names[data[0]] == null) {return;}
              d3.select(d1)
                .on("mouseover", handleMouseOver)                  
                .on("mouseout", handleMouseOut);
            });
        }


//DELETE EVERYTHING BENEATH HERE


  // d3.select("body")
  //       .append('p')
  //       .append('text')
  //       .text('State to be Removed: ')
  //       .append('input')
  //       .attr('id', 'removeValue');

  // d3.select('body')
  //       .append('p')
  //       .append('button')
  //       .text('Remove State')
  //       .on('click', function(){
  //           console.log("clicked");
  //           //svg.selectAll(".bar").style('fill', 'red');
  //           svg.selectAll('.bar')
  //               .filter(function(d) {
  //                   //return d.frequency < document.getElementById("cutoffValue").value;
  //                   console.log(d);
  //                   console.log(document.getElementById("removeValue").value);
  //                   return d == document.getElementById("removeValue").value;
  //               })
  //               .transition()
  //               .duration(function(d) {
  //                   return 1000;
  //               })
  //               .delay(function(d) {
  //                   return 1;
  //               })
  //               .attr('width', function(d) {
  //                   selectedStates.splice(selectedStates.indexOf(d), 1);
  //                   selectedStates.sort();
  //                   return 0;
  //               });
  //           //updateStateAxis();
  //       });

  // d3.select("body")
  //       .append('p')
  //       .append('text')
  //       .text('State to be Added: ')
  //       .append('input')
  //       .attr('id', 'addValue');

  // d3.select('body')
  //       .append('p')
  //       .append('button')
  //       .text('Add State')
  //       .on('click', function(){
  //           //console.log(d);
  //           //svg.selectAll(".bar").style('fill', 'red');
  //           //selectedStates.push(d);
  //           svg.selectAll('.bar')
  //               .filter(function(d) {
  //                   //return d.frequency < document.getElementById("cutoffValue").value;
  //                   console.log(d);
  //                   console.log(document.getElementById("addValue").value);
  //                   return d == document.getElementById("addValue").value;
  //               })
  //               .transition()
  //               .duration(function(d) {
  //                   return 1000;
  //               })
  //               .delay(function(d) {
  //                   return 1;
  //               })
  //               .attr('width', function(d) {
  //                 console.log(d);
  //                 selectedStates.push(d);
  //                 selectedStates.sort();
  //                   return 10;
  //               });
  //           //updateStateAxis();
  //       });

  //  d3.select('body')
  //       .append('p')
  //       .append('button')
  //       .text('Include New York')
  //       .on('click', function(){
  //           console.log("clicked");
  //           selectedStates = [];
  //           svg.selectAll('.bar')
  //               .transition()
  //               .duration(function(d) {
  //                   return 1000;
  //               })
  //               .delay(function(d) {
  //                   return 1;
  //               })
  //               .attr('width', function(d) {
  //                   return 0;
  //               });
  //           y.domain([0, d3.max(abbrData, function(d, i) { 
  //             //if(d == "NY") {return 0;}
  //             return seriousData[i] + fatalData[i];
  //           })]);
  //           //yAxisGroup.transition().call(yAxis); 
  //           yAxisGroup.transition().call(d3.axisLeft(y));
  //       }); 