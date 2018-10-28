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

app.get('/connectionTest', function (req, res) {
    res.json({ status: statusSuccess, message: "Server is up and ready" });
});

/**
 * Admin routes
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
            res.json({ status: statusError, message: "Request initiated." });
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

app.post("/getDataForAdmin", function (req, res) {
    let nic = req.body.nic;

    if (!nic) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let data = realm.objectForPrimaryKey("Data", nic);

    if (!data) {
        res.json({ status: statusError, message: "Empty data" });
        return
    }

    if (data.access == false) {
        return
    }

    res.json(
        {
            status: statusSuccess,
            message: "Data fetched",
            body: {
                nic: data.nic,
                name: data.name,
                fatherName: data.fatherName,
                gender: data.gender,
                country: data.country,
                dob: data.dob,
                doe: data.doe
            }
        }
    )
});

/**
 * User routes
 */

app.post("/writeData", function (req, res) {
    let nic = req.body.nic;
    let name = req.body.name;
    let fatherName = req.body.fatherName;
    let gender = req.body.gender;
    let country = req.body.country;
    let dob = req.body.dob;
    let doe = req.body.doe;

    if (!nic || !name || !fatherName || !gender || !country || !dob || !doe) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let data = realm.objectForPrimaryKey("Data", nic);
    if (!data) {
        res.json({ status: statusError, message: "Invalid NIC" });
        return
    }

    try {
        realm.write(() => {
            let item = realm.create("Data", {
                nic: nic,
                name: name,
                fatherName: fatherName,
                gender: gender,
                country: country,
                dob: dob,
                doe: doe
            }, true);
            res.json({ status: statusSuccess, message: 'Data written' });
        })
    } catch (e) {
        console.log(e);
        res.json({ status: statusError, message: 'Write Failed' });
    }
});

app.post("/approveRequest", function (req, res) {
    let nic = req.body.nic;
    let reqId = req.body.reqId;

    if (!nic || !reqId) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let request = realm.objectForPrimaryKey("Requests", reqId);
    let data = realm.objectForPrimaryKey("Data", nic);
    if (!request || !data) {
        res.json({ status: statusError, message: "Invalid parameters" });
        return
    }

    try {
        realm.write(() => {
            request.status = statusApproved
            data.access = true
            res.json({ status: statusSuccess, message: 'Request granted' });
        })
    } catch (e) {
        console.log(e);
        res.json({ status: statusError, message: 'Write Failed' });
    }
});

app.post("/declineRequest", function (req, res) {
    let nic = req.body.nic;
    let reqId = req.body.reqId;

    if (!nic || !reqId) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let request = realm.objectForPrimaryKey("Requests", reqId);
    let data = realm.objectForPrimaryKey("Data", nic);
    if (!request || !data) {
        res.json({ status: statusError, message: "Invalid parameters" });
        return
    }

    try {
        realm.write(() => {
            request.status = statusDeclined
            data.access = false
            res.json({ status: statusSuccess, message: 'Request granted' });
        })
    } catch (e) {
        console.log(e);
        res.json({ status: statusError, message: 'Write Failed' });
    }
});

app.post("/revokeAccess", function (req, res) {
    let nic = req.body.nic;
    let reqId = req.body.reqId;

    if (!nic || !reqId) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let request = realm.objectForPrimaryKey("Requests", reqId);
    let data = realm.objectForPrimaryKey("Data", nic);
    if (!request || !data) {
        res.json({ status: statusError, message: "Invalid parameters" });
        return
    }

    try {
        realm.write(() => {
            request.status = statusRevoked
            data.access = false
            res.json({ status: statusSuccess, message: 'Request granted' });
        })
    } catch (e) {
        console.log(e);
        res.json({ status: statusError, message: 'Write Failed' });
    }
});

app.post("/getDataForUser", function (req, res) {
    let nic = req.body.nic;

    if (!nic) {
        res.json({ status: statusError, message: "Empty parameters" });
        return
    }

    let data = realm.objectForPrimaryKey("Data", nic);

    res.json(
        {
            status: statusSuccess,
            message: "Data fetched",
            body: {
                nic: data.nic,
                name: data.name,
                fatherName: data.fatherName,
                gender: data.gender,
                country: data.country,
                dob: data.dob,
                doe: data.doe
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