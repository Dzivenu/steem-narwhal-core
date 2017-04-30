const pkg = require('../package.json');
const S = require('string');
const steem = require('steem');

// Private
function getPermalink(title) {
    return steem.formatter.commentPermlink() + S(title).dasherize();
}

function getMetaData() {
    return JSON.stringify({app: '${pkg.name}/${pkg.version}'});
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
    this.responses = [];
}

SteemitComment.prototype.addChildResponse = function(comment) {
    this.responses.push(comment);
}

module.exports = SteemitComment;