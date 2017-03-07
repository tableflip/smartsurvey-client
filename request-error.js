// https://docs.smartsurvey.io/v1/docs/errors
function RequestError (message, res, body) {
  var err = new Error((body && body.message) || message)
  err.status = (body && body.status) || res.statusCode
  err.code = (body && body.code)
  return err
}

module.exports = RequestError
