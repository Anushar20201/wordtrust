const router = require('express').Router();
const {
    User,
    Post,
    Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


//Getting all existing comments
router.get("/", (req, res) => {
    Comment.findAll()
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Creating a new comment
router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
                commentText: req.body.commentText,
                postId: req.body.postId,
                userId: req.session.userId
            })
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});


module.exports = router;