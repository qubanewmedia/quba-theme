'use strict';

/* Create a new Fractal instance and export it for use elsewhere if required */
const fractal = module.exports = require('@frctl/fractal').create();

/* Set the title of the project */
fractal.set('project.title', 'Pattern Library & Style Guide');
fractal.web.set('static.path', __dirname + '/src/assets/');
fractal.web.set('static.mount', 'assets');

// directory to logo keeping assets as root
fractal.set('project.logo', '/assets/img/logo.png');
fractal.web.set('builder.dest', __dirname + '/dist/pattern-library');

/* Tell Fractal where the components will live */
fractal.components.engine('@frctl/nunjucks'); // register the Nunjucks adapter for your components
fractal.components.set('ext', '.html'); // look for files with a .nunj file extension
fractal.components.set('path', __dirname + '/src/components');

/* Tell Fractal where the documentation pages will live */
fractal.docs.set('path', __dirname + '/src/docs');

const mySubTheme = require('quba-theme');

// ... project setup and configuration

fractal.web.theme(mySubTheme); // use the sub-classed theme