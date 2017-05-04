const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

var isValidPath = (pathToFile) => {
    if(pathToFile == undefined || pathToFile === '') {
        return Promise.reject(TypeError("A document, and it's path, must be provided."));
    }
    return Promise.resolve(true);
};

var doesExist = (pathToFile) => {

    return isValidPath(pathToFile)
    .then(() => {
        return fs.statAsync(pathToFile)
    })
    .then(() => {
        return Promise.resolve(true)
    })
    .error(() => {
        return Promise.reject(Error(pathToFile + " does not exist."));
    });
};

var isFile = (pathToFile) => {
    return isValidPath(pathToFile)
    .then(() => {
        return fs.statAsync(pathToFile)
    })
    .then((stats) => {
        return Promise.resolve(stats.isFile());
    })
    .error(() => {
        return Promise.reject(Error(pathToFile + " does not exist."));
    });
};

var readIntoBufferIfExists = (pathToFile) => {
    return doesExist(pathToFile)
    .then(() => {
        return Promise.resolve(fs.readFileAsync(pathToFile));
    });
};

var writeBufferToFile = (buffer, pathToDestinationFile) => {
    if(buffer == undefined || ! (buffer instanceof Buffer)) {
        return Promise.reject(TypeError("A buffer containing the document to be written must be provided."));
    }

    var parentDir;
    return isValidPath(pathToDestinationFile)
    .then(() => {
        parentDir = path.dirname(pathToDestinationFile);
        return doesExist(parentDir);
    })
    .then(() => {
        return fs.writeFileAsync(pathToDestinationFile, buffer);
    })
    .then( () => {
        return Promise.resolve(pathToDestinationFile);
    });
};

var deleteLocalFile = (pathToFile) => {
    return isFile(pathToFile)
    .then(() => {
        return Promise.resolve(fs.unlinkAsync(pathToFile));
    });
};

var createPath = (directoryPath, fileName) => {
    return path.join(path.resolve(directoryPath), fileName);
};

module.exports = {
    doesExist: doesExist,
    readIfExists: readIntoBufferIfExists,
    writeToFile: writeBufferToFile,
    deleteFile: deleteLocalFile,
    createPath: createPath
}