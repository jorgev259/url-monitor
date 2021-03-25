const event = require('events').EventEmitter
const HTTPStatus = require('http-status')
const request = require('request')
const pingFn = require('ping')

class Urlmon extends event {
  constructor (args) {
    super()
    const { url, interval = 5000, timeout = 3000, successCodes = [200, 301, 302], ping = false } = args

    this.url = url
    this.interval = interval
    this.timeout = timeout
    this.successCodes = successCodes
    this.ping = ping
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
  const { url, timeout, ping } = self
  if (ping) {
    pingFn.promise.probe(url)
      .then(function ({ alive, time }) {
        const event = alive ? 'available' : 'unavailable'

        self.emit(event, { code: 200, url, message: event, time })
      })
      .catch(err => {
        console.log(err)
        self.emit('error', { code: null, url, message: 'error', time: 0 })
      })
      .finally(() => {
        self.handle = setTimeout(testUrl, self.interval, self)
      })
  } else {
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
}

// ------ Export module
module.exports = Urlmon
