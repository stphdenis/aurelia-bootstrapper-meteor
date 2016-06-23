define(['exports', './aurelia-bootstrapper-meteor'], function (exports, _aureliaBootstrapperMeteor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaBootstrapperMeteor).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaBootstrapperMeteor[key];
      }
    });
  });
});