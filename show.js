const express = require('express')
const app = express()
const helmet = require('helmet')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const conn = mongoose.createConnection('mongodb://usr:pass@server_address:server_port/collection')
const SpeedTest = require('./models/SpeedTest')

const config = {
    port: 3000,
    viewExt: '.hbs',
    viewPath: './views',
    publicPath: './public'
}

//for security
app.use(helmet())

//public
app.use(express.static(path.join(__dirname, config.publicPath)))

//Handlebars setup
app.engine(config.viewExt, exphbs({
    extname: config.viewExt
}))

//View Engine Setup
app.set('views', path.join(__dirname, config.viewPath))
app.set('view engine', config.viewExt)

//Mongodb
const collection = conn.model('Speedtest', SpeedTest)


//Server
const server = require('http').Server(app)

app.get('/data', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    collection.find(function (err, data) {
        if (err) return console.error(err);
        res.json(data)
      })
})

app.get('/show', (req,res) => {
    res.render('index',{
        layout:false
    })
})

server.listen(config.port,()=>{
    console.log(`Server is now runing`)
})