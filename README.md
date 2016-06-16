# Lantern

An isomorphic web application built with "Universal JavaScript" and modern technologies, which contains basic functionality, fundamental design and workable architecture. Good to be used to create your project quickly.

The architecture design was already done for isomorphic. The views and frontend stuffs which are implemented with React can be rendered on server-side and client-side both and using the same configuration of routes. The good news is, there is no need to learn anti-pattern flux framework(e.g., redux) for isomorphic. Lantern provided an easy way for developers who are already familar with flux pattern.

Besides, the callback hell are not there anymore. The generator is widely used in this project, which is the new technology in new version of ECMAScript(JavaScript) for flow control. The Backend is using generator with Koa web framework, and frontend is using generator in flux framework as well.

Not only technique things, but also UI design is pretty cool in Lantern project. The framework that Semantic UI bring us fantastic frontend user interface, even better than bootstrap and other UI framework.

## Documentation

See our [Wiki](https://github.com/cfsghost/lantern/wiki) for more information.

## Installation

In order to support ES6+ and using a lots of new technologies (ex, generator and classes), Node.js 0.12+ or io.js is required. Once you have such environment, you can start to install modules needed via NPM.

```
npm install .
```

Then you can use webpack to compile and combine all of frontend source code for service.
```
webpack
```

Finally, you can start this web service:
```
node app.js
```

## Development

Starting up in development mode is able to enable hot loading mechanism, you can start service with:
```
node app.js dev
```

## Run in Production

For production, all of JavaScript will be minimized and optimized with no debug messages and symbols. You should use specific configuration file:
```
webpack --config webpack.production.config.js
```

## Features

* Fast to setup and easy to customize
* UI is pretty cool and fantasic
* Widely use ES6 and ES7+ (Generator, classes and decorator)
* Provided a lot of universal JavaScript solutions for development
* Isomorphic Architecture (React server-rendering by using universal JavaScript)
* Provided a lot useful extensions to speed up the development.
* Efficient server rendering
* Support permission management
* Support user database system
* Support Hot loading without webpack-dev-server
* Support i18n for multiple language
* Support third-party Authorization (Facebook/Github/Google/Linkedin)
* Support Hot-load mechanism

## Dependencies

* Node.js 0.12+
* Koa web framework 1.0
* MongoDB
* Fluky - Event-based framework for flux data flow pattern
* babel 6 - Used to support ES6/ES7+
* React v15.0.0+
* react-router 2.0.0+ - router for React
* [Semantic UI](http://semantic-ui.com/) - Front-end UI toolkit
* Webpack
* Passport

## Efficient Server Rendering

Server rendering machanism of React is synchronous and slow against Node.js event-loop performance. It causes that reduces the number of concurrent connections for single process.

A implementation in Lantern architecture is individual renderer processes for server rendering of react. All of React rendering work is separated from main process to avoid blocking server. (The default number of renderer process is 2)


## Benchmarks

Testing for rendering page with React on server side.

Environment:
* Apple MacBook Pro Retina 2013 (i7 2.4 GHz/8GB RAM)
* 1 Node.js process

Results:
```
$ ab -r -c 100 -n 1000 http://localhost:3001/
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3001

Document Path:          /
Document Length:        4584 bytes

Concurrency Level:      100
Time taken for tests:   2.193 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      4721000 bytes
HTML transferred:       4584000 bytes
Requests per second:    456.00 [#/sec] (mean)
Time per request:       219.300 [ms] (mean)
Time per request:       2.193 [ms] (mean, across all concurrent requests)
Transfer rate:          2102.30 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   0.7      0       5
Processing:    16  216 100.0    213     418
Waiting:       16  215 100.0    213     418
Total:         16  216 100.1    213     419
WARNING: The median and mean for the initial connection time are not within a normal deviation
        These results are probably not that reliable.

Percentage of the requests served within a certain time (ms)
  50%    213
  66%    268
  75%    298
  80%    320
  90%    353
  95%    369
  98%    397
  99%    404
 100%    419 (longest request)
```

## Showcases
* [Hackathon Taiwan](http://hackathon.tw/)

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2015 Fred Chien <<cfsghost@gmail.com>>
