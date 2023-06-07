const Koa = require('koa')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const mongoose = require('mongoose')
const path = require('path')

const app = new Koa()

const routing = require('./routes')

// Configure the mongoose
const { connectionStr } = require('./config')
mongoose.connect(connectionStr).then(() => console.log('MongoDB Successful connection!'))
mongoose.connection.on('error', console.error)

// Use a static resource middleware
app.use(koaStatic(path.join(__dirname, 'public')))

// Use the error-handling middleware
app.use(
  error({
    postFormat: (e, { stack, ...rest }) => (process.env.NODE_ENV === 'production' ? rest : { stack, ...rest })
  })
)
// Use the upload file middleware
app.use(
  koaBody({
    multipart: true, // Support for upload file format
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'), // The directory of the uploaded file
      keepExtensions: true // Hold the extension of the file
    }
  })
)

// Use the calibration parameter middleware
app.use(parameter(app))
// Register router
routing(app)
// Listen port
app.listen(3000, () => console.log('The program starts at port 3000'))
