const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    User,
    Post,
    Comment
} = require('../models');


router.get('/', (req, res) => {
    Post.findAll({
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
            //rendering homepage handlers here
            res.render('homepage', {
                posts,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/post/:id', (req, res) => {
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
                    message: 'Sorry, post not found'
                });
                return;
            }

            const post = data.get({
                plain: true
            });

            res.render('single-post', {
                post,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});



module.exports = router;