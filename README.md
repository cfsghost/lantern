# Lantern

An isomorphic web application built with modern technologies, which contains basic functionality, fundamental design and workable architecture. Good to be used to create your project quickly.

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

## Features

* Node.js
* ES6+ (Generator and classes)
* Koa web framework
* MongoDB
* [Semantic UI](http://semantic-ui.com/) - Front-end UI toolkit
* Webpack
* React
* Isomorphic
* Support Hot loading with Webpack

## Dependencies

* Node.js 0.12+ or io.js
* Fluky - Event-based framework for flux data flow pattern
* react-router - router for React
* babel - Used to support ES6+

License
-
Licensed under the MIT License

Authors
-
Copyright(c) 2015 Fred Chien <<cfsghost@gmail.com>>
