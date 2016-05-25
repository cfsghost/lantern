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

## Features

* Fast to setup and easy to customize
* UI is pretty cool and fantasic
* Widely use ES6 and ES7+ (Generator, classes and decorator)
* Provided a lot of universal JavaScript solutions for development
* Isomorphic Architecture
* Provided a lot useful extensions to speed up the development.
* Support permission management
* Support user database system
* Support Hot loading without webpack-dev-server
* Support i18n for multiple language
* Support third-party Authorization (Facebook/Github/Google/Linkedin)
* Support Hot-load mechanism
* 
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

## Showcases
* [Hackathon Taiwan](http://hackathon.tw/)

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2015 Fred Chien <<cfsghost@gmail.com>>
