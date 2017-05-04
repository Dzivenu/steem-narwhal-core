const fileUtils = require('./utils.js');

var retrievePreviouslySeenComments = function (configuration, fileName) {
    var pathToFile;

    if(fileName == undefined) {
        pathToFile = configuration;
    } else {
        pathToFile = fileUtils.createPath(configuration.storagePath, fileName);
    }

    return fileUtils.readIfExists(pathToFile)
    .then( (data) => {
        return Promise.resolve(JSON.parse(data));
    });
}

var storeComments = function(configuration, fileName, comments) {
    if(comments == undefined) {
        // NOOP
        Promise.resolve();
    }
    var pathToFile = fileUtils.createPath(configuration.storagePath, fileName);
    return fileUtils.writeToFile(new Buffer(JSON.stringify(comments)), pathToFile);
}

module.exports = {
    retrieveComments: retrievePreviouslySeenComments,
    storeComments: storeComments
}