/**
 * Schemas for database
 */
const RequestSchema = {
    name: 'Requests',
    primaryKey: 'id',
    properties: {
        id: 'string',
        nic: 'string',
        status: 'string'
    }
}

const DataSchema = {
    name: 'Data',
    primaryKey: 'nic',
    properties: {
        nic: 'string',
        name: 'string',
        fatherName: 'string',
        gender: { type: 'bool', default: true },
        country: { type: 'string', default: 'Pakistan' },
        dob: { type: 'string', default: '24.11.1996' },
        doe: { type: 'string', default: '26.11.2025' },
        access: { type: 'bool', default: false }
    }
}

/**
 * App dependencies
 */
const express = require('express');
const http = require('http');
const logger = require('logger');
const Realm = require("realm");
const bodyParser = require("body-parser");
const cors = require("cors");

var port = process.env.PORT || 8080;
const schemaVersionNumber = 0;
const app = express();
const schemas = [RequestSchema, DataSchema];

/**
 * Response status
 */
const statusSuccess = "Success";
const statusError = "Error";

const statusPending = "Pending"
const statusApproved = "Approved"
const statusRevoked = "Revoked"
const statusDeclined = "Declined"

/**
 * Init realm
 */
const realm = new Realm({
    schema: schemas,
    schemaVersion: schemaVersionNumber
});

app.use(bodyParser.urlencoded({ extended: false }));
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
    res.json({ status: statusSuccess, message: "Server is up and ready" });
});

/**
 * Client routes
 */

app.post("/requestAccess", function (req, res) {
    let nic = req.body.nic;

    if (!nic) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let id = 'REQ-' + generateUUID();

    try {
        realm.write(() => {
            let item = realm.create("Requests", {
                id: id,
                nic: nic,
                status: statusPending
            }, true);
        })
    } catch (e) {
        console.log(e);
        res.json({ status: statusError, message: 'Write Failed' });
    }
});

app.get('/getRequests', function (req, res) {
    let requests = realm.objects("Requests");

    res.json(
        {
            status: statusSuccess,
            message: "Requests fetched",
            body: {
                requests: requests.map(function (item) {
                    return {
                        id: item.id,
                        nic: item.nic,
                        status: item.status
                    }
                })
            }
        }
    )
});

app.post("/getData", function (req, res) {
    let nic = req.body.nic;

    if (!nic) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let data = realm.objectForPrimaryKey("Data", nic);

    if (data.access == false) {
        return
    }

    res.json(
        {
            status: statusSuccess,
            message: "Requests fetched",
            body: {
                nic: data.nic,
                name: data.name,
                fatherName: data.fatherName,
                gender: data.gender,
                country: data.country,
                dob: data.dob,
                doe: data.doe,
            }
        }
    )
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

function mapNumberList(number) {
    return number;
}

Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};