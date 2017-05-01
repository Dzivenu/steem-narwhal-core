const S = require('string');

// Public
function Outcome(x, y, isPositive, outcome) {
    this.xCoordinate = x;
    this.yCoordinate = y;
    this.isPositiveOutcome = isPositive;
    this.outcomeMessage = outcome;
}


Outcome.marshalOutcomes = function(data) {
    if(S(data).isEmpty()) {
        throw new TypeError("Unable to marshal empty or blank data");
    }

    var outcomeList = JSON.parse(data);

    var outcomes = [];

    outcomeList.forEach( (outcome) => {
        var tmpOutcome = new Outcome(outcome.x, outcome.y, outcome.isPositive, outcome.message);
        outcomes.push(tmpOutcome);
    });

    return outcomes;
}

module.exports = Outcome;