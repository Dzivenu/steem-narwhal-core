const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const assert = require('chai').assert;

const testUser1 = "yamadapc";
const testPostWithOneCommentPermalink = "test-1-2-3-4-5-6-7-9";

const testUserWithLotsOfResponses = "lantto";
const testPostWithLotsOfResponsesPermalink = "steem-api-explorer";

const comments = require("../../listen/comments.js");

describe('Input argument validation tests', () => {
    it('should not be possible to call the generateCommentTree function with no parameters', () => {
      return comments.generateCommentTree().should.be.rejectedWith(TypeError);
    });

    it('should not be possible to call the generateCommentTree function with a blank username', () => {
      return comments.generateCommentTree(' ').should.be.rejectedWith(TypeError);
    });

    it('should not be possible to call the generateCommentTree function with an null permalink', () => {
      return comments.generateCommentTree(testUser1).should.be.rejectedWith(TypeError);
    });

    it('should not be possible to call the generateCommentTree function with a blank permalink', () => {
      return comments.generateCommentTree(testUser1, '   ').should.be.rejectedWith(TypeError);
    });
});

describe('Retrieving all of the comments for a post', () => {

    it('should be possible to retrieve a single comments for a known post - with only one comment', () => {
        return comments.generateCommentTree(testUser1, testPostWithOneCommentPermalink)
        .then( (comments) => {
            assert.isNotNull(comments, "Expected there to be a comments returned");
            var comment = comments[0];
            assert.isNotNull(comment, "Expected the first comment returned.");
            assert.equal('moodledidoodledi', comment.author);
        })
        .should.be.fulfilled;
    });

    it('should be possible to retrieve all of the comments for a known post - which has multiple comments', () => {
        return comments.generateCommentTree(testUserWithLotsOfResponses, testPostWithLotsOfResponsesPermalink)
        .then( (comments) => {
            console.log(comments);
            assert.isNotNull(comments, "Expected there to be a comments returned.");
            assert.equal(12, comments.length, "Expected that the post would have had 12 top-level comments.");
            var comment = comments[0];
            assert.isNotNull(comment, "Expected the first comment returned.");
            assert.equal('tom-ray', comment.author);
            assert.equal(1, comment.responses.length, "Expected the first comment to have a single response.");
            var responseToComment = comment.responses[0];
            assert.equal('lantto', responseToComment.author, "Expected the first comment's response's details to be correct.");
            assert.equal('Thank you!', responseToComment.body, "Expected the first comment's response's details to be correct.");
        })
        .should.be.fulfilled;
    });
});
