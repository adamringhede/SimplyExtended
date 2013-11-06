Object.defineProperty(Object.prototype, "extend", {
    value: function (type, props) {
        var extension = {}, key, properties = props || type,
            abstract = type === 'abstract';
        for (key in properties) {
            extension[key] = {
                value: properties[key],
                enumerable: true,
                writable: true
            };
        }
        extension.__init__ = {
            value: {},
            enumerable: true
        };
        extension.parent = {
            value: this,
            enumerable: false
        };
        var o = Object.create(this, extension);

        function defineConstructor(constr, originalInits) {
            var rf;
            if (abstract) {
                rf = function () {
                    throw 'Cannot initiate an abstract object';
                };
            } else {
                rf = function () {
                    var initKey, nO = Object.create(o, {
                        __init__: {
                            value: originalInits,
                            enumerable: false
                        }
                    });
                    constr.apply(nO, arguments);
                    for (initKey in nO) {
                        if (/\binit/.test(initKey)) {
                            delete nO[initKey];
                        }
                    }
                    return nO;
                };
            }
            rf.toString = function () {
                return constr.toString();
            };
            return rf;
        }
        for (key in o) {
            if (/\binit/.test(key)) {
                var constr = o.__init__[key] = o[key];
                o[key] = defineConstructor(constr, o.__init__);
            }
        }
        return o;
    }
});