# smartsurvey-client

A simple JavaScript client to the SmartSurvey REST API.

## Example

```js
var SmartSurveyClient = require('smartsurvey-client')
var client = new SmartSurveyClient({ apiToken: 'TOKEN', apiTokenSecret: 'SECRET' })

client.getSurveys({ page: 1, pageSize: 25 }, function (err, result) {
  if (err) throw err
  console.log(result)
  // result:
  // {
  //   data: [],
  //   meta: {
  //     pagination: { page: 1, pageSize: 25, returned: 25, total: 31 }
  //   }
  // }
})
```

## Errors

Non HTTP 200 responses to API calls will be returned as an error. If the API provides it, the error message will have a `status`, `message` and `code` property. If not, `status` will be set to the status code from the request and `message` will be a generic error message.

```js
RequestError {
  status: 404,
  message: "Survey with id '123' could not be found.",
  code: 'not_found'
}
```

## Callbacks

Callback results to API methods have a standard structure. They are objects with a `data` property (the data returned by the API - an array or an object), a `meta` property (metadata included in the HTTP headers) and a raw `response` property.

```js
Result {
  data: [...],
  meta: {
    pagination: { page: 1, pageSize: 25, returned: 25, total: 31 }
    release: '1.1.0.29',
    server: 'Web1'
  },
  response: {...}
}
```

## Conventions

Request params are named as per the params documented in the SmartSurvey API docs, however they are renamed from `snake_case` to `camelCase`.

All requests take `apiToken` and `apiTokenSecret` params, but they can be optionally passed to the constructor where they will automatically be added to each request.

## API

**This module is work in progress**.

The following API calls have been implemented:

### `getSurveys([options,] cb)`

https://docs.smartsurvey.io/v1/reference#surveys

Fetch a page of surveys.

* `options.page` - page to fetch (default 1)
* `options.pageSize` - number of items per page (default 10)
* `options.sortBy` - field(s) to sort by

### `getSurvey(surveyId, [options,] cb)`

https://docs.smartsurvey.io/v1/reference#get-a-survey

Fetch a single survey.

* `options.detailed` - fetch more detailed survey data

### `getResponses(surveyId, [options,] cb)`

https://docs.smartsurvey.io/v1/reference#get-responses

Fetch a page of responses.

* `options.completed` - 0=Partial, 1=Completed, 2=Both - Return completed responses or partial
* `options.since` - return responses that completed no earlier than this date
* `options.until` - return responses that completed no later than this date
* `options.filterId` - enter the filter report ID you would like to use. Other filters will be ignored
* `options.trackingLinkId` - filter by tracking link id
* `options.uniqueId` - filter the unique (x) value
* `options.includeLabels` - return text of page/question/choice labels, rather than indices only
* `options.page` - page to fetch (default 1)
* `options.pageSize` - number of items per page (default 10)
* `options.sortBy` - field(s) to sort by

### `getResponse(surveyId, responseId, [options,] cb)`

https://docs.smartsurvey.io/v1/reference#get-a-response

Fetch a single response.

### `getFolder(folderId, [options,] cb)`

https://docs.smartsurvey.io/v1/reference#get-a-response

Fetch a details on a folder (a way that surveys are collected).

https://docs.smartsurvey.io/v1/reference#surveyfoldersfolder_iddetailed


## Utility

### `getAll(get, [options,] cb)`

* `get` - function that retrieves a page of content
* `options.pageSize` - size of pages that are retrieved (default 10)
* `options.onPage` - called when each page of results is retrieved

e.g.

```js
var SmartSurveyClient = require('smartsurvey-client')
var getAll = require('smartsurvey-client/get-all')
var client = new SmartSurveyClient({ apiToken: 'TOKEN', apiTokenSecret: 'SECRET' })

// Retrieve a page of surveys
function getPageOfSurveys (page, pageSize, cb) {
  // Merge page and pageSize with your request options
  client.getSurveys({ page: page, pageSize: pageSize }, cb)
}

// Optional callback for each page
function onPage (result) {
  console.log('Got page number', result.meta.pagination.page)
}

// Start fetch all the pages!
getAll(getPageOfSurveys, { pageSize: 10, onPage: onPage }, function (err, result) {
  console.log(result.data) // All surveys
})
```

----

A [(╯°□°）╯︵TABLEFLIP](https://tableflip.io) side project.
