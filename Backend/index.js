const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 4000;
var mongo = require('mongodb');
require('dotenv').config();

//MiddleWares
app.use(cors());
app.use(express.json());

//MongoDb Methods
//var MongoClient = require('mongodb').MongoClient;
//var url = process.env.MONGO_DB_URL;

//Particle connection
var Particle = require('particle-api-js');
var particle = new Particle();
var token = process.env.PARTICLE_TOKEN;

particle
    .login({
        username: process.env.PARTICLE_EMAIL,
        password: process.env.PARTICLE_PASSWORD,
    })
    .then(
        function (data) {
            console.log('API Login Sucess', data.body.access_token);
        },
        function (err) {
            console.log('Could not log in.', err);
        }
    );
/*
var devicesPr = particle.listDevices({ auth: process.env.PARTICLE_TOKEN });
devicesPr.then(
    function (devices) {
        console.log('Devices: ', devices);
    },
    function (err) {
        console.log('List devices call failed: ', err);
    }
);
*/

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/photonToggle', function (req, res) {
    var fnPr = particle.callFunction({
        deviceId: process.env.PHOTON_DEVICE_ID,
        name: 'Pomo Toggle',
        argument: 'pomo',
        auth: token,
    });

    fnPr.then(
        function (data) {
            console.log('Function called succesfully:', data);
            particle
                .getVariable({
                    deviceId: process.env.PHOTON_DEVICE_ID,
                    name: 'toggleState',
                    auth: token,
                })
                .then(
                    function (data) {
                        console.log(
                            'Device variable retrieved successfully:',
                            data
                        );
                        res.status(200).send({ status: data.body.result });
                    },
                    function (err) {
                        console.log(
                            'An error occurred while getting attrs:',
                            err
                        );
                    }
                );
        },
        function (err) {
            console.log('An error occurred:', err);
        }
    );
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
