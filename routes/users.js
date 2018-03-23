var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Issue = require('../models/issue');

/* GET users listing. */
/**
* @api {get} /users/ Lister tous les utilisateurs
* @apiVersion 1.0.0
* @apiName GetUsersList
* @apiGroup User
*
* @apiDescription Cette route retourne tous les utilisateurs stockés dans la base de donnée. Pour chaque utilisateur, on reçoit son role, sa date de création, son prénom, son nom et s'il a déjà indiqué des problèmes, ses problèmes.
*
* @apiSuccess {String} role  Le role de l'utilisateur
* @apiSuccess {Date} createdAt La date de création de l'utilisateur
* @apiSuccess {String} _id  L'id de l'utilisateur
* @apiSuccess {String} firstName  Le prénom de l'utilisateur
* @apiSuccess {String} lastName  Le nom de l'utilisateur
* @apiSuccess {Integer} directedIssuesCount Le nombre total de problèmes reportés par l'utilisateur
*
* @apiSuccessExample {json} Success-Response:
{
"role": "manager",
"createdAt": "2018-03-08T11:41:35.018Z",
"_id": "5aa1216fde3cb40014969c61",
"firstName": "Pierre",
"lastName": "Baud",
"__v": 0,
"directedIssuesCount": 2
},
{
"role": "manager",
"createdAt": "2018-03-08T11:41:49.735Z",
"_id": "5aa1217dde3cb40014969c62",
"firstName": "Sami",
"lastName": "Othmane",
"__v": 0
},
{
"role": "manager",
"createdAt": "2018-03-08T11:41:54.956Z",
"_id": "5aa12182de3cb40014969c63",
"firstName": "Kelly",
"lastName": "Pala",
"__v": 0
}
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
/**
* @api {post} /users Créer un nouvel utilisateur
* @apiVersion 1.0.0
* @apiName PostUser
* @apiGroup User
*
*
* @apiDescription Cette route permet de créer un nouvel utilisateur, il faut indiquer son role (manager ou citizen), son prénom et son nom. Il ne peut exister qu'un seul utilisateur avec la même combinaison nom/prenom
*
* @apiParam (Request body) {String="manager","citizen"} [role]  Le role de l'utilisateur, par défaut citizen
* @apiParam (Request body) {String{2..20}} firstName  Le prénom de l'utilisateur
* @apiParam (Request body) {String{2..20}} lastName  Le nom de l'utilisateur
*@apiParamExample {json} Body Request Example:
{
"firstName" : "Pierre",
"lastName": "Baud",
"role":"manager"
}
*
* @apiError (201) created L'utilisateur a été créé avec succès.
* @apiError (403) forbidden L’entité fournie avec la requête n'est pas acceptée, car il existe déjà un utilisateur avec ce nom et ce prénom.
*/
router.post('/', function(req, res, next) {
  // Create a new document from the JSON in the request body
  const newUser = new User(req.body);
  //User.find().where('firstName', newUser.firstName)
  // Save that document
  newUser.save(function(err, savedUser) {
    if (err) {
      if(err.name === "BulkWriteError"){
        res.status(403).send(" L'utilisateur " + req.body.firstName + " " + req.body.lastName + " existe déjà !")
      }
      return next(err);
    }
    // Send the saved document in the response
    res.status(201).send(savedUser);
  });
});

/**
* @api {get} /users/:id Afficher un utilisateur
* @apiVersion 1.0.0
* @apiName GetUserByID
* @apiGroup User
*
* @apiParam {String} id Identifiant unique pour chaque utilisateur
* @apiParamExample {String} Example id:
"5aa1216fde3cb40014969c61"
*
* @apiDescription Cette route retourne l'utilisateur, identifié par son id.
*
* @apiSuccess {String} role  Le role de l'utilisateur
* @apiSuccess {Date} createdAt La date de création de l'utilisateur
* @apiSuccess {String} _id  L'id de l'utilisateur
* @apiSuccess {String} firstName  Le prénom de l'utilisateur
* @apiSuccess {String} lastName  Le nom de l'utilisateur
* @apiSuccess {Integer} [directedIssuesCount] Le nombre total de problèmes reportés par l'utilisateur
*
* @apiSuccessExample {json} Success-Response:
{
"role": "manager",
"createdAt": "2018-03-08T11:41:35.018Z",
"_id": "5aa1216fde3cb40014969c61",
"firstName": "Pierre",
"lastName": "Baud",
"__v": 0
}
*
* @apiError (404) notFound Utilisateur non trouvé.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
*/
router.get('/:id', loadUserFromParams, function(req, res, next){
  res.send(req.user);
});


// Get issues from one User
/**
* @api {get} /users/:id/issues Afficher les problèmes d'un utilisateur
* @apiVersion 1.0.0
* @apiName GetUserIssuesByID
* @apiGroup User
*
* @apiParam {Number} id Identifiant unique pour chaque utilisateur
* @apiParamExample {String} Example id:
"5aa1216fde3cb40014969c61"
*
*
* @apiDescription Cette route retourne tous les problèmes reportés par l'utilisateur, identifié par son id.
*
* @apiSuccess {String} status  L'état du problème.
* @apiSuccess {Array} tags Tableau de Strings décrivants le problème.
* @apiSuccess {String} _id L'identifiant du problème.
* @apiSuccess {Number} latitude La latitude où se trouve le problème.
* @apiSuccess {Number} longitude La longitude où se trouve le problème.
* @apiSuccess {String} user L'identifiant de l'utulisateur qui a reporté le problème.
* @apiSuccess {Date} createdAt La date du report du problème.
* @apiSuccess {Date} updatedAt La date de la dernière mise à jour du problème.
* @apiSuccessExample {json} Success-Response:
{
"status": "new",
"tags": [],
"_id": "5aa131dbde3cb40014969c66",
"latitude": 1,
"longitude": 10,
"user": "5aa1216fde3cb40014969c61",
"createdAt": "2018-03-08T12:51:39.198Z",
"updatedAt": "2018-03-08T12:51:39.198Z",
"__v": 0
},
{
"status": "new",
"tags": [],
"_id": "5aa131eade3cb40014969c67",
"latitude": 1,
"longitude": 3,
"user": "5aa1216fde3cb40014969c61",
"createdAt": "2018-03-08T12:51:54.269Z",
"updatedAt": "2018-03-08T12:51:54.269Z",
"__v": 0
},
{
"status": "new",
"tags": [],
"_id": "5aa13218de3cb40014969c68",
"latitude": 1,
"longitude": 3,
"user": "5aa1216fde3cb40014969c61",
"createdAt": "2018-03-08T12:52:40.470Z",
"updatedAt": "2018-03-08T12:52:40.470Z",
"__v": 0
}
*
* @apiError (200) OK Les issues de l'utilisateur ont été renvoyées. Si l'utilisateur n'a pas d'issues, l'API renverra "This user hasn't reported any issue yet."
* @apiError (404) notFound Utilisateur non trouvé.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
*/
router.get('/:id/issues', loadUserFromParams, function(req, res, next){
  // The user exists
  let query = Issue.find(); // Query qui récupère toutes les issues
  query = query.where('user').equals(req.user.id)
  query.exec(function(err, issues) {
    if (err) {
      return next(err);
    }

    // If there's at least an issue
    if(typeof issues !== "undefined" && issues !== null && issues.length !== null && issues.length > 0){
      res.send(issues);
    } else { // Else there's no issue
      // Nous ne renvoyons pas d'erreur, car concrètement il n'y a pas d'erreur. Nous pourrions aussi renvoyer un tableau vide et cela serait au client de le gérer.
      res.send("This user hasn't reported any issue yet.");
    }

  });
});

/**
* @api {patch} /users/:id Modifier un ou plusieurs des attributs de l'utilisateur
* @apiVersion 1.0.0
* @apiName UpdateUserByID
* @apiGroup User
*
* @apiParam {Number} id Identifiant unique pour chaque utilisateur
* @apiParamExample {String} Example id:
"5aa1216fde3cb40014969c61"
*
*
* @apiDescription Cette route permet de modifier un utilisateur, identifié par son id. On peut modifier soit un, soit plusieurs des attributs de l'utilisateur.
*
* @apiParam (Request body) {String="manager","citizen"} [role]  Le role de l'utilisateur, par défaut citizen
* @apiParam (Request body) {String{2..20}} [firstName]  Le prénom de l'utilisateur
* @apiParam (Request body) {String{2..20}} [lastName]  Le nom de l'utilisateur
*
*@apiParamExample {json} Body Request Example:
{
"role":"citizen"
}
* @apiError (404) notFound Utilisateur non trouvé.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
* @apiError (403) forbidden L’entité fournie avec la requête n'est pas acceptée, car il existe déjà un utilisateur avec ce nom et ce prénom.
*/
router.patch('/:id', loadUserFromParams, function(req, res, next){
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
        res.status(403).send(" L'utilisateur " + req.body.firstName +" "+ req.body.lastName + " existe déjà !")
      }
    }
    // Send the saved document in the response
    res.send(updatedUser);
  });
});

/**
* @api {delete} /users/:id Supprimer un utilisateur
* @apiVersion 1.0.0
* @apiName DeleteUserByID
* @apiGroup User
*
* @apiParam {Number} id Identifiant unique pour chaque utilisateur
* @apiParamExample {String} Example id:
"5aa1216fde3cb40014969c61"
*
*
* @apiDescription Cette route supprime l'utilisateur, identifié par son id.
*
*
* @apiError (200) OK Utilisateur supprimé.
* @apiError (404) notFound Utilisateur non trouvé.
* @apiError (422) unprocessableEntity L’entité fournie avec la requête est incompréhensible ou incomplète.
*/
router.delete('/:id', loadUserFromParams, function(req, res, next){
  req.user.remove(function(err){
    if(err){
      return next(err);
    }
    res.status(200).send("User " + req.user.id + "has been deleted.");
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
function loadUserFromParams(req, res, next) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      if(err.name = "CastError"){
        return res.status(422).send("L'id n'a pas un format correct.");
      }
    } else if (!user) {
      return res.status(404).send('Aucun utilisateur avec l\'id ' + req.params.id + " trouvé.");
    }
    req.user = user;
    next();
  });
}


module.exports = router;
