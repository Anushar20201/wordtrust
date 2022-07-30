const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

//defining the relationships among User, Post and Comment models
User.hasMany(Post, {
    foreignKey: 'userId'
})

User.hasMany(Comment, {
    foreignKey: 'userId'
})

Post.belongsTo(User, {
    foreignKey: 'userId'
})

Post.hasMany(Comment, {
    foreignKey: 'userId'
})

Comment.belongsTo(User, {
    foreignKey: 'userId'
})

Comment.belongsTo(Post, {
    foreignKey: 'userId'
})


module.exports = {
    User,
    Post,
    Comment
};