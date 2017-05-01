const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const assert = require('chai').assert;

const respond = require("../../respond/comment.js");
const listen = require("../../listen/comments.js");
const SteemitComment = require('../../resources/steemitComment.js');

const testUser = "guest123";
const testOriginalPostWithComments = "daft-punk-random-access-memories";
const testResponseToContinueRespondingTo = "re-simonjay-re-guest123-daft-punk-random-access-memories-20170430t200800108z";



const TOGGLE_ON = false;

describe('Input argument validation tests', () => {

    it('should possible to post a response to an existing comment', () => {
        if(TOGGLE_ON) {
            return listen.generateCommentTree(testUser, testOriginalPostWithComments)
            .then( (comments) => {
                assert.equal(2, comments.length, "Expected the post to have two top-level comments.");
                var comment = comments[1];
                assert.equal('simonjay', comment.author);
                assert.equal('I like daft punk upvoted.', comment.body);
                assert.equal(1, comment.responses.length);
                return comment.responses[0];
            })
            .then( (parentComment) => {
                var commentToPost = SteemitComment.createComment(
                    parentComment,
                    testUser,
                    'Hi',
                    'Glad to hear it ^_^'
                );
                return Promise.resolve(respond.postComment(commentToPost));
            })
            .should.be.fulfilled;
        }
    });

});