// Generated by CoffeeScript 1.4.0
(function() {
  "use strict";
  var Walkthrough, exports, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  var exports = (_ref = window.mocks) != null ? _ref : window.mocks = {};

  /*
   * Used to spy on walkthrough events.
  */


  Walkthrough = (function(_super) {

    __extends(Walkthrough, _super);

    Walkthrough.useMock = function() {
      chat.Walkthrough = Walkthrough;
      return this.instance = void 0;
    };

    Walkthrough.setInstance = function(instance) {
      this.instance = instance;
      spyOn(this.instance, '_startWalkthrough');
      spyOn(this.instance, '_serverWalkthrough');
      spyOn(this.instance, '_channelWalkthrough');
      return spyOn(this.instance, '_endWalkthrough');
    };

    function Walkthrough() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      Walkthrough.setInstance(this);
      Walkthrough.__super__.constructor.apply(this, args);
    }

    return Walkthrough;

  })(chat.Walkthrough);

  exports.Walkthrough = Walkthrough;

}).call(this);
