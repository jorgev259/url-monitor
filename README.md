url-monitor
=============
Simple URL monitoring for node.js

## Installation
```
npm install url-monitor
```

## How to
```javascript
var urlmon = require('url-monitor');

var website = new urlmon({ url:'https://www.google.fr/?gws_rd=ssl' });

website.on('error', (data) => {
	website.stop();
	console.log(data);
})

website.on('available', (data) => {
	console.log(data);
})

website.on('unavailable', (data) => {
	console.log(data);
	website.stop();
})

website.start();
```

### Options
```javascript
{
	url:'https://www.google.fr/?gws_rd=ssl', // Required
	interval: 5000,                          // Time interval in ms, default to 5000
	timeout: 300,                            // Timeout in ms, default to 3000
	successCodes: [200, 301, 302]            // responseCodes that trigger 'available' event
	ping: false,                             // use ping module instead of http request
}
```

### Events
- `error` - Url is unreachable, host down, port closed...
- `available` - Url is up.
- `unavailable` - Host up but url is not working.

### Responses on events
```javascript
{ code: 200, url: 'http://my.url/something', message: 'OK', time: 1000 }
{ code: 404, url: 'http://my.url/something', message: 'Not found', time: 1000 }
{ code: null, url: 'http://my.url/something', message: 'Host unavailable', time: 0 }
...
```

## Updates
- `v1.4.2 :` add ping option to use module 'ping' in request instead of http request
- `v1.4.2 :` use Urlmon as class and add errors to class methods
- `v1.4.1 :` Add configurable successCodes per url
- `v1.4.0 :` Add 'time' to event responses
- `v1.3.3 :` Fix bug in https response with http result code in url field. Improves HTTP messages.
- `v1.3.2 :` Avoid self-signed certificate error
- `v1.3.0 :` Add privacy to some methods
- `v1.2.0 :` Goodbye setInterval, welcome to setTimeout...
- `v1.1.0 :` Adds 'url' in events responses
- `v1.0.0 :` Initial release

## Licence
The MIT License (MIT) 
Copyright (c) 2016-2018 Julien Blanc
Copyright (c) 2020 Jorge Vargas
