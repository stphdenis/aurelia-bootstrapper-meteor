import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';
import { MeteorLoader } from 'aurelia-loader-meteor';

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

    try { require('aurelia-animator-velocity'); } catch(e) {}
    try { require('aurelia-animator-css'); } catch(e) {}
    try { require('aurelia-binding'); } catch(e) {}
    try { require('aurelia-cache'); } catch(e) {}
    try { require('aurelia-dependency-injection'); } catch(e) {}
    try { require('aurelia-dialog'); } catch(e) {}
    try { require('aurelia-event-aggregator'); } catch(e) {}
    try { require('aurelia-fetch-client'); } catch(e) {}
    try { require('aurelia-framework'); } catch(e) {}
    try { require('aurelia-history'); } catch(e) {}
    try { require('aurelia-history-browser'); } catch(e) {}
    try { require('aurelia-html-import-template-loader'); } catch(e) {}
    try { require('aurelia-html-template-element'); } catch(e) {}
    try { require('aurelia-http-client'); } catch(e) {}
    try { require('aurelia-i18n'); } catch(e) {}
//    try { require('aurelia-loader'); } catch(e) {}
    try { require('aurelia-logging'); } catch(e) {}
    try { require('aurelia-logging-console'); } catch(e) {}
//    try { require('aurelia-metadata'); } catch(e) {}
//    try { require('aurelia-pal'); } catch(e) {}
//    try { require('aurelia-pal-browser'); } catch(e) {}
    try { require('aurelia-path'); } catch(e) {}
//    try { require('aurelia-polyfills'); } catch(e) {}
    try { require('aurelia-route-recognizer'); } catch(e) {}
    try { require('aurelia-router'); } catch(e) {}
    try { require('aurelia-task-queue'); } catch(e) {}
    try { require('aurelia-templating'); } catch(e) {}
    try { require('aurelia-templating-binding'); } catch(e) {}
    try { require('aurelia-templating-resources'); } catch(e) {}
    try { require('aurelia-templating-router'); } catch(e) {}
    try { require('aurelia-templating-validation'); } catch(e) {}
    try { require('aurelia-ui-virtualization'); } catch(e) {}
    try { require('aurelia-validation'); } catch(e) {}
    try { require('aurelia-web-components'); } catch(e) {}
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
