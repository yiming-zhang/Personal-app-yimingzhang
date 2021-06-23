/*
  indMinor.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const IndMinor = require('../models/IndMinor')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.indMinors = await IndMinor.find({ownerId:req.user._id})
      res.render('indMinor');
});

router.get('/:minorId',
  isLoggedIn,
  async (req, res, next) => {
      const minorId = req.params.minorId
      res.locals.im = await IndMinor.findOne({_id:minorId})
      res.render('indMinorPage');
});

/* add the value in the body to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const im = new IndMinor(
        {title:req.body.title,
         createdAt: new Date(),
         ownerId: req.user._id,
        })
      await im.save();
      //res.render("todoVerification")
      res.redirect('/im')
});


module.exports = router;
