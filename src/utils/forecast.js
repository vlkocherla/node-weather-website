import request from 'request'

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${latitude},${longitude}&units=f`

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      return callback('Unable to connect to weather service!', undefined)
    }
    if (body.error) {
      return callback(body.error.info, undefined)
    }
    callback(
      undefined,
      `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degrees out. It feeels like ${body.current.feelslike} degrees out. The humidity is ${body.current.humidity}%.`,
    )
  })
}

export default forecast
