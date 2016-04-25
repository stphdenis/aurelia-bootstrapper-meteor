'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrap = bootstrap;

require('aurelia-polyfills');

var _aureliaPalBrowser = require('aurelia-pal-browser');

var _aureliaLoaderMeteor = require('aurelia-loader-meteor');

var bootstrapQueue = [];
var sharedLoader = null;
var Aurelia = null;

function onBootstrap(callback) {
  return new Promise(function (resolve, reject) {
    if (sharedLoader) {
      resolve(callback(sharedLoader));
    } else {
      bootstrapQueue.push(function () {
        try {
          resolve(callback(sharedLoader));
        } catch (e) {
          reject(e);
        }
      });
    }
  });
}

function ready(global) {
  return new Promise(function (resolve, reject) {
    if (global.document.readyState === 'complete') {
      resolve(global.document);
    } else {
      global.document.addEventListener('DOMContentLoaded', completed);
      global.addEventListener('load', completed);
    }

    function completed() {
      global.document.removeEventListener('DOMContentLoaded', completed);
      global.removeEventListener('load', completed);
      resolve(global.document);
    }
  });
}

function handleApp(loader, appHost) {
  return config(loader, appHost, appHost.getAttribute('aurelia-app'));
}

function config(loader, appHost, configModuleId) {
  var aurelia = new Aurelia(loader);
  aurelia.host = appHost;

  if (configModuleId) {
    return loader.loadModule(configModuleId).then(function (customConfig) {
      return customConfig.configure(aurelia);
    });
  }

  aurelia.use.standardConfiguration().developmentLogging();

  return aurelia.start().then(function () {
    return aurelia.setRoot();
  });
}

function run() {
  return ready(window).then(function (doc) {
    (0, _aureliaPalBrowser.initialize)();

    var appHost = doc.querySelectorAll('[aurelia-app]');
    var loader = new _aureliaLoaderMeteor.MeteorLoader();
    loader.loadModule('aurelia-framework').then(function (m) {
      Aurelia = m.Aurelia;
      for (var i = 0, ii = appHost.length; i < ii; ++i) {
        handleApp(loader, appHost[i]).catch(console.error.bind(console));
      }

      sharedLoader = loader;
      for (var _i = 0, _ii = bootstrapQueue.length; _i < _ii; ++_i) {
        bootstrapQueue[_i]();
      }
      bootstrapQueue = null;
    });

    if(false) {
      require('aurelia-animator-css');
    }
  //  try { require('aurelia-animator-velocity'); } catch(e) {}
  //  try { require('aurelia-animator-css'); } catch(e) {}
  //  try { require('aurelia-binding'); } catch(e) {}
  //  try { require('aurelia-cache'); } catch(e) {}
  //  try { require('aurelia-dependency-injection'); } catch(e) {}
  //  try { require('aurelia-dialog'); } catch(e) {}
  //  try { require('aurelia-event-aggregator'); } catch(e) {}
  //  try { require('aurelia-fetch-client'); } catch(e) {}
  //  try { require('aurelia-framework'); } catch(e) {}
  //  try { require('aurelia-history'); } catch(e) {}
  //  try { require('aurelia-history-browser'); } catch(e) {}
  //  try { require('aurelia-html-import-template-loader'); } catch(e) {}
  //  try { require('aurelia-html-template-element'); } catch(e) {}
  //  try { require('aurelia-http-client'); } catch(e) {}
  //  try { require('aurelia-i18n'); } catch(e) {}
//    try { require('aurelia-loader'); } catch(e) {}
  //  try { require('aurelia-logging'); } catch(e) {}
  //  try { require('aurelia-logging-console'); } catch(e) {}
//    try { require('aurelia-metadata'); } catch(e) {}
//    try { require('aurelia-pal'); } catch(e) {}
//    try { require('aurelia-pal-browser'); } catch(e) {}
  //  try { require('aurelia-path'); } catch(e) {}
//    try { require('aurelia-polyfills'); } catch(e) {}
  //  try { require('aurelia-route-recognizer'); } catch(e) {}
  //  try { require('aurelia-router'); } catch(e) {}
  //  try { require('aurelia-task-queue'); } catch(e) {}
  //  try { require('aurelia-templating'); } catch(e) {}
  //  try { require('aurelia-templating-binding'); } catch(e) {}
  //  try { require('aurelia-templating-resources'); } catch(e) {}
  //  try { require('aurelia-templating-router'); } catch(e) {}
  //  try { require('aurelia-templating-validation'); } catch(e) {}
  //  try { require('aurelia-ui-virtualization'); } catch(e) {}
  //  try { require('aurelia-validation'); } catch(e) {}
  //  try { require('aurelia-web-components'); } catch(e) {}
  });
}

function bootstrap(configure) {
  return onBootstrap(function (loader) {
    var aurelia = new Aurelia(loader);
    return configure(aurelia);
  });
}

run();
