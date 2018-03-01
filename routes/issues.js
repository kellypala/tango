var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;



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

    // Filter issues by status
    let statusList = ['new', 'inProgress', 'canceled', 'completed'];
      if (statusList.includes(req.query.status)) {
        query = query.where('status').equals(req.query.status);
      }

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

    // Si l'issue a été uploadée avec un autre état que New
    if(newIssue.status !== 'new'){
        newIssue.status = 'new'; // Set New as the status
    }

    // Save that document
    newIssue.save(function(err, savedIssue) {
        if (err) {
            return next(err);
        }
        // Send the saved document in the response
        res.send(savedIssue);
    });
});

router.put('/:id', function(req, res, next){

    Issue.findById(req.params.id).exec(function(err, issueToModify) {
        if (err) {
            //return console.warn('Could not count people because: ' + err.message);
            return next(err);
        }

        if(req.body.user !== undefined){
            issueToModify.user = req.body.user;
        }
        if(req.body.description !== undefined){
            issueToModify.description = req.body.description;
        }
        if(req.body.imageUrl !== undefined){
            issueToModify.imageUrl = req.body.imageUrl;
        }
        if(req.body.latitude !== undefined){
            issueToModify.latitude = req.body.latitude;
        }
        if(req.body.longitude !== undefined){
            issueToModify.longitude = req.body.longitude;
        }
        if(req.body.tags !== undefined){
            issueToModify.tags = req.body.tags;
        }

        /*
        // GERER LE STATUT DE L'ISSUE
        switch(issueToModify.status){
            case "new": res.send('aloooohaaaaaa');
                if(req.body.status == "inProgress" || req.body.status == "canceled" || req.body.status == "completed"){
                    res.send('Impossible to go back to the status: new');
                }
            issueToModify.status = req.body.status;
                break;
            case "inProgress": res.send('lololol');
                if(req.body.status == "canceled" || req.body.status == "completed"){
                    res.send('Impossible to go back to the status: inProgress');
                }
                break;
            case "canceled": res.send('lololol');
                if(req.body.status == "completed"){
                    res.send('Impossible to go back to the status: canceled');
                }
                break;
            case "completed": res.send('lololol');
                if(req.body.status == "completed"){
                    res.send('Impossible to go back to the status: canceled');
                }
                break;
            default:
        }
        */
        if(req.body.status !== undefined) {
            // Si le statut demandé est le même que l'actuel
            if (req.body.status === issueToModify.status) {
                res.send("This issue status is already " + issueToModify.status);
            } else {
                // Ici, nous allons gérer le statut de l'issue
                switch (req.body.status) {
                    case "new":
                        //------ PAS VRAIMENT UTILE CE CASE
                        if (issueToModify.status === "inProgress" || issueToModify.status === "canceled" || issueToModify.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer à New que si il
                            issueToModify.status = req.body.status;
                        }
                        break;
                    case "inProgress":
                        if (issueToModify.status === "canceled" || issueToModify.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer à inProgress que si l'état était à New
                            issueToModify.status = req.body.status;
                        }
                        break;
                    case "canceled":
                        if (issueToModify.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer en canceled que si l'état était à New ou inProgress
                            issueToModify.status = req.body.status;
                        }
                        break;
                    case "completed":
                        if (issueToModify.status === "completed" || issueToModify.status === "canceled" || issueToModify.status === 'new' ) {
                            // HANDLE ERROR
                        } else { // Peut passer en completed que si l'état était inProgress
                            issueToModify.status = req.body.status;
                        }
                        break;
                    default:
                        //------- Normalement on devrait pas arriver ici
                        res.send('men what is that, what is happening');
                }
            }
        }

        // Sauvegarde de l'issue
        issueToModify.save(function(err, savedIssue) {
            if (err) {
                return next(err);
            }
            // Send the saved document in the response
            res.send(savedIssue);
        });
    });
});


router.delete('/:id', loadIssueFromParamsMiddleware, function(req, res, next){
    const issue_id = req.params.id;
    Issue.findById(issue_id).remove().exec(function(err, issues){
        if(err){
            return next(err);
        }
        res.send("Issue " + issue_id + " deleted.");
    });
});

function loadIssueFromParamsMiddleware(req, res, next) {

  const issueId = req.params.id;
  if (!ObjectId.isValid(issueId)) {
    return issueNotFound(res, issueId);
  }
  let query = Issue.findById(issueId)
  query.exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return issueNotFound(res, issueId);
    }

    req.issue = issue;
    next();
  });
}

module.exports = router;
