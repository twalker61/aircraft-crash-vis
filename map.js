var selectedStates;

function create () {
  
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

  var sorted = Object.keys(names).sort(); 

  selectedStates = [];
  for(i = 0; i < Object.keys(states).length; i++) {
    //adds 2 abbreviations per state (one per bar color)
    selectedStates[i*2] = Object.keys(states)[i];
    selectedStates[(i*2)+1] = Object.keys(states)[i];
  }
  //console.log(selectedStates);

  console.log("Map");
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
  
              //adds/removes state from the selected array (does it twice bc there are 2 bars)
              if(selectedStates.includes(currAbbr)) {
              	selectedStates.splice(selectedStates.indexOf(currAbbr), 1);
              	selectedStates.splice(selectedStates.indexOf(currAbbr), 1);
              } else {
              	selectedStates.push(currAbbr);
              	selectedStates.push(currAbbr);
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
              console.log(selectedStates);
              $.getScript("./selection.js", function(response, status) {
                //console.log("Before");
                try {
                  updateBars(selectedStates);
                } catch(error) {
                  console.log(error);
                }
              });
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
              $.getScript("selection.js", () => {
                //console.log("Before");
                updateBars(selectedStates);
              });
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