const event = require('events').EventEmitter
const HTTPStatus = require('http-status')
const util = require('util')
const request = require('request')

// ------ Constructor
function urlmon (options) {
  this.url = options.url
  this.interval = options.interval || 5000
  this.timeout = options.timeout || 3000
  this.handle = null
}

// ------ Inherit from 'events' module
util.inherits(urlmon, event)

// ------ Starts monitor
urlmon.prototype.start = function () {
  const self = this

  const timer = function () {
    testUrl.call(self, self.url)
    self.handle = setTimeout(timer, self.interval)
  }

  timer()
}

// ------ Stops monitor
urlmon.prototype.stop = function () {
  clearTimeout(this.handle)
  this.handle = null
}

// ------ Test url
function testUrl (url) {
  const self = this
  request.get({
    url,
    timeout: self.timeout,
    time: true
  }, (err, res) => {
    if (err) {
      self.emit('error', { code: null, url: url, message: 'Host unavailable', time: 0 })
    } else {
      let event = 'unavailable'

      if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
        event = 'available'
      }

      // ask Koba if she wants response time or end time
      const code = res.statusCode
      self.emit(event, { code, url, message: HTTPStatus[code], time: res.timings.end })
    }
  })
}

// ------ Export module
module.exports = urlmon
