import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import hbs from 'hbs'
import geocode from './utils/geocode.js'
import forecast from './utils/forecast.js'
// import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// app.use(function (req, res, next) {
//   console.log('Middleware called: ', req.method, req.url)
//   next()
// })

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Vijji',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Vijji',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text.',
    title: 'Help',
    name: 'Vijji',
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'Please provide the address!',
    })
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error: error,
        })
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error: error,
          })
        }
        res.send({
          location,
          forecast: forecastData,
        })
      })
    }
  )
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    })
  }
  console.log(req.query.search)
  res.send({
    products: [],
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Vijji',
    errorMessage: 'Help article not found',
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: 'Help',
    name: 'Vijji',
    errorMessage: 'Page not found',
  })
})

// Below is the custom middleware to serve static files if we don't use built-in express.static()
// app.use((req, res, next) => {
//   let filePath = path.join(publicDirectoryPath, req.url)

//   // When URL is "/", serve index.html
//   if (req.url === '/') {
//     filePath = path.join(publicDirectoryPath, 'index.html')
//   }

//   fs.stat(filePath, (err, stats) => {
//     if (err || !stats.isFile()) {
//       return next()
//     }

//     fs.readFile(filePath, (error, content) => {
//       if (error) {
//          return next(error)
//       }
//       res.end(content)
//     })
//   })
// })

app.listen(3000, () => {
  console.log('Server is running on port 3000.')
})
