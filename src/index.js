import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import { MeteorLoader } from 'aurelia-loader-meteor';

if(false) { // Just to say to Meteor to get this modules but not to load them.
  require('aurelia-event-aggregator');
  require('aurelia-framework');
  require('aurelia-history-browser');
  require('aurelia-templating-binding');
  require('aurelia-templating-resources');
  require('aurelia-templating-router');
}

let bootstrapQueue = [];
let sharedLoader = null;
let Aurelia = null;

function onBootstrap(callback) {
  return new Promise((resolve, reject) => {
    if (sharedLoader) {
      resolve(callback(sharedLoader));
    } else {
      bootstrapQueue.push(() => {
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
  return new Promise((resolve, reject) => {
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
  const aurelia = new Aurelia(loader);
  aurelia.host = appHost;

  if (configModuleId) {
    return loader.loadModule(configModuleId).then(customConfig => customConfig.configure(aurelia));
  }

  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  return aurelia.start().then(() => aurelia.setRoot());
}

function handleApp(loader, appHost) {
  return config(loader, appHost, appHost.getAttribute('aurelia-app'));
}

function run() {
  return ready(window).then(doc => {
    initialize();

    const appHost = doc.querySelectorAll('[aurelia-app]');
    const loader = new MeteorLoader();
    loader.loadModule('aurelia-framework').then(m => {
      Aurelia = m.Aurelia;
      for (let i = 0, ii = appHost.length; i < ii; ++i) {
        handleApp(loader, appHost[i]).catch(console.error.bind(console));
      }

      sharedLoader = loader;
      for (let i = 0, ii = bootstrapQueue.length; i < ii; ++i) {
        bootstrapQueue[i]();
      }
      bootstrapQueue = null;
    });
  });
}

/**
 * Manually bootstraps an application.
 * @param configure A callback which passes an Aurelia instance to the developer to manually configure and start up the app.
 * @return A Promise that completes when configuration is done.
 */
export function bootstrap(configure) {
  return onBootstrap(loader => {
    const aurelia = new Aurelia(loader);
    return configure(aurelia);
  });
}

run();
