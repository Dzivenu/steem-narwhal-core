const steem = require('steem');
const constants = require('../resources/constants.js');
const steemitComment = require('../resources/steemitComment.js');

const commiserations = [
    "That's not the correct answer. Thanks for playing - better luck next time!",
    "Oh no, the ground there wasn't sturdy and collapsed into a big Sinkhole 🕳️☠️. Better luck next time!",
    "Bad luck - whilst digging you hit rock and your Pickaxe broke ⛏🙁️"
];

const congratulations = [
    "That's correct; you found some treasure 💎. Well done!"
];

const admonishment = [
    "I'm afraid that you can only enter once per "
];



var postSteemitComment = function(comment) {

    if(comment == undefined || ! (comment instanceof steemitComment)) {
        return Promise.reject(TypeError("The comment must not be null and must be a SteemitComment object."));
    }

    return steem.broadcast.commentAsync(
            constants.POSTING_WIF,
            comment.parent.author,
            comment.parent.permalink,
            constants.SELF_USERNAME,
            comment.permalink,
            comment.title,
            comment.body,
            comment.metaData
        );
}


var postSteemitCommentForSuccessfulGuess = function(steemitComment) {

}

var postSteemitCommentForUnsuccessfulGuess = function(steemitComment) {

}

module.exports = {
    postSuccessfulComment: postSteemitCommentForSuccessfulGuess,
    postUnsuccessfulComment: postSteemitCommentForUnsuccessfulGuess,
    postComment: postSteemitComment
}