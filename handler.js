'use strict';

const axios = require('axios');
const _ = require('lodash');
const slackWebHook = process.env.SLACKWEBHOOK;
const amicaJSON = process.env.AMICAJSON;
const channel = process.env.CHANNEL;

module.exports.run = (event, context) => {
  console.log("launching scheduled GET request");
  axios.get(amicaJSON)
    .then(function(response) {
      return iterateDayMenu(response.data.MenusForDays);
    })
    .then(function(response){
      // Sending to Slack
      const slackMsg = {
        "channel": "#"+channel,
        "username": "Amicabot",
        "icon_emoji": ":female-cook:",
        "text": "*Amicassa tarjolla <http://www.amica.fi/ibm/|tänään>* ```"+constructText(response)+"```"
      }
      axios.post(slackWebHook, JSON.stringify(slackMsg));
    })
    .catch(function (error) {
      console.log(error);
      const slackMsg = {
        "channel": "#"+channel,
        "username": "Amicabot",
        "icon_emoji": ":female-cook:",
        "text": error
      }
      axios.post(slackWebHook, JSON.stringify(slackMsg));
    });
};

function iterateDayMenu(weeklyMenu){
  return new Promise(function (resolve, reject) {
    var today = new Date().toISOString().split('T')[0]; // getting this date
    
    // lets get through the whole list
    weeklyMenu.forEach(dayMenu => {
      // at first convert the date format
      var currentDay = dayMenu.Date.split('T')[0];
      // find the correct day from the list
      if (_.isEqual(currentDay,today)){
        console.log("returning "+currentDay+" menu.");
        if ( !_.isEmpty(dayMenu.SetMenus) ){
          resolve(dayMenu);
        }       
      };  
    });
    reject("No lunch today!");
  });
}

const constructText = function(message) {
  console.log("constructText");
  const template =
  `<% _.forEach(message.SetMenus, function(menu) { %><%= menu.Name %>
  <% _.forEach(menu.Components, function(component) { %><%= component %>
  <% }); %>
  <% }); %>Avoinna: <%= message.LunchTime %>`;

  var compiled = _.template(template);
  const description = compiled({ 'message': message });
  console.log(description);
  return description;
}