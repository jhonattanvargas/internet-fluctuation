const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.export= SpeedTest = new Schema({
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
