var selectedStates;

function create () {
  
  var states = {"AK" : {}, "AL" : {}, "AR" : {}, "AZ": {}, "CA" : {}, "CO" : {}, "CT" : {}, "DC" : {},
  "DE" : {},"FL" : {},"GA" : {}, "GU" : {}, "HI" : {},"IA" : {},"ID" : {},"IL" : {},"IN" : {},"KS" : {},
  "KY" : {},"LA" : {},"MA" : {},"MD" : {},"ME" : {},"MI" : {},"MN" : {},"MO" : {},"MS" : {},
  "MT" : {},"NC" : {},"ND" : {},"NE" : {},"NH" : {},"NJ" : {},"NM" : {},"NV" : {},"NY" : {},
  "OH" : {},"OK" : {},"OR" : {},"PA" : {},"RI" : {},"SC" : {},"SD" : {},"TN" : {},"TX" : {},
  "UT" : {},"VA" : {},"VT" : {},"WA" : {},"WI" : {},"WV" : {},"WY" : {}};

  var names = {"AL" : "Alabama", "AK" : "Alaska", "AZ" : "Arizona", "AR": "Arkansas", "CA" : "California", "CO" : "Colorado", "CT" : "Connecticut", "DC" : "District of Columbia",
  "DE" : "Delaware","FL" : "Florida","GA" : "Georgia", "GU" : "Guam", "HI" : "Hawaii","ID" : "Idaho","IL" : "Illinois","IN" : "Indiana","IA" : "Iowa","KS" : "Kansas",
  "KY" : "Kentucky","LA" : "Louisiana","ME" : "Maine","MD" : "Maryland","MA" : "Massachusetts","MI" : "Michigan","MN" : "Minnesota","MS" : "Mississippi","MO" : "Missouri",
  "MT" : "Montana","NE" : "Nebraska","NV" : "Nevada","NH" : "New Hampshire","NJ" : "New Jersey","NM" : "New Mexico","NY" : "New York","NC" : "North Carolina","ND" : "North Dakota",
  "OH" : "Ohio","OK" : "Oklahoma","OR" : "Oregon","PA" : "Pennsylvania","RI" : "Rhode Island","SC" : "South Carolina","SD" : "South Dakota","TN" : "Tennessee","TX" : "Texas",
  "UT" : "Utah","VT" : "Vermont","VA" : "Virginia","WA" : "Washington","WV" : "West Virginia","WI" : "Wisconsin","WY" : "Wyoming"};

  var removedStates = [];
    var addedStates = ["AL", "GA", "ME", "VT", "MA", "NY", "CT", "RI", 
      "NJ", "PA", "MD", "VA", "NC", "SC", "FL", "TN", "MS", "KY", "IN", 
      "OH", "MI", "WV", "MO", "MN", "TX", "LA", "AR", "AZ", "UT", "WY", 
      "CA", "OR", "WA", "ID", "ND", "SD", "IL", "NE", "KA", "HI", "AK", 
      "CO", "PR", "NV", "NM", "DC", "IA", "DE", "NH", "OK", "WI", "GU"];

  var sorted = Object.keys(names).sort(); 

  selectedStates = [];
  for(i = 0; i < Object.keys(states).length; i++) {
    //adds 2 abbreviations per state (one per bar color)
    selectedStates[i*2] = Object.keys(states)[i];
    selectedStates[(i*2)+1] = Object.keys(states)[i];
  }
  //console.log(selectedStates);

  //console.log("Map");
    sorted.forEach(function(d) {
    //console.log(names[d]);
    d3.select('.button-container').append('p')
          .append('button')
          .attr("style", "background-color: lightskyblue;")
          .attr("abbr", d)
          .attr("class", "stateButton")
          .text(names[d])
          .on('click', function(){
              //console.log(this.getAttribute("abbr"));
              var currAbbr = this.getAttribute("abbr");
              var currColor = this.getAttribute("style");
              //console.log(currAbbr);
  
              //adds/removes state from the selected array (does it twice bc there are 2 bars)
              if(selectedStates.includes(currAbbr)) {
                selectedStates.splice(selectedStates.indexOf(currAbbr), 1);
                selectedStates.splice(selectedStates.indexOf(currAbbr), 1);
                var a = addedStates.indexOf(currAbbr);
                addedStates.splice(a, 1);
                removedStates.push(currAbbr);
              } else {
                selectedStates.push(currAbbr);
                selectedStates.push(currAbbr);
                var a = removedStates.indexOf(currAbbr);
                removedStates.splice(a, 1);
                addedStates.push(currAbbr);
                //selected.sort();
              }
              //console.log(selectedStates);
  
              //toggles color
              if(currColor == "background-color: lightskyblue;") {
                this.setAttribute("style", "background-color: white;");
              } else {
                this.setAttribute("style", "background-color: lightskyblue;");
              }
              $.getScript("selection.js", () => {
                //console.log("Before");
                updateBars(selectedStates);
              });
              $.getScript("phases.js", () => {
                drawGraph(addedStates);
              });
              drawPhaseGraph(addedStates);
              updateMiniBars(selectedStates);
          });
  });
  
    d3.select('.button-container')
          .append('p')
          .append('button')
          .text('Add All')
          .attr("class", "resetButton")
          .on('click', function(){
            //make all buttons green
            d3.selectAll('.stateButton')["_groups"][0].forEach(function(d,i) {
                d3.selectAll('.stateButton')["_groups"][0][i].setAttribute("style", "background-color: lightskyblue;");
              });
  
            //fills up selected array & adds all bars
              selectedStates = [];
              for(i = 0; i < Object.keys(states).length; i++) {
                //adds 2 abbreviations per state (one per bar color)
                selectedStates[i*2] = Object.keys(states)[i];
                selectedStates[(i*2)+1] = Object.keys(states)[i];
              }
              removedStates.forEach((i) => {
                addedStates.push(i);
              })
              removedStates = [];
              //console.log(selectedStates);
              $.getScript("./selection.js", function(response, status) {
                //console.log("Before");
                updateBars(selectedStates);
              });
              $.getScript("phases.js", () => {
                drawGraph(addedStates);
              });
              drawPhaseGraph(addedStates);
              updateMiniBars(selectedStates);
              /*svg.selectAll('.bar')
                  .transition()
                  .duration(function(d) {
                      return 1000;
                  })
                  .delay(function(d) {
                      return 1;
                  })
                  .attr('width', function(d) {
                    //console.log(d);
                    selectedStates.push(d);
                      return 10;
                  });
                  selectedStates.sort();*/
                  //updateStateAxis();
          }); 
  
    d3.select('.button-container')
          .append('p')
          .append('button')
          .attr("class", "resetButton")
          .text('Remove All')
          .on('click', function(){
              //make all buttons white
              d3.selectAll('.stateButton')["_groups"][0].forEach(function(d,i) {
                d3.selectAll('.stateButton')["_groups"][0][i].setAttribute("style", "background-color: white;");
              });
  
              //clears selected array & removes all bars
              selectedStates = [];
              addedStates.forEach((i) => {
                removedStates.push(i);
              })
              addedStates = [];
              $.getScript("selection.js", () => {
                //console.log("Before");
                updateBars(selectedStates);
              });
              $.getScript("phases.js", () => {
                drawGraph(addedStates);
              });
              drawPhaseGraph(addedStates);
              updateMiniBars(selectedStates);
              /*svg.selectAll('.bar')
                  .transition()
                  .duration(function(d) {
                      return 1000;
                  })
                  .delay(function(d) {
                      return 1;
                  })
                  .attr('width', function(d) {
                      return 0;
                  });*/
              //updateStateAxis();
  
          });
}

function getSelectedStates() {
    return selectedStates;
  } 


/*
This is the section that controls the mini phase graph to give users a preview
It's basically a copy of the phase.js class
*/



var phaseXScale, phaseYScale;
  var phase_g1, phase_g2, phase_g3, phase_line, phase_path1, phase_path2, phase_path3;

var mini_margin = {top: 10, right: 50, bottom: 70, left: 60},
        mini_width = 650 - mini_margin.left - mini_margin.right,
        mini_height = 320 - mini_margin.top - mini_margin.bottom;

  var mini_graphOffset = 20;

  var p_mini = d3.select("#mini_phase")
          .attr("width", mini_width)
          .attr("height", mini_height);

function createPhaseMini() {
  var uninjuredDataByPhase;
    var injuredDataByPhase;
    var fatalDataByPhase;
var filtered_uninjured;
var filtered_injured;
var filtered_fatal;

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

      phaseYScale = d3.scaleLinear().domain(injuryExtent)
        .range([mini_height, mini_margin.bottom]);
      phaseXScale = d3.scaleBand().domain(
          ["STANDING", "TAXI", "TAKEOFF", "CLIMB", "CRUISE",
          "MANEUVERING", "DESCENT", "APPROACH", "LANDING", 
          "OTHER"])
        .range([0, mini_width-mini_margin.right]);

      var phaseXAxis = d3.axisBottom(phaseXScale);
      var phaseYAxis = d3.axisLeft(phaseYScale);

      p_mini.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate("+mini_margin.left+","+(mini_height-mini_margin.bottom)+")")
        .call(phaseXAxis);

      var phase_text_g = p_mini.append("g");

      phase_text_g.append("text")
        .attr("class", "label")
        .attr("transform", "translate("+mini_width/2+","+(mini_height-mini_margin.bottom/7)+")")
        .text("Phase of Flight")
        .style("text-anchor", "middle");
      //svg_x.append()

      p_mini.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate("+mini_margin.left+","+ -mini_margin.bottom+")")
        .call(phaseYAxis);

      phase_text_g.append("text")
        .attr("class", "label")
        .attr("transform", "translate("+mini_margin.left/4+","+(mini_height/2 - mini_margin.top*3)+"), rotate(-90)")
        .text("Number of Injuries per Category")
        .style("text-anchor", "middle");

      p_mini.selectAll(".x-axis text")  // select all the text elements for the xaxis
          .attr("transform", function(d) {
             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-30)";
         });

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

      phase_line = d3.line()
          .x((d) => {return phaseXScale(d.key) + mini_margin.left + mini_graphOffset;})
          .y((d) => {
            return phaseYScale(d.sum) - mini_margin.bottom;
          });
          //.curve(d3.curveMonotoneX);

      phase_path1 = p_mini.append('path')
        .datum(filtered_injured)
        .attr('d', phase_line)
        .attr("class", "mini-injured");
      phase_path3 = p_mini.append('path')
        .datum(filtered_fatal)
        .attr('d', phase_line)
        .attr("class", "mini-fatal");

      phase_g2 = p_mini.append("g");

      phase_g2.selectAll("circle")
        .data(filtered_injured)
        .enter()
        .append("circle")
        .attr("class", "mini-serious-injury")
        .attr("cx", (d) => {
          return phaseXScale(d.key) + mini_margin.left +mini_graphOffset;
        })
        .attr("cy", (d) => {
          console.log(phaseYScale(d.sum) - mini_margin.bottom);
          return phaseYScale(d.sum) - mini_margin.bottom;
        })
        .attr("r", 3);
        //.on("click", displayDetails);


      phase_g3 = p_mini.append("g");

      phase_g3.selectAll("circle")
        .data(filtered_fatal)
        .enter()
        .append("circle")
        .attr("class", "mini-fatal-injury")
        .attr("cx", (d) => {
          return phaseXScale(d.key) + mini_margin.left +mini_graphOffset;
        })
        .attr("cy", (d) => {
          return phaseYScale(d.sum) - mini_margin.bottom;
        })
        .attr("r", 3);
        //.on("click", displayDetails);

      /*var label_g = p_svg.append("g");
      label_g.append("text")
        .attr("class", "point-label")
        .attr("transform", "translate("+margin.left/8+"," + (height - margin.bottom/1.5)+")")
        .text("Total Uninjured:")
        .attr("fill", "#7eb338");*/
        //.on("mouseover", displayDetails);

      /*filtered_uninjured.forEach((d) => {
        console.log("index");
        label_g.append("text")
          .attr("class", "point-label")
          .attr("transform", "translate(" + (xScale(d.key) + margin.left + graphOffset) + "," + (height - margin.bottom/1.5) + ")")
          .text("(" + d.sum+")")
          .style("text-anchor", "middle")
          .on("mouseover", () => {
            var i = filtered_uninjured.indexOf(d);
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
      });*/

    });
}

/*function displayDetails(d, i) {
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
}*/

//This is separate because I wanted to call it in the filter function too
function drawPhaseGraph(addedStates) {

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

  d3.select(".mini-injured")
    .datum(filtered_injured)
    .transition()
    .duration(750)
    .attr('d', phase_line);
    

  d3.select(".mini-fatal")
    .datum(filtered_fatal)
    .transition()
    .duration(750)
    .attr('d', phase_line);
    

  //console.log()
  d3.selectAll(".mini-serious-injury")
    .data(filtered_injured)
    .transition()
    .duration(750)
    .attr("cy", (d) => {
      return phaseYScale(d.sum) - mini_margin.bottom;
    })

  d3.selectAll(".mini-fatal-injury")
    .data(filtered_fatal)
    .transition()
    .duration(750)
    .attr("cy", (d) => {
      //console.log("moving");
      console.log("mini: "+(phaseYScale(d.sum) - mini_margin.bottom));
      return phaseYScale(d.sum) - mini_margin.bottom;
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


/*
This is the section that controls the mini state graph to give users a preview
It's basically a copy of the selection.js class
*/

var s_mini = d3.select("#mini_state")
    .attr("width", mini_width + mini_margin.left + mini_margin.right)
    .attr("height", mini_height + mini_margin.top + mini_margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + mini_margin.left + "," + mini_margin.top + ")");

function createStateMini() {

//var x = d3.scale.ordinal().rangeRoundBands([width, 0], .05);
var stateXScale = d3.scaleBand().rangeRound([mini_width, 0], .05);

//var y = d3.scale.linear().range([height, 0]);
var stateYScale = d3.scaleLinear().range([mini_height, 0]);

/*var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");*/




d3.csv("aircraft_incidents.csv", function(error, data) {

  var states = {"AK" : {}, "AL" : {}, "AR" : {}, "AZ": {}, "CA" : {}, "CO" : {}, "CT" : {}, "DC" : {},
  "DE" : {},"FL" : {},"GA" : {}, "GU" : {}, "HI" : {},"IA" : {},"ID" : {},"IL" : {},"IN" : {},"KS" : {},
  "KY" : {},"LA" : {},"MA" : {},"MD" : {},"ME" : {},"MI" : {},"MN" : {},"MO" : {},"MS" : {},
  "MT" : {},"NC" : {},"ND" : {},"NE" : {},"NH" : {},"NJ" : {},"NM" : {},"NV" : {},"NY" : {},
  "OH" : {},"OK" : {},"OR" : {},"PA" : {},"RI" : {},"SC" : {},"SD" : {},"TN" : {},"TX" : {},
  "UT" : {},"VA" : {},"VT" : {},"WA" : {},"WI" : {},"WV" : {},"WY" : {}};

  var names = {"AL" : "Alabama", "AK" : "Alaska", "AZ" : "Arizona", "AR": "Arkansas", "CA" : "California", "CO" : "Colorado", "CT" : "Connecticut", "DC" : "District of Columbia",
  "DE" : "Delaware","FL" : "Florida","GA" : "Georgia", "GU" : "Guam", "HI" : "Hawaii","ID" : "Idaho","IL" : "Illinois","IN" : "Indiana","IA" : "Iowa","KS" : "Kansas",
  "KY" : "Kentucky","LA" : "Louisiana","ME" : "Maine","MD" : "Maryland","MA" : "Massachusetts","MI" : "Michigan","MN" : "Minnesota","MS" : "Mississippi","MO" : "Missouri",
  "MT" : "Montana","NE" : "Nebraska","NV" : "Nevada","NH" : "New Hampshire","NJ" : "New Jersey","NM" : "New Mexico","NY" : "New York","NC" : "North Carolina","ND" : "North Dakota",
  "OH" : "Ohio","OK" : "Oklahoma","OR" : "Oregon","PA" : "Pennsylvania","RI" : "Rhode Island","SC" : "South Carolina","SD" : "South Dakota","TN" : "Tennessee","TX" : "Texas",
  "UT" : "Utah","VT" : "Vermont","VA" : "Virginia","WA" : "Washington","WV" : "West Virginia","WI" : "Wisconsin","WY" : "Wyoming"};

  data.forEach(function(d) {
      var loc = d.Location;
      var abbr = loc.substring(loc.indexOf(",") + 2, loc.length);
      if(states[abbr] != null) {
        if(states[abbr]["fatalInjuries"] == null) {
          states[abbr]["fatalInjuries"] = 0;
        }
        states[abbr]["fatalInjuries"] += parseInt(d.Total_Fatal_Injuries);

        if(states[abbr]["seriousInjuries"] == null) {
          states[abbr]["seriousInjuries"] = 0;
        }
        states[abbr]["seriousInjuries"] += parseInt(d.Total_Serious_Injuries);

        if(states[abbr]["uninjured"] == null) {
          states[abbr]["uninjured"] = 0;
        }
        console.log(d.Total_Uninjured);
        if(d.Total_Uninjured != '') {
          states[abbr]["uninjured"] += parseInt(d.Total_Uninjured);
        }
      }
  });

  //console.log(states);
  var stateData = [], abbrData = [], seriousData = [], fatalData = [], uninjuredData = [];
  Object.keys(states).forEach(function(d) {
    //console.log(d);
    //console.log(states[d]);
    if(Object.keys(states[d]) != 0) {
      stateData.push(states[d]["fatalInjuries"] + states[d]["seriousInjuries"]);
      seriousData.push(states[d]["seriousInjuries"]);
      fatalData.push(states[d]["fatalInjuries"]);
      uninjuredData.push(states[d]["uninjured"]);
    } else {
      stateData.push(0);
      seriousData.push(0);
      fatalData.push(0);
      uninjuredData.push(0);
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
   updateBars(selectedStates);
});

  stateXScale.domain(Object.keys(states).reverse());
  stateYScale.domain([0, d3.max(abbrData, function(d, i) { 
    //if(d == "NY") {return 0;}
    return seriousData[i] + fatalData[i];
  })]);
  //y.domain([0,50]);

  // var s_svg = d3.select("#states-svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  // .append("g")
  //   .attr("transform", 
  //         "translate(" + margin.left + "," + margin.top + ")");

  var stateXAxisGroup = s_mini.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(xAxis)
      .call(d3.axisBottom(stateXScale))
    /*.selectAll("text")
      .style("text-anchor", "middle")
      //.attr("dx", "0.8em")
      .attr("dy", ".71em");
      //.attr("transform", "rotate(-90)" );*/

  var stateYAxisGroup = s_mini.append("g")
        .attr("class", "y axis")
        //.call(yAxis)
        .call(d3.axisLeft(stateYScale))
      /*.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
        //.text("Value ($)");*/

  var state_labels = s_mini.append("g");

      state_labels.append("text")
        .attr("class", "label")
        .text("Number of Injuries")
        .attr("transform", "translate(-40,"+mini_height/2+"), rotate(-90)")
        .style("text-anchor", "middle");

        state_labels.append("text")
        .attr("class", "label")
        .text("State")
        .attr("transform", "translate("+mini_width/2+",430)")
        .style("text-anchor", "middle");

        /*stae_labels.append("text")
        .text("Hover over a bar or label to view injury numbers")
        .attr("transform", "translate(490, 470)")
        .style("text-anchor", "middle");*/

  /*d3.select("#nyScaleButton")
    .on("click", function() {
      console.log(this.textContent);
      if(this.textContent == "Exclude NY from Scale") {
        y.domain([0, d3.max(abbrData, function(d, i) { 
          if(d == "NY") {return 0;}
          return seriousData[i] + fatalData[i];
        })]);
        $("#nyScaleButton").text("Include NY in Scale");
      } else if (this.textContent == "Include NY in Scale") {
        y.domain([0, d3.max(abbrData, function(d, i) { 
          return seriousData[i] + fatalData[i];
        })]);
        $("#nyScaleButton").text("Exclude NY from Scale");
      }
      
      yAxisGroup.call(d3.axisLeft(y));
      updateY();
    });*/

  /*function updateY() {
      d3.selectAll('.bar')
                .filter(function(d, i) {
                    return this.getAttribute("style") == "fill: mediumpurple;";
                })
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr('y', function(d,i) {
                    return y(seriousData[i]);
                })
                .attr("height", function(d, i) {
                  return height - y(seriousData[i]);
                });
         d3.selectAll('.bar')
                .filter(function(d, i) {
                    return this.getAttribute("style") == "fill: crimson;";
                })
                .transition()
                .duration(function(d) {
                    return 1000;
                })
                .delay(function(d) {
                    return 1;
                })
                .attr("y", function(d, i) {
                  return y(fatalData[i]) - (height - y(seriousData[i]));
                })
                .attr("height", function(d, i) {
                  return height - y(fatalData[i]);
                });
    }*/
    

  //creates the bars for serious injuries (on bottom)
  s_mini.selectAll("mini-bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'mini-bar')
      .style("fill", "mediumpurple")
      .attr("id", function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return 21+ (i * ((mini_width - 33) / 52));
      })
      .attr("width", function(d, i) {
        return 5;
      })
      .attr("y", function(d, i) {
        return stateYScale(seriousData[i]);
      })
      .attr("height", function(d, i) {
        return mini_height - stateYScale(seriousData[i]);
      })
      //.on("click", display);
      /*.on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);*/

     //creates bars for fatal injuries (on top of serious injury bars)
  s_mini.selectAll("mini-bar")
      .data(abbrData)
      .enter()
      .append("rect")
      .attr('class', 'mini-bar')
      .style("fill", function(d) {
        return "crimson";
      })
      .attr("id", function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return 21+(i * ((mini_width - 33) / 52));
      })
      .attr("width", function(d, i) {
        /*if(d == "NY") {return 20;}
        else {return 10;} */
        return 5;
      })
      .attr("y", function(d, i) {
        return stateYScale(fatalData[i]) - (mini_height - stateYScale(seriousData[i]));
      })
      .attr("height", function(d, i) {
        return mini_height - stateYScale(fatalData[i]);
      })
      //.on("click", display);
      /*.on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);*/

      //these two functions handle hovering over the bars/labels
      /*function handleMouseOver(d, i) {
          document.getElementById('currentState').textContent = names[d];
          document.getElementById('currentFatal').textContent = fatalData[abbrData.indexOf(d)];
          document.getElementById('currentSerious').textContent = seriousData[abbrData.indexOf(d)];
          document.getElementById('currentUninjured').textContent = uninjuredData[abbrData.indexOf(d)];
      }
      function handleMouseOut() {
          document.getElementById('currentState').textContent = '';
          document.getElementById('currentFatal').textContent = '';
          document.getElementById('currentSerious').textContent = '';
          document.getElementById('currentUninjured').textContent = '';
      }
      function display(d, i) {
          document.getElementById('currentState').textContent = names[d];
          document.getElementById('currentFatal').textContent = fatalData[abbrData.indexOf(d)];
          document.getElementById('currentSerious').textContent = seriousData[abbrData.indexOf(d)];
          document.getElementById('currentUninjured').textContent = uninjuredData[abbrData.indexOf(d)];
      }*/

  //console.log(d3.selectAll(".tick"));

  /*d3.selectAll(".tick")["_groups"][0].forEach(function(d1) {
    var data = d3.select(d1).data();
    //console.log(data);
    if(names[data[0]] == null) {return;}
    d3.select(d1)
      .on("mouseover", handleMouseOver)                  
      .on("mouseout", handleMouseOut)
  });*/

});
}
  //update which bars are visible based on selected states
  function updateMiniBars(selected) {
    selectedStates = selected;
    //console.log(selectedStates);
      //adds all selected states
      d3.selectAll('.mini-bar')
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
                .attr('width', function(d,i) {
                    //console.log(i);
                    /*if(d == "NY" && i > selectedStates.length / 2) {return 50;}
                    else {return 10;} */
                    return 5;
                });

         //removes all states that aren't currently selected
         d3.selectAll('.mini-bar')
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