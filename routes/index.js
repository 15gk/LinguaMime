var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('sign', { title: 'Express' });
   res.render('sign');
});
router.get("/hello", function (req, res, next) {
  // res.render('sign', { title: 'Express' });
  res.render("learn");
});
module.exports = router;
