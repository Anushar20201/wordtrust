const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

//directing to apiRoutes
router.use('/api', apiRoutes);
//directing to dashboardRoutes
router.use('/dashboard', dashboardRoutes);
//directing to homeRoutes
router.use('/', homeRoutes);


router.use((req, res) => {
    res.status(404).end();
});


module.exports = router;