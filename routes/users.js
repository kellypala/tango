  var express = require('express');
  var router = express.Router();
  const User = require('../models/user');
  const Issue = require('../models/issue');

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
       Issue.aggregate([
       {
         $group: { // Group the documents by users ID
           _id: '$user',
           issuesCount: { // Count the number of issues for that ID
             $sum: 1
           }
         }
       }
     ],function(err, results){
             if (err) {
             return next(err);
           }
           const listUsers = users;
           const listIssues = results;

           const usersJson = listUsers.map(user => user.toJSON());

           listIssues.forEach(function(result) {
               console.log(result);
             const resultId = result._id.toString();
             const correspondingUser = usersJson.find(user => user._id == resultId);
             correspondingUser.directedIssuesCount = result.issuesCount;
           });
            res.send(usersJson);
            })
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

   router.get('/:id', loadUserFromParams, function(req, res, next){
     res.send(req.user);
   });


    // Get issues from one User
    router.get('/:id/issues', loadUserFromParams, function(req, res, next){
        // Check existence de l'utilisateur
        User.findById(req.params.id).exec(function(err, user) {
            if (err) {
              // Non existing user
              return next(err);
            }

            // The user exists
            let query = Issue.find(); // Query qui récupère toutes les issues
            query = query.where('user').equals(req.params.id)
            query.exec(function(err, issues) {
                if (err) {
                    return next(err);
                }

                // If there's at least an issue
                if(typeof issues !== "undefined" && issues !== null && issues.length !== null && issues.length > 0){
                    res.send(issues);
                } else { // Else there's no issue
                    res.send('there is no issue -> GERER ERREUR');
                }
            });
        });
    });


   router.put('/:id', loadUserFromParams, function(req, res, next){
       if(req.body.firstName !== undefined){
         req.user.firstName = req.body.firstName;
       }
       if(req.body.lastName !== undefined){
         req.user.lastName = req.body.lastName;
       }
       if(req.body.role !== undefined){
         req.user.role = req.body.role;
       }
       //res.send(userToModify.lastName);
       req.user.save(function(err, updatedUser) {
         if (err) {
           return next(err);
         }
         // Send the saved document in the response
         res.send(updatedUser);
       });
   });

   router.delete('/:id', loadUserFromParams, function(req, res, next){
    req.user.remove(function(err){
      if(err){
        return next(err);
      }
      res.send("User " + req.user.id + " deleted. ");
    });
   });

   function loadUserFromParams(req, res, next) {
     User.findById(req.params.id).exec(function(err, user) {
       if (err) {
         return next(err);
       } else if (!user) {
         return res.status(404).send('No user found with ID ' + req.params.id);
       }
       req.user = user;
       next();
     });
   }


  module.exports = router;
