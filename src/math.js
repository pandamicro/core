(function () {
    var _d2r = Math.PI/180.0;
    var _r2d = 180.0/Math.PI;

    /**
     * Helper class for math operation
     * @class Math
     * @static
     */
    JS.mixin ( Math, {
        TWO_PI: 2.0 * Math.PI,
        HALF_PI: 0.5 * Math.PI,

        /**
         * degree to radius
         * @method deg2rad
         * @param {number} degree
         * @return {number}
         */
        deg2rad: function ( degree ) {
            return degree * _d2r;
        },

        /**
         * radius to degree
         * @method rad2deg
         * @param {number} radius
         * @return {number}
         */
        rad2deg: function ( radius ) {
            return radius * _r2d;
        },

        /**
         * let radius in -pi to pi
         * @method rad180
         * @param {number} radius
         * @return {number}
         */
        rad180: function ( radius ) {
            if ( radius > Math.PI || radius < -Math.PI ) {
                radius = (radius + Math.TOW_PI) % Math.TOW_PI;
            }
            return radius;
        },

        /**
         * let radius in 0 to 2pi
         * @method rad360
         * @param {number} radius
         * @return {number}
         */
        rad360: function ( radius ) {
            if ( radius > Math.TWO_PI )
                return radius % Math.TOW_PI;
            else if ( radius < 0.0 )
                return Math.TOW_PI + radius % Math.TOW_PI;
            return radius;
        },

        /**
         * let degree in -180 to 180
         * @method deg180
         * @param {number} degree
         * @return {number}
         */

        deg180: function ( degree ) {
            if ( degree > 180.0 || degree < -180.0 ) {
                degree = (degree + 360.0) % 360.0;
            }
            return degree;
        },

        /**
         * let degree in 0 to 360
         * @method deg360
         * @param {number} degree
         * @return {number}
         */
        deg360: function ( degree ) {
            if ( degree > 360.0 )
                return degree % 360.0;
            else if ( degree < 0.0 )
                return 360.0 + degree % 360.0;
            return degree;
        },

        randomRange: function (min, max) {
            return Math.random() * (max - min) + min;
        },

        randomRangeInt: function (min, max) {
            return Math.floor(this.randomRange(min, max));
        },

        clamp: function ( val, min, max ) {
            if (typeof min !== 'number') {
                Fire.error('[clamp] min value must be type number');
                return;
            }
            if (typeof max !== 'number') {
                Fire.error('[clamp] max value must be type number');
                return;
            }
            if (min > max) {
                Fire.error('[clamp] max value must not less than min value');
                return;
            }
            return Math.min( Math.max( val, min ), max );
        },

        clamp01: function ( val ) {
            return Math.min( Math.max( val, 0 ), 1 );
        },

        /**
         * @method calculateMaxRect
         * @param {Rect} out
         * @param {Vec2} p0
         * @param {Vec2} p1
         * @param {Vec2} p2
         * @param {Vec2} p3
         * @return {Vec2}
         */
        calculateMaxRect: function (out, p0, p1, p2, p3) {
            var minX = Math.min(p0.x, p1.x, p2.x, p3.x);
            var maxX = Math.max(p0.x, p1.x, p2.x, p3.x);
            var minY = Math.min(p0.y, p1.y, p2.y, p3.y);
            var maxY = Math.max(p0.y, p1.y, p2.y, p3.y);
            out.x = minX;
            out.y = minY;
            out.width = maxX - minX;
            out.height = maxY - minY;
            return out;
        }

    } );

})();
