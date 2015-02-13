﻿// global definitions

Fire.isNode = !!(typeof process !== 'undefined' && process.versions && process.versions.node);
Fire.isNodeWebkit = !!(Fire.isNode && 'node-webkit' in process.versions);   // node-webkit
Fire.isAtomShell = !!(Fire.isNode && 'atom-shell' in process.versions);     // atom-shell
Fire.isApp = Fire.isNodeWebkit || Fire.isAtomShell;                         // native client
Fire.isPureWeb = !Fire.isNode && !Fire.isApp;                               // common web browser
Fire.isEditor = Fire.isApp;     // by far there is no standalone client version, so app == editor

if (Fire.isAtomShell) {
    Fire.isWeb = typeof process !== 'undefined' && process.type === 'renderer';
}
else {
    Fire.isWeb = (typeof __dirname === 'undefined' || __dirname === null); // common web browser, or window's render context in node-webkit or atom-shell
}
Fire.isEditorCore = Fire.isApp && !Fire.isWeb;

/**
 * @name Fire#isRetina
 * @property {boolean} isRetina check if running in retina display
 */
Object.defineProperty(Fire, 'isRetina', {
    get: function () {
        return Fire.isWeb && window.devicePixelRatio && window.devicePixelRatio > 1;
    }
});

if (Fire.isNode) {
    Fire.isDarwin = process.platform === 'darwin';
    Fire.isWin32 = process.platform === 'win32';
}
else {
    // http://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform-as-of-today
    var platform = window.navigator.platform;
    Fire.isDarwin = platform.substring(0, 3) === 'Mac';
    Fire.isWin32 = platform.substring(0, 3) === 'Win';
}

// definitions for FObject._objFlags

var Destroyed = 1 << 0;
var ToDestroy = 1 << 1;
var DontSave = 1 << 2;
var EditorOnly  = 1 << 3; // dont save in build
var Dirty = 1 << 4; // used in editor

var ObjectFlags = {
    // public flags

    DontSave: DontSave,
    EditorOnly: EditorOnly,
    Dirty: Dirty,

    // public flags for engine

    Destroying: 1 << 9,
    /**
     * Hide in game and hierarchy.
     * This flag is readonly, it can only be used as an argument of scene.createEntity() or Entity.createWithFlags()
     * @property {number} ObjectFlags.HideInGame
     */
    HideInGame: 1 << 10,

    // public flags for editor

    /**
     * This flag is readonly, it can only be used as an argument of scene.createEntity() or Entity.createWithFlags()
     * @property {number} ObjectFlags.HideInEditor
     */
    HideInEditor: 1 << 11,

    // flags for Component
    IsOnEnableCalled: 1 << 12,
    IsOnLoadCalled: 1 << 13,
    IsOnStartCalled: 1 << 14,

};

/**
 * Hide in game view, hierarchy, and scene view... etc.
 * This flag is readonly, it can only be used as an argument of scene.createEntity() or Entity.createWithFlags()
 * @property {number} ObjectFlags.Hide
 */
ObjectFlags.Hide = ObjectFlags.HideInGame | ObjectFlags.HideInEditor;

/**
 *
 * @type {{DontSave: number, EditorOnly: number, Dirty: number, Destroying: number, HideInGame: number, HideInEditor: number, IsOnEnableCalled: number, IsOnLoadCalled: number, IsOnStartCalled: number}}
 * @private
 */
Fire._ObjectFlags = ObjectFlags;

var PersistentMask = ~(ToDestroy | Dirty | ObjectFlags.Destroying |     // can not clone these flags
                       ObjectFlags.IsOnEnableCalled |
                       ObjectFlags.IsOnLoadCalled |
                       ObjectFlags.IsOnStartCalled);
