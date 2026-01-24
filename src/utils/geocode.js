import request from 'request'

const geocode = (address, callback) => {
  const url = `https://api.geoloods.io/v2/search?api_key=${
    process.env.GEO_API_KEY
  }&query=${encodeURIComponent(address)}`

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      return callback('Unable to connect to geocoding service!', undefined)
    }

    if (typeof body === 'string') {
      return callback(body, undefined)
    }

    if (body.error) {
      return callback(body.error, undefined)
    }

    const results = body

    // filter for place in USA
    const location = results.find((place) => place.CountryCode === 'US')

    if (!location || location.length === 0) {
      return callback('Unable to find location. Try another search.', undefined)
    }

    callback(undefined, {
      latitude: location.Latitude,
      longitude: location.Longitude,
      location: location.Name,
    })
  })
}

export default geocode
