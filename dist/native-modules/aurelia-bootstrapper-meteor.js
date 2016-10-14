import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import { MeteorLoader } from 'aurelia-loader-meteor';

if (false) {
  require('aurelia-event-aggregator');
  require('aurelia-framework');
  require('aurelia-history-browser');
  require('aurelia-templating-binding');
  require('aurelia-templating-resources');
  require('aurelia-templating-router');
}

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
    function completed() {
      global.document.removeEventListener('DOMContentLoaded', completed);
      global.removeEventListener('load', completed);
      resolve(global.document);
    }

    if (global.document.readyState === 'complete') {
      resolve(global.document);
    } else {
      global.document.addEventListener('DOMContentLoaded', completed);
      global.addEventListener('load', completed);
    }
  });
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

function handleApp(loader, appHost) {
  return config(loader, appHost, appHost.getAttribute('aurelia-app'));
}

function run() {
  return ready(window).then(function (doc) {
    initialize();

    var appHost = doc.querySelectorAll('[aurelia-app]');
    var loader = new MeteorLoader();
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
  });
}

export function bootstrap(configure) {
  return onBootstrap(function (loader) {
    var aurelia = new Aurelia(loader);
    return configure(aurelia);
  });
}

run();