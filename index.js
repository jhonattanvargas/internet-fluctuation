const mongoose = require('mongoose')
const speedTest = require('speedtest-net')
const conn = mongoose.createConnection('mongodb://usr:pass@server_address:server_port/collection')
const Schema = mongoose.Schema
const os = require('os')
var address 
require('node-macaddress').one(function (err, addr) { address = addr } )

const SpeedTest = new Schema({
    computer: {
        name: String,
        mac: String
    },
    time: {
        type: Date,
        default: Date.now
    },
    speeds: {
        download: Number,
        upload: Number
    },
    client:{
        ip: String,
        lat: Number,
        lon: Number,
        isp: String
    },
    server: {
        host: String,
        lat: Number,
        lon: Number,
        location: String,
        country: String,
        sponsor: String,
        ping: Number,
        id: Number
    }
})

const collection = conn.model('Speedtest',SpeedTest)

function speedtest(){
    let test = speedTest({maxTime: 5000})
    test.on('data', data => {
        //console.log(data)
        speed = new collection({
            computer: {
                name: os.hostname(),
                mac: address
            },
            speeds: {
                download: data.speeds.download,
                upload: data.speeds.upload
            },
            client: {
                ip: data.client.ip,
                lat: data.client.lat,
                lon: data.client.lon,
                isp: data.client.isp
            },
            server: {
                host: data.server.host,
                lat: data.server.lat,
                lon: data.server.lon,
                location: data.server.location,
                country: data.server.country,
                sponsor: data.server.sponsor,
                ping: data.server.ping,
                id: data.server.id
            }
        })

        speed.save(function (err) {
            //if (!err) console.log('Success!')
        })

        test.on('error', err => {
            console.error(err);
        })
    })
}

setInterval(speedtest,10000)
