const router = require('express').Router();
const {
    User,
    Post,
    Comment
} = require('../../models');
const withAuth = require('../../utils/auth');


// Getting all posts
router.get("/", (req, res) => {
    Post.findAll({
        attributes: ["id", "content", "title", "createdOn"],
        include: [{
            model: User,
            attributes: ["userName"],
        },
        {
            model: Comment,
            attributes: ["id", "commentText", "postId", "userId", "createdOn"],
            include: {
                model: User,
                attributes: ["userName"],
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

// Getting a single post
router.get("/:id", (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "content", "title", "createdOn"],
        include: [{
            model: User,
            attributes: ["userName"],
        },
        {
            model: Comment,
            attributes: ["id", "commentLine", "postId", "userId", "createdOn"],
            include: {
                model: User,
                attributes: ["userName"],
            },
        },
        ],
    })
        .then((data) => {
            if (!data) {
                res.status(404).json({
                    message: "No post found with this id"
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

// Creating a post
router.post("/", withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.post_content,
        userId: req.session.userId
    })
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Updating a post
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
            if (!data) {
                res.status(404).json({
                    message: "Not found"
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

//Deleting a post
router.delete("/:id", withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((data) => {
            if (!data) {
                res.status(404).json({
                    message: "Not found"
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