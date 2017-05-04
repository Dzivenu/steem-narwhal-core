const fileUtils = require('../dao/utils.js');

function Configuration(bootstrapFile) {
    this.configPath;
    this.outcomesPath;
    this.storagePath;

    let jsonData;

    return fileUtils.readIfExists(bootstrapFile)
    .then( (bootstrapData) => {
        return JSON.parse(bootstrapData);
    })
    .then( (json) => {
        jsonData = json;
        return fileUtils.doesExist(jsonData.config_location);
    })
    .then( () => {
        this.configPath = jsonData.config_location;
        return fileUtils.doesExist(jsonData.outcomes_location);
    })
    .then( () => {
        this.outcomesPath = jsonData.outcomes_location;
        return fileUtils.doesExist(jsonData.storage_location);
    })
    .then ( () => {
        this.storagePath = jsonData.storage_location;
        jsonData = null;
        return Promise.resolve(this);
    })
    .catch( (err) => {
        console.log(err);
        return Promise.reject(Error("Unable to load the configurations due to the error " + err));
    })
}

module.exports = Configuration;