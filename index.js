const engine = require('./engine/main.js');

var queue = [];
var lastCommentTime;
var responsesMade;

var getFirstAction = function(actionQueue) {
    if(actionQueue.length)
}

var start = function() {
    var isRunning = true;

    while(isRunning) {

        // No action to process - go and retrieve new ones
        if(queue.length === 0) {

        } else {
            var action = queue.pop();

        }

    }
}

module.exports = {
    start: start
};