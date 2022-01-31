const express = require('express')
let path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
const Store = require('electron-store');

(async () => {

    console.log("Server started");

    let appPath = process.argv[3];
    const localStore = new Store({ cwd: appPath });
    const app = express()

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(cors());

    app.get('/store', async (req, res) => {
        let data = localStore.store;
        res.json(data);
    });

    const port = 0; // Pick random available port

    let server = app.listen(port, () => {
        console.log('server listening')
        let currentPort = server.address().port;

        process.send({
            status: 'ready',
            port: currentPort
        });
    })

})();
