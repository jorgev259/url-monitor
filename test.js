const Urlmon = require('./url-monitor')
const urls = ['https://www.google.com', 'https://flippingbook.com/404', 'https://www.jkgfnkosdfgnkmsdfgsdfg.net/']

urls.forEach(url => {
  const website = new Urlmon({ url })

  website.on('error', (data) => {
    console.log('error', data)
  })

  website.on('available', (data) => {
    console.log('available', data)
  })

  website.on('unavailable', (data) => {
    console.log('unavailable', data)
  })

  website.start()
})
