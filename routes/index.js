var express = require('express');
var router = express.Router();

var User = require("../models/user");
/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('sign');
});
router.get("/about", function (req, res, next) {
  res.render("about");
});
router.get("/contact", function (req, res, next) {
  res.render("contact");
});
router.get("/landing", function (req, res, next) {
  res.render("landing");
});


// router.get("/profile", function (req, res) {
//   console.log(req.session);
//   if (req.isAuthenticated()) {
//     console.log(req.user)
//     res.json({ message: "You made it to the secured profie" });
//   } else {
//     res.json({ message: "You are not authenticated" });
//   }
// });
router.get("/profile", async function (req, res, next) {
  // Check if the user is logged in
  if (!req.user) {
    // If not logged in, redirect to the register page
    return res.redirect("/register");
  }
   console.log(req.user)
  try {
    // Assuming you have a field 'doctorId' in your Slot model
    res.render("profile", {
      title: "Profile",
      user: req.user,
    });
  } catch (error) {
    // Handle any errors that may occur during the database query
    console.error(error);
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;
