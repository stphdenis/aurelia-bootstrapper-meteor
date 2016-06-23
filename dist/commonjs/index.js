'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaBootstrapperMeteor = require('./aurelia-bootstrapper-meteor');

Object.keys(_aureliaBootstrapperMeteor).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaBootstrapperMeteor[key];
    }
  });
});