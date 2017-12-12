const express = require('express');
const config = require('./config');
var cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/dburl', function (req, res) {
    var url = 'mongodb://' + config.get('database.uri') + '/' + config.get('database.database-name');
    res.status(200).json(url);
});

// app.get('/dburl/collection/:collection', function (req, res) {
//     var collection = req.params.collection;

//     try {
//         res.json(config.get('database.collections.' + collection));
//     } catch (err) {
//         res.sendStatus(404);
//     }
// });

app.listen(config.get('port'));
