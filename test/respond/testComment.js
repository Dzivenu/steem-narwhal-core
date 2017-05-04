const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const assert = require('chai').assert;

const respond = require("../../produce/comment.js");
const listen = require("../../consume/comments.js");
const SteemitComment = require('../../resources/steemitComment.js');

const testUser = "guest123";
const testOriginalPostWithComments = "daft-punk-random-access-memories";

const TOGGLE_ON = false;

describe('Input argument validation tests', () => {

    var parentComment;

    before('Retrieve the parent comment', () => {
        return listen.generateCommentTree(testUser, testOriginalPostWithComments)
            .then( (comments) => {
                assert.equal(2, comments.length, "Expected the post to have two top-level comments.");
                var comment = comments[1];
                assert.equal('simonjay', comment.author);
                assert.equal('I like daft punk upvoted.', comment.body);
                assert.equal(1, comment.responses.length);
                parentComment = comment.responses[0];
                Promise.resolve();
            }).should.be.fulfilled
    });

    it('should possible to post a response to an existing comment', () => {
        var commentToPost = SteemitComment.createComment(
            parentComment,
            testUser,
            'Hi',
            'Test 2'
        );
        if(TOGGLE_ON) {
            return Promise.resolve(respond.postComment(commentToPost))
            .should.be.fulfilled;
        }
    });

    it('should not be possible to post a response to an existing comment straight after having posted', () => {
        var commentToPost = SteemitComment.createComment(
            parentComment,
            testUser,
            'Hi',
            'Test 3'
        );
        if(TOGGLE_ON) {
            return Promise.resolve(respond.postComment(commentToPost))
            .should.be.rejected;
        }
    });


});