const engine = require('./engine/main.js');

var run = function() {
    engine.start();
}

module.exports = {
    run: run
};