const listen = require('../consume/comments.js');
const respond = require('../produce/comment.js');
const Outcomes = require('../resources/outcomes.js');
const PoisonPill = require('../resources/outcomes.js');
const checkResponses = require('./checkResponses.js');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

var start = function() {

    var isRunning = true;
    var outcomes;

    Promise.join(
        fs.readFileAsync('./test/resources/outcomes/outcomes1.json'),
        fs.readFileAsync('./test/resources/config/post1.json')
    )
    .then( (data, config) => {
        outcomes = Outcomes.marshalOutcomes(data);
        return JSON.parse(config);
    })
    .then(config) {
        // Main loop
        while(isRunning) {
            listen.retrieveNewComments(config.author, config.permalink)
            .then( (newComments) => {
                // Decide what actions need to be performed based on the comments
            })
            .then( (actions) => {
                var actionPromises = [];

                actions.forEach( (action) => {
                    if(action instanceof PoisonPill) {
                        console.log("Received Poison Pill");
                        isRunning = false;
                    }

                    // Create action promises
                });

                return Promise.all(actionPromises);
            })
            .then( () => {

            });
        }
    }
}


module.exports = {
    start: start
};