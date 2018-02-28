  var express = require('express');
  var router = express.Router();
  const User = require('../models/user');

  /* GET users listing. */
  /**
   * @api {get} /users/:id Request a user's information
   * @apiName GetUser
   * @apiGroup User
   *
   * @apiParam {Number} id Unique identifier of the user
   *
   * @apiSuccess {String} firstName First name of the user
   * @apiSuccess {String} lastName  Last name of the user
   */
   router.get('/', function(req, res, next) {
     User.find().sort('lastName').exec(function(err, users) {
       if (err) {
         return next(err);
       }
       res.send(users);
     });
   });


   /* POST new user */
   router.post('/', function(req, res, next) {
     // Create a new document from the JSON in the request body
     const newUser = new User(req.body);
     //User.find().where('firstName', newUser.firstName)
     // Save that document
     newUser.save(function(err, savedUser) {
       if (err) {
         return next(err);
       }
       // Send the saved document in the response
       res.send(savedUser);
     });
   });

   router.get('/:id', function(req, res, next){
     User.findById(req.params.id).exec(function(err, users) {
       if (err) {
          //return console.warn('Could not count people because: ' + err.message);
         return next(err);
       }
       res.send(users);
     });
   });

   router.put('/:id', function(req, res, next){
     User.findById(req.params.id).exec(function(err, userToModify) {
       if (err) {
          //return console.warn('Could not count people because: ' + err.message);
         return next(err);
       }
       //res.send("celui à modifier " + userToModify.lastName);
       //res.send("Celui par lequel on modifie" + req.body.lastName);
       if(req.body.firstName != undefined){
         userToModify.firstName = req.body.firstName;
       }
       if(req.body.lastName != undefined){
         userToModify.lastName = req.body.lastName;
       }
       if(req.body.role != undefined){
         userToModify.role = req.body.role;
       }
       //res.send(userToModify.lastName);
       userToModify.save(function(err, savedUser) {
         if (err) {
           return next(err);
         }
         // Send the saved document in the response
         res.send(savedUser);
       });

     });
   });

   router.delete('/:id', function(req, res, next){
     const user_id = req.params.id;
    User.findById(user_id).remove().exec(function(err, userToDelete){
      if(err){
        return next(err);
      }
      res.send("User " + user_id + " deleted. ");
    });
   });

  module.exports = router;
