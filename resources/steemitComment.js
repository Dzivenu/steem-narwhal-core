const pkg = require('../package.json');
const S = require('string');
const steem = require('steem');

// Private
function getPermalink(username, permalink) {
    return steem.formatter.commentPermlink(username, permalink);
}

function getMetaData() {
    var details = pkg.name + ':' + pkg.version;
    return JSON.stringify({app: details});
}

// Public
function SteemitComment(commentAuthor, commentBody, commentPermalink, commentTitle, commentPosted, commentParent, commentMetaData) {
    this.parent = commentParent;
    this.author = commentAuthor;
    this.body = commentBody;
    this.title = commentTitle;
    this.permalink = commentPermalink;
    this.created = commentPosted;
    this.metaData = commentMetaData;
    this.isGuess = false;
    this.responses = [];
}

SteemitComment.prototype.addChildResponse = function(comment) {
    this.responses.push(comment);
}

// Static function
SteemitComment.unmarshalComment = function(commentFromApi) {
    return new SteemitComment(
        commentFromApi.author,
        commentFromApi.body,
        commentFromApi.permlink,
        commentFromApi.title,
        commentFromApi.created
    );
}

// Static function
SteemitComment.createComment = function(parentComment, author, title, body) {
    return new SteemitComment(
        author,
        body,
        getPermalink(parentComment.author, parentComment.permalink),
        title,
        null,
        parentComment,
        getMetaData()
    );
}

module.exports = SteemitComment;