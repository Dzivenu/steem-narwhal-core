const fileUtils = require('../../dao/utils.js');
const path = require('path');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = require('chai').assert;

chai.use(chaiAsPromised);
chai.should();

const INVALID_PATH_ERROR_REGEX = /A document/;
const NON_BUFFER_ERROR_REGEX = /A buffer/;
const DOES_NOT_EXIST_ERROR_REGEX = /does not exist/;

const DIRECTORY_THAT_DOES_NOT_EXIST = './foo/bar';
const FILE_PATH_THAT_DOES_NOT_EXIST = './foo/bar/doesNotExist.txt';

const DIRECTORY_THAT_DOES_EXIST = './test/resources/storage/';
const FILE_PATH_THAT_DOES_EXIST = './test/resources/storage/test_plaintext_1.txt';
const TEXT_FILE_PATH_THAT_DOES_EXIST = './test/resources/storage/test_plaintext_1.txt';
const JSON_FILE_PATH_THAT_DOES_EXIST = './test/resources/config/test_metadata_1.json';
const TEST_TEXT = 'The quick brown fox jumps over the lazy dog';

describe('Input argument validation tests', () => {

    describe('doesExist function tests', () => {
        it('should be true that calling the doesExist function with an empty path is handled properly', () => {
            return fileUtils.doesExist().should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });

        it('should be true that calling the doesExist function with a blank path is handled properly', () => {
            return fileUtils.doesExist('').should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });

    });

    describe('readIfExists function tests', () => {
        it('should be true that calling the readIfExists function with an empty path is handled properly', () => {
            return fileUtils.readIfExists().should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });

        it('should be true that calling the readIfExists function with a blank path is handled properly', () => {
            return fileUtils.readIfExists('').should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });
    });

    describe('writeBufferToFile function tests', () => {
        it('should be true that calling the writeBufferToFile function with an empty buffer is handled properly', () => {
            return fileUtils.writeToFile().should.be.rejectedWith(TypeError, NON_BUFFER_ERROR_REGEX);
        });

        it('should be true that calling the writeBufferToFile function with a non-Buffer, parameter is handled properly', () => {
            return fileUtils.writeToFile('').should.be.rejectedWith(TypeError, NON_BUFFER_ERROR_REGEX);
        });

        it('should be true that calling the writeBufferToFile function with an empty path is is handled properly', () => {
            return fileUtils.writeToFile(Buffer('')).should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });

        it('should be true that calling the writeBufferToFile function with a blank path is is handled properly', () => {
            return fileUtils.writeToFile(Buffer(''), '').should.be.rejectedWith(TypeError, INVALID_PATH_ERROR_REGEX);
        });
    });
});

describe('Correct behaviour validation tests', () => {
    const newFileToWrite = DIRECTORY_THAT_DOES_EXIST + 'temp_file_1.txt';

    describe('doesExist function tests', () => {
        it('should be true that calling the doesExist function with an incorrect path is properly identified', () => {
            return fileUtils.doesExist(FILE_PATH_THAT_DOES_NOT_EXIST).should.be.rejectedWith(Error, DOES_NOT_EXIST_ERROR_REGEX);
        });

        it('should be true that calling the doesExist function with an correct path is properly identified', () => {
            return fileUtils.doesExist(FILE_PATH_THAT_DOES_EXIST).should.eventually.equal(true);
        });
    });

    describe('readIfExists function tests', () => {
        it('should be true that calling the readIfExists function with an incorrect path is properly identified', () => {
            return fileUtils.readIfExists(FILE_PATH_THAT_DOES_NOT_EXIST).should.be.rejectedWith(Error, DOES_NOT_EXIST_ERROR_REGEX);
        });

        it('should be true that calling the readIfExists function with an correct path is properly identified', () => {
            return fileUtils.readIfExists(FILE_PATH_THAT_DOES_EXIST).should.be.fulfilled;
        });

        it('should be true that calling the readIfExists function on an existing plaintext file returns a buffer containing the expected data', () => {
            return fileUtils.readIfExists(TEXT_FILE_PATH_THAT_DOES_EXIST)
            .then( (buffer) => {
                assert.equal(TEST_TEXT, buffer.toString());
                return Promise.resolve();
            })
            .should.be.fulfilled;
        });

    });

    describe('writeBufferToFile function tests', () => {
        it('should be true that calling the writeBufferToFile function with an incorrect path is properly identified', () => {
            return fileUtils.writeToFile(Buffer(''), './foo/bar/test.txt').should.be.rejectedWith(Error, DOES_NOT_EXIST_ERROR_REGEX);
        });

        it('should be true that calling the writeBufferToFile function with an correct path results in the data being written', () => {
            return fileUtils.writeToFile(Buffer('Hello World!'), newFileToWrite).should.be.fulfilled;
        });
    });

    describe('deleteLocalFile function tests', () => {
        it('should be true that calling the deleteLocalFile function with an incorrect path is properly identified', () => {
            return fileUtils.deleteFile('./foo/bar/test.txt').should.be.rejectedWith(Error, DOES_NOT_EXIST_ERROR_REGEX);
        });

        it('should be true that calling the deleteLocalFile function results in the file being deleted', () => {
            return fileUtils.deleteFile(newFileToWrite).should.be.fulfilled;
        });
    });

    describe('createPath function tests', () => {
        const expectedOutput = path.resolve('./abc/def/ghi.txt');
        const directoryPath = './abc/def';
        const fileName = 'ghi.txt';

        it('should be possible to create a path from a directory and a file name', () => {
            assert.equal(
                expectedOutput,
                fileUtils.createPath(directoryPath, fileName),
                "Expected that the resulting path would be correctly formed"
            );
        })

    });
});