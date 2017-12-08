const express = require('express');
const config = require('./config');

const app = express();
app.use(express.json());

app.get('/dburl/collection/:collection', function (req, res) {
    var collection = req.params.collection;

    try {
        res.json(config.get('database.collections.' + collection));
    } catch (err) {
        res.sendStatus(404);
    }
});

app.get('/dburl', function (req, res) {
    var url = 'mongodb://' + config.get('database.uri') + '/' + config.get('database.database-name');
    res.json(url);
});

app.listen(config.get('port'));