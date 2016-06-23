import 'aurelia-polyfills';
import {
  initialize
} from 'aurelia-pal-browser';
import {
  MeteorLoader
} from 'aurelia-loader-meteor';

/**
 * Manually bootstraps an application.
 * @param configure A callback which passes an Aurelia instance to the developer to manually configure and start up the app.
 * @return A Promise that completes when configuration is done.
 */
export declare function bootstrap(configure?: any): any;