const event = require('events').EventEmitter
const HTTPStatus = require('http-status')
const request = require('request')

class Urlmon extends event {
  constructor (args) {
    super()
    const { url, interval = 5000, timeout = 3000, successCodes = [200, 301, 302] } = args

    this.url = url
    this.interval = interval
    this.timeout = timeout
    this.successCodes = successCodes
  }

  start () {
    if (this.handle) throw new Error('Monitor already started')
    this.handle = setTimeout(testUrl, 0, this)
  }

  stop () {
    if (!this.handle) throw new Error('Monitor is not started')
    clearTimeout(this.handle)
    this.handle = null
  }
}

// ------ Test url
function testUrl (self) {
  const { url, timeout } = self

  request.get({ url, timeout, time: true },
    (err, res) => {
      const code = res ? res.statusCode : null
      let event = 'unavailable'

      if (err) event = 'error'
      else if (self.successCodes.includes(code)) event = 'available'

      self.emit(event, { code, url, message: res ? HTTPStatus[code] : 'Host unavailable', time: res ? res.timings.end : 0 })
      self.handle = setTimeout(testUrl, self.interval, self)
    })
}

// ------ Export module
module.exports = Urlmon
