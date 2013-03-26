// Generated by CoffeeScript 1.4.0
(function() {
  "use strict";
  var UserInputHandler, exports,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  var exports = window;

  /*
   * Manages keyboard and hotkey input from the user, including autocomplete and
   * traversing through previous commands.
  */


  UserInputHandler = (function(_super) {

    __extends(UserInputHandler, _super);

    function UserInputHandler(input, window) {
      this.input = input;
      this.window = window;
      this._sendUserCommand = __bind(this._sendUserCommand, this);

      this._handleKeydown = __bind(this._handleKeydown, this);

      this._handleGlobalKeydown = __bind(this._handleGlobalKeydown, this);

      UserInputHandler.__super__.constructor.apply(this, arguments);
      this.input.focus();
      this._inputStack = new InputStack;
      this._autoComplete = new AutoComplete;
      this.input.keydown(this._handleKeydown);
      this.window.keydown(this._handleGlobalKeydown);
    }

    UserInputHandler.prototype.setContext = function(_context) {
      var _this = this;
      this._context = _context;
      this._autoComplete.setContext(this._context);
      return this._context.on('set_input', function(text) {
        if (!_this.input.val()) {
          return _this.input.val(text);
        }
      });
    };

    UserInputHandler.prototype.setKeyboardShortcuts = function(keyboardShortcuts) {
      return this._keyboardShortcutMap = keyboardShortcuts;
    };

    UserInputHandler.prototype._handleGlobalKeydown = function(e) {
      this.text = this.input.val();
      this._focusInputOnKeyPress(e);
      this._handleKeyboardShortcuts(e);
      if (e.isDefaultPrevented()) {
        return false;
      }
      this._showPreviousCommandsOnArrowKeys(e);
      this._autoCompleteOnTab(e);
      return !e.isDefaultPrevented();
    };

    UserInputHandler.prototype._focusInputOnKeyPress = function(e) {
      if (!(e.metaKey || e.ctrlKey)) {
        e.currentTarget = this.input[0];
        return this.input.focus();
      }
    };

    UserInputHandler.prototype._handleKeyboardShortcuts = function(e) {
      var args, command, event, _ref;
      _ref = this._keyboardShortcutMap.getMappedCommand(e, this.input.val()), command = _ref[0], args = _ref[1];
      if (!command) {
        return;
      }
      e.preventDefault();
      event = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Event, ['command', command].concat(__slice.call(args)), function(){});
      return this._emitEventToCurrentWindow(event);
    };

    UserInputHandler.prototype._showPreviousCommandsOnArrowKeys = function(e) {
      var input;
      if (e.which === keyCodes.toKeyCode('UP') || e.which === keyCodes.toKeyCode('DOWN')) {
        e.preventDefault();
        if (e.which === keyCodes.toKeyCode('UP')) {
          this._inputStack.setCurrentText(this.text);
          input = this._inputStack.showPreviousInput();
        } else {
          input = this._inputStack.showNextInput();
        }
        if (input != null) {
          return this.input.val(input);
        }
      } else {
        return this._inputStack.reset();
      }
    };

    UserInputHandler.prototype._autoCompleteOnTab = function(e) {
      var textWithCompletion;
      if (e.which === keyCodes.toKeyCode('TAB')) {
        e.preventDefault();
        if (this.text) {
          textWithCompletion = this._autoComplete.getTextWithCompletion(this.text, this._getCursorPosition());
          this.input.val(textWithCompletion);
          return this._setCursorPosition(this._autoComplete.getUpdatedCursorPosition());
        }
      }
    };

    UserInputHandler.prototype._setCursorPosition = function(pos) {
      return this.input[0].setSelectionRange(pos, pos);
    };

    UserInputHandler.prototype._getCursorPosition = function() {
      return this.input[0].selectionStart;
    };

    UserInputHandler.prototype._handleKeydown = function(e) {
      this.text = this.input.val();
      if (e.which === keyCodes.toKeyCode('ENTER')) {
        if (this.text.length > 0) {
          this.input.val('');
          this._sendUserCommand();
        }
      }
      return true;
    };

    /*
       * Wrap the input in an event and emit it.
    */


    UserInputHandler.prototype._sendUserCommand = function() {
      var event, name, words;
      this._inputStack.addInput(this.text);
      words = this.text.split(/\s/);
      if (this.text[0] === '/') {
        name = words[0].slice(1).toLowerCase();
        words = words.slice(1);
      } else {
        name = 'say';
      }
      event = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Event, ['command', name].concat(__slice.call(words)), function(){});
      return this._emitEventToCurrentWindow(event);
    };

    UserInputHandler.prototype._emitEventToCurrentWindow = function(event) {
      event.context = this._context.currentWindow.getContext();
      return this.emit(event.type, event);
    };

    return UserInputHandler;

  })(EventEmitter);

  exports.UserInputHandler = UserInputHandler;

}).call(this);
