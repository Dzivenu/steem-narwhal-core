const Outcomes = require('../../resources/outcomes.js');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));

const assert = require('chai').assert;

describe('Verify marshalling outcome data from a file', () => {

    it('should possible to read outcomes from a file and marshal them to outcome objects', () => {
        return fs.readFileAsync('./test/resources/outcomes/outcomes1.json')
        .then( (data) => {
            var outcomes = Outcomes.marshalOutcomes(data);
            assert.isNotNull(outcomes, "Expected that the file would contain outcomes.");
            assert.equal(2, outcomes.length, "Expected that there would be two outcomes in the file.");
            var goodOutcome = outcomes[0];
            assert.isNotNull(goodOutcome, "Expected that the file would contain a goodOutcome.");
            assert.equal(true, goodOutcome.isPositiveOutcome, "Expected that the good Outcome would be flagged as just that.");
            assert.equal("A", goodOutcome.xCoordinate, "Expected that the X coordinate was correctly parsed.");
            assert.equal("1", goodOutcome.yCoordinate, "Expected that the Y coordinate was correctly parsed.");
            var badOutcome = outcomes[1];
            assert.isNotNull(badOutcome, "Expected that the file would contain a badOutcome.");
            assert.equal(false, badOutcome.isPositiveOutcome, "Expected that the bad Outcome would be flagged as just that.");
            assert.equal("B", badOutcome.xCoordinate, "Expected that the X coordinate was correctly parsed.");
            assert.equal("2", badOutcome.yCoordinate, "Expected that the Y coordinate was correctly parsed.");
        });
    });

});