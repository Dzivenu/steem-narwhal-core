const constants = require("../resources/constants.js");
const S = require('string');
const steem = require('steem');
const SteemitComment = require('../resources/steemitComment.js');

const DEFAULT_COMMENT_DEPTH = 2;

var isOwnResponse = function(comment) {
    // If it's one of the bot's own comments then skip it - we don't want to respond to that
    if(comment.author === constants.SELF_USERNAME) {
        return true;
    }
    return false;
}

var haveResponded = function(comment) {

    if(comment.responses.length === 0) {
        return false;
    }

    var hasCommentBeenRespondedTo = false;

    comment.responses.forEach( (response) => {
        if(isOwnResponse(response)) {
            hasCommentBeenRespondedTo = true;
        }
    });

    return hasCommentBeenRespondedTo;
}

var unmarshalComment = function(commentFromApi) {
    return new SteemitComment(
        commentFromApi.author,
        commentFromApi.body,
        commentFromApi.permlink,
        commentFromApi.title,
        commentFromApi.created
    );
}

/**
 * Recursive function to walk the tree of comments for a post.
 * The steemd API function getContentRepliesAsync only returns a shallow list of comments and we want to retrieve the
 * responses to the comments to ensure that we only respond once per comment.
**/
var walkCommentTree = function(username, permalink, maxDepth, parentComment) {

    return steem.api.getContentRepliesAsync(username, permalink)
    .then( ( comments ) => {
        var promises = [];

        comments.forEach( (comment) => {
            var currentComment = unmarshalComment(comment);
            parentComment.addChildResponse(currentComment);
            if(comment.depth !== maxDepth || comment.children !== 0) {
                var tmpPromise = walkCommentTree(comment.author, comment.permlink, maxDepth, currentComment);
                promises.push(tmpPromise);
            }
        });

        return Promise.all(promises);
    });
}

var generateCommentTree = function(username, permalink, depth) {
    if(S(username).isEmpty()) {
        return Promise.reject(TypeError("The username parameter must not be blank / empty"));
    }

    if(S(permalink).isEmpty()) {
        return Promise.reject(TypeError("The permalink parameter must not be blank / empty"));
    }

    if(depth == undefined || ! depth.isInteger()) {
        depth = DEFAULT_COMMENT_DEPTH;
    }

    var dummyComment = new SteemitComment();

    return walkCommentTree(username, permalink, depth, dummyComment)
        .then(() => {
            return Promise.resolve(dummyComment.responses);
        });
}

var retrieveCommentsBotHasNotRespondedTo = function(username, permalink) {
    return generateCommentTree(username, permalink)
    .then( (comments) => {
        var unrespondedComments = [];
        comments.forEach( (comment) => {
            if(! haveResponded(comment)) {
                unrespondedComments.push(comment);
            }
        });
        return Promise.resolve(unrespondedComments);
    });
}

module.exports = {
    generateCommentTree: generateCommentTree,
    retrieveNewComments: retrieveCommentsBotHasNotRespondedTo
}