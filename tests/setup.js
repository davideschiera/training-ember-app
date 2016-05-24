//
// bind polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
// used for phantomJS
//
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof FNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    fBound.prototype = new FNOP();

    return fBound;
  };
}

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 0;

$('head').append('<script type="text/javascript" src="//localhost:35729/livereload.js"></script>');

document.write('<div id="ember-testing-container">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<script src="//use.typekit.net/cmf7jti.js"></script>' +
    '<link rel="icon" href="/images/favicon.gif"/>' +
    '<script type="text/x-handlebars" data-template-name="widgetContent">' +
    '</script>' +
    '<div id="ember-testing"></div></div>');

SampleApp.Testing = {};
