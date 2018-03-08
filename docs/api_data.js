define({ "api": [
  {
    "type": "delete",
    "url": "/users/:id",
    "title": "Supprimer un utilisateur",
    "name": "DeleteUserByID",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Identifiant unique pour chaque utilisateur</p>"
          }
        ]
      }
    },
    "description": "<p>Cette route supprime l'utilisateur, identifié par son id.</p>",
    "error": {
      "fields": {
        "200": [
          {
            "group": "200",
            "optional": false,
            "field": "OK",
            "description": "<p>Utilisateur supprimé.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "notFound",
            "description": "<p>Utilisateur non trouvé.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "unprocessableEntity",
            "description": "<p>L’entité fournie avec la requête est incompréhensible ou incomplète.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Afficher un utilisateur",
    "name": "GetUserByID",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Identifiant unique pour chaque utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Example id:",
          "content": "\"5aa1216fde3cb40014969c61\"",
          "type": "String"
        }
      ]
    },
    "description": "<p>Cette route retourne l'utilisateur, identifié par son id.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Le role de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>La date de création de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>L'id de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Le prénom de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Le nom de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": true,
            "field": "directedIssuesCount",
            "description": "<p>Le nombre total de problèmes reportés par l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n\"role\": \"manager\",\n\"createdAt\": \"2018-03-08T11:41:35.018Z\",\n\"_id\": \"5aa1216fde3cb40014969c61\",\n\"firstName\": \"Pierre\",\n\"lastName\": \"Baud\",\n\"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "notFound",
            "description": "<p>Utilisateur non trouvé.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "unprocessableEntity",
            "description": "<p>L’entité fournie avec la requête est incompréhensible ou incomplète.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/:id/issues",
    "title": "Afficher les problèmes d'un utilisateur",
    "name": "GetUserIssuesByID",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Identifiant unique pour chaque utilisateur</p>"
          }
        ]
      }
    },
    "description": "<p>Cette route retourne tous les problèmes reportés par l'utilisateur, identifié par son id.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>L'état du problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": false,
            "field": "tags",
            "description": "<p>Tableau de Strings décrivants le problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>L'identifiant du problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>La latitude où se trouve le problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>La longitude où se trouve le problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>L'identifiant de l'utulisateur qui a reporté le problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>La date du report du problème.</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updatedAt",
            "description": "<p>La date de la dernière mise à jour du problème.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n\"status\": \"new\",\n\"tags\": [],\n\"_id\": \"5aa131dbde3cb40014969c66\",\n\"latitude\": 1,\n\"longitude\": 10,\n\"user\": \"5aa1216fde3cb40014969c61\",\n\"createdAt\": \"2018-03-08T12:51:39.198Z\",\n\"updatedAt\": \"2018-03-08T12:51:39.198Z\",\n\"__v\": 0\n},\n{\n\"status\": \"new\",\n\"tags\": [],\n\"_id\": \"5aa131eade3cb40014969c67\",\n\"latitude\": 1,\n\"longitude\": 3,\n\"user\": \"5aa1216fde3cb40014969c61\",\n\"createdAt\": \"2018-03-08T12:51:54.269Z\",\n\"updatedAt\": \"2018-03-08T12:51:54.269Z\",\n\"__v\": 0\n},\n{\n\"status\": \"new\",\n\"tags\": [],\n\"_id\": \"5aa13218de3cb40014969c68\",\n\"latitude\": 1,\n\"longitude\": 3,\n\"user\": \"5aa1216fde3cb40014969c61\",\n\"createdAt\": \"2018-03-08T12:52:40.470Z\",\n\"updatedAt\": \"2018-03-08T12:52:40.470Z\",\n\"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "notFound",
            "description": "<p>Utilisateur non trouvé.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "unprocessableEntity",
            "description": "<p>L’entité fournie avec la requête est incompréhensible ou incomplète.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/users/",
    "title": "Lister tous les utilisateurs",
    "name": "GetUsersList",
    "group": "User",
    "description": "<p>Cette route retourne tous les utilisateurs stockés dans la base de donnée. Pour chaque utilisateur, on reçoit son role, sa date de création, son prénom, son nom et s'il a déjà indiqué des problèmes, ses problèmes.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>Le role de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "createdAt",
            "description": "<p>La date de création de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "_id",
            "description": "<p>L'id de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstName",
            "description": "<p>Le prénom de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "lastName",
            "description": "<p>Le nom de l'utilisateur</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer",
            "optional": false,
            "field": "directedIssuesCount",
            "description": "<p>Le nombre total de problèmes reportés par l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n\"role\": \"manager\",\n\"createdAt\": \"2018-03-08T11:41:35.018Z\",\n\"_id\": \"5aa1216fde3cb40014969c61\",\n\"firstName\": \"Pierre\",\n\"lastName\": \"Baud\",\n\"__v\": 0,\n\"directedIssuesCount\": 2\n},\n{\n\"role\": \"manager\",\n\"createdAt\": \"2018-03-08T11:41:49.735Z\",\n\"_id\": \"5aa1217dde3cb40014969c62\",\n\"firstName\": \"Sami\",\n\"lastName\": \"Othmane\",\n\"__v\": 0\n},\n{\n\"role\": \"manager\",\n\"createdAt\": \"2018-03-08T11:41:54.956Z\",\n\"_id\": \"5aa12182de3cb40014969c63\",\n\"firstName\": \"Kelly\",\n\"lastName\": \"Pala\",\n\"__v\": 0\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users",
    "title": "Créer un nouvel utilisateur",
    "name": "PostUser",
    "group": "User",
    "description": "<p>Cette route permet de créer un nouvel utilisateur, il faut indiquer son role (manager ou citizen), son prénom et son nom. Il ne peut exister qu'un seul utilisateur avec la même combinaison nom/prenom</p>",
    "parameter": {
      "fields": {
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"manager\"",
              "\"citizen\""
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Le role de l'utilisateur, par défaut citizen</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "firstName",
            "description": "<p>Le prénom de l'utilisateur</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": false,
            "field": "lastName",
            "description": "<p>Le nom de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Body Request Example:",
          "content": "{\n\"firstName\" : \"Pierre\",\n\"lastName\": \"Baud\",\n\"role\":\"manager\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "201": [
          {
            "group": "201",
            "optional": false,
            "field": "created",
            "description": "<p>L'utilisateur a été créé avec succès.</p>"
          }
        ],
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>L’entité fournie avec la requête n'est pas acceptée, car il existe déjà un utilisateur avec ce nom et ce prénom.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Modifier un utilisateur",
    "name": "UpdateUserByID",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Identifiant unique pour chaque utilisateur</p>"
          }
        ],
        "Request body": [
          {
            "group": "Request body",
            "type": "String",
            "allowedValues": [
              "\"manager\"",
              "\"citizen\""
            ],
            "optional": true,
            "field": "role",
            "description": "<p>Le role de l'utilisateur, par défaut citizen</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": true,
            "field": "firstName",
            "description": "<p>Le prénom de l'utilisateur</p>"
          },
          {
            "group": "Request body",
            "type": "String",
            "size": "2..20",
            "optional": true,
            "field": "lastName",
            "description": "<p>Le nom de l'utilisateur</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Body Request Example:",
          "content": "{\n\"role\":\"citizen\"\n}",
          "type": "json"
        }
      ]
    },
    "description": "<p>Cette route permet de modifier un utilisateur, identifié par son id. On peut modifier soit un, soit plusieurs des attributs de l'utilisateur.</p>",
    "error": {
      "fields": {
        "403": [
          {
            "group": "403",
            "optional": false,
            "field": "forbidden",
            "description": "<p>L’entité fournie avec la requête n'est pas acceptée, car il existe déjà un utilisateur avec ce nom et ce prénom.</p>"
          }
        ],
        "404": [
          {
            "group": "404",
            "optional": false,
            "field": "notFound",
            "description": "<p>Utilisateur non trouvé.</p>"
          }
        ],
        "422": [
          {
            "group": "422",
            "optional": false,
            "field": "unprocessableEntity",
            "description": "<p>L’entité fournie avec la requête est incompréhensible ou incomplète.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "routes/users.js",
    "groupTitle": "User"
  }
] });
