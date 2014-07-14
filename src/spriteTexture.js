FIRE.SpriteTexture = (function () {
    var _super = FIRE.Asset;

    // constructor
    function SpriteTexture ( img ) {
        _super.call(this);

        // basic settings
        this.texture = img;
        this.rotated = false;
        this.trim = false;       // TODO, editor only ?
        this.trimThreshold = 1;  // TODO, editor only ?

        // trims
        this.trimX = 0;
        this.trimY = 0;
        this.width = 0;     // trimmed width
        this.height = 0;    // trimmed height
        this.x = 0;
        this.y = 0;
    }
    FIRE.extend(SpriteTexture, _super);
    SpriteTexture.prototype.__classname__ = "FIRE.SpriteTexture";

    SpriteTexture.prototype.__defineGetter__('rotatedWidth', function () {
        return this.rotated ? this.height : this.width;
    });

    SpriteTexture.prototype.__defineGetter__('rotatedHeight', function () {
        return this.rotated ? this.width : this.height;
    });

    return SpriteTexture;
})();
