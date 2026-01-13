import request from 'request'

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a4efb06dd154b39a6387f106ac99781c&query=${latitude},${longitude}&units=f`

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      return callback('Unable to connect to weather service!', undefined)
    }
    if (body.error) {
      return callback(body.error.info, undefined)
    }
    callback(
      undefined,
      `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feeels like ${body.current.feelslike} degrees out. There is ${body.current.precip}% chance of rain.`
    )
  })
}

export default forecast
