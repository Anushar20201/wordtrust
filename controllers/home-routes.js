const router = require('express').Router();

router.get('/', (req, res) => {
  //redirecting this to homepage handlebars
  res.render('homepage');
});



module.exports = router;