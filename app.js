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

const port = 3000;
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
 * @api {post} /addRequestType Add request type in database
 * @apiName addRequestType
 * @apiGroup Superuser
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {Int} id Request type ID.
 * @apiParam {String} typeName Request type name.
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
 *        "message": "Type added"
 *      }
 */
app.post("/addRequestType", function (req, res) {
    if (!isSuperuserKeyValid(req, res)) {
        return;
    }

    let id = req.body.id;
    let name = req.body.typeName;
    if (!id || !name) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    try {
        realm.write(() => {
            realm.create("RequestTypes", {
                id: id,
                typeName: name
            }, true);
            res.json({status: statusSuccess, message: "Type added"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
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

    if (!userName || !password || !name || !location) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    if (isNaN(age) || !location.contains(",")) {
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
            realm.create("Users", {
                userName: userName,
                password: password,
                name: name,
                age: age,
                location: location
            }, true);
            addLocation(userName, location);
            res.json({status: statusSuccess, message: "Type added"});
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
 *        "message": "User credentials valid",
 *        "body": {
 *              userName: "sami",
 *              name: "Abdul Sami",
 *              age: 21
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

    res.json(
        {
            status: statusSuccess,
            message: "User credentials valid",
            body: {
                userName: user.userName,
                name: user.name,
                age: user.age,
                receivedRequests: user.receivedRequests.map(mapNumberList)
            }
        }
    )
});

/**
 * @api {post} /getLocationFriends Get all location friends of a user
 * @apiName getLocationFriends
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
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  location: "24.9008297,67.1680825"
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  location: "24.9008297,67.1680825"
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  location: "24.9008297,67.1680825"
 *              }
 *        ]
 *   }
 */
app.post("/getLocationFriends", function (req, res) {
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

    let friends = user.locationFriends;

    res.json(
        {
            status: statusSuccess,
            message: "User credentials valid",
            body: friends.map(function (item) {
                return {
                    userName: item.userName,
                    name: item.name,
                    age: item.age,
                    location: item.location
                }
            })
        }
    )
});

/**
 * @api {post} /getMotionFriends Get all motion friends of a user
 * @apiName getMotionFriends
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
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  isInMotion: true
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  isInMotion: false
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21",
 *                  isInMotion: true
 *              }
 *        ]
 *   }
 */
app.post("/getMotionFriends", function (req, res) {
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

    let friends = user.motionFriends;

    res.json(
        {
            status: statusSuccess,
            message: "User credentials valid",
            body: friends.map(function (item) {
                return {
                    userName: item.userName,
                    name: item.name,
                    age: item.age,
                    isInMotion: item.isInMotion
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
 *                  fromUser: "sami",
 *                  date: 1345674343,
 *                  typeId: 0
 *              },
 *              {
 *                  id: "REQ-sdfdfd-zvdgdg-arereggdd",
 *                  fromUser: "sami",
 *                  date: 1345674343,
 *                  typeId: 1
 *              },
 *              {
 *                  id: "REQ-sdfdfd-zvdgdg-arereggdd",
 *                  fromUser: "sami",
 *                  date: 1345674343,
 *                  typeId: 0
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

    let requests = user.receivedRequests;

    res.json(
        {
            status: statusSuccess,
            message: "Friend requests fetched",
            body: requests.map(function (item) {
                return {
                    id: item.id,
                    fromUser: item.fromUser,
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

    if (!location.contains(",")) {
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
 * @api {post} /updateMotionStatus Update location of a user
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
    let status = req.body.isInMotion;

    if (!userName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    if (typeof status !== 'boolean') {
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
            user.isInMotion = status;
            res.json({status: statusSuccess, message: "Motion status updated"});
        })
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
 *   }
 */
app.post("/sendFriendRequest", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let fromUserName = req.body.fromUserName;
    let toUserName = req.body.toUserName;
    let type = req.body.typeId;

    if (!fromUserName || !toUserName) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    if (isNaN(type)) {
        res.json({status: statusError, message: "Invalid parameters"});
        return
    }

    if (type !== 0 || type !== 1) {
        res.json({status: statusError, message: "Invalid parameters"});
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
        realm.write(() => {
            user.sentRequests.push({
                id: 'REQ-' + generateUUID(),
                fromUser: fromUserName,
                toUser: toUserName,
                date: Date.now(),
                typeId: type
            });
            res.json({status: statusSuccess, message: "Request sent"});
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
            res.json({status: statusSuccess, message: "Request accepted"});
        })
    } catch (e) {
        console.log(e);
        res.json({status: statusError, message: 'Write Failed'});
    }
});

/**
 * @api {post} /searchGlobalUsers Search for all users in the database
 * @apiName searchGlobalUsers
 * @apiGroup Client
 * @apiVersion 0.0.1
 *
 * @apiParam {String} apiKey Key for API authentication.
 * @apiParam {Object} query Query for search.
 * @apiParam {Int} criteria Criteria for search.
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
 *        "message": "All users fetched",
 *        "body": [
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21"
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21"
 *              },
 *              {
 *                  userName: "sami",
 *                  name: "Abdul Sami",
 *                  age: "21"
 *              }
 *        ]
 *   }
 */
app.post("/searchGlobalUsers", function (req, res) {
    if (!isClientKeyValid(req, res)) {
        return;
    }

    let query = req.body.query;
    let criteria = req.body.criteria;

    if (!query || !criteria) {
        res.json({status: statusError, message: "Empty parameters"});
        return
    }

    switch (criteria) {
        case 0: {
            break;
        }
        case 1: {
            break;
        }
        case 2: {
            break;
        }
        case 3: {
            break;
        }
        default: {
            res.json({status: statusError, message: "Invalid criteria"});
            return
        }
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
    let user = realm.objectForPrimaryKey("User", userName);
    user.locationHistory.push(location);
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