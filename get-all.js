var each = require('async-each')

function getAll (get, options, cb) {
  if (!cb) {
    cb = options
    options = {}
  }

  options = options || {}
  var collect = !!cb
  cb = cb || function () {}

  var pageSize = options.pageSize || 10

  get(1, pageSize, function (err, firstResult) {
    if (err) return cb(err)
    if (options.onPage) options.onPage(firstResult)

    var totalPages = Math.ceil(firstResult.meta.pagination.total / pageSize)

    if (totalPages < 2) {
      return cb(null, firstResult.data)
    }

    var pages = []
    for (var i = 2; i < totalPages + 1; i++) pages.push(i)

    each(pages, function (page, cb) {
      get(page, pageSize, function (err, result) {
        if (err) return cb(err)
        if (options.onPage) options.onPage(result)
        cb(null, collect ? result : null)
      })
    }, function (err, results) {
      if (err || !collect) return cb(err)

      cb(null, [firstResult].concat(results).reduce(function (result, pageResult) {
        result.data = result.data.concat(pageResult.data)
        return result
      }, { data: [] }))
    })
  })
}

module.exports = getAll
