var Request = require('request')
var RequestError = require('./request-error')
var ResponseMeta = require('./response-meta')
var undef

/**
* Create a new SmartSurvey API Client
* @constructor
* @param {Object} [options]
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {string} [options.baseUrl] API base URL (default https://api.smartsurvey.io/v1)
*/
function SmartSurveyClient (options) {
  if (this instanceof SmartSurveyClient === false) {
    return new SmartSurveyClient(options)
  }
  this._options = options || {}
}

SmartSurveyClient.prototype._baseUrl = function () {
  return this._options.baseUrl || 'https://api.smartsurvey.io/v1'
}

SmartSurveyClient.prototype._authenticateQueryString = function (qs, options) {
  qs = qs || {}
  options = options || {}

  if (!options.apiToken || !options.apiTokenSecret) {
    qs.api_token = this._options.apiToken
    qs.api_token_secret = this._options.apiTokenSecret
  } else {
    qs.api_token = options.apiToken
    qs.api_token_secret = options.apiTokenSecret
  }

  if (!qs.api_token) throw new Error('API token is required')
  if (!qs.api_token_secret) throw new Error('API token secret is required')

  return qs
}

/**
* Fetch a page of surveys.
* @param {Object} [options]
* @param {number} [options.page] Page number to retrieve (default 1)
* @param {number} [options.pageSize] Page size to retrieve (default 10)
* @param {string|string[]} [options.sortBy] Field(s) to sort by
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {SmartSurveyClient~requestCallback} cb
*/
SmartSurveyClient.prototype.getSurveys = function (options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var qs = {}

  if (options.page !== undef) qs.page = options.page
  if (options.pageSize !== undef) qs.page_size = options.pageSize
  if (options.sortBy !== undef) qs.sort_by = options.sortBy

  try {
    qs = this._authenticateQueryString(qs, options)
  } catch (err) {
    return setTimeout(function () { cb(err) })
  }

  return Request.get({
    method: 'GET',
    url: this._baseUrl() + '/surveys',
    qs: qs,
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      return cb(new RequestError('Failed to get surveys', res, body))
    }

    cb(null, { data: body, meta: ResponseMeta.parse(res), response: res })
  })
}

/**
* Fetch a single survey.
* @param {number} surveyId ID of the survey to fetch
* @param {Object} [options]
* @param {boolean} [options.detailed] Get detailed information about a survey
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {SmartSurveyClient~requestCallback} cb
*/
SmartSurveyClient.prototype.getSurvey = function (surveyId, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var qs = {}

  try {
    qs = this._authenticateQueryString(qs, options)
  } catch (err) {
    return setTimeout(function () { cb(err) })
  }

  return Request.get({
    method: 'GET',
    url: this._baseUrl() + '/surveys/' + encodeURIComponent(surveyId) + (options.detailed ? '/detailed' : ''),
    qs: qs,
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      return cb(new RequestError('Failed to get survey', res, body))
    }

    cb(null, { data: body, meta: ResponseMeta.parse(res), response: res })
  })
}

/**
* Fetch a page of survey responses.
* @param {number} surveyId ID of the survey from which to fetch responses
* @param {Object} [options]
* @param {number} [options.completed] 0=Partial, 1=Completed, 2=Both - Return completed responses or partial
* @param {Date} [options.since] Return responses that completed no earlier than this date
* @param {Date} [options.until] Return responses that completed no later than this date
* @param {number} [options.filterId] Enter the filter report ID you would like to use. Other filters will be ignored
* @param {number} [options.trackingLinkId] Filter by tracking link id
* @param {number} [options.uniqueId] Filter the unique (x) value
* @param {boolean} [options.includeLabels] Return text of page/question/choice labels, rather than indices only
* @param {number} [options.page] Page number to retrieve (default 1)
* @param {number} [options.pageSize] Page size to retrieve (default 10)
* @param {string|string[]} [options.sortBy] Field(s) to sort by
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {SmartSurveyClient~requestCallback} cb
*/
SmartSurveyClient.prototype.getResponses = function (surveyId, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var qs = {}

  if (options.completed !== undef) qs.completed = options.completed
  if (options.since !== undef) qs.since = options.since
  if (options.until !== undef) qs.until = options.until
  if (options.filterId !== undef) qs.filter_id = options.filterId
  if (options.trackingLinkId !== undef) qs.tracking_link_id = options.trackingLinkId
  if (options.uniqueId !== undef) qs.unique_id = options.uniqueId
  if (options.includeLabels !== undef) qs.include_labels = options.includeLabels
  if (options.page !== undef) qs.page = options.page
  if (options.pageSize !== undef) qs.page_size = options.pageSize
  if (options.sortBy !== undef) qs.sort_by = options.sortBy

  try {
    qs = this._authenticateQueryString(qs, options)
  } catch (err) {
    return setTimeout(function () { cb(err) })
  }

  return Request.get({
    method: 'GET',
    url: this._baseUrl() + '/surveys/' + encodeURIComponent(surveyId) + '/responses',
    qs: qs,
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      return cb(new RequestError('Failed to get responses', res, body))
    }

    cb(null, { data: body, meta: ResponseMeta.parse(res), response: res })
  })
}

/**
* Fetch a single survey response.
* @param {number} surveyId ID of the survey to fetch the response from
* @param {number} responseId ID of the response to fetch
* @param {Object} [options]
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {SmartSurveyClient~requestCallback} cb
*/
SmartSurveyClient.prototype.getResponse = function (surveyId, responseId, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var qs = {}

  try {
    qs = this._authenticateQueryString(qs, options)
  } catch (err) {
    return setTimeout(function () { cb(err) })
  }

  return Request.get({
    method: 'GET',
    url: this._baseUrl() + '/surveys/' + encodeURIComponent(surveyId) + '/responses/' + encodeURIComponent(responseId),
    qs: qs,
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      return cb(new RequestError('Failed to get response', res, body))
    }

    cb(null, { data: body, meta: ResponseMeta.parse(res), response: res })
  })
}

/**
* Fetch details of a survey folder
* @param {number} folderId ID of the folder to fetch
* @param {Object} [options]
* @param {string} [options.apiToken] API Token
* @param {string} [options.apiTokenSecret] API Token Secret
* @param {SmartSurveyClient~requestCallback} cb
*/

SmartSurveyClient.prototype.getFolder = function (folderId, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var qs = {}

  try {
    qs = this._authenticateQueryString(qs, options)
  } catch (err) {
    return setTimeout(function () { cb(err) })
  }

  return Request.get({
    method: 'GET',
    url: this._baseUrl() + '/surveyfolders/' + encodeURIComponent(folderId) + '/detailed',
    qs: qs,
    json: true
  }, function (err, res, body) {
    if (err) return cb(err)

    if (res.statusCode !== 200) {
      return cb(new RequestError('Failed to get folder', res, body))
    }

    cb(null, { data: body, meta: ResponseMeta.parse(res), response: res })
  })
}

/**
 * @callback SmartSurveyClient~requestCallback
 * @param {Error} err
 * @param {Object} result
 * @param {Object} result.data Response data
 * @param {Object} result.meta Metadata from the API
 * @param {Object} result.meta.pagination Pagination metadata
 * @param {number} result.meta.pagination.page Current page number
 * @param {number} result.meta.pagination.pageSize Number of items per page
 * @param {number} result.meta.pagination.returned Number of items returned
 * @param {number} result.meta.pagination.total Total items available
 * @param {string} result.meta.release API version number
 * @param {string} result.meta.server Server name that processed the request
 * @param {Object} result.response IncomingMessage object from request
 */

module.exports = SmartSurveyClient
