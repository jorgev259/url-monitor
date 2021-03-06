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
  this.lastState = null
  this.successCodes = options.successCodes || [200, 301, 302]
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
    const code = res ? res.statusCode : null
    let event = 'unavailable'

    if (err) event = 'error'
    else if (self.successCodes.includes(code)) event = 'available'

    // ask Koba if she wants response time or end time
    self.emit(event, { code, url, message: res ? HTTPStatus[code] : 'Host unavailable', time: res ? res.timings.end : 0 })
  })
}

// ------ Export module
module.exports = urlmon
