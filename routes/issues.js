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

  Issue.find().count(function(err, total) {
    let query = Issue.find().sort('status');

    // Parse the "page" param (default to 1 if invalid)
    let page = parseInt(req.query.page,10);
    if(isNaN(page)|| page < 1){
      page = 1;
    }

    // Parse the "pageSize" param (default to 100 if invalid)
    let pageSize = parseInt(req.query.pageSize, 10);
    if(isNaN(pageSize)|| pageSize < 0 || pageSize > 10){
      pageSize = 10;
    }

    // Apply skip and limit to select the correct page of elements
    query = query.skip((page - 1)*pageSize).limit(pageSize);

    if(req.query.userId !== undefined){
      query = query.where("user").equals(req.query.userId);
      countQuery = countQuery.where("user").equals(req.query.userId);
    }

    query.exec(function(err, issues) {
      if (err) {
        return next(err);
      }
      res.send({
        page: page,
        pageSize: pageSize,
        total: total,
        data: issues
      });
    });
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
