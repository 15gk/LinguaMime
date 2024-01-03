var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('sign', { title: 'Express' });
   res.render('sign');
});
router.get("/about", function (req, res, next) {
  // res.render('sign', { title: 'Express' });
  res.render("about");
});
router.get("/contact", function (req, res, next) {
  // res.render('sign', { title: 'Express' });
  res.render("contact");
});


module.exports = router;
