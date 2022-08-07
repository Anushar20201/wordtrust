const router = require('express').Router();
const {
    User,
    Post,
    Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


//Get all comments
router.get("/", (req, res) => {
    Comment.findAll()
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Create a comment
router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
            commentLine: req.body.commentLine,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        })
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});


module.exports = router;