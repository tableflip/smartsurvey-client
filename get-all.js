var each = require('async-each')

function getAll (get, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  cb = cb || function () {}

  var pageSize = options.pageSize || 10

  get({ page: 1, pageSize: pageSize }, function (err, result) {
    if (err) return cb(err)
    if (options.onPage) options.onPage(result)

    var totalPages = Math.ceil(result.meta.pagination.total / pageSize)

    if (totalPages < 2) {
      return cb(null, result.data)
    }

    var pages = []
    for (var i = 2; i < totalPages + 1; i++) pages.push(i)

    each(pages, function (page, cb) {
      get(page, pageSize, function (err, result) {
        if (err) return cb(err)
        if (options.onPage) options.onPage(result)
        cb(null, result)
      })
    }, function (err, results) {
      if (err) return cb(err)

      cb(null, results.reduce(function (result, pageResult) {
        result.data = result.data.concat(pageResult.data)
        return result
      }, { data: [] }))
    })
  })
}

module.exports = getAll
