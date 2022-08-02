const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    Post,
    User,
    Comment
} = require('../models');
const withAuth = require('../utils/auth');


router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            userId: req.session.userId
        },
        attributes: [
            'id',
            'title',
            'content',
            'createdOn'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'commentLine', 'postId', 'userId', 'createdOn'],
            include: {
                model: User,
                attributes: ['userName']
            }
        },
        {
            model: User,
            attributes: ['userName']
        }
        ]
    })
        .then(data => {
            const posts = data.map(post => post.get({
                plain: true
            }));
            res.render('dashboard', {
                posts,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'createdOn'
        ],
        include: [{
            model: Comment,
            attributes: ['id', 'commentLine', 'postId', 'userId', 'createdOn'],
            include: {
                model: User,
                attributes: ['userName']
            }
        },
        {
            model: User,
            attributes: ['userName']
        }
        ]
    })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    message: 'Sorry, not found'
                });
                return;
            }

            const post = data.get({
                plain: true
            });

            res.render('edit-post', {
                post,
                loggedIn: true
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/new', (req, res) => {
    res.render('add-post', {
        loggedIn: true
    })
})

module.exports = router;