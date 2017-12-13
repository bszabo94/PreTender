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
    return got('http://' + config.get('user-url.uri') + '/user/' + username)
        .then(resp => {

            if (JSON.parse(resp.body) != null) {
                return true;
            } else {
                return false;
            }
        })
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not use user-exist service."
                }
            }
        });
};

var getTenderType = function (type) {
    return got('http://' + config.get('tender-type-url.uri') + '/tendertype', { headers: { 'type': type } })
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not retrieve tender-type."
                }
            }
        });
};

var getTenderTypeByID = function (id) {
    return got('http://' + config.get('tender-type-url.uri') + '/tendertype/' + id)
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not retrieve tender-type."
                }
            }
        });
};

var getIssuedtender = function (id) {
    return got('http://' + config.get('issued-tender-url.uri') + '/issuedtender/' + id)
        .catch(() => {
            throw {
                status: 400,
                payload: {
                    message: "Could not retrieve issued tender."
                }
            }
        });
};

var modUser = function (username, query) {
    return got.post('http://' + config.get('user-url.uri') + '/user/' + username, { json: true, body: query })
        .catch(err => {
            throw {
                status: 400,
                payload: {
                    message: "Could not modify user properlyr."
                }
            }
        });
};

var saveApplication = function (application) {
    return got.post('http://' + config.get('save-application-url.uri') + '/saveapplication', { json: true, body: application })
        .catch(err => {
            throw {
                status: 400,
                payload: {
                    message: "Could not save application."
                }
            }
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
                            res.status(400).json("Issued Tender not found.");
                        }
                        getTenderType(it.type)
                            .then(tt => {
                                tt = JSON.parse(tt.body);
                                if (it == null) {
                                    res.status(400).json("Tender Type not found.");
                                }

                                newApplication.user = username;
                                newApplication.referenceID = issuedtenderid;
                                newApplication.tendertype = tt['_id'];
                                var date = new Date()
                                newApplication.lastedited = date.toISOString();

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

                                        var appID = result.body.insertedId;

                                        var query = {
                                            $push: {
                                                tenders: appID
                                            }
                                        };
                                        modUser(username, query)
                                            .then(result => {
                                                if (result.body.nModified == 1) {
                                                    res.status(200)
                                                        .json({ status: 1, message: "Tender succesfully applied." });
                                                } else {
                                                    res.status(400)
                                                        .json("Something went wrong. Apply unsuccesful.");
                                                }
                                            })
                                            .catch(err => {
                                                res.status(400)
                                                    .json(err.message);
                                            });
                                    })
                                    .catch(err => {
                                        res.status(400)
                                            .json(err.message);
                                    });
                            })
                            .catch(err => {
                                res.status(400)
                                    .json(err.message);
                            });

                    })
                    .catch(err => {
                        res.status(400)
                            .json(err.message);
                    });
            } else {
                res.status(400)
                    .json("Invalid username for apply tender.");
            }
        })
        .catch(() => {
            res.status(400)
                .json("Could not check user existence.");
        });


});

app.listen(config.get('port'));
