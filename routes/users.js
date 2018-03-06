  var express = require('express');
  var router = express.Router();
  const User = require('../models/user');
  const Issue = require('../models/issue');

  /* GET users listing. */
  /**
   * @api {get} /users/ Request all users list
   * @apiName GetUsersList
   * @apiGroup User
   *
   * @apiDescription This route retrieves all the users stored in the database. It retrieves their role, their creation's date, the first and last name, and, if they had already directed issues, how many they directed.
   *
   * @apiSuccess {String} role  Role of the user
   * @apiSuccess {Date} createdAt User's creation date
   * @apiSuccess {String} _id  id of the user
   * @apiSuccess {String} firstName  First name of the user
   * @apiSuccess {String} lastName  Last name of the user
   * @apiSuccess {Integer} directedIssuesCount  Count all the issues directed by the user
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
         if(err.name = "BulkWriteError"){
           res.status(422).send(" L'utilisateur " + req.body.firstName +" "+ req.body.lastName + " existe déjà !")
         }
         return next(err);
       }
       // Send the saved document in the response
       res.status(201).send(savedUser);
     });
   });

   /**
    * @api {get} /id /users/:id Request an user's informations
    * @apiName GetUserByID
    * @apiGroup User
    *
    * @apiParam {Number} id Unique identifier of the user
    *
    * @apiSuccess {String} role  Role of the user
    * @apiSuccess {Date} createdAt User's creation date
    * @apiSuccess {String} _id  id of the user
    * @apiSuccess {String} firstName  First name of the user
    * @apiSuccess {String} lastName  Last name of the user
    * @apiSuccess {Integer} directedIssuesCount  Count all the issues directed by the user
    *
    * @apiError (404) notFound User's id not found
    */
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
           if(err.name = "BulkWriteError"){
             res.status(422).send(" L'utilisateur " + req.body.firstName +" "+ req.body.lastName + " existe déjà !")
           }
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
      res.status(200).send("User " + req.user.id + " deleted. ");
    });
   });

   function loadUserFromParams(req, res, next) {
     User.findById(req.params.id).exec(function(err, user) {
       if (err) {
         if(err.name = "CastError"){
           return res.status(422).send("L'utilisateur avec cet id n'existe pas !");
         }
       } else if (!user) {
         return res.status(404).send('No user found with ID ' + req.params.id);
       }
       req.user = user;
       next();
     });
   }


  module.exports = router;
