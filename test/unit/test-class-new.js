﻿largeModule('Class New');

test('test', function () {

    ok(Fire.Class(), 'can define empty class');

    var Animal = Fire.Class({
        name: 'Animal',
        properties: {
            name: {
                default: '...',
                tooltip: 'Float',
                displayName: 'displayName'
            },
            eat: function () {
                return 'eating';
            },
            weight: {
                default: -1,
                serializable: false
            },
            weight10: {
                type: 'Integer',
                set: function (value) {
                    this.weight = Math.floor(value / 10);
                },
                get: function () {
                    return this.weight * 10;
                }
            },
            weight5x: {
                type: 'Integer',
                get: function () {
                    return this.weight * 5;
                },
                set: function (value) {
                    this.weight = value / 5;
                },
            }
        }
    });

    strictEqual(Fire.JS.getClassName(Animal), 'Animal', 'get class name');

    // property

    var instance = new Animal();
    strictEqual(instance.name, '...', 'get property');
    strictEqual(instance.eat(), 'eating', 'get chained property');
    strictEqual(instance.weight, -1, 'get partial property');

    strictEqual(Fire.attr(Animal, 'name').tooltip, 'Float', 'get name tooltip');
    strictEqual(Fire.attr(Animal, 'name').displayName, 'displayName', 'get name displayName');
    strictEqual(Fire.attr(Animal, 'weight').serializable, false, 'get attribute');

    // getter / setter

    strictEqual(instance.weight10, instance.weight * 10, 'define getter');
    instance.weight10 = 40;
    strictEqual(instance.weight10, 40, 'define setter');

    strictEqual(instance.weight5x, instance.weight * 5, 'define getter by getset');
    instance.weight5x = 30;
    strictEqual(instance.weight5x, 30, 'define setter by getset');

    // constructor

    Fire.JS.unregisterClass(Animal);

    var constructor = new Callback();
    Animal = Fire.Class({
        name: 'Animal',
        constructor: constructor,
        properties: {
            weight: 100
        }
    });

    constructor.enable();
    var instance1 = new Animal();
    constructor.once('call constructor');

    strictEqual(Fire.attr(Animal, 'weight').default, 100, 'can get attribute even has constructor');
    strictEqual(instance1.weight, 100, 'property inited even has constructor');

    var instance2 = new Animal();
    instance1.weight = 0;
    strictEqual(instance2.weight, 100, 'is instance property');

    var instance3 = new Animal();
    strictEqual(instance3.weight, 100, 'class define not changed');

    Fire.JS.unregisterClass(Animal);
});

test('Inherit', function () {
    var Animal = Fire.Class({
        name: 'Fire.Animal',
        properties: {
            name: 'ann'
        }
    });
    var Dog = Fire.Class({
        name: 'Fire.Dog',
        extends: Animal,
        properties: {
            name: {
                default: 'doge',
                tooltip: 'String'
            }
        }
    });
    var Husky = Fire.Class({
        name: 'Fire.Husky',
        extends: Dog,
        properties: {
            weight: 100
        }
    });

    strictEqual(Fire.JS.getClassName(Animal), 'Fire.Animal', 'can get class name 1');
    strictEqual(Fire.JS.getClassName(Dog), 'Fire.Dog', 'can get class name 2');
    strictEqual(Fire.JS.getClassName(Husky), 'Fire.Husky', 'can get class name 3');

    strictEqual(Dog.$super, Animal, 'can get super');

    strictEqual(Fire.attr(Animal, 'name'), Fire.attr(Dog, 'name'),
                "inheritance chain shares the same property's attribute");
    strictEqual(Fire.attr(Dog, 'name').tooltip, 'String', 'can modify attribute');
    strictEqual(Fire.attr(Dog, 'weight'), undefined, 'base property not added');

    var husky = new Husky();
    var dog = new Dog();

    strictEqual(dog.name, 'doge', 'can override property');
    strictEqual(husky.name, 'doge', 'can inherit property');

    deepEqual(Husky.__props__, ['name', 'weight'], 'can inherit prop list');
    deepEqual(Dog.__props__, ['name'], 'base prop list not changed');

    Fire.JS.unregisterClass(Animal, Dog, Husky);
});

test('Inherit + constructor', function () {
    var animalConstructor = Callback();
    var huskyConstructor = Callback();
    var Animal = Fire.Class({
        name: 'Fire.Animal',
        constructor: animalConstructor,
        properties: {
            name: 'ann'
        }
    });
    var Dog = Fire.Class({
        name: 'Fire.Dog',
        extends: Animal,
        properties: {
            name: 'doge'
        }
    });
    var Husky = Fire.Class({
        name: 'Fire.Husky',
        extends: Dog,
        constructor: huskyConstructor
    });

    strictEqual(Fire.JS.getClassName(Dog), 'Fire.Dog', 'can get class name 2');

    animalConstructor.enable();
    huskyConstructor.enable();
    huskyConstructor.callbackFunction(function () {
        animalConstructor.once('base construct should called automatically');
        Husky.$super.call(this);
    });
    var husky = new Husky();
    huskyConstructor.once('call husky constructor');
    animalConstructor.once('call anim constructor by husky');

    var dog = new Dog();
    animalConstructor.once('call anim constructor by dog');

    strictEqual(dog.name, 'doge', 'can override property');
    strictEqual(husky.name, 'doge', 'can inherit property');

    Fire.JS.unregisterClass(Animal, Dog, Husky);
});

test('prop reference', function () {
    var type = Fire.Class({
        name: 'Fire.MyType',
        properties: {
            ary: [],
            vec2: {
                default: new Fire.Vec2(10, 20)
            },
            dict: {
                default: {}
            }
        }
    });
    var obj1 = new type();
    var obj2 = new type();

    notStrictEqual(obj1.vec2, obj2.vec2, 'cloneable object reference not equal');
    notStrictEqual(obj1.ary, obj2.ary, 'empty array reference not equal');
    notStrictEqual(obj1.dict, obj2.dict, 'empty dict reference not equal');

    Fire.JS.unregisterClass(type);
});

test('serialization if inherited from FObject', function () {
    var type = Fire.Class({
        name: 'Fire.MyType',
        extends: FObject
    });

    var obj = new type();
    obj.name = '阿加西';

    var json = JSON.parse(Fire.serialize(obj));
    var expected = { "__type__": "Fire.MyType", "_name": "阿加西", "_objFlags": 0 };

    deepEqual(json, expected, 'can serialize FObject.name');

    Fire.JS.unregisterClass(type);
});

test('isChildClassOf', function () {
    strictEqual(Fire.isChildClassOf(null, null) ||
                Fire.isChildClassOf(Object, null) ||
                Fire.isChildClassOf(null, Object),  false, 'nil');

    //strictEqual(Fire.isChildClassOf(123, Object), false, 'can ignore wrong type');
    //strictEqual(Fire.isChildClassOf(Object, 123), false, 'can ignore wrong type 2');

    strictEqual(Fire.isChildClassOf(Object, Object), true, 'any obj is child of itself');

    var Base = function () {};

    strictEqual(Fire.isChildClassOf(Base, Object) &&
                ! Fire.isChildClassOf(Object, Base), true, 'any type is child of Object');

    var Base = function () {};
    var Sub = function () {};
    Fire.JS.extend(Sub, Base);
    strictEqual(Fire.isChildClassOf(Sub, Base) &&
                !Fire.isChildClassOf(Base, Sub), true, 'Sub is child of Base');

    // fire class

    var Animal = Fire.Class({
        name: 'Fire.Animal',
        extends: Sub,
        properties: {
            name: 'ann'
        }
    });
    var Dog = Fire.Class({
        name: 'Fire.Dog',
        extends: Animal,
        properties: {
            name: 'doge'
        }
    });
    var Husky = Fire.Class({
        name: 'Fire.Husky',
        extends: Dog,
        properties: {
            weight: 100
        }
    });

    strictEqual(Fire.isChildClassOf( Husky, Husky), true, 'Husky is child of itself');
    strictEqual(Fire.isChildClassOf( Dog, Animal), true, 'Animal is parent of Dog');
    strictEqual(Fire.isChildClassOf( Husky, Animal) &&
                ! Fire.isChildClassOf( Animal, Husky), true, 'Animal is parent of Husky');
    strictEqual(Fire.isChildClassOf( Dog, Husky), false, 'Dog is not child of Husky');

    strictEqual(Fire.isChildClassOf( Animal, Sub), true, 'Animal is child of Sub');
    strictEqual(Fire.isChildClassOf( Animal, Base), true, 'Animal is child of Base');
    strictEqual(Fire.isChildClassOf( Dog, Base),  true, 'Dog is child of Base');

    Fire.JS.unregisterClass(Animal, Dog, Husky);
});
