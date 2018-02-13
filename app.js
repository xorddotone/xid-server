/**
 * Schemas for database
 */
const UserSchema = {
    name: 'Users',
    primaryKey: 'userName',
    properties: {
        userName: 'string',
        password: 'string',
        name: {type: 'string', indexed: true},
        age: {type: 'int', indexed: true},
        description: 'string',
        location: {type: 'string', indexed: true},
        isInMotion: {type: 'bool', default: false, indexed: true},
        locationHistory: 'string[]',
        locationFriends: 'string[]',
        motionFriends: 'string[]',
        receivedRequests: 'FriendRequests[]',
        sentRequests: 'FriendRequests[]'
    }
};
const FriendRequestSchema = {
    name: 'FriendRequests',
    primaryKey: 'id',
    properties: {
        id: 'string',
        fromUser: 'string',
        toUser: 'string',
        date: { type: 'int', indexed: true },
        typeId: { type: 'int', indexed: true }
    }
};
const RequestTypeSchema = {
    name: 'RequestTypes',
    primaryKey: 'id',
    properties: {
        id: 'int',
        typeName: {type: 'string', indexed: true}
    }
};

/**
 * App dependencies
 */
const express = require('express');
const http = require('http');
const logger = require('logger');
const Realm = require("realm");
const bodyParser = require("body-parser");
const cors = require("cors");

/**
 * API Keys for admin/client
 */
const superuserKeys = ['8B4229E8CB1A34D2684915DE6DCFA', 'AB3BF59F6FE36C4185EFB3EA6A7EA'];
const clientKeys = ['133D35B86D62EACF4B383A2A7C1F2', 'B3134A1F29AE39764D6CF3BDBADBA'];

var port = process.env.PORT || 8080;
const schemaVersionNumber = 0;
const app = express();
const schemas = [UserSchema, FriendRequestSchema, RequestTypeSchema];

/**
 * Response status
 */
const statusSuccess = "Success";
const statusError = "Error";

/**
 * Init realm
 */
const realm = new Realm({
    schema: schemas,
    schemaVersion: schemaVersionNumber
});

app.use(bodyParser.urlencoded({extended: false}));
// app.use(logger("dev"));
app.use(cors());

/**
 * Superuser routes
 */

/**
 * @api {get} /connectionTest Test Server Connection.
 * @apiName connectionTest
 * @apiGroup Superuser
 * @apiversion 0.0.1
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 */
app.get('/connectionTest', function (req, res) {
    res.json({status: statusSuccess, message: "Server is up and ready"});
});

/**
 * Client routes
 */

/**
 * @api {post} /signUpUser Sign Up user
 * @apiName signUpUser
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 * @apiParam {String} password Password.
 * @apiParam {String} name Name.
 * @apiParam {Int} age Age.
 * @apiParam {String} location Current location.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "User signed up",
 *   }
 */
app.post("/signUpUser", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    let password = req.body.password;
    let name = req.body.name;
    let age = req.body.age;
    let location = req.body.location;

    if (!userName || !password || !name) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    if (isNaN(age) || !location.includes(",")) {
        res.json({status: statusError, message: "Invalid parameters"});
        return
    }

    let split = location.split(",");
    try {
        if (isNaN(split[0]) || isNaN(split[1])) {
            res.json({status: statusError, message: "Invalid parameters"});
            return
        }
    } catch (e) {
        res.json({status: statusError, message: "Invalid parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (user) {
        res.json({status: statusError, message: "Username already exists"});
        return
    }

    try {
        realm.write(() => {
            let item = realm.create("Users", {
                userName: userName,
                password: password,
                name: name,
                age: parseInt(age),
                description: "",
                location: location
            }, true);
            addLocation(userName, location);
            res.json(
                {
                    status: statusSuccess,
                    message: "User signed up",
                    body: {
                        userName: item.userName,
                        name: item.name,
                        age: item.age,
                        description: item.description
                    }
                }
            )
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /signInUser Sign In user
 * @apiName signInUser
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 * @apiParam {String} password Password.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "User signed in",
 *        "body": {
 *              userName: "user",
 *              name: "User",
 *              age: 21,
 *              description: "Description",
 *              location: "87.5436,67.53567",
 *              isInMotion: false,
 *              locationHistory: [
 *                  "87.5436,67.53567",
 *                  "87.5436,67.53567",
 *                  "87.5436,67.53567"
 *              ],
 *              locationFriends: [
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *              ],
 *              motionFriends: [
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *              ],
 *              receivedRequests: [
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      toUser: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      typeId: 0
 *                  },
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      toUser: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      typeId: 0
 *                  }
 *              ],
 *              sentRequests: [
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      toUser: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      typeId: 0
 *                  },
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      toUser: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      typeId: 0
 *                  }
 *              ]
 *        }
 *   }
 */
app.post("/signInUser", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    let password = req.body.password;

    if (!userName || !password) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "Invalid Username or Password"});
        return
    }

    if (user.password !== password) {
        res.json({status: statusError, message: "Invalid Username or Password"});
        return
    }

    let requests = realm.objects("FriendRequests");
    let receivedRequests = [];
    let sentRequests = [];

    requests.forEach(function(item) {
        if (item.toUser === userName) {
            receivedRequests.push(item);
        }
    });

    requests.forEach(function(item) {
        if (item.fromUser === userName) {
            sentRequests.push(item);
        }
    });

    res.json(
        {
            status: statusSuccess,
            message: "User credentials valid",
            body: {
                userName: user.userName,
                name: user.name,
                age: user.age,
                description: user.description,
                location: user.location,
                isInMotion: user.isInMotion,
                locationHistory: user.locationHistory.map(mapNumberList),
                locationFriends: user.locationFriends.map(mapNumberList),
                motionFriends: user.motionFriends.map(mapNumberList),
                receivedRequests: receivedRequests.map(function (item) {
                    return {
                        id: item.id,
                        userName: item.fromUser,
                        date: item.date,
                        typeId: item.typeId
                    }
                }),
                sentRequests: sentRequests.map(function (item) {
                    return {
                        id: item.id,
                        userName: item.toUser,
                        date: item.date,
                        typeId: item.typeId
                    }
                })
            }
        }
    )
});

/**
 * @api {post} /getMinimalUser Get minimal user
 * @apiName getMinimalUser
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "User profile fetched",
 *        "body": {
 *              userName: "user",
 *              name: "User",
 *              age: 21,
 *              description: "Description"
 *        }
 *   }
 */
app.post("/getMinimalUser", function (req, res) {
    if (!isKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    
    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "Invalid Username"});
        return
    }

    res.json(
        {
            status: statusSuccess,
            message: "User profile fetched",
            body: {
                userName: user.userName,
                name: user.name,
                age: user.age,
                description: user.description
            }
        }
    )
});

/**
 * @api {post} /getUser Get user
 * @apiName getUser
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "User profile fetched",
 *        "body": {
 *              userName: "user",
 *              name: "User",
 *              age: 21,
 *              description: "Description",
 *              location: "87.5436,67.53567",
 *              isInMotion: false,
 *              locationHistory: [
 *                  "87.5436,67.53567",
 *                  "87.5436,67.53567",
 *                  "87.5436,67.53567"
 *              ],
 *              locationFriends: [
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *              ],
 *              motionFriends: [
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *                  "USER-24gdgdgh-fdgsds-4343dggd",
 *              ],
 *              receivedRequests: [
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      userName: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      date: 24562345,
 *                      typeId: 0
 *                  },
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      userName: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      date: 24562345,
 *                      typeId: 0
 *                  }
 *              ],
 *              sentRequests: [
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      userName: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      date: 24562345,
 *                      typeId: 0
 *                  },
 *                  {
 *                      id: "REQ-gfg-dfgdf3-fdgd3",
 *                      userName: "USER-24gdgdgh-fdgsds-4343dggd",
 *                      date: 24562345,
 *                      typeId: 0
 *                  }
 *              ]
 *        }
 *   }
 */
app.post("/getUser", function (req, res) {
    if (!isKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    
    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "Invalid Username"});
        return
    }

    let requests = realm.objects("FriendRequests");
    let receivedRequests = [];
    let sentRequests = [];

    requests.forEach(function(item) {
        if (item.toUser === userName) {
            receivedRequests.push(item);
        }
    });

    requests.forEach(function(item) {
        if (item.fromUser === userName) {
            sentRequests.push(item);
        }
    });

    res.json(
        {
            status: statusSuccess,
            message: "User profile fetched",
            body: {
                userName: user.userName,
                name: user.name,
                age: user.age,
                description: user.description,
                location: user.location,
                isInMotion: user.isInMotion,
                locationHistory: user.locationHistory.map(mapNumberList),
                locationFriends: user.locationFriends.map(mapNumberList),
                motionFriends: user.motionFriends.map(mapNumberList),
                receivedRequests: receivedRequests.map(function (item) {
                    return {
                        id: item.id,
                        userName: item.fromUser,
                        date: item.date,
                        typeId: item.typeId
                    }
                }),
                sentRequests: sentRequests.map(function (item) {
                    return {
                        id: item.id,
                        userName: item.toUser,
                        date: item.date,
                        typeId: item.typeId
                    }
                })
            }
        }
    )
});

/**
 * @api {post} /getAllFriends Get all friends of a user
 * @apiName getAllFriends
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object[]} body Response Object[].
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Friends fetched",
 *        "body": [
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21"
 *              },
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21"
 *              },
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21"
 *              }
 *        ]
 *   }
 */
app.post("/getAllFriends", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    let friends = realm.objects("Users");
    let userFriends = []
    for (var i = 0; i < friends.length; i++) {
        for (var j = 0; j < user.locationFriends.length; j++) {
            if (user.locationFriends[j] === friends[i].userName) {
                userFriends.push(friends[i])
            }
        }
        for (var j = 0; j < user.motionFriends.length; j++) {
            if (user.motionFriends[j] === friends[i].userName) {
                userFriends.push(friends[i])
            }
        }
    }

    res.json(
        {
            status: statusSuccess,
            message: "Friends fetched",
            body: userFriends.map(function (item) {
                return {
                    userName: item.userName,
                    name: item.name,
                    age: item.age
                }
            })
        }
    )
});

/**
 * @api {post} /getAllUsers Get all users
 * @apiName getAllUsers
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object[]} body Response Object[].
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Friends fetched",
 *        "body": [
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21",
 *              },
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21",
 *              },
 *              {
 *                  userName: "user",
 *                  name: "User",
 *                  age: "21",
 *              }
 *        ]
 *   }
 */
app.post("/getAllUsers", function (req, res) {
    if (!isKeyValid(req, res)) {
        return;
    }

    let users = realm.objects("Users");

    res.json(
        {
            status: statusSuccess,
            message: "All users fetched",
            body: users.map(function (item) {
                return {
                    userName: item.userName,
                    name: item.name,
                    age: item.age
                }
            })
        }
    )
});

/**
 * @api {post} /getFriendRequests Get all friend requests of a user
 * @apiName getFriendRequests
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object[]} body Response Object[].
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Friend requests fetched",
 *        "body": [
 *              {
 *                  id: "REQ-sdfdfd-zvdgdg-arereggdd",
                    userName: "user",
                    userFullName: "User",
                    date: 1345674343,
                    typeId: 1,
 *              },
 *              {
 *                  id: "REQ-sdfdfd-zvdgdg-arereggdd",
                    userName: "user",
                    userFullName: "User",
                    date: 1345674343,
                    typeId: 1,
 *              },
 *              {
 *                  id: "REQ-sdfdfd-zvdgdg-arereggdd",
                    userName: "user",
                    userFullName: "User",
                    date: 1345674343,
                    typeId: 0,
 *              }
 *        ]
 *   }
 */
app.post("/getFriendRequests", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    let requests = realm.objects("FriendRequests");
    let receivedRequests = [];

    requests.forEach(function(item) {
        if (item.toUser === userName) {
            receivedRequests.push(item);
        }
    });

    res.json(
        {
            status: statusSuccess,
            message: "Friend requests fetched",
            body: receivedRequests.map(function (item) {
                var name = realm.objectForPrimaryKey("Users", item.fromUser).name;
                return {
                    id: item.id,
                    userName: item.fromUser,
                    userFullName: name,
                    date: item.date,
                    typeId: item.typeId,
                }
            })
        }
    )
});

/**
 * @api {post} /updateLocation Update location of a user
 * @apiName updateLocation
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 * @apiParam {String} location Location.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object[]} body Response Object[].
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Location updated",
 *   }
 */
app.post("/updateLocation", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    let location = req.body.location;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    if (!location.includes(",")) {
        res.json({status: statusError, message: "Invalid parameters"});
        return
    }

    let split = location.split(",");

    try {
        if (isNaN(split[0]) || isNaN(split[1])) {
            res.json({status: statusError, message: "Invalid parameters"});
            return
        }
    } catch (e) {
        res.json({status: statusError, message: "Invalid parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    try {
        realm.write(() => {
            user.location = location;
            addLocation(userName, location);
            res.json({status: statusSuccess, message: "Location updated"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /updateMotionStatus Update movement status of a user
 * @apiName updateMotionStatus
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username.
 * @apiParam {String} isInMotion Motion status.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object[]} body Response Object[].
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Motion status updated",
 *   }
 */
app.post("/updateMotionStatus", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    let status = JSON.parse(req.body.isInMotion);

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    // if (typeof status !== 'boolean') {
        // res.json({status: statusError, message: "Invalid parameters"});
        // return
    // }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    try {
        realm.write(() => {
            user.isInMotion = status;
            res.json({status: statusSuccess, message: "Motion status updated"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /getLocation Get location of a user
 * @apiName getLocation
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username of user.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Location fetched",
 *        "body": {
 *              latitude: "67.5456",
 *              longitude: "68.6634"
 *        }
 *   }
 */
app.post("/getLocation", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    try {
        if (user.location.includes(",")) {
            let result = user.location.split(",")
            res.json({
                status: statusSuccess, 
                message: "Location fetched",
                body: {
                    latitude: result[0],
                    longitude: result[1]
                }
            });
        } else {
            res.json({
                status: statusSuccess, 
                message: "Location fetched",
                body: {
                    latitude: "0.0",
                    longitude: "0.0"
                }
            });
        }
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /getMovementStatus Get movement status of a user
 * @apiName getMovementStatus
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username of user.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Movement Status fetched",
 *        "body": {
 *              isInMotion = true
 *        }
 *   }
 */
app.post("/getMovementStatus", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    try {
        res.json({
            status: statusSuccess, 
            message: "Movement status fetched",
            body: {
                isInMotion: user.isInMotion
            }
        });
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /sendFriendRequest Send friend request to a user
 * @apiName sendFriendRequest
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} fromUserName Username of user.
 * @apiParam {String} toUserName Username of friend.
 * @apiParam {Int} typeId Request type.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 * @apiSuccess {Object} body Response Object.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Request sent",
 *        "body": {
 *              id: "REQ-gdgwqrr-gfhfght-e56fhfh"
 *        }
 *   }
 */
app.post("/sendFriendRequest", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let fromUserName = req.body.fromUserName;
    let toUserName = req.body.toUserName;
    let typeId = req.body.typeId;

    if (!fromUserName || !toUserName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", fromUserName);
    let friend = realm.objectForPrimaryKey("Users", toUserName);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    if (!friend) {
        res.json({status: statusError, message: "Friend does not exist"});
        return
    }

    try {
        let id = 'REQ-' + fromUserName + '-' + toUserName;
        realm.write(() => {
            realm.create("FriendRequests", {
                id: id,
                fromUser: fromUserName,
                toUser: toUserName,
                date: Date.now(),
                typeId: parseInt(typeId)
            }, true);
            res.json({
                status: statusSuccess, 
                message: "Request sent",
                body: {
                    id: id
                }
            });
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /cancelFriendRequest Cancel friend request
 * @apiName cancelFriendRequest
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} id Request ID.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Request cancelled",
 *   }
 */
app.post("/cancelFriendRequest", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let reqId = req.body.id;

    if (!reqId) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let request = realm.objectForPrimaryKey("FriendRequests", reqId);

    if (!request) {
        res.json({status: statusError, message: "Request does not exist"});
        return
    }

    try {
        realm.write(() => {
            realm.delete(request);
            res.json({status: statusSuccess, message: "Request cancelled"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /acceptFriendRequest Accept friend request
 * @apiName acceptFriendRequest
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} id Request ID.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Request accepted",
 *   }
 */
app.post("/acceptFriendRequest", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let reqId = req.body.id;

    if (!reqId) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let request = realm.objectForPrimaryKey("FriendRequests", reqId);

    if (!request) {
        res.json({status: statusError, message: "Request does not exist"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", request.fromUser);
    let friend = realm.objectForPrimaryKey("Users", request.toUser);

    if (!user) {
        res.json({status: statusError, message: "User does not exist"});
        return
    }

    if (!friend) {
        res.json({status: statusError, message: "Friend does not exist"});
        return
    }

    try {
        realm.write(() => {
            if (request.typeId === 0) {
                user.locationFriends.push(friend.userName);
                friend.locationFriends.push(user.userName);
            }
            else if (request.typeId === 1) {
                user.motionFriends.push(friend.userName);
                friend.motionFriends.push(user.userName);
            }
            realm.delete(request);
            res.json({status: statusSuccess, message: "Request accepted"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /rejectFriendRequest Reject friend request
 * @apiName rejectFriendRequest
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} id Request ID.
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Request rejected",
 *   }
 */
app.post("/rejectFriendRequest", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let reqId = req.body.id;

    if (!reqId) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let request = realm.objectForPrimaryKey("FriendRequests", reqId);

    if (!request) {
        res.json({status: statusError, message: "Request does not exist"});
        return
    }

    try {
        realm.write(() => {
            realm.delete(request);
            res.json({status: statusSuccess, message: "Request rejected"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /removeFriend Remove friend
 * @apiName removeFriend
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {String} userName Username
 * @apiParam {String} friendUserName Friend Username
 *
 * @apiSuccess {String} status Success/Error.
 * @apiSuccess {String} message Response message.
 *
 * @apiErrorExample {json} Error-Response:
 *     {
 *        "status": "Error",
 *        "message": "Invalid API Key"
 *      }
 *
 * @apiSuccessExample {json} Success-Response:
 *     {
 *        "status": "Success",
 *        "message": "Friend removed",
 *   }
 */
app.post("/removeFriend", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let userName = req.body.userName;
    let friendUserName = req.body.friendUserName;

    if (!userName || !friendUserName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    let user = realm.objectForPrimaryKey("Users", userName);
    let friend = realm.objectForPrimaryKey("Users", friendUserName);

    if (!user || !friendUserName) {
        res.json({status: statusError, message: "Invalid username"});
        return
    }

    try {
        realm.write(() => {
            user.locationFriends.forEach(function(item) {
                if (item == friendUserName) {
                    var index = user.locationFriends.indexOf(item);
                    if (index !== -1) user.locationFriends.splice(index, 1);
                }
            })
            user.motionFriends.forEach(function(item) {
                if (item == friendUserName) {
                    var index = user.motionFriends.indexOf(item);
                    if (index !== -1) user.motionFriends.splice(index, 1);
                }
            })
            friend.locationFriends.forEach(function(item) {
                if (item == userName) {
                    var index = friend.locationFriends.indexOf(item);
                    if (index !== -1) friend.locationFriends.splice(index, 1);
                }
            })
            friend.motionFriends.forEach(function(item) {
                if (item == userName) {
                    var index = friend.motionFriends.indexOf(item);
                    if (index !== -1) friend.motionFriends.splice(index, 1);
                }
            })
            res.json({status: statusSuccess, message: "Friend removed"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

http.createServer(app).listen(port, function () {
    console.log("Server running on port " + port);
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function addLocation(userName, location) {
    let user = realm.objectForPrimaryKey("Users", userName);
    user.locationHistory.push(location);
}

function isKeyValid(req, res) {
    if (superuserKeys.indexOf(req.body.apiKey) === -1 && clientKeys.indexOf(req.body.apiKey) === -1) {
        res.json({status: statusError, message: "Invalid API Key"});
        return false;
    }
    return true;
}

function isSuperuserKeyValid(req, res) {
    if (superuserKeys.indexOf(req.body.apiKey) === -1) {
        res.json({status: statusError, message: "Invalid API Key"});
        return false;
    }
    return true;
}

function isClientKeyValid(req, res) {
    if (clientKeys.indexOf(req.body.apiKey) === -1) {
        res.json({status: statusError, message: "Invalid API Key"});
        return false;
    }
    return true;
}

function mapNumberList(number) {
    return number;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};