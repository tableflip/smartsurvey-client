exports.parse = function (res) {
  var meta = {}

  if (res.headers['x-ss-pagination-page']) {
    meta.pagination = meta.pagination || {}
    meta.pagination.page = res.headers['x-ss-pagination-page']
  }

  if (res.headers['x-ss-pagination-pagesize']) {
    meta.pagination = meta.pagination || {}
    meta.pagination.pageSize = res.headers['x-ss-pagination-pagesize']
  }

  if (res.headers['x-ss-pagination-returned']) {
    meta.pagination = meta.pagination || {}
    meta.pagination.returned = res.headers['x-ss-pagination-returned']
  }

  if (res.headers['x-ss-pagination-total']) {
    meta.pagination = meta.pagination || {}
    meta.pagination.total = res.headers['x-ss-pagination-total']
  }

  if (res.headers['x-ss-release']) {
    meta.release = res.headers['x-ss-release']
  }

  if (res.headers['x-ss-server']) {
    meta.server = res.headers['x-ss-server']
  }

  return meta
}
