const fileUtils = require('../../dao/utils.js');
const path = require('path');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const assert = require('chai').assert;

chai.use(chaiAsPromised);
chai.should();

const SteemitComment = require('../../resources/steemitComment.js');
const Configuration = require('../../resources/configuration.js');
const responsesDao = require('../../dao/responses.js');

const TEST_STORAGE_DIR = './test/resources/storage/';
const TEST_FILE_NAME = 'test-post-1.json';

/*
describe('tests to make sure that the writing of a file works correctly', () => {

})

describe('tests to make sure that reading of a file works correctly', () => {

})
*/

describe('end-to-end tests', () => {

    var comments = [];
    var comment1 = new SteemitComment(
                               'testAuthor',
                               'testBody',
                               'testPermalink',
                               'testTitle',
                               new Date(),
                               new SteemitComment(),
                               'testMetaData'
                           );

    before('create comments', () => {
        comments.push(comment1);
    })

    it('should be possible to store comments and retrieve them - and the data should be the same', () => {

        return new Configuration('./test/resources/config/bootstrap.json')
        .then( (config) => {
            return responsesDao.storeComments(config, TEST_FILE_NAME, comments);
        })
        .then( (pathToWrittenFile) => {
            assert.isNotNull(pathToWrittenFile);
            return responsesDao.retrieveComments(pathToWrittenFile);
        })
        .then( (returnedComments) => {
            assert.isNotNull(returnedComments);
            assert.isTrue(returnedComments instanceof Array);
            assert.equal(1, returnedComments.length);
            var comment = comments[0];
            assert.equal(comment1.author, comment.author);
            assert.equal(comment1.body, comment.body);
            assert.equal(comment1.title, comment.title);
            assert.equal(comment1.permalink, comment.permalink);
            assert.equal(comment1.created, comment.created);
            assert.equal(comment1.metaData, comment.metaData);
            assert.equal(comment1.isGuess, comment.isGuess);
            assert.equal(comment1.responses.length, comment.responses.length);

            return Promise.resolve();
        })
        .should.be.fulfilled;
    })

    after('remove the temp file', () => {
        return fileUtils.deleteFile(fileUtils.createPath(TEST_STORAGE_DIR, TEST_FILE_NAME));
    })
})