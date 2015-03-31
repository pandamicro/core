﻿(function () {

    /**
     * The CallbacksHandler is an abstract class that can register and unregister callbacks by key.
     * Subclasses should implement their own methods about how to invoke the callbacks.
     * @class CallbacksHandler
     * @constructor
     */
    var CallbacksHandler = (function () {
        this._callbackTable = {};
    });

    Fire._CallbacksHandler = CallbacksHandler;

    /**
     * @method add
     * @param {string} key
     * @param {function} callback
     * @return {boolean} whether the key is new
     */
    CallbacksHandler.prototype.add = function (key, callback) {
        var list = this._callbackTable[key];
        if (typeof list !== 'undefined') {
            if (callback) {
                if (list !== null) {
                    list.push(callback);
                }
                else {
                    list = [callback];
                    this._callbackTable[key] = list;
                }
            }
            return false;
        }
        else {
            // new key
            list = callback ? [callback] : null;
            this._callbackTable[key] = list;
            return true;
        }
    };

    /**
     * Check if the specified key has any registered callback. If a callback is also specified,
     * it will only return true if the callback is registered.
     * @method has
     * @param {string} key
     * @param {function} [callback]
     * @return {boolean}
     */
    CallbacksHandler.prototype.has = function (key, callback) {
        var list = this._callbackTable[key];
        if (list && list.length > 0) {
            if (callback) {
                return list.indexOf(callback) !== -1;
            }
            return true;
        }
        return false;
    };

    /**
     * @method removeAll
     * @param {string} key
     */
    CallbacksHandler.prototype.removeAll = function (key) {
        delete this._callbackTable[key];
    };

    /**
     * @method remove
     * @param {string} key
     * @param {function} callback
     * @return {boolean} removed
     */
    CallbacksHandler.prototype.remove = function (key, callback) {
        var list = this._callbackTable[key];
        if (list) {
            var index = list.indexOf(callback);
            if (index !== -1) {
                list.splice(index, 1);
                return true;
            }
        }
        return false;
    };



    /**
     * The callbacks invoker to handle and invoke callbacks by key
     * @class CallbacksInvoker
     * @extends CallbacksHandler
     * @constructor
     */
    var CallbacksInvoker = function () {
        this._callbackTable = {}; // 直接赋值，省得调用父构造函数
    };
    JS.extend(CallbacksInvoker, CallbacksHandler);

    /**
     * This is a property accessible from {% crosslink Fire Fire %} global object
     * @property Fire.CallbacksInvoker
     * @type CallbacksInvoker
     */
    Fire.CallbacksInvoker = CallbacksInvoker;

    /**
     * @method invoke
     * @param {string} key
     * @param {*} [p1]
     * @param {*} [p2]
     * @param {*} [p3]
     * @param {*} [p4]
     * @param {*} [p5]
     */
    CallbacksInvoker.prototype.invoke = function (key, p1, p2, p3, p4, p5) {
        var list = this._callbackTable[key];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                list[i](p1, p2, p3, p4, p5);
            }
        }
    };

    /**
     * @method invokeAndRemove
     * @param {string} key
     * @param {*} [p1]
     * @param {*} [p2]
     * @param {*} [p3]
     * @param {*} [p4]
     * @param {*} [p5]
     */
    CallbacksInvoker.prototype.invokeAndRemove = function (key, p1, p2, p3, p4, p5) {
        // this.invoke(key, p1, p2, p3, p4, p5);
        // 这里不直接调用invoke仅仅是为了减少调用堆栈的深度，方便调试
        var list = this._callbackTable[key];
        if (list) {
            for (var i = 0; i < list.length; i++) {
                list[i](p1, p2, p3, p4, p5);
            }
        }
        this.removeAll(key);
    };

    /**
     * @method bindKey
     * @param {string} key
     * @param {boolean} [remove=false] - remove callbacks after invoked
     * @return {function} the new callback which will invoke all the callbacks binded with the same supplied key
     */
    CallbacksInvoker.prototype.bindKey = function (key, remove) {
        var self = this;
        return function bindedInvocation (p1, p2, p3, p4, p5) {
            // this.invoke(key, p1, p2, p3, p4, p5);
            // 这里不直接调用invoke仅仅是为了减少调用堆栈的深度，方便调试
            var list = self._callbackTable[key];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    list[i](p1, p2, p3, p4, p5);
                }
            }
            if (remove) {
                self.removeAll(key);
            }
        };
    };

    return CallbacksInvoker;
})();
