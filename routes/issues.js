var express = require('express');
var router = express.Router();
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
    Issue.find().sort('status').exec(function(err, issues) {
        if (err) {
            return next(err);
        }
        res.send(issues);
    });
});

router.get('/:id', function(req, res, next){
  Issue.findById(req.params.id).exec(function(err, issues) {
    if (err) {
       //return console.warn('Could not count people because: ' + err.message);
      return next(err);
    }
    res.send(issues);
  });
});

/* POST new user */
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);
    // Save that document
    newIssue.save(function(err, savedIssue) {
        if (err) {
            return next(err);
        }
        // Send the saved document in the response
        res.send(savedIssue);
    });
});

router.delete('/:id', function(req, res, next){
    const issue_id = req.params.id;
    Issue.findById(issue_id).remove().exec(function(err, issues){
        if(err){
            return next(err);
        }
        res.send("Issue " + issue_id + " deleted.");
    });
});

module.exports = router;
