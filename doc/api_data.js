define({ "api": [
  {
    "type": "post",
    "url": "/acceptFriendRequest",
    "title": "Accept friend request",
    "name": "acceptFriendRequest",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Request ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Request accepted\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/cancelFriendRequest",
    "title": "Cancel friend request",
    "name": "cancelFriendRequest",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Request ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Request cancelled\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/getFriendRequests",
    "title": "Get all friend requests of a user",
    "name": "getFriendRequests",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Friend requests fetched\",\n     \"body\": [\n           {\n               id: \"REQ-sdfdfd-zvdgdg-arereggdd\",\n               fromUser: \"sami\",\n               date: 1345674343,\n               typeId: 0\n           },\n           {\n               id: \"REQ-sdfdfd-zvdgdg-arereggdd\",\n               fromUser: \"sami\",\n               date: 1345674343,\n               typeId: 1\n           },\n           {\n               id: \"REQ-sdfdfd-zvdgdg-arereggdd\",\n               fromUser: \"sami\",\n               date: 1345674343,\n               typeId: 0\n           }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/getLocationFriends",
    "title": "Get all location friends of a user",
    "name": "getLocationFriends",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Friends fetched\",\n     \"body\": [\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               location: \"24.9008297,67.1680825\"\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               location: \"24.9008297,67.1680825\"\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               location: \"24.9008297,67.1680825\"\n           }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/getMotionFriends",
    "title": "Get all motion friends of a user",
    "name": "getMotionFriends",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Friends fetched\",\n     \"body\": [\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               isInMotion: true\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               isInMotion: false\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\",\n               isInMotion: true\n           }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/rejectFriendRequest",
    "title": "Reject friend request",
    "name": "rejectFriendRequest",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Request ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Request rejected\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/searchGlobalUsers",
    "title": "Search for all users in the database",
    "name": "searchGlobalUsers",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "query",
            "description": "<p>Query for search.</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "criteria",
            "description": "<p>Criteria for search.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"All users fetched\",\n     \"body\": [\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\"\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\"\n           },\n           {\n               userName: \"sami\",\n               name: \"Abdul Sami\",\n               age: \"21\"\n           }\n     ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/sendFriendRequest",
    "title": "Send friend request to a user",
    "name": "sendFriendRequest",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "fromUserName",
            "description": "<p>Username of user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "toUserName",
            "description": "<p>Username of friend.</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "typeId",
            "description": "<p>Request type.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Request sent\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/signInUser",
    "title": "Sign In user",
    "name": "signInUser",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"User credentials valid\",\n     \"body\": {\n           userName: \"sami\",\n           name: \"Abdul Sami\",\n           age: 21\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/signUpUser",
    "title": "Sign Up user",
    "name": "signUpUser",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name.</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "age",
            "description": "<p>Age.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Current location.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"User signed up\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/updateLocation",
    "title": "Update location of a user",
    "name": "updateLocation",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "location",
            "description": "<p>Location.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Location updated\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "type": "post",
    "url": "/updateMotionStatus",
    "title": "Update location of a user",
    "name": "updateMotionStatus",
    "group": "Client",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>Username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "isInMotion",
            "description": "<p>Motion status.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "body",
            "description": "<p>Response Object[].</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "  {\n     \"status\": \"Success\",\n     \"message\": \"Motion status updated\",\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Client"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/doc/main.js",
    "group": "D__Expendive_Workspace_NodeJS_SLSHServer_doc_main_js",
    "groupTitle": "D__Expendive_Workspace_NodeJS_SLSHServer_doc_main_js",
    "name": ""
  },
  {
    "type": "post",
    "url": "/addRequestType",
    "title": "Add request type in database",
    "name": "addRequestType",
    "group": "Superuser",
    "version": "0.0.1",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "apiKey",
            "description": "<p>Key for API authentication.</p>"
          },
          {
            "group": "Parameter",
            "type": "Int",
            "optional": false,
            "field": "id",
            "description": "<p>Request type ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "typeName",
            "description": "<p>Request type name.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status",
            "description": "<p>Success/Error.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": \"Success\",\n   \"message\": \"Type added\"\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n   \"status\": \"Error\",\n   \"message\": \"Invalid API Key\"\n }",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Superuser"
  },
  {
    "type": "get",
    "url": "/connectionTest",
    "title": "Test Server Connection.",
    "name": "connectionTest",
    "group": "Superuser",
    "version": "0.0.1",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK",
          "type": "json"
        }
      ]
    },
    "filename": "D:/Expendive/Workspace/NodeJS/SLSHServer/app.js",
    "groupTitle": "Superuser"
  }
] });
