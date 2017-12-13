const config = require('./config');

const express = require('express');
const got = require('got');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

var newApplication = {
    "referenceID": 0,
    "tendertype": 0,
    "user": "",
    "lastedited": "",
    "finilized": 0,
    "data": null
};

var checkUserExists = function (username) {
    return got('http://' + config.get('user.url') + '/user/' + username)
        .then(resp => {
            return JSON.parse(resp.body) != null;
        })
        .catch(err => {
            throw err;
        });
};

var getTenderType = function (type) {
    return got('http://' + config.get('tender-type.url') + '/tendertype', { headers: { 'type': type } })
        .catch(err => {
            throw err;
        });
};

var getTenderTypeByID = function (id) {
    return got('http://' + config.get('tender-type.url') + '/tendertype/' + id)
        .catch(err => {
            throw err;
        });
};

var getIssuedtender = function (id) {
    return got('http://' + config.get('issued-tender.url') + '/issuedtender/' + id)
        .catch(err => {
            throw err;
        });
};

var modUser = function (username, query) {
    return got.post('http://' + config.get('user.url') + '/user/' + username, { json: true, body: query })
        .catch(err => {
            throw err;
        });
};

var saveApplication = function (application) {
    return got.post('http://' + config.get('save-application.url') + '/saveapplication', { json: true, body: application })
        .catch(err => {
            throw err;
        });
};

app.post('/applytender/:username/:issuedtenderid', function (req, res) {
    var username = req.params.username,
        issuedtenderid = req.params.issuedtenderid;

    checkUserExists(username)
        .then(exists => {
            if (exists) {
                getIssuedtender(issuedtenderid)
                    .then(it => {
                        it = JSON.parse(it.body);
                        if (it == null) {
                            res.status(404)
                                .json("Issued Tender not found.");
                            return;
                        }
                        getTenderType(it.type)
                            .then(tt => {
                                tt = JSON.parse(tt.body);
                                if (it == null) {
                                    res.status(404)
                                        .json("Tender Type not found.");
                                    return;
                                }

                                newApplication.user = username;
                                newApplication.referenceID = issuedtenderid;
                                newApplication.tendertype = tt['_id'];
                                newApplication.lastedited = (new Date()).toISOString();

                                var data = {
                                    firstname: "",
                                    lastname: ""
                                };
                                var ttData = tt.requirements;
                                for (prop of Object.keys(ttData))
                                    data[prop] = "";

                                data["recommendation"] = "";
                                data["documents"] = [];
                                newApplication.data = data;
                                newApplication = newApplication;
                                saveApplication(newApplication)
                                    .then(result => {
                                        var appID = result.body.insertedId,
                                            query = {
                                                $push: {
                                                    tenders: appID
                                                }
                                            };
                                        return modUser(username, query)
                                    })
                                    .then(result => {
                                        if (result.body.nModified == 1) {
                                            res.status(200)
                                                .json({ status: 1, message: "Tender succesfully applied." });
                                        } else {
                                            res.status(404)
                                                .json({ status: 0, message: "Something went wrong. Apply unsuccesful." });
                                        }
                                    })
                                    .catch(err => {
                                        throw err;
                                    });
                            })
                            .catch(err => {
                                throw err;
                            });
                    })
                    .catch(err => {
                        throw err;
                    });
            } else {
                res.status(404)
                    .json("User not found. Cannot apply for tender.");
            }
        })
        .catch(err => {
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));