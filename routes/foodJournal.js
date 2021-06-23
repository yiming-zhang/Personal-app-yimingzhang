
const express = require('express');
const router = express.Router();
const FoodJournal = require('../models/FoodJournal')//same to your models here use IndMinor
//const IndMinorCourse = require('../models/IndMinorCourse')


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
      res.locals.foodJournals = await FoodJournal.find({}) //model.find() indMinors is referred in views-indMinor.ejs
      res.render('foodJournal');//this indMinor is the ejs in views
});



/*
router.get('/delete/:minorId',
  isLoggedIn,
  async (req,res,next) => {
      // delete the minor from the collection of minors
      await IndMinor.remove({_id:req.params.minorId})
      // also delete all of the courses associated with that minor!
      await IndMinor.remove({minorId:req.params.minorId})
      res.redirect('/')
})  */


/* add the value in the body to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const fj = new FoodJournal(//new+modelname this im is constant name, could be anyname
        {title:req.body.title,
         createdAt: new Date(),
         description:req.body.description,
         ownerId: req.user._id,
        })
      await fj.save();//save it to database
      //res.render("todoVerification")
      res.redirect('/fj')
});


// handle data about adding new course to a minor


module.exports = router;
