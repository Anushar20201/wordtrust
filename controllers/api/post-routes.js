const router = require('express').Router();
const {
    User,
    Post,
    Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


//Getting all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "content", "title", "created_at"],
        order: [
            ["created_at", "DESC"]
        ],
        include: [{
            model: User,
            attributes: ["username"],
        },
        {
            model: Comment,
            attributes: ["id", "commentLine", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"],
            },
        },
        ],
    })
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Getting a single post
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "content", "title", "created_at"],
        include: [{
            model: User,
            attributes: ["username"],
        },
        {
            model: Comment,
            attributes: ["id", "commentLine", "post_id", "user_id", "created_at"],
            include: {
                model: User,
                attributes: ["username"],
            },
        },
        ],
    })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create a new post
router.post("/", withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.post_content,
        user_id: req.session.user_id
    })
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Update a post based on id
router.put("/:id", withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        content: req.body.post_content,
    }, {
        where: {
            id: req.params.id,
        },
    })
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Deleting a post based on id
router.delete("/:id", withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((data) => {
            if (!data) {
                res.status(404).json({
                    message: 'Not found'
                });
                return;
            }
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;