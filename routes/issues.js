var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');


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


router.get('/:id', loadIssueFromParams, function(req, res, next){
  res.send(req.issue);
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

router.put('/:id', loadIssueFromParams, function(req, res, next){
        // On dit qu'il n'est pas possible de modifier le User
        if(req.body.user !== undefined){
            //issueToModify.user = req.body.user;

            // HANDLE THE ERROR -> impossible de changer de user
        }

        if(req.body.description !== undefined){
            req.issue.description = req.body.description;
        }
        if(req.body.imageUrl !== undefined){
            req.issue.imageUrl = req.body.imageUrl;
        }

        if(req.body.latitude !== undefined){
            req.issue.latitude = req.body.latitude;
        }

        if(req.body.longitude !== undefined){
            req.issue.longitude = req.body.longitude;
        }
        if(req.body.tags !== undefined){
            req.issue.tags = req.body.tags;
        }

        /*
        // gérer LE STATUT DE L'ISSUE
        switch(issueToModify.status){
            case "new": res.send('bjr');
                if(req.body.status == "inProgress" || req.body.status == "canceled" || req.body.status == "completed"){
                    res.send('Impossible to go back to the status: new');
                }
            issueToModify.status = req.body.status;
                break;
            case "inProgress": res.send('de');
                if(req.body.status == "canceled" || req.body.status == "completed"){
                    res.send('Impossible to go back to the status: inProgress');
                }
                break;
            case "canceled": res.send('de');
                if(req.body.status == "completed"){
                    res.send('Impossible to go back to the status: canceled');
                }
                break;
            case "completed": res.send('de');
                if(req.body.status == "completed"){
                    res.send('Impossible to go back to the status: canceled');
                }
                break;
            default:
        }
        */
        if(req.body.status !== undefined) {
            // Si le statut demandé est le même que l'actuel
            if (req.body.status === req.issue.status) {
                //res.send("This issue status is already " + issueToModify.status);
            } else {
                // Ici, nous allons gérer le statut de l'issue
                switch (req.body.status) {
                    case "new":
                        //------ PAS VRAIMENT UTILE CE CASE
                        if (req.issue.status === "inProgress" || req.issue.status === "canceled" || req.issue.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer à New que si il
                            req.issue.status = req.body.status;
                        }
                        break;
                    case "inProgress":
                        if (req.issue.status === "canceled" || req.user.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer à inProgress que si l'état était à New
                            req.issue.status = req.body.status;
                        }
                        break;
                    case "canceled":
                        if (req.issue.status === "completed") {
                            // HANDLE ERROR
                        } else { // Peut passer en canceled que si l'état était à New ou inProgress
                            req.issue.status = req.body.status;
                        }
                        break;
                    case "completed":

                        if (req.issue.status === "completed" || req.issue.status === "canceled" || req.issue.status === 'new' ) {
                            // HANDLE ERROR
                        } else { // Peut passer en completed que si l'état était inProgress
                            req.issue.status = req.body.status;
                        }
                        break;
                    default:
                        //------- Normalement on devrait pas arriver ici
                        res.send('men what is that, what is happening');
                }
            }
        }

        // Sauvegarde de l'issue
        req.issue.save(function(err, updatedIssue) {
            if (err) {
                return next(err);
            }
            // Send the saved document in the response
            res.send(updatedIssue);
        });
});


router.delete('/:id', loadIssueFromParams, function(req, res, next){
  req.issue.remove(function(err){
    if(err){
      return next(err);
    }
    res.send("Issue " + req.issue.id + " deleted. ");
  });
});

function loadIssueFromParams(req, res, next) {
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      res.send("ici");
      return res.status(404).send('No issue found with ID ' + req.params.id);
    }
    req.issue = issue;
    next();
  });
}

module.exports = router;
