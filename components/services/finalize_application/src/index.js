const config = require('./config');

const express = require('express'),
    got = require('got'),
    cors = require('cors'),
    mongoClient = require('mongodb'),
    oid = require('mongodb').ObjectId,
    app = express();

app.use(express.json());
app.use(cors());

var validateApplication = function (id) {
    return got('http://' + config.get('validate-application.url') + '/validateapplication/' + id)
        .then(response => {
            return response.body;
        })
        .catch(err => {
            throw err;
        });
};

var modifyApplication = function (id, query) {
    return got.post('http://' + config.get('application.url') + '/application/' + id, { json: true, body: query })
        .then(response => {
            return response.body;
        })
        .catch(err => {
            throw err;
        });
};

app.post('/finalizeapplication/:id', function (req, res) {
    var id = req.params.id,
        query = { '_id': new oid(req.params.id) };
    validateApplication(id)
        .then(validity => {
            validity = JSON.parse(validity);
            if (!validity.valid) {
                res.status(200)
                    .json("Could not validate application.");
            } else {
                var query = { $set: { finalized: 1 } };
                modifyApplication(id, query)
                    .then(response => {
                        res.status(200)
                            .json(response);
                    })
                    .catch(err => {
                        throw err;
                    });
            };
        }).catch(err => {
            res.status(404)
                .json(err.message);
        });
});

app.listen(config.get('port'));