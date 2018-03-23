var express = require('express');
var router = express.Router();
const Issue = require('../models/issue');
const User = require('../models/user');

/* GET issues listing. */
/**
* @api {get} /issues/ Lister toutes les issues
* @apiName GetIssuesList
* @apiGroup Issue
*
* @apiDescription Cette route retourne toutes issues stockées dans la base de donnée. Pour chaque issue, on reçoit son id, son statut, sa date de création, sa date de modification (dernière en date), sa latitude, sa longitude, l'id du User ayant reporté l'issue, sa description (si existante), l'url de l'image illustrant l'issue (si existante), le(s) tag(s) (si existant(s)).
*
* @apiSuccess {String} status  Le statut de l'issue. Les différents statuts sont: "new", "inProgress", "canceled", "completed".
* @apiSuccess {Date} createdAt  La date de création de l'issue
* @apiSuccess {Date} updatedAt  La date de modification (dernière en date) de l'issue
* @apiSuccess {String} _id  L'id de l'issue
* @apiSuccess {String} user  L'id du User ayant reporté l'issue
* @apiSuccess {String} description  La description de l'issue
* @apiSuccess {String[]} tags  Le tableau de tag(s) de l'issue
* @apiSuccess {String} imageUrl  L'url de l'image illustrant l'issue
* @apiSuccess {Integer} latitude  La latitude de l'endroit où se situe l'issue
* @apiSuccess {Integer} longitude  La longitude de l'endroit où se situe l'issue
*
* @apiSuccessExample {json} Success-Response:
{
"status": "new",
"tags": [],
"_id": "5ab382654eaec00d60f061de",
"latitude": 25,
"longitude": 25,
"user": "5a9e91e42cd05e805032d190",
"createdAt": "2018-03-22T10:16:05.377Z",
"updatedAt": "2018-03-22T10:16:05.377Z",
"__v": 0
},
{
"status": "new",
"tags": [
"graffiti",
"mur"
],
"_id": "5ab382d74eaec00d60f061df",
"latitude": 48,
"longitude": 2.3,
"user": "5a9e91e42cd05e805032d190",
"description": "Graffiti sur les murs",
"imageUrl": "img/graffitiMur16emeArrondissement.png",
"createdAt": "2018-03-22T10:17:59.071Z",
"updatedAt": "2018-03-22T10:17:59.071Z",
"__v": 0
},
{
"status": "inProgress",
"tags": [],
"_id": "5ab3835a4eaec00d60f061e0",
"latitude": 46,
"longitude": 6,
"user": "5a9e91e42cd05e805032d190",
"description": "Panneau de limitation de vitesse cassé",
"createdAt": "2018-03-22T10:20:10.434Z",
"updatedAt": "2018-03-22T10:20:54.846Z",
"__v": 0
}
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

/**
* @api {get} /issues/:id Afficher une issue
* @apiName GetIssueByID
* @apiGroup Issue
*
* @apiParam {String} id Identifiant unique pour chaque issue
* @apiParamExample {String} Example id:
"5a9e92262cd05e805032d193"
*
* @apiDescription Cette route retourne l'issue, identifiée par son id.
*
* @apiSuccess {String} status  Le statut de l'issue. Les différents statuts sont: "new", "inProgress", "canceled", "completed".
* @apiSuccess {Date} createdAt  La date de création de l'issue
* @apiSuccess {Date} updatedAt  La date de modification (dernière en date) de l'issue
* @apiSuccess {String} _id  L'id de l'issue
* @apiSuccess {String} user  L'id du User ayant reporté l'issue
* @apiSuccess {String} description  La description de l'issue
* @apiSuccess {String[]} tags  Le tableau de tag(s) de l'issue
* @apiSuccess {String} imageUrl  L'url de l'image illustrant l'issue
* @apiSuccess {Integer} latitude  La latitude de l'endroit où se situe l'issue
* @apiSuccess {Integer} longitude  La longitude de l'endroit où se situe l'issue
*
* @apiSuccessExample {json} Success-Response:
{
    "status": "new",
    "tags": [
        "graffiti",
        "mur"
    ],
    "_id": "5ab382d74eaec00d60f061df",
    "latitude": 48,
    "longitude": 2.3,
    "user": "5a9e91e42cd05e805032d190",
    "description": "Graffiti sur les murs",
    "imageUrl": "img/graffitiMur16emeArrondissement.png",
    "createdAt": "2018-03-22T10:17:59.071Z",
    "updatedAt": "2018-03-22T10:17:59.071Z",
    "__v": 0
}
*
* @apiError (404) notFound Issue non trouvée.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
*/
router.get('/:id', loadIssueFromParams, function(req, res, next){
  res.send(req.issue); // non nécessaire d'ajouter .status(200)
});

/* POST new issue */
/**
* @api {post} /issues Créer une nouvelle issue
* @apiName PostIssue
* @apiGroup Issue
*
* @apiDescription Cette route permet de créer une nouvelle issue. Il faut obligatoirement y indiquer l'id d'un User, une latitude, une longitude. Il est aussi possible d'indiquer un statut (si non indiqué, sera "new" par défaut), une description, une url de l'image montrant l'issue en question, des tags afin de catégoriser l'issue.
*
* @apiParam (Request body) {String="new","inProgress","canceled","completed"} [status]  Le statut de l'issue, par défaut "new"
* @apiParam (Request body) {String} user  L'id du User souhaitant reporter l'issue
* @apiParam (Request body) {String{..1000}} [description]  La description de l'issue
* @apiParam (Request body) {String[]} [tags]  Le tableau de tag(s) de l'issue
* @apiParam (Request body) {String{..500}} [imageUrl]  L'url de l'image illustrant l'issue
* @apiParam (Request body) {Integer} latitude  La latitude de l'endroit où se situe l'issue
* @apiParam (Request body) {Integer} longitude  La longitude de l'endroit où se situe l'issue
*
*@apiParamExample {json} Body Request Example:
{
	"status": "new",
	"latitude": "46",
	"longitude": "6",
	"user": "5a9e91e42cd05e805032d190",
	"description": "Panneau de limitation de vitesse cassé",
	"imageUrl": "img/panneauCasse.png",
	"tags": ["panneau","cassé","illisible"]
}
*
* @apiError (201) created L'issue a été créée avec succès.
*/
router.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newIssue = new Issue(req.body);

    // Si l'issue a été uploadée avec un autre état que New
    // Choix de conception de notre part
    if(newIssue.status !== 'new'){
        newIssue.status = 'new'; // Set New as the status
    }

    // Save that document
    newIssue.save(function(err, savedIssue) {
        if (err) {
            if(err.name='validatorError'){ // Si c'est une erreur de validation
                res.status(422).send(err.message);
            } else { // Si c'est une erreur d'un autre type
                res.send(err);
                return next();
            }
        }
        // Send the saved document in the response
        res.status(200).send(savedIssue);
    });
});

/**
* @api {put} /issues/:id Modifier une issue
* @apiName UpdateIssueByID
* @apiGroup Issue
*
* @apiParam {Number} id Identifiant unique pour chaque issue
*
* @apiDescription Cette route permet de modifier une issue, identifiée par son id. On peut modifier soit un, soit plusieurs des attributs de l'issue.
*
* @apiParam (Request body) {String="new","inProgress","canceled","completed"} status  Le statut de l'issue, par défaut "new"
* @apiParam (Request body) {String} user  L'id du User ayant reporté l'issue
* @apiParam (Request body) {String{..1000}} description  La description de l'issue
* @apiParam (Request body) {String[]} [tags]  Le tableau de tag(s) de l'issue
* @apiParam (Request body) {String{..500}} imageUrl  L'url de l'image illustrant l'issue
* @apiParam (Request body) {Integer} latitude  La latitude de l'endroit où se situe l'issue
* @apiParam (Request body) {Integer} longitude  La longitude de l'endroit où se situe l'issue
*
*@apiParamExample {json} Body Request Example:
{
"role":"citizen"
}
* @apiError (200) OK L'issue a été modifiée avec succès.
* @apiError (400) badRequest Impossible de modifier l'issue d'une au non respect d'une contrainte
* @apiError (404) notFound Issue non trouvée.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
*/
router.put('/:id', loadIssueFromParams, loadUserFromParams, function(req, res, next){

    // Comme c'est un put, il faut modifier tout les champs, donc recevoir tous les champs pour les modifiers
    if(
        req.body.user === undefined
        || req.body.status === undefined
        || req.body.description === undefined
        || req.body.imageUrl === undefined
        || req.body.latitude === undefined
        || req.body.longitude === undefined
        || req.body.tags === undefined
    ){
        res.status(422).send('ALL the fields of the issue must be filled and sent.');
        return next();
    }

    // Si le changement de user est souhaité
    if(req.body.user !== undefined){
        req.issue.user = req.body.user;
    }

    // Si le changement de status est souhaité
    if(req.body.status !== undefined){
        if(allowStatusChanges(req)){ // Si nous pouvons changer le status
            req.issue.status = req.body.status;
        } else { // S'il n'est pas possible de changer le status
            res.status(400).send('Impossible for the status to go from "' + req.issue.status + '" to "' + req.body.status + '"');
            return next();
        }
    }

    // Si le changement de la description est souhaité
    if(req.body.description !== undefined){
        req.issue.description = req.body.description;
    }

    // Si le changement de l'url de l'image est souhaité
    if(req.body.imageUrl !== undefined){
        req.issue.imageUrl = req.body.imageUrl;
    }

    // Si le changement de la latitude est souhaité
    if(req.body.latitude !== undefined){
        req.issue.latitude = req.body.latitude;
    }
    // Si le changement de la longitude est souhaité
    if(req.body.longitude !== undefined){
        req.issue.longitude = req.body.longitude;
    }
    // Si le changement des tags est souhaité
    if(req.body.tags !== undefined){
        req.issue.tags = req.body.tags; // Ici nous remplaçons tous les anciens tags par les nouveaux. Si il est souhaité de garder d'ancients tags, il faudra gérer cela du coté client et renvoyer les nouveaux+anciens tags.
    }

    // Sauvegarde de l'issue avec les données modifiées
    req.issue.save(function(err, updatedIssue) {
        if (err) {
            if(err.name='validatorError'){ // Si c'est une erreur de validation
                res.status(422).send(err.message);
            } else { // Si c'est une erreur d'un autre type
                res.send(err);
                return next();
            }
        } else {
            // Send the saved issue in the response
            res.send(updatedIssue);
        }
    });
});

/**
* @api {delete} /issues/:id Supprimer une issue
* @apiName DeleteIssueByID
* @apiGroup Issue
*
* @apiParam {Number} id Identifiant unique pour chaque issue
*
* @apiError (200) OK Issue supprimée.
* @apiError (404) notFound Issue non trouvée.
*/
router.delete('/:id', loadIssueFromParams, function(req, res, next){
  req.issue.remove(function(err){
    if(err){
      return next(err);
    }
    res.status(200).send("The issue " + req.issue.id + "is deleted.");
  });
});

/**
 * 
 * This function will load the issue corresponding to the id recieved.
 * 
 * @param {*} req The object sent to the API
 * @param {*} res 
 * @param {*} next 
 */
function loadIssueFromParams(req, res, next) {
  Issue.findById(req.params.id).exec(function(err, issue) {
    if (err) {
      return next(err);
    } else if (!issue) {
      return res.status(404).send('No issue found with ID ' + req.params.id);
    }
    req.issue = issue;
    next();
  });
}

/**
 * 
 * This function will check if it's possible for the status to be changed. It will check constraints we setted:
 * - Impossible to go from "new" to "completed"
 * - Impossible to go from "inProgress" to "new"
 * - Impossible to change the status when it's "completed" or "canceled"
 * - Possibilities: new -> inProgress, canceled | inProgress -> completed, canceled
 * 
 * @param {*} req The object sent to our API
 */
function allowStatusChanges(req){
    const askedStatus = req.body.status;
    const actualStatus = req.issue.status;
    if(actualStatus === askedStatus){ // Si le statut demandé est le même que l'actuel
        return true;
    } else { // Le statut demandé n'est pas le même que l'actuel                
        // new -> inProgress, new -> canceled
        // inProgress -> canceled, inProgress -> completed
        // canceled -x-> nothing, completed -x-> nothing (points de non retour)
        if(actualStatus === 'new' && (askedStatus === 'inProgress' || askedStatus === 'canceled')){
            return true; // The change can be made
        } else {
            if(actualStatus === 'inProgress' && (askedStatus === 'canceled' || askedStatus === 'completed')){
                return true; // The change can be made
            } else {
                return false; // The change can't be made - Impossible to go from actualStatus to askedStatus
            }
        }
    }
}

// Faudrait qu'on fasse un middleware parce que c'est un copié collé de fonction??
function loadUserFromParams(req, res, next) {
    User.findById(req.body.user).exec(function(err, user) {
      if (err) {
        if(err.name = "CastError"){
          return res.status(422).send("L'id du User n'a pas un format correct.");
        }
      } else if (!user) {
        return res.status(404).send('Aucun User avec l\'id ' + req.params.id + " trouvé.");
      }
      req.user = user;
      next();
    });
}

module.exports = router;
