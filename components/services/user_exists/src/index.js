const config = require('./config');

const express = require('express');
const got = require('got');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());

var getUser = function (username) {
    return got('http://' + config.get('user-url.uri') + '/user/' + username)
        .catch(err => {
            throw {
                status: 404,
                payload: {
                    message: "Could not retrieve user information."
                }
            }
        });
};

app.get('/checkuserexists/:username', function (req, res) {
    var newuser = req.params.username;

    getUser(newuser)
        .then(result => {
            if (JSON.parse(result.body) == null) {
                res.status(200).json({ status: 0, message: "User " + newuser + " does not exists." });
            } else {
                res.status(200).json({ status: 1, message: "User " + newuser + " exists." });
            };
        })
        .catch(err => {
            res.status(err.status).json(r.payload);
        });
});

app.listen(config.get('port'));
