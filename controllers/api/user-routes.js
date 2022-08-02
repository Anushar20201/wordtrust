const router = require('express').Router();
const {
    User,
    Post,
    Comment
} = require('../../models');

// Get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {
            exclude: ['password']
        }
    })
        .then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Getting specific user with id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: {
            exclude: ['password']
        },
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: ['id', 'title', 'content', 'createdOn']
        },
        {
            model: Comment,
            attributes: ['id', 'commentLine', 'createdOn'],
            include: {
                model: Post,
                attributes: ['title']
            }
        }
        ]
    })
        .then(data => {
            if (!data) {
                res.status(404).json({
                    message: 'Sorry, not found any'
                });
                return;
            }
            res.json(data);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Creating a new user
router.post('/', (req, res) => {
    User.create({
        userName: req.body.userName,
        password: req.body.password
    })
        .then(data => {
            req.session.save(() => {
                req.session.userId = data.id;
                req.session.userName = data.userName;
                req.session.loggedIn = true;

                res.json(data);
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            userName: req.body.userName
        }
    })
        .then(data => {
            if (!data) {
                res.status(400).json({
                    message: 'Not found'
                });
                return;
            }

            req.session.save(() => {
                req.session.userId = data.id;
                req.session.userName = data.userName;
                req.session.loggedIn = true;

                res.json({
                    user: data,
                    message: 'Successfully logged in'
                });
            });

            const validPassword = data.checkPassword(req.body.password);

            if (!validPassword) {
                res.status(400).json({
                    message: 'Entered Wrong password'
                });
                return;
            }

            req.session.save(() => {
                req.session.userId = data.id;
                req.session.userName = data.userName;
                req.session.loggedIn = true;

                res.json({
                    user: data,
                    message: 'Successfully logged in!!'
                });
            });
        });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }

});

module.exports = router;