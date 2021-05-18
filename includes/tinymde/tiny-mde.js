(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TinyMDE = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty


	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings




	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string


	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty


	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$2();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');
	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;

	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }

	  if (O === global_1) {
	    if (simple) O[key] = value;else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation


	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;



	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols


	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;










	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/


	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray


	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject


	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var nativeJoin = [].join;
	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD = arrayMethodIsStrict('join', ','); // `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join

	_export({
	  target: 'Array',
	  proto: true,
	  forced: ES3_STRINGS || !STRICT_METHOD
	}, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var defineProperty = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name'; // Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name

	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys


	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var nativeAssign = Object.assign;
	var defineProperty$1 = Object.defineProperty; // `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign

	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({
	    b: 1
	  }, nativeAssign(defineProperty$1({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$1(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), {
	    b: 2
	  })).b !== 1) return true; // should work with symbols and should have deterministic property order (V8 bug)

	  var A = {};
	  var B = {}; // eslint-disable-next-line no-undef

	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) {
	    B[chr] = chr;
	  });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;

	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  }

	  return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign


	_export({
	  target: 'Object',
	  stat: true,
	  forced: Object.assign !== objectAssign
	}, {
	  assign: objectAssign
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.


	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});
	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec; // This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.

	var nativeReplace = String.prototype.replace;
	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	}();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET; // nonparticipating capturing group, copied from es5-shim's String#split patch.

	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');

	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex); // Support anchored sticky behavior.

	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      } // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.


	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }

	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }

	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({
	  target: 'RegExp',
	  proto: true,
	  forced: /./.exec !== regexpExec
	}, {
	  exec: regexpExec
	});

	var SPECIES$2 = wellKnownSymbol('species');
	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;

	  re.exec = function () {
	    var result = [];
	    result.groups = {
	      a: '7'
	    };
	    return result;
	  };

	  return ''.replace(re, '$<a>') !== '7';
	}); // IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0

	var REPLACE_KEEPS_$0 = function () {
	  return 'a'.replace(/./, '$0') === '$0';
	}();

	var REPLACE = wellKnownSymbol('replace'); // Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string

	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }

	  return false;
	}(); // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper


	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;

	  re.exec = function () {
	    return originalExec.apply(this, arguments);
	  };

	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);
	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};

	    O[SYMBOL] = function () {
	      return 7;
	    };

	    return ''[KEY](O) != 7;
	  });
	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {}; // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.

	      re.constructor = {};

	      re.constructor[SPECIES$2] = function () {
	        return re;
	      };

	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () {
	      execCalled = true;
	      return null;
	    };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (!DELEGATES_TO_SYMBOL || !DELEGATES_TO_EXEC || KEY === 'replace' && !(REPLACE_SUPPORTS_NAMED_GROUPS && REPLACE_KEEPS_$0 && !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE) || KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return {
	            done: true,
	            value: nativeRegExpMethod.call(regexp, str, arg2)
	          };
	        }

	        return {
	          done: true,
	          value: nativeMethod.call(str, regexp, arg2)
	        };
	      }

	      return {
	        done: false
	      };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];
	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2 // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	    // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	    ? function (string, arg) {
	      return regexMethod.call(string, this, arg);
	    } // 21.2.5.6 RegExp.prototype[@@match](string)
	    // 21.2.5.9 RegExp.prototype[@@search](string)
	    : function (string) {
	      return regexMethod.call(string, this);
	    });
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation


	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF ? CONVERT_TO_STRING ? S.charAt(position) : first : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt = stringMultibyte.charAt; // `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex


	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec


	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;

	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);

	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }

	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic


	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [// `String.prototype.match` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.match
	  function match(regexp) {
	    var O = requireObjectCoercible(this);
	    var matcher = regexp == undefined ? undefined : regexp[MATCH];
	    return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	  }, // `RegExp.prototype[@@match]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	  function (regexp) {
	    var res = maybeCallNative(nativeMatch, regexp, this);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    if (!rx.global) return regexpExecAbstract(rx, S);
	    var fullUnicode = rx.unicode;
	    rx.lastIndex = 0;
	    var A = [];
	    var n = 0;
	    var result;

	    while ((result = regexpExecAbstract(rx, S)) !== null) {
	      var matchStr = String(result[0]);
	      A[n] = matchStr;
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      n++;
	    }

	    return n === 0 ? null : A;
	  }];
	});

	var MATCH = wellKnownSymbol('match'); // `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp

	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	var SPECIES$3 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var arrayPush = [].push;
	var min$2 = Math.min;
	var MAX_UINT32 = 0xFFFFFFFF; // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError

	var SUPPORTS_Y = !fails(function () {
	  return !RegExp(MAX_UINT32, 'y');
	}); // @@split logic

	fixRegexpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;

	  if ('abbc'.split(/(b)*/)[1] == 'c' || 'test'.split(/(?:)/, -1).length != 4 || 'ab'.split(/(?:ab)*/).length != 2 || '.'.split(/(.?)(.?)/).length != 4 || '.'.split(/()()/).length > 1 || ''.split(/.?/).length) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = String(requireObjectCoercible(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string]; // If `separator` is not a regex, use native split

	      if (!isRegexp(separator)) {
	        return nativeSplit.call(string, separator, lim);
	      }

	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.unicode ? 'u' : '') + (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0; // Make `global` and avoid `lastIndex` issues by working with a copy

	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;

	      while (match = regexpExec.call(separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;

	        if (lastIndex > lastLastIndex) {
	          output.push(string.slice(lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }

	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }

	      if (lastLastIndex === string.length) {
	        if (lastLength || !separatorCopy.test('')) output.push('');
	      } else output.push(string.slice(lastLastIndex));

	      return output.length > lim ? output.slice(0, lim) : output;
	    }; // Chakra, V8

	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [// `String.prototype.split` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.split
	  function split(separator, limit) {
	    var O = requireObjectCoercible(this);
	    var splitter = separator == undefined ? undefined : separator[SPLIT];
	    return splitter !== undefined ? splitter.call(separator, O, limit) : internalSplit.call(String(O), separator, limit);
	  }, // `RegExp.prototype[@@split]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
	  //
	  // NOTE: This cannot be properly polyfilled in engines that don't support
	  // the 'y' flag.
	  function (regexp, limit) {
	    var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
	    if (res.done) return res.value;
	    var rx = anObject(regexp);
	    var S = String(this);
	    var C = speciesConstructor(rx, RegExp);
	    var unicodeMatching = rx.unicode;
	    var flags = (rx.ignoreCase ? 'i' : '') + (rx.multiline ? 'm' : '') + (rx.unicode ? 'u' : '') + (SUPPORTS_Y ? 'y' : 'g'); // ^(? + rx + ) is needed, in combination with some S slicing, to
	    // simulate the 'y' flag.

	    var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
	    var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	    if (lim === 0) return [];
	    if (S.length === 0) return regexpExecAbstract(splitter, S) === null ? [S] : [];
	    var p = 0;
	    var q = 0;
	    var A = [];

	    while (q < S.length) {
	      splitter.lastIndex = SUPPORTS_Y ? q : 0;
	      var z = regexpExecAbstract(splitter, SUPPORTS_Y ? S : S.slice(q));
	      var e;

	      if (z === null || (e = min$2(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p) {
	        q = advanceStringIndex(S, q, unicodeMatching);
	      } else {
	        A.push(S.slice(p, q));
	        if (A.length === lim) return A;

	        for (var i = 1; i <= z.length - 1; i++) {
	          A.push(z[i]);
	          if (A.length === lim) return A;
	        }

	        q = p = e;
	      }
	    }

	    A.push(S.slice(p));
	    return A;
	  }];
	}, !SUPPORTS_Y);

	var quot = /"/g; // B.2.3.2.1 CreateHTML(string, tag, attribute, value)
	// https://tc39.github.io/ecma262/#sec-createhtml

	var createHtml = function (string, tag, attribute, value) {
	  var S = String(requireObjectCoercible(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments


	var stringHtmlForced = function (METHOD_NAME) {
	  return fails(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	// `String.prototype.anchor` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.anchor


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('anchor')
	}, {
	  anchor: function anchor(name) {
	    return createHtml(this, 'a', 'name', name);
	  }
	});

	// `String.prototype.bold` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.bold


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('bold')
	}, {
	  bold: function bold() {
	    return createHtml(this, 'b', '', '');
	  }
	});

	// `String.prototype.link` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.link


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringHtmlForced('link')
	}, {
	  link: function link(url) {
	    return createHtml(this, 'a', 'href', url);
	  }
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct;
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }

	  return _construct.apply(null, arguments);
	}

	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}

	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;

	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;

	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);

	      _cache.set(Class, Wrapper);
	    }

	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }

	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };

	  return _wrapNativeSuper(Class);
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
	}

	function _iterableToArray(iter) {
	  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	function _wrapRegExp(re, groups) {
	  _wrapRegExp = function (re, groups) {
	    return new BabelRegExp(re, undefined, groups);
	  };

	  var _RegExp = _wrapNativeSuper(RegExp);

	  var _super = RegExp.prototype;

	  var _groups = new WeakMap();

	  function BabelRegExp(re, flags, groups) {
	    var _this = _RegExp.call(this, re, flags);

	    _groups.set(_this, groups || _groups.get(re));

	    return _this;
	  }

	  _inherits(BabelRegExp, _RegExp);

	  BabelRegExp.prototype.exec = function (str) {
	    var result = _super.exec.call(this, str);

	    if (result) result.groups = buildGroups(result, this);
	    return result;
	  };

	  BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
	    if (typeof substitution === "string") {
	      var groups = _groups.get(this);

	      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
	        return "$" + groups[name];
	      }));
	    } else if (typeof substitution === "function") {
	      var _this = this;

	      return _super[Symbol.replace].call(this, str, function () {
	        var args = [];
	        args.push.apply(args, arguments);

	        if (typeof args[args.length - 1] !== "object") {
	          args.push(buildGroups(args, _this));
	        }

	        return substitution.apply(this, args);
	      });
	    } else {
	      return _super[Symbol.replace].call(this, str, substitution);
	    }
	  };

	  function buildGroups(result, re) {
	    var g = _groups.get(re);

	    return Object.keys(g).reduce(function (groups, name) {
	      groups[name] = result[g[name]];
	      return groups;
	    }, Object.create(null));
	  }

	  return _wrapRegExp.apply(this, arguments);
	}

	var svg = {
	  blockquote: "<svg height=\"18\" width=\"18\"><rect width=\"5\" height=\"5\" x=\"3\" y=\"4\" ry=\"1\"/><rect ry=\"1\" y=\"4\" x=\"10\" height=\"5\" width=\"5\"/><path d=\"M8 6.999v3c0 1-1 3-1 3s-.331 1-1.331 1h-1c-1 0-.669-1-.669-1s1-2 1-3v-3zm7 0v3c0 1-1 3-1 3s-.331 1-1.331 1h-1c-1 0-.669-1-.669-1s1-2 1-3v-3z\"/></svg>",
	  bold: "<svg height=\"18\" width=\"18\"><path d=\"M4 2a1 1 0 00-1 1v12a1 1 0 001 1h6c4 0 5-2 5-4 0-1.322-.434-2.636-1.885-3.381C13.772 7.885 14 6.945 14 6c0-2-1-4-5-4zm1 2h4c1.668 0 2.32.393 2.6.672.28.279.4.662.4 1.328s-.12 1.057-.4 1.338c-.275.274-1.014.646-2.6.662H5zm5 6c1.666.005 2.318.388 2.596.666.277.278.404.667.404 1.334s-.127 1.06-.404 1.338c-.278.278-.93.66-2.596.662l-4.992.004L5 10z\"/></svg>",
	  clear_formatting: "<svg height=\"18\" width=\"18\"><path d=\"M11.03 1a1 1 0 00-.74.3l-9 9a1 1 0 000 1.4l4 4A1 1 0 006 16h2a1 1 0 00.7-.3l8-8a1 1 0 000-1.4l-5-5a1 1 0 00-.67-.3zM8.7 5.7l3.58 3.6L7.6 14H6.4l-3-3 5.3-5.3z\"/><rect ry=\".8\" rx=\".8\" y=\"14\" x=\"16\" height=\"2\" width=\"2\"/><rect width=\"2\" height=\"2\" x=\"13\" y=\"14\" rx=\".8\" ry=\".8\"/><rect ry=\".8\" rx=\".8\" y=\"14\" x=\"10\" height=\"2\" width=\"2\"/></svg>",
	  code: "<svg height=\"18\" width=\"18\"><path d=\"M13.5 2.994a.5.5 0 00-.5.5.5.5 0 000 .034V4.53a5.993 5.993 0 00-7.451-.445A6 6 0 1012.45 13.9a5.99 5.99 0 001.346-1.334.5.5 0 00.096-.101.5.5 0 00-.12-.698.5.5 0 00-.697.12l-.004-.005a5 5 0 01-1.197 1.2 5 5 0 111.215-6.965.5.5 0 00.697.12.5.5 0 00.211-.44V4.745H14V3.493a.5.5 0 00-.5-.5z\"/></svg>",
	  h1: "<svg height=\"18\" width=\"18\"><path d=\"M3 2s0-1 1-1h1c1 0 1 1 1 1v6h6V2s0-1 1-1h1c1 0 1 1 1 1v14s0 1-1 1h-1c-1 0-1-1-1-1v-6H6v6s0 1-1 1H4c-1 0-1-1-1-1z\"/></svg>",
	  h2: "<svg height=\"18\" width=\"18\"><path d=\"M4 2s0-1 1-1 1 1 1 1v6c1-1 2-1 4-1 3 0 4 2 4 4v5s0 1-1 1-1-1-1-1v-5c0-1.094-1-2-2-2-2 0-3 0-4 2v5s0 1-1 1-1-1-1-1z\"/></svg>",
	  hr: "<svg height=\"18\" width=\"18\"><rect ry=\"1\" y=\"8\" height=\"2\" width=\"18\" style=\"font-variation-settings:normal;marker:none\"/></svg>",
	  image: "<svg height=\"18\" width=\"18\"><path d=\"M1 2v14h16V2H1zm2 2h12v7l-3-3-4 4-2-2-3 3V4z\"/><circle r=\"1.5\" cy=\"6.5\" cx=\"5.5\"/></svg>",
	  italic: "<svg height=\"18\" width=\"18\"><path d=\"M9 2a1 1 0 000 2L7 14a1 1 0 100 2h2a1 1 0 000-2l2-10a1 1 0 100-2z\"/></svg>",
	  link: "<svg height=\"18\" width=\"18\"><path d=\"M9.07 5.18a3.9 3.9 0 00-1.52.43C6.31 6.22 5.3 7.29 4.3 8.29c-1 1-2.07 2.02-2.68 3.26-.31.62-.5 1.33-.41 2.07.09.75.48 1.47 1.1 2.09.61.61 1.33 1 2.08 1.1.74.09 1.45-.1 2.07-.42 1.24-.61 2.26-1.68 3.26-2.68.46-.47.94-.94 1.39-1.44l-.43.26c-.68.34-1.49.56-2.36.46-.2-.03-.4-.08-.6-.14-.79.76-1.55 1.45-2.16 1.76-.38.19-.67.24-.92.21-.26-.03-.54-.14-.92-.53-.39-.38-.5-.66-.53-.91-.03-.26.02-.55.21-.93.39-.76 1.32-1.74 2.32-2.74 1-1 1.98-1.93 2.74-2.32.38-.19.67-.24.93-.21.25.03.53.14.91.53.39.38.5.66.53.92v.06l1.12-1.06.44-.47c-.18-.3-.4-.6-.67-.87-.62-.61-1.34-1-2.09-1.1a3.08 3.08 0 00-.55-.01z\"/><path d=\"M13.07.86a3.9 3.9 0 00-1.52.43c-1.24.62-2.26 1.69-3.26 2.69-.46.47-.94.94-1.39 1.43.15-.08.28-.18.43-.25a4.4 4.4 0 012.36-.46c.2.02.4.07.6.14.79-.77 1.55-1.46 2.16-1.76.38-.19.67-.25.93-.21.25.03.53.14.91.52.39.38.5.66.53.92.03.26-.02.55-.21.93-.39.76-1.32 1.74-2.32 2.74-1 1-1.98 1.93-2.74 2.31-.38.2-.67.25-.93.22-.25-.04-.53-.15-.91-.53-.39-.38-.5-.66-.53-.92V9c-.36.33-.73.67-1.12 1.06l-.43.46c.17.3.4.6.66.87.62.62 1.34 1 2.08 1.1.75.1 1.46-.1 2.08-.41 1.24-.62 2.26-1.69 3.26-2.69s2.07-2.02 2.68-3.26c.31-.62.5-1.32.41-2.07a3.63 3.63 0 00-1.1-2.08c-.61-.62-1.33-1-2.07-1.1a3.08 3.08 0 00-.56-.02z\"/></svg>",
	  ol: "<svg height=\"18\" width=\"18\"><path d=\"M1.5 7a.5.5 0 100 1h1a.5.5 0 01.5.5c0 .164-.08.31-.14.355l-1.655 1.25A.492.492 0 001 10.5a.5.5 0 00.5.5h2a.5.5 0 000-1H3l.398-.299A1.5 1.5 0 002.5 7z\"/><path d=\"M1.5 12c-.667 0-.667 1 0 1h1.25c.333 0 .333.5 0 .5H2.5c-.667 0-.667 1 0 1h.25c.333 0 .333.5 0 .5H1.5c-.667 0-.667 1 0 1h1c.398 0 .78-.131 1.06-.365.282-.235.44-.554.44-.885a1.121 1.121 0 00-.303-.75c.191-.204.3-.47.303-.75 0-.332-.158-.651-.44-.885-.3-.241-.675-.37-1.06-.365z\"/><rect y=\"13\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><rect ry=\"1\" width=\"12\" height=\"2\" x=\"6\" y=\"8\"/><rect y=\"3\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><path d=\"M1.5 2a.5.5 0 100 1H2v2h-.5a.5.5 0 100 1h2a.5.5 0 100-1H3V2.5c0-.277-.223-.5-.5-.5z\"/></svg>",
	  strikethrough: "<svg width=\"18\" height=\"18\"><path d=\"M10 2C6 2 4 4 4 6c0 .338.08.672.193 1h2.34C6.113 6.629 6 6.295 6 6c0-.334.117-.725.691-1.154C7.265 4.416 8.331 4 10 4h3a1 1 0 000-2zm1.477 9c.413.368.523.706.523 1 0 .334-.127.712-.701 1.143-.575.43-1.632.85-3.299.857l-1.006.007V14H5a1 1 0 000 2h3c4 0 6-2 6-4 0-.338-.081-.672-.195-1z\"/><rect ry=\"1\" y=\"8\" x=\"1\" height=\"2\" width=\"16\"/></svg>",
	  ul: "<svg height=\"18\" width=\"18\"><circle cx=\"2\" cy=\"9\" r=\"2\"/><circle cy=\"4\" cx=\"2\" r=\"2\"/><rect y=\"3\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/><circle cx=\"2\" cy=\"14\" r=\"2\"/><rect ry=\"1\" width=\"12\" height=\"2\" x=\"6\" y=\"8\"/><rect y=\"13\" x=\"6\" height=\"2\" width=\"12\" ry=\"1\"/></svg>"
	};

	var isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
	var DefaultCommands = {
	  'bold': {
	    name: 'bold',
	    action: 'bold',
	    innerHTML: svg.bold,
	    title: 'Bold',
	    hotkey: 'Mod-B'
	  },
	  'italic': {
	    name: 'italic',
	    action: 'italic',
	    innerHTML: svg.italic,
	    title: 'Italic',
	    hotkey: 'Mod-I'
	  },
	  'strikethrough': {
	    name: 'strikethrough',
	    action: 'strikethrough',
	    innerHTML: svg.strikethrough,
	    title: 'Strikethrough',
	    hotkey: 'Mod2-Shift-5'
	  },
	  'code': {
	    name: 'code',
	    action: 'code',
	    innerHTML: svg.code,
	    title: 'Format as code'
	  },
	  'h1': {
	    name: 'h1',
	    action: 'h1',
	    innerHTML: svg.h1,
	    title: 'Level 1 heading',
	    hotkey: 'Mod-Shift-1'
	  },
	  'h2': {
	    name: 'h2',
	    action: 'h2',
	    innerHTML: svg.h2,
	    title: 'Level 2 heading',
	    hotkey: 'Mod-Shift-2'
	  },
	  'ul': {
	    name: 'ul',
	    action: 'ul',
	    innerHTML: svg.ul,
	    title: 'Bulleted list'
	  },
	  'ol': {
	    name: 'ol',
	    action: 'ol',
	    innerHTML: svg.ol,
	    title: 'Numbered list'
	  },
	  'blockquote': {
	    name: 'blockquote',
	    action: 'blockquote',
	    innerHTML: svg.blockquote,
	    title: 'Quote',
	    hotkey: 'Mod2-Shift-Q'
	  },
	  'insertLink': {
	    name: 'insertLink',
	    action: function action(editor) {
	      if (editor.isInlineFormattingAllowed()) editor.wrapSelection('[', ']()');
	    },
	    enabled: function enabled(editor, focus, anchor) {
	      return editor.isInlineFormattingAllowed(focus, anchor) ? false : null;
	    },
	    innerHTML: svg.link,
	    title: 'Insert link',
	    hotkey: 'Mod-K'
	  },
	  'insertImage': {
	    name: 'insertImage',
	    action: function action(editor) {
	      if (editor.isInlineFormattingAllowed()) editor.wrapSelection('![', ']()');
	    },
	    enabled: function enabled(editor, focus, anchor) {
	      return editor.isInlineFormattingAllowed(focus, anchor) ? false : null;
	    },
	    innerHTML: svg.image,
	    title: 'Insert image',
	    hotkey: 'Mod2-Shift-I'
	  },
	  'hr': {
	    name: 'hr',
	    action: function action(editor) {
	      return editor.paste('\n***\n');
	    },
	    enabled: function enabled() {
	      return false;
	    },
	    innerHTML: svg.hr,
	    title: 'Insert horizontal line',
	    hotkey: 'Mod2-Shift-L'
	  }
	};

	var CommandBar = /*#__PURE__*/function () {
	  function CommandBar(props) {
	    var _this = this;

	    _classCallCheck(this, CommandBar);

	    this.e = null;
	    this.editor = null;
	    this.commands = [];
	    this.buttons = {};
	    this.state = {};
	    this.hotkeys = [];
	    var element = props.element;

	    if (element && !element.tagName) {
	      element = document.getElementById(props.element);
	    }

	    if (!element) {
	      element = document.body;
	    }

	    this.createCommandBarElement(element, props.commands || ['bold', 'italic', 'strikethrough', '|', 'code', '|', 'h1', 'h2', '|', 'ul', 'ol', '|', 'blockquote', 'hr', '|', 'insertLink', 'insertImage']);
	    document.addEventListener('keydown', function (e) {
	      return _this.handleKeydown(e);
	    });
	    if (props.editor) this.setEditor(props.editor);
	  }

	  _createClass(CommandBar, [{
	    key: "createCommandBarElement",
	    value: function createCommandBarElement(parentElement, commands) {
	      var _this2 = this;

	      this.e = document.createElement('div');
	      this.e.className = 'TMCommandBar';

	      var _iterator = _createForOfIteratorHelper(commands),
	          _step;

	      try {
	        for (_iterator.s(); !(_step = _iterator.n()).done;) {
	          var command = _step.value;

	          if (command == '|') {
	            var el = document.createElement('div');
	            el.className = 'TMCommandDivider';
	            this.e.appendChild(el);
	          } else {
	            var _ret = function () {
	              var commandName = void 0;

	              if (typeof command == "string") {
	                // Reference to default command
	                if (DefaultCommands[command]) {
	                  commandName = command;
	                  _this2.commands[commandName] = DefaultCommands[commandName];
	                } else {
	                  return "continue";
	                }
	              } else if (_typeof(command) == "object" && command.name) {
	                commandName = command.name;
	                _this2.commands[commandName] = {};
	                if (DefaultCommands[commandName]) Object.assign(_this2.commands[commandName], DefaultCommands[commandName]);
	                Object.assign(_this2.commands[commandName], command);
	              } else {
	                return "continue";
	              }

	              var title = _this2.commands[commandName].title || commandName;

	              if (_this2.commands[commandName].hotkey) {
	                var keys = _this2.commands[commandName].hotkey.split('-'); // construct modifiers


	                var modifiers = [];
	                var modifierexplanation = [];

	                for (var i = 0; i < keys.length - 1; i++) {
	                  switch (keys[i]) {
	                    case 'Ctrl':
	                      modifiers.push('ctrlKey');
	                      modifierexplanation.push('Ctrl');
	                      break;

	                    case 'Cmd':
	                      modifiers.push('metaKey');
	                      modifierexplanation.push('⌘');
	                      break;

	                    case 'Alt':
	                      modifiers.push('altKey');
	                      modifierexplanation.push('Alt');
	                      break;

	                    case 'Option':
	                      modifiers.push('altKey');
	                      modifierexplanation.push('⌥');
	                      break;

	                    case 'Win':
	                      modifiers.push('metaKey');
	                      modifierexplanation.push('⊞ Win');
	                      break;

	                    case 'Shift':
	                      modifiers.push('shiftKey');
	                      modifierexplanation.push('⇧');
	                      break;

	                    case 'Mod':
	                      // Mod is a convenience mechanism: Ctrl on Windows, Cmd on Mac
	                      if (isMacLike) {
	                        modifiers.push('metaKey');
	                        modifierexplanation.push('⌘');
	                      } else {
	                        modifiers.push('ctrlKey');
	                        modifierexplanation.push('Ctrl');
	                      }

	                      break;

	                    case 'Mod2':
	                      modifiers.push('altKey');
	                      if (isMacLike) modifierexplanation.push('⌥');else modifierexplanation.push('Alt');
	                      break;
	                    // Mod2 is a convenience mechanism: Alt on Windows, Option on Mac
	                  }
	                }

	                modifierexplanation.push(keys[keys.length - 1]);
	                var hotkey = {
	                  modifiers: modifiers,
	                  command: commandName
	                }; // TODO Right now this is working only for letters and numbers

	                if (keys[keys.length - 1].match(/^[0-9]$/)) {
	                  hotkey.code = "Digit".concat(keys[keys.length - 1]);
	                } else {
	                  hotkey.key = keys[keys.length - 1].toLowerCase();
	                }

	                _this2.hotkeys.push(hotkey);

	                title = title.concat(" (".concat(modifierexplanation.join('+'), ")"));
	              }

	              _this2.buttons[commandName] = document.createElement('div');
	              _this2.buttons[commandName].className = 'TMCommandButton TMCommandButton_Disabled';
	              _this2.buttons[commandName].title = title;
	              _this2.buttons[commandName].innerHTML = _this2.commands[commandName].innerHTML;

	              _this2.buttons[commandName].addEventListener('mousedown', function (e) {
	                return _this2.handleClick(commandName, e);
	              });

	              _this2.e.appendChild(_this2.buttons[commandName]);
	            }();

	            if (_ret === "continue") continue;
	          }
	        }
	      } catch (err) {
	        _iterator.e(err);
	      } finally {
	        _iterator.f();
	      }

	      parentElement.appendChild(this.e);
	    }
	  }, {
	    key: "handleClick",
	    value: function handleClick(commandName, event) {
	      if (!this.editor) return;
	      event.preventDefault();

	      if (typeof this.commands[commandName].action == "string") {
	        if (this.state[commandName] === false) this.editor.setCommandState(commandName, true);else this.editor.setCommandState(commandName, false);
	      } else if (typeof this.commands[commandName].action == "function") {
	        this.commands[commandName].action(this.editor);
	      }
	    }
	  }, {
	    key: "setEditor",
	    value: function setEditor(editor) {
	      var _this3 = this;

	      this.editor = editor;
	      editor.addEventListener('selection', function (e) {
	        return _this3.handleSelection(e);
	      });
	    }
	  }, {
	    key: "handleSelection",
	    value: function handleSelection(event) {
	      if (event.commandState) {
	        for (var command in this.commands) {
	          if (event.commandState[command] === undefined) {
	            if (this.commands[command].enabled) this.state[command] = this.commands[command].enabled(this.editor, event.focus, event.anchor);else this.state[command] = event.focus ? false : null;
	          } else {
	            this.state[command] = event.commandState[command];
	          }

	          if (this.state[command] === true) {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Active';
	          } else if (this.state[command] === false) {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Inactive';
	          } else {
	            this.buttons[command].className = 'TMCommandButton TMCommandButton_Disabled';
	          }
	        }
	      }
	    }
	  }, {
	    key: "handleKeydown",
	    value: function handleKeydown(event) {
	      var _iterator2 = _createForOfIteratorHelper(this.hotkeys),
	          _step2;

	      try {
	        outer: for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	          var hotkey = _step2.value;

	          if (hotkey.key && event.key.toLowerCase() == hotkey.key || hotkey.code && event.code == hotkey.code) {
	            // Key matches hotkey. Look for any required modifier that wasn't pressed
	            var _iterator3 = _createForOfIteratorHelper(hotkey.modifiers),
	                _step3;

	            try {
	              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	                var modifier = _step3.value;
	                if (!event[modifier]) continue outer;
	              } // Everything matches.

	            } catch (err) {
	              _iterator3.e(err);
	            } finally {
	              _iterator3.f();
	            }

	            this.handleClick(hotkey.command, event);
	            return;
	          }
	        }
	      } catch (err) {
	        _iterator2.e(err);
	      } finally {
	        _iterator2.f();
	      }
	    }
	  }]);

	  return CommandBar;
	}();

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties


	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);

	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var defineProperty$2 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty$2(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var $includes = arrayIncludes.includes;





	var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', {
	  ACCESSORS: true,
	  1: 0
	}); // `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !USES_TO_LENGTH
	}, {
	  includes: function includes(el
	  /* , fromIndex = 0 */
	  ) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables('includes');

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('splice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var max$1 = Math.max;
	var min$3 = Math.min;
	var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded'; // `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
	}, {
	  splice: function splice(start, deleteCount
	  /* , ...items */
	  ) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;

	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$3(max$1(toInteger(deleteCount), 0), len - actualStart);
	    }

	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }

	    A = arraySpeciesCreate(O, actualDeleteCount);

	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }

	    A.length = actualDeleteCount;

	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }

	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];else delete O[to];
	      }
	    }

	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }

	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  }

	  return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;

	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) {
	      /* empty */
	    }
	  }

	  return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes


	_export({
	  target: 'String',
	  proto: true,
	  forced: !correctIsRegexpLogic('includes')
	}, {
	  includes: function includes(searchString
	  /* , position = 0 */
	  ) {
	    return !!~String(requireObjectCoercible(this)).indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var max$2 = Math.max;
	var min$4 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	}; // @@replace logic


	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
	  return [// `String.prototype.replace` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	  function replace(searchValue, replaceValue) {
	    var O = requireObjectCoercible(this);
	    var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	    return replacer !== undefined ? replacer.call(searchValue, O, replaceValue) : nativeReplace.call(String(O), searchValue, replaceValue);
	  }, // `RegExp.prototype[@@replace]` method
	  // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	  function (regexp, replaceValue) {
	    if (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0 || typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1) {
	      var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	      if (res.done) return res.value;
	    }

	    var rx = anObject(regexp);
	    var S = String(this);
	    var functionalReplace = typeof replaceValue === 'function';
	    if (!functionalReplace) replaceValue = String(replaceValue);
	    var global = rx.global;

	    if (global) {
	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	    }

	    var results = [];

	    while (true) {
	      var result = regexpExecAbstract(rx, S);
	      if (result === null) break;
	      results.push(result);
	      if (!global) break;
	      var matchStr = String(result[0]);
	      if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	    }

	    var accumulatedResult = '';
	    var nextSourcePosition = 0;

	    for (var i = 0; i < results.length; i++) {
	      result = results[i];
	      var matched = String(result[0]);
	      var position = max$2(min$4(toInteger(result.index), S.length), 0);
	      var captures = []; // NOTE: This is equivalent to
	      //   captures = result.slice(1).map(maybeToString)
	      // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	      // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	      // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.

	      for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));

	      var namedCaptures = result.groups;

	      if (functionalReplace) {
	        var replacerArgs = [matched].concat(captures, position, S);
	        if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	        var replacement = String(replaceValue.apply(undefined, replacerArgs));
	      } else {
	        replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	      }

	      if (position >= nextSourcePosition) {
	        accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	        nextSourcePosition = position + matched.length;
	      }
	    }

	    return accumulatedResult + S.slice(nextSourcePosition);
	  }]; // https://tc39.github.io/ecma262/#sec-getsubstitution

	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;

	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }

	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;

	      switch (ch.charAt(0)) {
	        case '$':
	          return '$';

	        case '&':
	          return matched;

	        case '`':
	          return str.slice(0, position);

	        case "'":
	          return str.slice(tailPos);

	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;

	        default:
	          // \d\d?
	          var n = +ch;
	          if (n === 0) return match;

	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }

	          capture = captures[n - 1];
	      }

	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$'); // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation

	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var non = '\u200B\u0085\u180E'; // check that a method works with the correct list
	// of whitespaces and has a correct name

	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;

	 // `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim


	_export({
	  target: 'String',
	  proto: true,
	  forced: stringTrimForced('trim')
	}, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var FAILS_ON_PRIMITIVES = fails(function () {
	  objectKeys(1);
	}); // `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys

	_export({
	  target: 'Object',
	  stat: true,
	  forced: FAILS_ON_PRIMITIVES
	}, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  }

	  return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.

	/* eslint-disable no-proto */


	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;

	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) {
	    /* empty */
	  }

	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	// makes subclassing work correct for wrapped built-ins


	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if ( // it can work only with native `setPrototypeOf`
	  objectSetPrototypeOf && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	  typeof (NewTarget = dummy.constructor) == 'function' && NewTarget !== Wrapper && isObject(NewTargetPrototype = NewTarget.prototype) && NewTargetPrototype !== Wrapper.prototype) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var SPECIES$4 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
	    defineProperty(Constructor, SPECIES$4, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var defineProperty$3 = objectDefineProperty.f;

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;











	var setInternalState = internalState.set;





	var MATCH$2 = wellKnownSymbol('match');
	var NativeRegExp = global_1.RegExp;
	var RegExpPrototype = NativeRegExp.prototype;
	var re1 = /a/g;
	var re2 = /a/g; // "new" should create a new object, old webkit bug

	var CORRECT_NEW = new NativeRegExp(re1) !== re1;
	var UNSUPPORTED_Y$2 = regexpStickyHelpers.UNSUPPORTED_Y;
	var FORCED$1 = descriptors && isForced_1('RegExp', !CORRECT_NEW || UNSUPPORTED_Y$2 || fails(function () {
	  re2[MATCH$2] = false; // RegExp constructor can alter flags and IsRegExp works correct with @@match

	  return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	})); // `RegExp` constructor
	// https://tc39.github.io/ecma262/#sec-regexp-constructor

	if (FORCED$1) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = this instanceof RegExpWrapper;
	    var patternIsRegExp = isRegexp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var sticky;

	    if (!thisIsRegExp && patternIsRegExp && pattern.constructor === RegExpWrapper && flagsAreUndefined) {
	      return pattern;
	    }

	    if (CORRECT_NEW) {
	      if (patternIsRegExp && !flagsAreUndefined) pattern = pattern.source;
	    } else if (pattern instanceof RegExpWrapper) {
	      if (flagsAreUndefined) flags = regexpFlags.call(pattern);
	      pattern = pattern.source;
	    }

	    if (UNSUPPORTED_Y$2) {
	      sticky = !!flags && flags.indexOf('y') > -1;
	      if (sticky) flags = flags.replace(/y/g, '');
	    }

	    var result = inheritIfRequired(CORRECT_NEW ? new NativeRegExp(pattern, flags) : NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype, RegExpWrapper);
	    if (UNSUPPORTED_Y$2 && sticky) setInternalState(result, {
	      sticky: sticky
	    });
	    return result;
	  };

	  var proxy = function (key) {
	    key in RegExpWrapper || defineProperty$3(RegExpWrapper, key, {
	      configurable: true,
	      get: function () {
	        return NativeRegExp[key];
	      },
	      set: function (it) {
	        NativeRegExp[key] = it;
	      }
	    });
	  };

	  var keys$1 = getOwnPropertyNames(NativeRegExp);
	  var index = 0;

	  while (keys$1.length > index) proxy(keys$1[index++]);

	  RegExpPrototype.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype;
	  redefine(global_1, 'RegExp', RegExpWrapper);
	} // https://tc39.github.io/ecma262/#sec-get-regexp-@@species


	setSpecies('RegExp');

	var UNSUPPORTED_Y$3 = regexpStickyHelpers.UNSUPPORTED_Y; // `RegExp.prototype.flags` getter
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags


	if (descriptors && (/./g.flags != 'g' || UNSUPPORTED_Y$3)) {
	  objectDefineProperty.f(RegExp.prototype, 'flags', {
	    configurable: true,
	    get: regexpFlags
	  });
	}

	var TO_STRING = 'toString';
	var RegExpPrototype$1 = RegExp.prototype;
	var nativeToString = RegExpPrototype$1[TO_STRING];
	var NOT_GENERIC = fails(function () {
	  return nativeToString.call({
	    source: 'a',
	    flags: 'b'
	  }) != '/a/b';
	}); // FF44- RegExp#toString has a wrong name

	var INCORRECT_NAME = nativeToString.name != TO_STRING; // `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring

	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype$1) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, {
	    unsafe: true
	  });
	}

	// const replacements = {
	//   ASCIIPunctuation: '!"#$%&\'()*+,\\-./:;<=>?@\\[\\]^_`{|}~',
	//   TriggerChars: '`_\*\[\]\(\)',
	//   Scheme: `[A-Za-z][A-Za-z0-9\+\.\-]{1,31}`,
	//   Email: `[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*`, // From CommonMark spec
	// }
	var replacements = {
	  ASCIIPunctuation: /[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~\\]/,
	  NotTriggerChar: /[^`_*[\]()<>!~]/,
	  Scheme: /[A-Za-z][A-Za-z0-9+.-]{1,31}/,
	  Email: /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/,
	  // From CommonMark spec
	  HTMLOpenTag: /<HTMLTagName(?:HTMLAttribute)*\s*\/?>/,
	  HTMLCloseTag: /<\/HTMLTagName\s*>/,
	  HTMLTagName: /[A-Za-z][A-Za-z0-9-]*/,
	  HTMLComment: /<!--(?:[^>-]|(?:[^>-](?:[^-]|-[^-])*[^-]))-->/,
	  HTMLPI: /<\?(?:|.|(?:[^?]|\?[^>])*)\?>/,
	  HTMLDeclaration: /<![A-Z]+\s[^>]*>/,
	  HTMLCDATA: /<!\[CDATA\[.*?\]\]>/,
	  HTMLAttribute: /\s+[A-Za-z_:][A-Za-z0-9_.:-]*(?:HTMLAttValue)?/,
	  HTMLAttValue: /\s*=\s*(?:(?:'[^']*')|(?:"[^"]*")|(?:[^\s"'=<>`]+))/,
	  KnownTag: /address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul/
	}; // From CommonMark.js. 

	var punctuationLeading = new RegExp(/^(?:[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B])/);
	var punctuationTrailing = new RegExp(/(?:[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B])$/); // export const inlineTriggerChars = new RegExp(`[${replacements.TriggerChars}]`);

	/**
	 * This is CommonMark's block grammar, but we're ignoring nested blocks here.  
	 */

	var lineGrammar = {
	  TMH1: {
	    regexp: /^( {0,3}#\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH1">$1</span>$$2<span class="TMMark TMMark_TMH1">$3</span>'
	  },
	  TMH2: {
	    regexp: /^( {0,3}##\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH2">$1</span>$$2<span class="TMMark TMMark_TMH2">$3</span>'
	  },
	  TMH3: {
	    regexp: /^( {0,3}###\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH3">$1</span>$$2<span class="TMMark TMMark_TMH3">$3</span>'
	  },
	  TMH4: {
	    regexp: /^( {0,3}####\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH4">$1</span>$$2<span class="TMMark TMMark_TMH4">$3</span>'
	  },
	  TMH5: {
	    regexp: /^( {0,3}#####\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH5">$1</span>$$2<span class="TMMark TMMark_TMH5">$3</span>'
	  },
	  TMH6: {
	    regexp: /^( {0,3}######\s)(.*?)((?:\s+#+\s*)?)$/,
	    replacement: '<span class="TMMark TMMark_TMH6">$1</span>$$2<span class="TMMark TMMark_TMH6">$3</span>'
	  },
	  TMBlockquote: {
	    regexp: /^( {0,3}>[ ]?)(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMBlockquote">$1</span>$$2'
	  },
	  TMCodeFenceBacktickOpen: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(````*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)([\0-_a-\uFFFF]*?)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceBacktick">$1</span><span class="TMInfoString">$3</span>$4'
	  },
	  TMCodeFenceTildeOpen: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(~~~~*)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)(.*?)([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceTilde">$1</span><span class="TMInfoString">$3</span>$4'
	  },
	  TMCodeFenceBacktickClose: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(````*))([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceBacktick">$1</span>$3'
	  },
	  TMCodeFenceTildeClose: {
	    regexp: /*#__PURE__*/_wrapRegExp(/^( {0,3}(~~~~*))([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	      seq: 2
	    }),
	    replacement: '<span class="TMMark TMMark_TMCodeFenceTilde">$1</span>$3'
	  },
	  TMBlankLine: {
	    regexp: /^([ \t]*)$/,
	    replacement: '$0'
	  },
	  TMSetextH1Marker: {
	    regexp: /^ {0,3}=+\s*$/,
	    replacement: '<span class="TMMark TMMark_TMSetextH1Marker">$0</span>'
	  },
	  TMSetextH2Marker: {
	    regexp: /^ {0,3}-+\s*$/,
	    replacement: '<span class="TMMark TMMark_TMSetextH1Marker">$0</span>'
	  },
	  TMHR: {
	    regexp: /^( {0,3}(\*[ \t]*\*[ \t]*\*[ \t*]*)|(-[ \t]*-[ \t]*-[ \t-]*)|(_[ \t]*_[ \t]*_[ \t_]*))$/,
	    replacement: '<span class="TMMark TMMark_TMHR">$0</span>'
	  },
	  TMUL: {
	    regexp: /^( {0,3}[+*-] {1,4})(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMUL">$1</span>$$2'
	  },
	  TMOL: {
	    regexp: /^( {0,3}\d{1,9}[.)] {1,4})(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMOL">$1</span>$$2'
	  },
	  // TODO: This is currently preventing sublists (and any content within list items, really) from working
	  TMIndentedCode: {
	    regexp: /^( {4}|\t)(.*)$/,
	    replacement: '<span class="TMMark TMMark_TMIndentedCode">$1</span>$2'
	  },
	  TMLinkReferenceDefinition: {
	    // TODO: Link destination can't include unbalanced parantheses, but we just ignore that here 
	    regexp: /^( {0,3}\[\s*)([^\s\]](?:[^\]]|\\\])*?)(\s*\]:\s*)((?:[^\s<>]+)|(?:<(?:[^<>\\]|\\.)*>))?(\s*)((?:\((?:[^()\\]|\\.)*\))|(?:"(?:[^"\\]|\\.)*")|(?:'(?:[^'\\]|\\.)*'))?(\s*)$/,
	    replacement: '<span class="TMMark TMMark_TMLinkReferenceDefinition">$1</span><span class="TMLinkLabel TMLinkLabel_Definition">$2</span><span class="TMMark TMMark_TMLinkReferenceDefinition">$3</span><span class="TMLinkDestination">$4</span>$5<span class="TMLinkTitle">$6</span>$7',
	    labelPlaceholder: 2 // this defines which placeholder in the above regex is the link "label"

	  }
	};
	/**
	 * HTML blocks have multiple different classes of opener and closer. This array defines all the cases
	 */

	var htmlBlockGrammar = [{
	  start: /^ {0,3}<(?:script|pre|style)(?:\s|>|$)/i,
	  end: /(?:<\/script>|<\/pre>|<\/style>)/i,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<!--/,
	  end: /-->/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<\?/,
	  end: /\?>/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<![A-Z]/,
	  end: />/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}<!\[CDATA\[/,
	  end: /\]\]>/,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}(?:<|<\/)(?:KnownTag)(?:\s|>|\/>|$)/i,
	  end: false,
	  paraInterrupt: true
	}, {
	  start: /^ {0,3}(?:HTMLOpenTag|HTMLCloseTag)\s*$/,
	  end: false,
	  paraInterrupt: false
	}];
	/**
	 * Structure of the object:
	 * Top level entries are rules, each consisting of a regular expressions (in string format) as well as a replacement.
	 * In the regular expressions, replacements from the object 'replacements' will be processed before compiling into the property regexp.
	 */

	var inlineGrammar = {
	  escape: {
	    regexp: /^\\(ASCIIPunctuation)/,
	    replacement: '<span class="TMMark TMMark_TMEscape">\\</span>$1'
	  },
	  code: {
	    regexp: /^(`+)((?:[^`])|(?:[^`].*?[^`]))(\1)/,
	    replacement: '<span class="TMMark TMMark_TMCode">$1</span><code class="TMCode">$2</code><span class="TMMark TMMark_TMCode">$3</span>'
	  },
	  autolink: {
	    regexp: /^<((?:Scheme:[^\s<>]*)|(?:Email))>/,
	    replacement: '<span class="TMMark TMMark_TMAutolink">&lt;</span><span class="TMAutolink">$1</span><span class="TMMark TMMark_TMAutolink">&gt;</span>'
	  },
	  html: {
	    regexp: /^((?:HTMLOpenTag)|(?:HTMLCloseTag)|(?:HTMLComment)|(?:HTMLPI)|(?:HTMLDeclaration)|(?:HTMLCDATA))/,
	    replacement: '<span class="TMHTML">$1</span>'
	  },
	  linkOpen: {
	    regexp: /^\[/,
	    replacement: ''
	  },
	  imageOpen: {
	    regexp: /^!\[/,
	    replacement: ''
	  },
	  linkLabel: {
	    regexp: /^(\[\s*)([^\]]*?)(\s*\])/,
	    replacement: '',
	    labelPlaceholder: 2
	  },
	  default: {
	    regexp: /^(.|(?:NotTriggerChar+))/,
	    replacement: '$1'
	  }
	}; // Process replacements in regexps

	var replacementRegexp = new RegExp(Object.keys(replacements).join('|')); // Inline

	var inlineRules = _toConsumableArray(Object.keys(inlineGrammar));

	var _iterator = _createForOfIteratorHelper(inlineRules),
	    _step;

	try {
	  for (_iterator.s(); !(_step = _iterator.n()).done;) {
	    var _rule = _step.value;
	    var _re = inlineGrammar[_rule].regexp.source; // Replace while there is something to replace. This means it also works over multiple levels (replacements containing replacements)

	    while (_re.match(replacementRegexp)) {
	      _re = _re.replace(replacementRegexp, function (string) {
	        return replacements[string].source;
	      });
	    }

	    inlineGrammar[_rule].regexp = new RegExp(_re, inlineGrammar[_rule].regexp.flags);
	  } // HTML Block (only opening rule is processed currently)

	} catch (err) {
	  _iterator.e(err);
	} finally {
	  _iterator.f();
	}

	for (var _i = 0, _htmlBlockGrammar = htmlBlockGrammar; _i < _htmlBlockGrammar.length; _i++) {
	  var rule = _htmlBlockGrammar[_i];
	  var re = rule.start.source; // Replace while there is something to replace. This means it also works over multiple levels (replacements containing replacements)

	  while (re.match(replacementRegexp)) {
	    re = re.replace(replacementRegexp, function (string) {
	      return replacements[string].source;
	    });
	  }

	  rule.start = new RegExp(re, rule.start.flags);
	}
	/**
	 * Escapes HTML special characters (<, >, and &) in the string.
	 * @param {string} string The raw string to be escaped
	 * @returns {string} The string, ready to be used in HTML
	 */


	function htmlescape(string) {
	  return (string ? string : '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}
	/**
	 * Contains the commands that can be sent to the editor. Contains objects with a name representing the name of the command.
	 * Each of the objects contains the following keys:
	 * 
	 *   - type: Can be either inline (for inline formatting) or line (for block / line formatting).
	 *   - className: Used to determine whether the command is active at a given position. 
	 *     For line formatting, this looks at the class of the line element. For inline elements, tries to find an enclosing element with that class.
	 *   - set / unset: Contain instructions how to set and unset the command. For line type commands, both consist of a pattern and replacement that 
	 *     will be applied to each line (using String.replace). For inline type commands, the set object contains a pre and post string which will
	 *     be inserted before and after the selection. The unset object contains a prePattern and a postPattern. Both should be regular expressions and 
	 *     they will be applied to the portion of the line before and after the selection (using String.replace, with an empty replacement string).
	 */


	var commands = {
	  // Replacements for unset for inline commands are '' by default
	  bold: {
	    type: 'inline',
	    className: 'TMStrong',
	    set: {
	      pre: '**',
	      post: '**'
	    },
	    unset: {
	      prePattern: /(?:\*\*|__)$/,
	      postPattern: /^(?:\*\*|__)/
	    }
	  },
	  italic: {
	    type: 'inline',
	    className: 'TMEm',
	    set: {
	      pre: '*',
	      post: '*'
	    },
	    unset: {
	      prePattern: /(?:\*|_)$/,
	      postPattern: /^(?:\*|_)/
	    }
	  },
	  code: {
	    type: 'inline',
	    className: 'TMCode',
	    set: {
	      pre: '`',
	      post: '`'
	    },
	    unset: {
	      prePattern: /`+$/,
	      postPattern: /^`+/
	    } // FIXME this doesn't ensure balanced backticks right now

	  },
	  strikethrough: {
	    type: 'inline',
	    className: 'TMStrikethrough',
	    set: {
	      pre: '~~',
	      post: '~~'
	    },
	    unset: {
	      prePattern: /~~$/,
	      postPattern: /^~~/
	    }
	  },
	  h1: {
	    type: 'line',
	    className: 'TMH1',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '# $2'
	    },
	    unset: {
	      pattern: /^( {0,3}#\s+)(.*?)((?:\s+#+\s*)?)$/,
	      replacement: '$2'
	    }
	  },
	  h2: {
	    type: 'line',
	    className: 'TMH2',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '## $2'
	    },
	    unset: {
	      pattern: /^( {0,3}##\s+)(.*?)((?:\s+#+\s*)?)$/,
	      replacement: '$2'
	    }
	  },
	  ul: {
	    type: 'line',
	    className: 'TMUL',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '- $2'
	    },
	    unset: {
	      pattern: /^( {0,3}[+*-] {1,4})(.*)$/,
	      replacement: '$2'
	    }
	  },
	  ol: {
	    type: 'line',
	    className: 'TMOL',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '$#. $2'
	    },
	    unset: {
	      pattern: /^( {0,3}\d{1,9}[.)] {1,4})(.*)$/,
	      replacement: '$2'
	    }
	  },
	  blockquote: {
	    type: 'line',
	    className: 'TMBlockquote',
	    set: {
	      pattern: /^( {0,3}(?:(?:#+|[0-9]{1,9}[).]|[>\-*+])\s+)?)(.*)$/,
	      replacement: '> $2'
	    },
	    unset: {
	      pattern: /^( {0,3}>[ ]?)(.*)$/,
	      replacement: '$2'
	    }
	  }
	};

	var Editor = /*#__PURE__*/function () {
	  function Editor() {
	    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Editor);

	    this.e = null;
	    this.textarea = null;
	    this.lines = [];
	    this.lineElements = [];
	    this.lineTypes = [];
	    this.lineCaptures = [];
	    this.lineReplacements = [];
	    this.linkLabels = [];
	    this.lineDirty = [];
	    this.lastCommandState = null;
	    this.listeners = {
	      change: [],
	      selection: []
	    };
	    var element = props.element;
	    this.textarea = props.textarea;

	    if (this.textarea && !this.textarea.tagName) {
	      this.textarea = document.getElementById(this.textarea);
	      if (!element) element = this.textarea;
	    }

	    if (element && !element.tagName) {
	      element = document.getElementById(props.element);
	    }

	    if (!element) {
	      element = document.getElementsByTagName('body')[0];
	    }

	    if (element.tagName == 'TEXTAREA') {
	      this.textarea = element;
	      element = this.textarea.parentNode;
	    }

	    if (this.textarea) {
	      this.textarea.style.display = 'none';
	    }

	    this.createEditorElement(element); // TODO Placeholder for empty content

	    this.setContent(props.content || (this.textarea ? this.textarea.value : false) || '# Hello TinyMDE!\nEdit **here**');
	  }
	  /**
	   * Creates the editor element inside the target element of the DOM tree
	   * @param element The target element of the DOM tree
	   */


	  _createClass(Editor, [{
	    key: "createEditorElement",
	    value: function createEditorElement(element) {
	      var _this = this;

	      this.e = document.createElement('div');
	      this.e.className = 'TinyMDE';
	      this.e.contentEditable = true; // The following is important for formatting purposes, but also since otherwise the browser replaces subsequent spaces with  &nbsp; &nbsp;
	      // That breaks a lot of stuff, so we do this here and not in CSS—therefore, you don't have to remember to but this in the CSS file

	      this.e.style.whiteSpace = 'pre-wrap'; // Avoid formatting (B / I / U) popping up on iOS

	      this.e.style.webkitUserModify = 'read-write-plaintext-only';

	      if (this.textarea && this.textarea.parentNode == element && this.textarea.nextSibling) {
	        element.insertBefore(this.e, this.textarea.nextSibling);
	      } else {
	        element.appendChild(this.e);
	      }

	      this.e.addEventListener("input", function (e) {
	        return _this.handleInputEvent(e);
	      }); // this.e.addEventListener("keydown", (e) => this.handleKeydownEvent(e));

	      document.addEventListener("selectionchange", function (e) {
	        return _this.handleSelectionChangeEvent(e);
	      });
	      this.e.addEventListener("paste", function (e) {
	        return _this.handlePaste(e);
	      }); // this.e.addEventListener('keydown', (e) => this.handleKeyDown(e));

	      this.lineElements = this.e.childNodes; // this will automatically update
	    }
	    /**
	     * Sets the editor content.
	     * @param {string} content The new Markdown content
	     */

	  }, {
	    key: "setContent",
	    value: function setContent(content) {
	      // Delete any existing content
	      while (this.e.firstChild) {
	        this.e.removeChild(this.e.firstChild);
	      }

	      this.lines = content.split(/(?:\r\n|\r|\n)/);
	      this.lineDirty = [];

	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        var le = document.createElement('div');
	        this.e.appendChild(le);
	        this.lineDirty.push(true);
	      }

	      this.lineTypes = new Array(this.lines.length);
	      this.updateFormatting();
	      this.fireChange();
	    }
	    /**
	     * Gets the editor content as a Markdown string.
	     * @returns {string} The editor content as a markdown string
	     */

	  }, {
	    key: "getContent",
	    value: function getContent() {
	      return this.lines.join('\n');
	    }
	    /**
	     * This is the main method to update the formatting (from this.lines to HTML output)
	     */

	  }, {
	    key: "updateFormatting",
	    value: function updateFormatting() {
	      // First, parse line types. This will update this.lineTypes, this.lineReplacements, and this.lineCaptures
	      // We don't apply the formatting yet
	      this.updateLineTypes(); // Collect any valid link labels from link reference definitions—we need that for formatting to determine what's a valid link

	      this.updateLinkLabels(); // Now, apply the formatting

	      this.applyLineTypes();
	    }
	    /**
	     * Updates this.linkLabels: For every link reference definition (line type TMLinkReferenceDefinition), we collect the label
	     */

	  }, {
	    key: "updateLinkLabels",
	    value: function updateLinkLabels() {
	      this.linkLabels = [];

	      for (var l = 0; l < this.lines.length; l++) {
	        if (this.lineTypes[l] == 'TMLinkReferenceDefinition') {
	          this.linkLabels.push(this.lineCaptures[l][lineGrammar.TMLinkReferenceDefinition.labelPlaceholder]);
	        }
	      }
	    }
	    /**
	     * Helper function to replace placeholders from a RegExp capture. The replacement string can contain regular dollar placeholders (e.g., $1),
	     * which are interpreted like in String.replace(), but also double dollar placeholders ($$1). In the case of double dollar placeholders, 
	     * Markdown inline grammar is applied on the content of the captured subgroup, i.e., $$1 processes inline Markdown grammar in the content of the
	     * first captured subgroup, and replaces `$$1` with the result.
	     * 
	     * @param {string} replacement The replacement string, including placeholders.
	     * @param  capture The result of a RegExp.exec() call
	     * @returns The replacement string, with placeholders replaced from the capture result.
	     */

	  }, {
	    key: "replace",
	    value: function replace(replacement, capture) {
	      var _this2 = this;

	      return replacement.replace(/\$\$([0-9])/g, function (str, p1) {
	        return "<span class=\"TMInlineFormatted\">".concat(_this2.processInlineStyles(capture[p1]), "</span>");
	      }).replace(/\$([0-9])/g, function (str, p1) {
	        return htmlescape(capture[p1]);
	      });
	    }
	    /**
	     * Applies the line types (from this.lineTypes as well as the capture result in this.lineReplacements and this.lineCaptures) 
	     * and processes inline formatting for all lines.
	     */

	  }, {
	    key: "applyLineTypes",
	    value: function applyLineTypes() {
	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        if (this.lineDirty[lineNum]) {
	          var contentHTML = this.replace(this.lineReplacements[lineNum], this.lineCaptures[lineNum]); // this.lineHTML[lineNum] = (contentHTML == '' ? '<br />' : contentHTML); // Prevent empty elements which can't be selected etc.

	          this.lineElements[lineNum].className = this.lineTypes[lineNum];
	          this.lineElements[lineNum].removeAttribute('style');
	          this.lineElements[lineNum].innerHTML = contentHTML == '' ? '<br />' : contentHTML; // Prevent empty elements which can't be selected etc.
	        }

	        this.lineElements[lineNum].dataset.lineNum = lineNum;
	      }
	    }
	    /**
	     * Determines line types for all lines based on the line / block grammar. Captures the results of the respective line
	     * grammar regular expressions.
	     * Updates this.lineTypes, this.lineCaptures, and this.lineReplacements.
	     */

	  }, {
	    key: "updateLineTypes",
	    value: function updateLineTypes() {
	      var codeBlockType = false;
	      var codeBlockSeqLength = 0;
	      var htmlBlock = false;

	      for (var lineNum = 0; lineNum < this.lines.length; lineNum++) {
	        var lineType = 'TMPara';
	        var lineCapture = [this.lines[lineNum]];
	        var lineReplacement = '$$0'; // Default replacement for paragraph: Inline format the entire line
	        // Check ongoing code blocks
	        // if (lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMCodeFenceBacktickOpen' || this.lineTypes[lineNum - 1] == 'TMFencedCodeBacktick')) {

	        if (codeBlockType == 'TMCodeFenceBacktickOpen') {
	          // We're in a backtick-fenced code block, check if the current line closes it
	          var capture = lineGrammar.TMCodeFenceBacktickClose.regexp.exec(this.lines[lineNum]);

	          if (capture && capture.groups['seq'].length >= codeBlockSeqLength) {
	            lineType = 'TMCodeFenceBacktickClose';
	            lineReplacement = lineGrammar.TMCodeFenceBacktickClose.replacement;
	            lineCapture = capture;
	            codeBlockType = false;
	          } else {
	            lineType = 'TMFencedCodeBacktick';
	            lineReplacement = '$0';
	            lineCapture = [this.lines[lineNum]];
	          }
	        } // if (lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMCodeFenceTildeOpen' || this.lineTypes[lineNum - 1] == 'TMFencedCodeTilde')) {
	        else if (codeBlockType == 'TMCodeFenceTildeOpen') {
	            // We're in a tilde-fenced code block
	            var _capture = lineGrammar.TMCodeFenceTildeClose.regexp.exec(this.lines[lineNum]);

	            if (_capture && _capture.groups['seq'].length >= codeBlockSeqLength) {
	              lineType = 'TMCodeFenceTildeClose';
	              lineReplacement = lineGrammar.TMCodeFenceTildeClose.replacement;
	              lineCapture = _capture;
	              codeBlockType = false;
	            } else {
	              lineType = 'TMFencedCodeTilde';
	              lineReplacement = '$0';
	              lineCapture = [this.lines[lineNum]];
	            }
	          } // Check HTML block types


	        if (lineType == 'TMPara' && htmlBlock === false) {
	          var _iterator = _createForOfIteratorHelper(htmlBlockGrammar),
	              _step;

	          try {
	            for (_iterator.s(); !(_step = _iterator.n()).done;) {
	              var htmlBlockType = _step.value;

	              if (this.lines[lineNum].match(htmlBlockType.start)) {
	                // Matching start condition. Check if this tag can start here (not all start conditions allow breaking a paragraph).
	                if (htmlBlockType.paraInterrupt || lineNum == 0 || !(this.lineTypes[lineNum - 1] == 'TMPara' || this.lineTypes[lineNum - 1] == 'TMUL' || this.lineTypes[lineNum - 1] == 'TMOL' || this.lineTypes[lineNum - 1] == 'TMBlockquote')) {
	                  htmlBlock = htmlBlockType;
	                  break;
	                }
	              }
	            }
	          } catch (err) {
	            _iterator.e(err);
	          } finally {
	            _iterator.f();
	          }
	        }

	        if (htmlBlock !== false) {
	          lineType = 'TMHTMLBlock';
	          lineReplacement = '$0'; // No formatting in TMHTMLBlock

	          lineCapture = [this.lines[lineNum]]; // This should already be set but better safe than sorry
	          // Check if HTML block should be closed

	          if (htmlBlock.end) {
	            // Specific end condition
	            if (this.lines[lineNum].match(htmlBlock.end)) {
	              htmlBlock = false;
	            }
	          } else {
	            // No specific end condition, ends with blank line
	            if (lineNum == this.lines.length - 1 || this.lines[lineNum + 1].match(lineGrammar.TMBlankLine.regexp)) {
	              htmlBlock = false;
	            }
	          }
	        } // Check all regexps if we haven't applied one of the code block types


	        if (lineType == 'TMPara') {
	          for (var type in lineGrammar) {
	            if (lineGrammar[type].regexp) {
	              var _capture2 = lineGrammar[type].regexp.exec(this.lines[lineNum]);

	              if (_capture2) {
	                lineType = type;
	                lineReplacement = lineGrammar[type].replacement;
	                lineCapture = _capture2;
	                break;
	              }
	            }
	          }
	        } // If we've opened a code block, remember that


	        if (lineType == 'TMCodeFenceBacktickOpen' || lineType == 'TMCodeFenceTildeOpen') {
	          codeBlockType = lineType;
	          codeBlockSeqLength = lineCapture.groups['seq'].length;
	        } // Link reference definition and indented code can't interrupt a paragraph


	        if ((lineType == 'TMIndentedCode' || lineType == 'TMLinkReferenceDefinition') && lineNum > 0 && (this.lineTypes[lineNum - 1] == 'TMPara' || this.lineTypes[lineNum - 1] == 'TMUL' || this.lineTypes[lineNum - 1] == 'TMOL' || this.lineTypes[lineNum - 1] == 'TMBlockquote')) {
	          // Fall back to TMPara
	          lineType = 'TMPara';
	          lineCapture = [this.lines[lineNum]];
	          lineReplacement = '$$0';
	        } // Setext H2 markers that can also be interpreted as an empty list item should be regarded as such (as per CommonMark spec)


	        if (lineType == 'TMSetextH2Marker') {
	          var _capture3 = lineGrammar.TMUL.regexp.exec(this.lines[lineNum]);

	          if (_capture3) {
	            lineType = 'TMUL';
	            lineReplacement = lineGrammar.TMUL.replacement;
	            lineCapture = _capture3;
	          }
	        } // Setext headings are only valid if preceded by a paragraph (and if so, they change the type of the previous paragraph)


	        if (lineType == 'TMSetextH1Marker' || lineType == 'TMSetextH2Marker') {
	          if (lineNum == 0 || this.lineTypes[lineNum - 1] != 'TMPara') {
	            // Setext marker is invalid. However, a H2 marker might still be a valid HR, so let's check that
	            var _capture4 = lineGrammar.TMHR.regexp.exec(this.lines[lineNum]);

	            if (_capture4) {
	              // Valid HR
	              lineType = 'TMHR';
	              lineCapture = _capture4;
	              lineReplacement = lineGrammar.TMHR.replacement;
	            } else {
	              // Not valid HR, format as TMPara
	              lineType = 'TMPara';
	              lineCapture = [this.lines[lineNum]];
	              lineReplacement = '$$0';
	            }
	          } else {
	            // Valid setext marker. Change types of preceding para lines
	            var headingLine = lineNum - 1;
	            var headingLineType = lineType == 'TMSetextH1Marker' ? 'TMSetextH1' : 'TMSetextH2';

	            do {
	              if (this.lineTypes[headingLineType] != headingLineType) {
	                this.lineTypes[headingLine] = headingLineType;
	                this.lineDirty[headingLineType] = true;
	              }

	              this.lineReplacements[headingLine] = '$$0';
	              this.lineCaptures[headingLine] = [this.lines[headingLine]];
	              headingLine--;
	            } while (headingLine >= 0 && this.lineTypes[headingLine] == 'TMPara');
	          }
	        } // Lastly, save the line style to be applied later


	        if (this.lineTypes[lineNum] != lineType) {
	          this.lineTypes[lineNum] = lineType;
	          this.lineDirty[lineNum] = true;
	        }

	        this.lineReplacements[lineNum] = lineReplacement;
	        this.lineCaptures[lineNum] = lineCapture;
	      }
	    }
	    /**
	     * Updates all line contents from the HTML, then re-applies formatting.
	     */

	  }, {
	    key: "updateLineContentsAndFormatting",
	    value: function updateLineContentsAndFormatting() {
	      this.clearDirtyFlag();
	      this.updateLineContents();
	      this.updateFormatting();
	    }
	    /**
	     * Attempts to parse a link or image at the current position. This assumes that the opening [ or ![ has already been matched. 
	     * Returns false if this is not a valid link, image. See below for more information
	     * @param {string} originalString The original string, starting at the opening marker ([ or ![)
	     * @param {boolean} isImage Whether or not this is an image (opener == ![)
	     * @returns false if not a valid link / image. 
	     * Otherwise returns an object with two properties: output is the string to be included in the processed output, 
	     * charCount is the number of input characters (from originalString) consumed.
	     */

	  }, {
	    key: "parseLinkOrImage",
	    value: function parseLinkOrImage(originalString, isImage) {
	      // Skip the opening bracket
	      var textOffset = isImage ? 2 : 1;
	      var opener = originalString.substr(0, textOffset);
	      var type = isImage ? 'TMImage' : 'TMLink';
	      var currentOffset = textOffset;
	      var bracketLevel = 1;
	      var linkText = false;
	      var linkRef = false;
	      var linkLabel = [];
	      var linkDetails = []; // If matched, this will be an array: [whitespace + link destination delimiter, link destination, link destination delimiter, whitespace, link title delimiter, link title, link title delimiter + whitespace]. All can be empty strings.

	      textOuter: while (currentOffset < originalString.length && linkText === false
	      /* empty string is okay */
	      ) {
	        var string = originalString.substr(currentOffset); // Capture any escapes and code blocks at current position, they bind more strongly than links
	        // We don't have to actually process them here, that'll be done later in case the link / image is valid, but we need to skip over them.

	        for (var _i = 0, _arr = ['escape', 'code', 'autolink', 'html']; _i < _arr.length; _i++) {
	          var rule = _arr[_i];
	          var cap = inlineGrammar[rule].regexp.exec(string);

	          if (cap) {
	            currentOffset += cap[0].length;
	            continue textOuter;
	          }
	        } // Check for image. It's okay for an image to be included in a link or image


	        if (string.match(inlineGrammar.imageOpen.regexp)) {
	          // Opening image. It's okay if this is a matching pair of brackets
	          bracketLevel++;
	          currentOffset += 2;
	          continue textOuter;
	        } // Check for link (not an image because that would have been captured and skipped over above)


	        if (string.match(inlineGrammar.linkOpen.regexp)) {
	          // Opening bracket. Two things to do:
	          // 1) it's okay if this part of a pair of brackets.
	          // 2) If we are currently trying to parse a link, this nested bracket musn't start a valid link (no nested links allowed)
	          bracketLevel++; // if (bracketLevel >= 2) return false; // Nested unescaped brackets, this doesn't qualify as a link / image

	          if (!isImage) {
	            if (this.parseLinkOrImage(string, false)) {
	              // Valid link inside this possible link, which makes this link invalid (inner links beat outer ones)
	              return false;
	            }
	          }

	          currentOffset += 1;
	          continue textOuter;
	        } // Check for closing bracket


	        if (string.match(/^\]/)) {
	          bracketLevel--;

	          if (bracketLevel == 0) {
	            // Found matching bracket and haven't found anything disqualifying this as link / image.
	            linkText = originalString.substr(textOffset, currentOffset - textOffset);
	            currentOffset++;
	            continue textOuter;
	          }
	        } // Nothing matches, proceed to next char


	        currentOffset++;
	      } // Did we find a link text (i.e., find a matching closing bracket?)


	      if (linkText === false) return false; // Nope
	      // So far, so good. We've got a valid link text. Let's see what type of link this is

	      var nextChar = currentOffset < originalString.length ? originalString.substr(currentOffset, 1) : ''; // REFERENCE LINKS

	      if (nextChar == '[') {
	        var _string = originalString.substr(currentOffset);

	        var _cap = inlineGrammar.linkLabel.regexp.exec(_string);

	        if (_cap) {
	          // Valid link label
	          currentOffset += _cap[0].length;
	          linkLabel.push(_cap[1], _cap[2], _cap[3]);

	          if (_cap[inlineGrammar.linkLabel.labelPlaceholder]) {
	            // Full reference link
	            linkRef = _cap[inlineGrammar.linkLabel.labelPlaceholder];
	          } else {
	            // Collapsed reference link
	            linkRef = linkText.trim();
	          }
	        } else {
	          // Not a valid link label
	          return false;
	        }
	      } else if (nextChar != '(') {
	        // Shortcut ref link
	        linkRef = linkText.trim(); // INLINE LINKS
	      } else {
	        // nextChar == '('
	        // Potential inline link
	        currentOffset++;
	        var parenthesisLevel = 1;

	        inlineOuter: while (currentOffset < originalString.length && parenthesisLevel > 0) {
	          var _string2 = originalString.substr(currentOffset); // Process whitespace


	          var _cap2 = /^\s+/.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Opening whitespace

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Open destination, but not a destination yet; desination opened with <

	              case 2:
	                // Open destination with content in it. Whitespace only allowed if opened by angle bracket, otherwise this closes the destination
	                if (linkDetails[0].match(/</)) {
	                  linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                } else {
	                  if (parenthesisLevel != 1) return false; // Unbalanced parenthesis

	                  linkDetails.push(''); // Empty end delimiter for destination

	                  linkDetails.push(_cap2[0]); // Whitespace in between destination and title
	                }

	                break;

	              case 3:
	                linkDetails.push(_cap2[0]);
	                break;
	              // Whitespace between destination and title

	              case 4:
	                return false;
	              // This should never happen (no opener for title yet, but more whitespace to capture)

	              case 5:
	                linkDetails.push('');
	              // Whitespace at beginning of title, push empty title and continue

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Whitespace in title

	              case 7:
	                linkDetails[6] = linkDetails[6].concat(_cap2[0]);
	                break;
	              // Whitespace after closing delimiter

	              default:
	                return false;
	              // We should never get here
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          } // Process backslash escapes


	          _cap2 = inlineGrammar.escape.regexp.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // This opens the link destination, append it

	              case 2:
	                linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                break;
	              // Part of the link destination

	              case 3:
	                return false;
	              // Lacking opening delimiter for link title

	              case 4:
	                return false;
	              // Lcaking opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // This opens the link title

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Part of the link title

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          } // Process opening angle bracket as deilimiter of destination


	          if (linkDetails.length < 2 && _string2.match(/^</)) {
	            if (linkDetails.length == 0) linkDetails.push('');
	            linkDetails[0] = linkDetails[0].concat('<');
	            currentOffset++;
	            continue inlineOuter;
	          } // Process closing angle bracket as delimiter of destination


	          if ((linkDetails.length == 1 || linkDetails.length == 2) && _string2.match(/^>/)) {
	            if (linkDetails.length == 1) linkDetails.push(''); // Empty link destination

	            linkDetails.push('>');
	            currentOffset++;
	            continue inlineOuter;
	          } // Process  non-parenthesis delimiter for title. 


	          _cap2 = /^["']/.exec(_string2); // For this to be a valid opener, we have to either have no destination, only whitespace so far,
	          // or a destination with trailing whitespace.

	          if (_cap2 && (linkDetails.length == 0 || linkDetails.length == 1 || linkDetails.length == 4)) {
	            while (linkDetails.length < 4) {
	              linkDetails.push('');
	            }

	            linkDetails.push(_cap2[0]);
	            currentOffset++;
	            continue inlineOuter;
	          } // For this to be a valid closer, we have to have an opener and some or no title, and this has to match the opener


	          if (_cap2 && (linkDetails.length == 5 || linkDetails.length == 6) && linkDetails[4] == _cap2[0]) {
	            if (linkDetails.length == 5) linkDetails.push(''); // Empty link title

	            linkDetails.push(_cap2[0]);
	            currentOffset++;
	            continue inlineOuter;
	          } // Other cases (linkDetails.length == 2, 3, 7) will be handled with the "default" case below.
	          // Process opening parenthesis


	          if (_string2.match(/^\(/)) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push('');
	              // This opens the link destination

	              case 2:
	                // Part of the link destination
	                linkDetails[1] = linkDetails[1].concat('(');
	                if (!linkDetails[0].match(/<$/)) parenthesisLevel++;
	                break;

	              case 3:
	                linkDetails.push('');
	              //  opening delimiter for link title

	              case 4:
	                linkDetails.push('(');
	                break;
	              // opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // opens the link title, add empty title content and proceed to next case 

	              case 6:
	                // Part of the link title. Un-escaped parenthesis only allowed in " or ' delimited title
	                if (linkDetails[4] == '(') return false;
	                linkDetails[5] = linkDetails[5].concat('(');
	                break;

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset++;
	            continue inlineOuter;
	          } // Process closing parenthesis


	          if (_string2.match(/^\)/)) {
	            if (linkDetails.length <= 2) {
	              // We are inside the link destination. Parentheses have to be matched if not in angle brackets
	              while (linkDetails.length < 2) {
	                linkDetails.push('');
	              }

	              if (!linkDetails[0].match(/<$/)) parenthesisLevel--;

	              if (parenthesisLevel > 0) {
	                linkDetails[1] = linkDetails[1].concat(')');
	              }
	            } else if (linkDetails.length == 5 || linkDetails.length == 6) {
	              // We are inside the link title. 
	              if (linkDetails[4] == '(') {
	                // This closes the link title
	                if (linkDetails.length == 5) linkDetails.push('');
	                linkDetails.push(')');
	              } else {
	                // Just regular ol' content
	                if (linkDetails.length == 5) linkDetails.push(')');else linkDetails[5] = linkDetails[5].concat(')');
	              }
	            } else {
	              parenthesisLevel--; // This should decrease it from 1 to 0...
	            }

	            if (parenthesisLevel == 0) {
	              // No invalid condition, let's make sure the linkDetails array is complete
	              while (linkDetails.length < 7) {
	                linkDetails.push('');
	              }
	            }

	            currentOffset++;
	            continue inlineOuter;
	          } // Any old character


	          _cap2 = /^./.exec(_string2);

	          if (_cap2) {
	            switch (linkDetails.length) {
	              case 0:
	                linkDetails.push('');
	              // this opens the link destination, add empty opening delimiter and proceed to next case

	              case 1:
	                linkDetails.push(_cap2[0]);
	                break;
	              // This opens the link destination, append it

	              case 2:
	                linkDetails[1] = linkDetails[1].concat(_cap2[0]);
	                break;
	              // Part of the link destination

	              case 3:
	                return false;
	              // Lacking opening delimiter for link title

	              case 4:
	                return false;
	              // Lcaking opening delimiter for link title

	              case 5:
	                linkDetails.push('');
	              // This opens the link title

	              case 6:
	                linkDetails[5] = linkDetails[5].concat(_cap2[0]);
	                break;
	              // Part of the link title

	              default:
	                return false;
	              // After link title was closed, without closing parenthesis
	            }

	            currentOffset += _cap2[0].length;
	            continue inlineOuter;
	          }

	          throw "Infinite loop"; // we should never get here since the last test matches any character
	        }

	        if (parenthesisLevel > 0) return false; // Parenthes(es) not closed
	      }

	      if (linkRef !== false) {
	        // Ref link; check that linkRef is valid
	        var valid = false;

	        var _iterator2 = _createForOfIteratorHelper(this.linkLabels),
	            _step2;

	        try {
	          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
	            var _label = _step2.value;

	            if (_label == linkRef) {
	              valid = true;
	              break;
	            }
	          }
	        } catch (err) {
	          _iterator2.e(err);
	        } finally {
	          _iterator2.f();
	        }

	        var label = valid ? "TMLinkLabel TMLinkLabel_Valid" : "TMLinkLabel TMLinkLabel_Invalid";
	        var output = "<span class=\"TMMark TMMark_".concat(type, "\">").concat(opener, "</span><span class=\"").concat(type, " ").concat(linkLabel.length < 3 || !linkLabel[1] ? label : "", "\">").concat(this.processInlineStyles(linkText), "</span><span class=\"TMMark TMMark_").concat(type, "\">]</span>");

	        if (linkLabel.length >= 3) {
	          output = output.concat("<span class=\"TMMark TMMark_".concat(type, "\">").concat(linkLabel[0], "</span>"), "<span class=\"".concat(label, "\">").concat(linkLabel[1], "</span>"), "<span class=\"TMMark TMMark_".concat(type, "\">").concat(linkLabel[2], "</span>"));
	        }

	        return {
	          output: output,
	          charCount: currentOffset
	        };
	      } else if (linkDetails) {
	        // Inline link
	        // This should never happen, but better safe than sorry.
	        while (linkDetails.length < 7) {
	          linkDetails.push('');
	        }

	        return {
	          output: "<span class=\"TMMark TMMark_".concat(type, "\">").concat(opener, "</span><span class=\"").concat(type, "\">").concat(this.processInlineStyles(linkText), "</span><span class=\"TMMark TMMark_").concat(type, "\">](").concat(linkDetails[0], "</span><span class=\"").concat(type, "Destination\">").concat(linkDetails[1], "</span><span class=\"TMMark TMMark_").concat(type, "\">").concat(linkDetails[2]).concat(linkDetails[3]).concat(linkDetails[4], "</span><span class=\"").concat(type, "Title\">").concat(linkDetails[5], "</span><span class=\"TMMark TMMark_").concat(type, "\">").concat(linkDetails[6], ")</span>"),
	          charCount: currentOffset
	        };
	      }

	      return false;
	    }
	    /**
	     * Formats a markdown string as HTML, using Markdown inline formatting.
	     * @param {string} originalString The input (markdown inline formatted) string
	     * @returns {string} The HTML formatted output
	     */

	  }, {
	    key: "processInlineStyles",
	    value: function processInlineStyles(originalString) {
	      var _this3 = this;

	      var processed = '';
	      var stack = []; // Stack is an array of objects of the format: {delimiter, delimString, count, output}

	      var offset = 0;
	      var string = originalString;

	      var _loop = function _loop() {
	        var _loop2 = function _loop2() {
	          var rule = _arr2[_i2];
	          var cap = inlineGrammar[rule].regexp.exec(string);

	          if (cap) {
	            string = string.substr(cap[0].length);
	            offset += cap[0].length;
	            processed += inlineGrammar[rule].replacement // .replace(/\$\$([1-9])/g, (str, p1) => processInlineStyles(cap[p1])) // todo recursive calling
	            .replace(/\$([1-9])/g, function (str, p1) {
	              return htmlescape(cap[p1]);
	            });
	            return {
	              v: "continue|outer"
	            };
	          }
	        };

	        // Process simple rules (non-delimiter)
	        for (var _i2 = 0, _arr2 = ['escape', 'code', 'autolink', 'html']; _i2 < _arr2.length; _i2++) {
	          var _ret2 = _loop2();

	          if (_typeof(_ret2) === "object") return _ret2.v;
	        } // Check for links / images


	        var potentialLink = string.match(inlineGrammar.linkOpen.regexp);
	        var potentialImage = string.match(inlineGrammar.imageOpen.regexp);

	        if (potentialImage || potentialLink) {
	          var result = _this3.parseLinkOrImage(string, potentialImage);

	          if (result) {
	            processed = "".concat(processed).concat(result.output);
	            string = string.substr(result.charCount);
	            offset += result.charCount;
	            return "continue|outer";
	          }
	        } // Check for em / strong delimiters


	        var cap = /(^\*+)|(^_+)/.exec(string);

	        if (cap) {
	          var delimCount = cap[0].length;
	          var delimString = cap[0];
	          var currentDelimiter = cap[0][0]; // This should be * or _

	          string = string.substr(cap[0].length); // We have a delimiter run. Let's check if it can open or close an emphasis.

	          var preceding = offset > 0 ? originalString.substr(0, offset) : ' '; // beginning and end of line count as whitespace

	          var following = offset + cap[0].length < originalString.length ? string : ' ';
	          var punctuationFollows = following.match(punctuationLeading);
	          var punctuationPrecedes = preceding.match(punctuationTrailing);
	          var whitespaceFollows = following.match(/^\s/);
	          var whitespacePrecedes = preceding.match(/\s$/); // These are the rules for right-flanking and left-flanking delimiter runs as per CommonMark spec

	          var canOpen = !whitespaceFollows && (!punctuationFollows || !!whitespacePrecedes || !!punctuationPrecedes);
	          var canClose = !whitespacePrecedes && (!punctuationPrecedes || !!whitespaceFollows || !!punctuationFollows); // Underscores have more detailed rules than just being part of left- or right-flanking run:

	          if (currentDelimiter == '_' && canOpen && canClose) {
	            canOpen = punctuationPrecedes;
	            canClose = punctuationFollows;
	          } // If the delimiter can close, check the stack if there's something it can close


	          if (canClose) {
	            var stackPointer = stack.length - 1; // See if we can find a matching opening delimiter, move down through the stack

	            while (delimCount && stackPointer >= 0) {
	              if (stack[stackPointer].delimiter == currentDelimiter) {
	                // We found a matching delimiter, let's construct the formatted string
	                // Firstly, if we skipped any stack levels, pop them immediately (non-matching delimiters)
	                while (stackPointer < stack.length - 1) {
	                  var _entry = stack.pop();

	                  processed = "".concat(_entry.output).concat(_entry.delimString.substr(0, _entry.count)).concat(processed);
	                } // Then, format the string


	                if (delimCount >= 2 && stack[stackPointer].count >= 2) {
	                  // Strong
	                  processed = "<span class=\"TMMark\">".concat(currentDelimiter).concat(currentDelimiter, "</span><strong class=\"TMStrong\">").concat(processed, "</strong><span class=\"TMMark\">").concat(currentDelimiter).concat(currentDelimiter, "</span>");
	                  delimCount -= 2;
	                  stack[stackPointer].count -= 2;
	                } else {
	                  // Em
	                  processed = "<span class=\"TMMark\">".concat(currentDelimiter, "</span><em class=\"TMEm\">").concat(processed, "</em><span class=\"TMMark\">").concat(currentDelimiter, "</span>");
	                  delimCount -= 1;
	                  stack[stackPointer].count -= 1;
	                } // If that stack level is empty now, pop it


	                if (stack[stackPointer].count == 0) {
	                  var _entry2 = stack.pop();

	                  processed = "".concat(_entry2.output).concat(processed);
	                  stackPointer--;
	                }
	              } else {
	                // This stack level's delimiter type doesn't match the current delimiter type
	                // Go down one level in the stack
	                stackPointer--;
	              }
	            }
	          } // If there are still delimiters left, and the delimiter run can open, push it on the stack


	          if (delimCount && canOpen) {
	            stack.push({
	              delimiter: currentDelimiter,
	              delimString: delimString,
	              count: delimCount,
	              output: processed
	            });
	            processed = ''; // Current formatted output has been pushed on the stack and will be prepended when the stack gets popped

	            delimCount = 0;
	          } // Any delimiters that are left (closing unmatched) are appended to the output.


	          if (delimCount) {
	            processed = "".concat(processed).concat(delimString.substr(0, delimCount));
	          }

	          offset += cap[0].length;
	          return "continue|outer";
	        } // Check for strikethrough delimiter


	        cap = /^~~/.exec(string);

	        if (cap) {
	          var consumed = false;

	          var _stackPointer = stack.length - 1; // See if we can find a matching opening delimiter, move down through the stack


	          while (!consumed && _stackPointer >= 0) {
	            if (stack[_stackPointer].delimiter == '~') {
	              // We found a matching delimiter, let's construct the formatted string
	              // Firstly, if we skipped any stack levels, pop them immediately (non-matching delimiters)
	              while (_stackPointer < stack.length - 1) {
	                var _entry4 = stack.pop();

	                processed = "".concat(_entry4.output).concat(_entry4.delimString.substr(0, _entry4.count)).concat(processed);
	              } // Then, format the string


	              processed = "<span class=\"TMMark\">~~</span><del class=\"TMStrikethrough\">".concat(processed, "</del><span class=\"TMMark\">~~</span>");

	              var _entry3 = stack.pop();

	              processed = "".concat(_entry3.output).concat(processed);
	              consumed = true;
	            } else {
	              // This stack level's delimiter type doesn't match the current delimiter type
	              // Go down one level in the stack
	              _stackPointer--;
	            }
	          } // If there are still delimiters left, and the delimiter run can open, push it on the stack


	          if (!consumed) {
	            stack.push({
	              delimiter: '~',
	              delimString: '~~',
	              count: 2,
	              output: processed
	            });
	            processed = ''; // Current formatted output has been pushed on the stack and will be prepended when the stack gets popped
	          }

	          offset += cap[0].length;
	          string = string.substr(cap[0].length);
	          return "continue|outer";
	        } // Process 'default' rule


	        cap = inlineGrammar.default.regexp.exec(string);

	        if (cap) {
	          string = string.substr(cap[0].length);
	          offset += cap[0].length;
	          processed += inlineGrammar.default.replacement.replace(/\$([1-9])/g, function (str, p1) {
	            return htmlescape(cap[p1]);
	          });
	          return "continue|outer";
	        }

	        throw 'Infinite loop!';
	      };

	      outer: while (string) {
	        var _ret = _loop();

	        if (_ret === "continue|outer") continue outer;
	      } // Empty the stack, any opening delimiters are unused


	      while (stack.length) {
	        var entry = stack.pop();
	        processed = "".concat(entry.output).concat(entry.delimString.substr(0, entry.count)).concat(processed);
	      }

	      return processed;
	    }
	    /** 
	     * Clears the line dirty flag (resets it to an array of false)
	     */

	  }, {
	    key: "clearDirtyFlag",
	    value: function clearDirtyFlag() {
	      this.lineDirty = new Array(this.lines.length);

	      for (var i = 0; i < this.lineDirty.length; i++) {
	        this.lineDirty[i] = false;
	      }
	    }
	    /**
	     * Updates the class properties (lines, lineElements) from the DOM.
	     * @returns true if contents changed
	     */

	  }, {
	    key: "updateLineContents",
	    value: function updateLineContents() {
	      // this.lineDirty = []; 
	      // Check if we have changed anything about the number of lines (inserted or deleted a paragraph)
	      // < 0 means line(s) removed; > 0 means line(s) added
	      var lineDelta = this.e.childElementCount - this.lines.length;

	      if (lineDelta) {
	        // yup. Let's try how much we can salvage (find out which lines from beginning and end were unchanged)
	        // Find lines from the beginning that haven't changed...
	        var firstChangedLine = 0;

	        while (firstChangedLine <= this.lines.length && firstChangedLine <= this.lineElements.length && this.lineElements[firstChangedLine] // Check that the line element hasn't been deleted
	        && this.lines[firstChangedLine] == this.lineElements[firstChangedLine].textContent) {
	          firstChangedLine++;
	        } // End also from the end


	        var lastChangedLine = -1;

	        while (-lastChangedLine < this.lines.length && -lastChangedLine < this.lineElements.length && this.lines[this.lines.length + lastChangedLine] == this.lineElements[this.lineElements.length + lastChangedLine].textContent) {
	          lastChangedLine--;
	        }

	        var linesToDelete = this.lines.length + lastChangedLine + 1 - firstChangedLine;
	        if (linesToDelete < -lineDelta) linesToDelete = -lineDelta;
	        if (linesToDelete < 0) linesToDelete = 0;
	        var linesToAdd = [];

	        for (var l = 0; l < linesToDelete + lineDelta; l++) {
	          linesToAdd.push(this.lineElements[firstChangedLine + l].textContent);
	        }

	        this.spliceLines(firstChangedLine, linesToDelete, linesToAdd, false);
	      } else {
	        // No lines added or removed
	        for (var line = 0; line < this.lineElements.length; line++) {
	          var e = this.lineElements[line];
	          var ct = e.textContent;

	          if (this.lines[line] !== ct) {
	            // Line changed, update it
	            this.lines[line] = ct;
	            this.lineDirty[line] = true;
	          }
	        }
	      }
	    }
	    /**
	     * Processes a new paragraph.
	     * @param sel The current selection
	     */

	  }, {
	    key: "processNewParagraph",
	    value: function processNewParagraph(sel) {
	      if (!sel) return; // Update lines from content

	      this.updateLineContents();
	      var continuableType = false; // Let's see if we need to continue a list

	      var checkLine = sel.col > 0 ? sel.row : sel.row - 1;

	      switch (this.lineTypes[checkLine]) {
	        case 'TMUL':
	          continuableType = 'TMUL';
	          break;

	        case 'TMOL':
	          continuableType = 'TMOL';
	          break;

	        case 'TMIndentedCode':
	          continuableType = 'TMIndentedCode';
	          break;
	      }

	      var lines = this.lines[sel.row].replace(/\n\n$/, '\n').split(/(?:\r\n|\n|\r)/);

	      if (lines.length == 1) {
	        // No new line
	        this.updateFormatting();
	        return;
	      }

	      this.spliceLines(sel.row, 1, lines, true);
	      sel.row++;
	      sel.col = 0;

	      if (continuableType) {
	        // Check if the previous line was non-empty
	        var capture = lineGrammar[continuableType].regexp.exec(this.lines[sel.row - 1]);

	        if (capture) {
	          // Convention: capture[1] is the line type marker, capture[2] is the content
	          if (capture[2]) {
	            // Previous line has content, continue the continuable type
	            // Hack for OL: increment number
	            if (continuableType == 'TMOL') {
	              capture[1] = capture[1].replace(/\d{1,9}/, function (result) {
	                return parseInt(result[0]) + 1;
	              });
	            }

	            this.lines[sel.row] = "".concat(capture[1]).concat(this.lines[sel.row]);
	            this.lineDirty[sel.row] = true;
	            sel.col = capture[1].length;
	          } else {
	            // Previous line has no content, remove the continuable type from the previous row
	            this.lines[sel.row - 1] = '';
	            this.lineDirty[sel.row - 1] = true;
	          }
	        }
	      }

	      this.updateFormatting();
	    } // /**
	    //  * Processes a "delete" input action.
	    //  * @param {object} focus The selection
	    //  * @param {boolean} forward If true, performs a forward delete, otherwise performs a backward delete
	    //  */
	    // processDelete(focus, forward) {
	    //   if (!focus) return;
	    //   let anchor = this.getSelection(true);
	    //   // Do we have a non-empty selection? 
	    //   if (focus.col != anchor.col || focus.row != anchor.row) {
	    //     // non-empty. direction doesn't matter.
	    //     this.paste('', anchor, focus);
	    //   } else {
	    //     if (forward) {
	    //       if (focus.col < this.lines[focus.row].length) this.paste('', {row: focus.row, col: focus.col + 1}, focus);
	    //       else if (focus.col < this.lines.length) this.paste('', {row: focus.row + 1, col: 0}, focus);
	    //       // Otherwise, we're at the very end and can't delete forward
	    //     } else {
	    //       if (focus.col > 0) this.paste('', {row: focus.row, col: focus.col - 1}, focus);
	    //       else if (focus.row > 0) this.paste('', {row: focus.row - 1, col: this.lines[focus.row - 1].length - 1}, focus);
	    //       // Otherwise, we're at the very beginning and can't delete backwards
	    //     }
	    //   }
	    // }

	    /**
	     * Gets the current position of the selection counted by row and column of the editor Markdown content (as opposed to the position in the DOM).
	     * 
	     * @param {boolean} getAnchor if set to true, gets the selection anchor (start point of the selection), otherwise gets the focus (end point).
	     * @return {object} An object representing the selection, with properties col and row.
	     */

	  }, {
	    key: "getSelection",
	    value: function getSelection() {
	      var getAnchor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	      var selection = window.getSelection();
	      var startNode = getAnchor ? selection.anchorNode : selection.focusNode;
	      if (!startNode) return null;
	      var offset = startNode.nodeType === Node.TEXT_NODE ? getAnchor ? selection.anchorOffset : selection.focusOffset : 0;

	      if (startNode == this.e) {
	        return {
	          row: 0,
	          col: offset
	        };
	      }

	      var col = this.computeColumn(startNode, offset);
	      if (col === null) return null; // We are outside of the editor
	      // Find the row node

	      var node = startNode;

	      while (node.parentElement != this.e) {
	        node = node.parentElement;
	      }

	      var row = 0; // Check if we can read a line number from the data-line-num attribute.
	      // The last condition is a security measure since inserting a new paragraph copies the previous rows' line number

	      if (node.dataset && node.dataset.lineNum && (!node.previousSibling || node.previousSibling.dataset.lineNum != node.dataset.lineNum)) {
	        row = parseInt(node.dataset.lineNum);
	      } else {
	        while (node.previousSibling) {
	          row++;
	          node = node.previousSibling;
	        }
	      }

	      return {
	        row: row,
	        col: col,
	        node: startNode
	      };
	    }
	    /**
	     * Computes a column within an editor line from a node and offset within that node.
	     * @param {Node} startNode The node
	     * @param {int} offset THe selection
	     * @returns {int} the column, or null if the node is not inside the editor
	     */

	  }, {
	    key: "computeColumn",
	    value: function computeColumn(startNode, offset) {
	      var node = startNode;
	      var col = offset; // First, make sure we're actually in the editor.

	      while (node && node.parentNode != this.e) {
	        node = node.parentNode;
	      }

	      if (node == null) return null;
	      node = startNode;

	      while (node.parentNode != this.e) {
	        if (node.previousSibling) {
	          node = node.previousSibling;
	          col += node.textContent.length;
	        } else {
	          node = node.parentNode;
	        }
	      }

	      return col;
	    }
	    /**
	     * Computes DOM node and offset within that node from a position expressed as row and column.
	     * @param {int} row Row (line number)
	     * @param {int} col Column
	     * @returns An object with two properties: node and offset. offset may be null;
	     */

	  }, {
	    key: "computeNodeAndOffset",
	    value: function computeNodeAndOffset(row, col) {
	      var bindRight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	      if (row >= this.lineElements.length) {
	        // Selection past the end of text, set selection to end of text
	        row = this.lineElements.length - 1;
	        col = this.lines[row].length;
	      }

	      if (col > this.lines[row].length) {
	        col = this.lines[row].length;
	      }

	      var parentNode = this.lineElements[row];
	      var node = parentNode.firstChild;
	      var childrenComplete = false; // default return value

	      var rv = {
	        node: parentNode.firstChild ? parentNode.firstChild : parentNode,
	        offset: 0
	      };

	      while (node != parentNode) {
	        if (!childrenComplete && node.nodeType === Node.TEXT_NODE) {
	          if (node.nodeValue.length >= col) {
	            if (bindRight && node.nodeValue.length == col) {
	              // Selection is at the end of this text node, but we are binding right (prefer an offset of 0 in the next text node)
	              // Remember return value in case we don't find another text node
	              rv = {
	                node: node,
	                offset: col
	              };
	              col = 0;
	            } else {
	              return {
	                node: node,
	                offset: col
	              };
	            }
	          } else {
	            col -= node.nodeValue.length;
	          }
	        }

	        if (!childrenComplete && node.firstChild) {
	          node = node.firstChild;
	        } else if (node.nextSibling) {
	          childrenComplete = false;
	          node = node.nextSibling;
	        } else {
	          childrenComplete = true;
	          node = node.parentNode;
	        }
	      } // Either, the position was invalid and we just return the default return value
	      // Or we are binding right and the selection is at the end of the line


	      return rv;
	    }
	    /**
	     * Sets the selection based on rows and columns within the editor Markdown content.
	     * @param {object} focus Object representing the selection, needs to have properties row and col.
	     */

	  }, {
	    key: "setSelection",
	    value: function setSelection(focus) {
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      if (!focus) return;
	      var range = document.createRange();

	      var _this$computeNodeAndO = this.computeNodeAndOffset(focus.row, focus.col, anchor && anchor.row == focus.row && anchor.col > focus.col),
	          focusNode = _this$computeNodeAndO.node,
	          focusOffset = _this$computeNodeAndO.offset; // Bind selection right if anchor is in the same row and behind the focus


	      var anchorNode = null,
	          anchorOffset = null;

	      if (anchor && (anchor.row != focus.row || anchor.col != focus.col)) {
	        var _this$computeNodeAndO2 = this.computeNodeAndOffset(anchor.row, anchor.col, focus.row == anchor.row && focus.col > anchor.col),
	            node = _this$computeNodeAndO2.node,
	            offset = _this$computeNodeAndO2.offset;

	        anchorNode = node;
	        anchorOffset = offset;
	      }

	      if (anchorNode) range.setStart(anchorNode, anchorOffset);else range.setStart(focusNode, focusOffset);
	      range.setEnd(focusNode, focusOffset);
	      var windowSelection = window.getSelection();
	      windowSelection.removeAllRanges();
	      windowSelection.addRange(range);
	    }
	    /** 
	     * Event handler for input events 
	     */

	  }, {
	    key: "handleInputEvent",
	    value: function handleInputEvent(event) {
	      var focus = this.getSelection();

	      if ((event.inputType == 'insertParagraph' || event.inputType == 'insertLineBreak') && focus) {
	        this.clearDirtyFlag();
	        this.processNewParagraph(focus);
	      } else {
	        if (!this.e.firstChild) {
	          this.e.innerHTML = '<div class="TMBlankLine"><br></div>';
	        } else {
	          for (var childNode = this.e.firstChild; childNode; childNode = childNode.nextSibling) {
	            if (childNode.nodeType != 3 || childNode.tagName != 'DIV') {
	              // Found a child node that's either not an element or not a div. Wrap it in a div.
	              var divWrapper = document.createElement('div');
	              this.e.insertBefore(divWrapper, childNode);
	              this.e.removeChild(childNode);
	              divWrapper.appendChild(childNode);
	            }
	          }
	        }

	        this.updateLineContentsAndFormatting();
	      }

	      if (focus) this.setSelection(focus);
	      this.fireChange();
	    }
	    /**
	     * Event handler for "selectionchange" events.
	     */

	  }, {
	    key: "handleSelectionChangeEvent",
	    value: function handleSelectionChangeEvent() {
	      this.fireSelection();
	    }
	    /**
	     * Convenience function to "splice" new lines into the arrays this.lines, this.lineDirty, this.lineTypes, and the DOM elements 
	     * underneath the editor element.
	     * This method is essentially Array.splice, only that the third parameter takes an un-spread array (and the forth parameter)
	     * determines whether the DOM should also be adjusted.
	     * 
	     * @param {int} startLine Position at which to start changing the array of lines
	     * @param {int} linesToDelete Number of lines to delete
	     * @param {array} linesToInsert Array of strings representing the lines to be inserted
	     * @param {boolean} adjustLineElements If true, then <div> elements are also inserted in the DOM at the respective position
	     */

	  }, {
	    key: "spliceLines",
	    value: function spliceLines(startLine) {
	      var _this$lines, _this$lineTypes, _this$lineDirty;

	      var linesToDelete = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	      var linesToInsert = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	      var adjustLineElements = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	      if (adjustLineElements) {
	        for (var i = 0; i < linesToDelete; i++) {
	          this.e.removeChild(this.e.childNodes[startLine]);
	        }
	      }

	      var insertedBlank = [];
	      var insertedDirty = [];

	      for (var _i3 = 0; _i3 < linesToInsert.length; _i3++) {
	        insertedBlank.push('');
	        insertedDirty.push(true);

	        if (adjustLineElements) {
	          if (this.e.childNodes[startLine]) this.e.insertBefore(document.createElement('div'), this.e.childNodes[startLine]);else this.e.appendChild(document.createElement('div'));
	        }
	      }

	      (_this$lines = this.lines).splice.apply(_this$lines, [startLine, linesToDelete].concat(_toConsumableArray(linesToInsert)));

	      (_this$lineTypes = this.lineTypes).splice.apply(_this$lineTypes, [startLine, linesToDelete].concat(insertedBlank));

	      (_this$lineDirty = this.lineDirty).splice.apply(_this$lineDirty, [startLine, linesToDelete].concat(insertedDirty));
	    }
	    /**
	     * Event handler for the "paste" event
	     */

	  }, {
	    key: "handlePaste",
	    value: function handlePaste(event) {
	      event.preventDefault(); // get text representation of clipboard

	      var text = (event.originalEvent || event).clipboardData.getData('text/plain'); // insert text manually

	      this.paste(text);
	    }
	    /**
	     * Pastes the text at the current selection (or at the end, if no current selection)
	     * @param {string} text 
	     */

	  }, {
	    key: "paste",
	    value: function paste(text) {
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      if (!anchor) anchor = this.getSelection(true);
	      if (!focus) focus = this.getSelection(false);
	      var beginning, end;

	      if (!focus) {
	        focus = {
	          row: this.lines.length - 1,
	          col: this.lines[this.lines.length - 1].length
	        }; // Insert at end
	      }

	      if (!anchor) {
	        anchor = focus;
	      }

	      if (anchor.row < focus.row || anchor.row == focus.row && anchor.col <= focus.col) {
	        beginning = anchor;
	        end = focus;
	      } else {
	        beginning = focus;
	        end = anchor;
	      }

	      var insertedLines = text.split(/(?:\r\n|\r|\n)/);
	      var lineBefore = this.lines[beginning.row].substr(0, beginning.col);
	      var lineEnd = this.lines[end.row].substr(end.col);
	      insertedLines[0] = lineBefore.concat(insertedLines[0]);
	      var endColPos = insertedLines[insertedLines.length - 1].length;
	      insertedLines[insertedLines.length - 1] = insertedLines[insertedLines.length - 1].concat(lineEnd);
	      this.spliceLines(beginning.row, 1 + end.row - beginning.row, insertedLines);
	      focus.row = beginning.row + insertedLines.length - 1;
	      focus.col = endColPos;
	      this.updateFormatting();
	      this.setSelection(focus);
	      this.fireChange();
	    }
	    /**
	     * Computes the (lowest in the DOM tree) common ancestor of two DOM nodes.
	     * @param {Node} node1 the first node
	     * @param {Node} node2 the second node
	     * @returns {Node} The commen ancestor node, or null if there is no common ancestor
	     */

	  }, {
	    key: "computeCommonAncestor",
	    value: function computeCommonAncestor(node1, node2) {
	      if (!node1 || !node2) return null;
	      if (node1 == node2) return node1;

	      var ancestry = function ancestry(node) {
	        var ancestry = [];

	        while (node) {
	          ancestry.unshift(node);
	          node = node.parentNode;
	        }

	        return ancestry;
	      };

	      var ancestry1 = ancestry(node1);
	      var ancestry2 = ancestry(node2);
	      if (ancestry1[0] != ancestry2[0]) return null;
	      var i;

	      for (i = 0; ancestry1[i] == ancestry2[i]; i++) {
	      }

	      return ancestry1[i - 1];
	    }
	    /**
	     * Finds the (lowest in the DOM tree) enclosing DOM node with a given class.
	     * @param {object} focus The focus selection object
	     * @param {object} anchor The anchor selection object
	     * @param {string} className The class name to find
	     * @returns {Node} The enclosing DOM node with the respective class (inside the editor), if there is one; null otherwise.
	     */

	  }, {
	    key: "computeEnclosingMarkupNode",
	    value: function computeEnclosingMarkupNode(focus, anchor, className) {
	      var node = null;
	      if (!focus) return null;

	      if (!anchor) {
	        node = focus.node;
	      } else {
	        if (focus.row != anchor.row) return null;
	        node = this.computeCommonAncestor(focus.node, anchor.node);
	      }

	      if (!node) return null;

	      while (node != this.e) {
	        if (node.className && node.className.includes(className)) return node;
	        node = node.parentNode;
	      } // Ascended all the way to the editor element


	      return null;
	    }
	    /**
	     * Returns the state (true / false) of all commands.
	     * @param focus Focus of the selection. If not given, assumes the current focus.
	     */

	  }, {
	    key: "getCommandState",
	    value: function getCommandState() {
	      var focus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	      var anchor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
	      var commandState = {};
	      if (!focus) focus = this.getSelection(false);
	      if (!anchor) anchor = this.getSelection(true);

	      if (!focus) {
	        for (var cmd in commands) {
	          commandState[cmd] = null;
	        }

	        return commandState;
	      }

	      if (!anchor) anchor = focus;
	      var start, end;

	      if (anchor.row < focus.row || anchor.row == focus.row && anchor.col < focus.col) {
	        start = anchor;
	        end = focus;
	      } else {
	        start = focus;
	        end = anchor;
	      }

	      if (end.row > start.row && end.col == 0) {
	        end.row--;
	        end.col = this.lines[end.row].length; // Selection to beginning of next line is said to end at the beginning of the last line
	      }

	      for (var _cmd in commands) {
	        if (commands[_cmd].type == 'inline') {
	          if (!focus || focus.row != anchor.row || !this.isInlineFormattingAllowed(focus, anchor)) {
	            commandState[_cmd] = null;
	          } else {
	            // The command state is true if there is a respective enclosing markup node (e.g., the selection is enclosed in a <b>..</b>) ... 
	            commandState[_cmd] = !!this.computeEnclosingMarkupNode(focus, anchor, commands[_cmd].className) || // ... or if it's an empty string preceded by and followed by formatting markers, e.g. **|** where | is the cursor
	            focus.col == anchor.col && !!this.lines[focus.row].substr(0, focus.col).match(commands[_cmd].unset.prePattern) && !!this.lines[focus.row].substr(focus.col).match(commands[_cmd].unset.postPattern);
	          }
	        }

	        if (commands[_cmd].type == 'line') {
	          if (!focus) {
	            commandState[_cmd] = null;
	          } else {
	            var state = this.lineTypes[start.row] == commands[_cmd].className;

	            for (var line = start.row; line <= end.row; line++) {
	              if (this.lineTypes[line] == commands[_cmd].className != state) {
	                state = null;
	                break;
	              }
	            }

	            commandState[_cmd] = state;
	          }
	        }
	      }

	      return commandState;
	    }
	    /**
	     * Sets a command state
	     * @param {string} command 
	     * @param {boolean} state 
	     */

	  }, {
	    key: "setCommandState",
	    value: function setCommandState(command, state) {
	      if (commands[command].type == 'inline') {
	        var anchor = this.getSelection(true);
	        var focus = this.getSelection(false);
	        if (!anchor) anchor = focus;
	        if (!anchor) return;
	        if (anchor.row != focus.row) return;
	        if (!this.isInlineFormattingAllowed(focus, anchor)) return;
	        var markupNode = this.computeEnclosingMarkupNode(focus, anchor, commands[command].className);
	        this.clearDirtyFlag(); // First case: There's an enclosing markup node, remove the markers around that markup node

	        if (markupNode) {
	          this.lineDirty[focus.row] = true;
	          var startCol = this.computeColumn(markupNode, 0);
	          var len = markupNode.textContent.length;
	          var left = this.lines[focus.row].substr(0, startCol).replace(commands[command].unset.prePattern, '');
	          var mid = this.lines[focus.row].substr(startCol, len);
	          var right = this.lines[focus.row].substr(startCol + len).replace(commands[command].unset.postPattern, '');
	          this.lines[focus.row] = left.concat(mid, right);
	          anchor.col = left.length;
	          focus.col = anchor.col + len;
	          this.updateFormatting();
	          this.setSelection(focus, anchor); // Second case: Empty selection with surrounding formatting markers, remove those
	        } else if (focus.col == anchor.col && !!this.lines[focus.row].substr(0, focus.col).match(commands[command].unset.prePattern) && !!this.lines[focus.row].substr(focus.col).match(commands[command].unset.postPattern)) {
	          this.lineDirty[focus.row] = true;

	          var _left = this.lines[focus.row].substr(0, focus.col).replace(commands[command].unset.prePattern, '');

	          var _right = this.lines[focus.row].substr(focus.col).replace(commands[command].unset.postPattern, '');

	          this.lines[focus.row] = _left.concat(_right);
	          focus.col = anchor.col = _left.length;
	          this.updateFormatting();
	          this.setSelection(focus, anchor); // Not currently formatted, insert formatting markers
	        } else {
	          // Trim any spaces from the selection
	          var _ref = focus.col < anchor.col ? {
	            startCol: focus.col,
	            endCol: anchor.col
	          } : {
	            startCol: anchor.col,
	            endCol: focus.col
	          },
	              _startCol = _ref.startCol,
	              endCol = _ref.endCol;

	          var match = this.lines[focus.row].substr(_startCol, endCol - _startCol).match( /*#__PURE__*/_wrapRegExp(/^([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*).*[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uFEFE\uFF00-\uFFFF]([\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)$/, {
	            leading: 1,
	            trailing: 2
	          }));

	          if (match) {
	            _startCol += match.groups.leading.length;
	            endCol -= match.groups.trailing.length;
	          }

	          focus.col = _startCol;
	          anchor.col = endCol; // Just insert markup before and after and hope for the best. 

	          this.wrapSelection(commands[command].set.pre, commands[command].set.post, focus, anchor); // TODO clean this up so that markup remains properly nested
	        }
	      } else if (commands[command].type == 'line') {
	        var _anchor = this.getSelection(true);

	        var _focus = this.getSelection(false);

	        if (!_anchor) _anchor = _focus;
	        if (!_focus) return;
	        this.clearDirtyFlag();
	        var start = _anchor.row > _focus.row ? _focus : _anchor;
	        var end = _anchor.row > _focus.row ? _anchor : _focus;

	        if (end.row > start.row && end.col == 0) {
	          end.row--;
	        }

	        for (var line = start.row; line <= end.row; line++) {
	          if (state && this.lineTypes[line] != commands[command].className) {
	            this.lines[line] = this.lines[line].replace(commands[command].set.pattern, commands[command].set.replacement.replace('$#', line - start.row + 1));
	            this.lineDirty[line] = true;
	          }

	          if (!state && this.lineTypes[line] == commands[command].className) {
	            this.lines[line] = this.lines[line].replace(commands[command].unset.pattern, commands[command].unset.replacement);
	            this.lineDirty[line] = true;
	          }
	        }

	        this.updateFormatting();
	        this.setSelection({
	          row: end.row,
	          col: this.lines[end.row].length
	        }, {
	          row: start.row,
	          col: 0
	        });
	      }
	    }
	    /**
	     * Returns whether or not inline formatting is allowed at the current focus 
	     * @param {object} focus The current focus
	     */

	  }, {
	    key: "isInlineFormattingAllowed",
	    value: function isInlineFormattingAllowed() {
	      // TODO Remove parameters from all calls
	      var sel = window.getSelection();
	      if (!sel) return false; // Check if we can find a common ancestor with the class `TMInlineFormatted` 
	      // Special case: Empty selection right before `TMInlineFormatted`

	      if (sel.isCollapsed && sel.focusNode.nodeType == 3 && sel.focusOffset == sel.focusNode.nodeValue.length) {
	        var node;

	        for (node = sel.focusNode; node && node.nextSibling == null; node = node.parentNode) {
	        }

	        if (node && node.nextSibling.className && node.nextSibling.className.includes('TMInlineFormatted')) return true;
	      } // Look for a common ancestor


	      var ancestor = this.computeCommonAncestor(sel.focusNode, sel.anchorNode);
	      if (!ancestor) return false; // Check if there's an ancestor of class 'TMInlineFormatted' or 'TMBlankLine'

	      while (ancestor && ancestor != this.e) {
	        if (ancestor.className && (ancestor.className.includes('TMInlineFormatted') || ancestor.className.includes('TMBlankLine'))) return true;
	        ancestor = ancestor.parentNode;
	      }

	      return false;
	    }
	    /**
	     * Wraps the current selection in the strings pre and post. If the selection is not on one line, returns.
	     * @param {string} pre The string to insert before the selection.
	     * @param {string} post The string to insert after the selection.
	     * @param {object} focus The current selection focus. If null, selection will be computed.
	     * @param {object} anchor The current selection focus. If null, selection will be computed.
	     */

	  }, {
	    key: "wrapSelection",
	    value: function wrapSelection(pre, post) {
	      var focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
	      var anchor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
	      if (!focus) focus = this.getSelection(false);
	      if (!anchor) anchor = this.getSelection(true);
	      if (!focus || !anchor || focus.row != anchor.row) return;
	      this.lineDirty[focus.row] = true;
	      var startCol = focus.col < anchor.col ? focus.col : anchor.col;
	      var endCol = focus.col < anchor.col ? anchor.col : focus.col;
	      var left = this.lines[focus.row].substr(0, startCol).concat(pre);
	      var mid = endCol == startCol ? '' : this.lines[focus.row].substr(startCol, endCol - startCol);
	      var right = post.concat(this.lines[focus.row].substr(endCol));
	      this.lines[focus.row] = left.concat(mid, right);
	      anchor.col = left.length;
	      focus.col = anchor.col + mid.length;
	      this.updateFormatting();
	      this.setSelection(focus, anchor);
	    }
	    /**
	     * Toggles the command state for a command (true <-> false)
	     * @param {string} command The editor command
	     */

	  }, {
	    key: "toggleCommandState",
	    value: function toggleCommandState(command) {
	      if (!this.lastCommandState) this.lastCommandState = this.getCommandState();
	      this.setCommandState(command, !this.lastCommandState[command]);
	    }
	    /**
	     * Fires a change event. Updates the linked textarea and notifies any event listeners.
	     */

	  }, {
	    key: "fireChange",
	    value: function fireChange() {
	      if (!this.textarea && !this.listeners.change.length) return;
	      var content = this.getContent();
	      if (this.textarea) this.textarea.value = content;

	      var _iterator3 = _createForOfIteratorHelper(this.listeners.change),
	          _step3;

	      try {
	        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
	          var listener = _step3.value;
	          listener({
	            content: content,
	            linesDirty: this.linesDirty
	          });
	        }
	      } catch (err) {
	        _iterator3.e(err);
	      } finally {
	        _iterator3.f();
	      }
	    }
	    /**
	     * Fires a "selection changed" event.
	     */

	  }, {
	    key: "fireSelection",
	    value: function fireSelection() {
	      if (this.listeners.selection && this.listeners.selection.length) {
	        var focus = this.getSelection(false);
	        var anchor = this.getSelection(true);
	        var commandState = this.getCommandState(focus, anchor);

	        if (this.lastCommandState) {
	          Object.assign(this.lastCommandState, commandState);
	        } else {
	          this.lastCommandState = Object.assign({}, commandState);
	        }

	        var _iterator4 = _createForOfIteratorHelper(this.listeners.selection),
	            _step4;

	        try {
	          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
	            var listener = _step4.value;
	            listener({
	              focus: focus,
	              anchor: anchor,
	              commandState: this.lastCommandState
	            });
	          }
	        } catch (err) {
	          _iterator4.e(err);
	        } finally {
	          _iterator4.f();
	        }
	      }
	    }
	    /**
	     * Adds an event listener.
	     * @param {string} type The type of event to listen to. Can be 'change' or 'selection'
	     * @param {*} listener Function of the type (event) => {} to be called when the event occurs.
	     */

	  }, {
	    key: "addEventListener",
	    value: function addEventListener(type, listener) {
	      if (type.match(/^(?:change|input)$/i)) {
	        this.listeners.change.push(listener);
	      }

	      if (type.match(/^(?:selection|selectionchange)$/i)) {
	        this.listeners.selection.push(listener);
	      }
	    }
	  }]);

	  return Editor;
	}();

	exports.CommandBar = CommandBar;
	exports.Editor = Editor;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC1nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGlkZGVuLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtYnVpbHQtaW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuY29uY2F0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1pcy1zdHJpY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmpvaW4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWdleHAtZmxhZ3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLXN0aWNreS1oZWxwZXJzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAuZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy1tdWx0aWJ5dGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1yZWdleHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuc3BsaXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLWh0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3RyaW5nLWh0bWwtZm9yY2VkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuYW5jaG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuYm9sZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLmxpbmsuanMiLCJzcmMvc3ZnL3N2Zy5qcyIsInNyYy9UaW55TURFQ29tbWFuZEJhci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1tZXRob2QtdXNlcy10by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5zcGxpY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbm90LWEtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcnJlY3QtaXMtcmVnZXhwLWxvZ2ljLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3doaXRlc3BhY2VzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3N0cmluZy10cmltLWZvcmNlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3RyaW5nLnRyaW0uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm9iamVjdC5rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2EtcG9zc2libGUtcHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnJlZ2V4cC5jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAudG8tc3RyaW5nLmpzIiwic3JjL2dyYW1tYXIuanMiLCJzcmMvVGlueU1ERS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2hlY2sgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICYmIGl0Lk1hdGggPT0gTWF0aCAmJiBpdDtcbn07XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG5tb2R1bGUuZXhwb3J0cyA9XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgY2hlY2sodHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZikgfHxcbiAgY2hlY2sodHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwpIHx8XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIDEsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pWzFdICE9IDc7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICFuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgMTogMiB9LCAxKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciBzcGxpdCA9ICcnLnNwbGl0O1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICByZXR1cm4gIU9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApO1xufSkgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNsYXNzb2YoaXQpID09ICdTdHJpbmcnID8gc3BsaXQuY2FsbChpdCwgJycpIDogT2JqZWN0KGl0KTtcbn0gOiBPYmplY3Q7XG4iLCIvLyBgUmVxdWlyZU9iamVjdENvZXJjaWJsZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZXF1aXJlb2JqZWN0Y29lcmNpYmxlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJbmRleGVkT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoaXQpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXRvcHJpbWl0aXZlXG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBQUkVGRVJSRURfU1RSSU5HKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpKSByZXR1cm4gaW5wdXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpbnB1dC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUFJFRkVSUkVEX1NUUklORyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIEVYSVNUUyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEVYSVNUUyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoY3JlYXRlRWxlbWVudCgnZGl2JyksICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfVxuICB9KS5hICE9IDc7XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbnZhciBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/IG5hdGl2ZUdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcblxudmFyIG5hdGl2ZURlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnR5YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyBuYXRpdmVEZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCcpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHlNb2R1bGUuZihvYmplY3QsIGtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGdsb2JhbCwga2V5LCB2YWx1ZSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZ2xvYmFsW2tleV0gPSB2YWx1ZTtcbiAgfSByZXR1cm4gdmFsdWU7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbnZhciBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24udG9TdHJpbmc7XG5cbi8vIHRoaXMgaGVscGVyIGJyb2tlbiBpbiBgMy40LjEtMy40LjRgLCBzbyB3ZSBjYW4ndCB1c2UgYHNoYXJlZGAgaGVscGVyXG5pZiAodHlwZW9mIHN0b3JlLmluc3BlY3RTb3VyY2UgIT0gJ2Z1bmN0aW9uJykge1xuICBzdG9yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcuY2FsbChpdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmUuaW5zcGVjdFNvdXJjZTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nICYmIC9uYXRpdmUgY29kZS8udGVzdChpbnNwZWN0U291cmNlKFdlYWtNYXApKTtcbiIsInZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjYuNScsXG4gIG1vZGU6IElTX1BVUkUgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyBTdHJpbmcoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgKCsraWQgKyBwb3N0Zml4KS50b1N0cmluZygzNik7XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBOQVRJVkVfV0VBS19NQVAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXdlYWstbWFwJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBvYmplY3RIYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG52YXIgc2V0LCBnZXQsIGhhcztcblxudmFyIGVuZm9yY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGhhcyhpdCkgPyBnZXQoaXQpIDogc2V0KGl0LCB7fSk7XG59O1xuXG52YXIgZ2V0dGVyRm9yID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBzdGF0ZTtcbiAgICBpZiAoIWlzT2JqZWN0KGl0KSB8fCAoc3RhdGUgPSBnZXQoaXQpKS50eXBlICE9PSBUWVBFKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkJyk7XG4gICAgfSByZXR1cm4gc3RhdGU7XG4gIH07XG59O1xuXG5pZiAoTkFUSVZFX1dFQUtfTUFQKSB7XG4gIHZhciBzdG9yZSA9IG5ldyBXZWFrTWFwKCk7XG4gIHZhciB3bWdldCA9IHN0b3JlLmdldDtcbiAgdmFyIHdtaGFzID0gc3RvcmUuaGFzO1xuICB2YXIgd21zZXQgPSBzdG9yZS5zZXQ7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICB3bXNldC5jYWxsKHN0b3JlLCBpdCwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtZ2V0LmNhbGwoc3RvcmUsIGl0KSB8fCB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtaGFzLmNhbGwoc3RvcmUsIGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KGl0LCBTVEFURSwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIG9iamVjdEhhcyhpdCwgU1RBVEUpID8gaXRbU1RBVEVdIDoge307XG4gIH07XG4gIGhhcyA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBvYmplY3RIYXMoaXQsIFNUQVRFKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0LFxuICBnZXQ6IGdldCxcbiAgaGFzOiBoYXMsXG4gIGVuZm9yY2U6IGVuZm9yY2UsXG4gIGdldHRlckZvcjogZ2V0dGVyRm9yXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcblxudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcbnZhciBlbmZvcmNlSW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZW5mb3JjZTtcbnZhciBURU1QTEFURSA9IFN0cmluZyhTdHJpbmcpLnNwbGl0KCdTdHJpbmcnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIGtleSwgdmFsdWUsIG9wdGlvbnMpIHtcbiAgdmFyIHVuc2FmZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMudW5zYWZlIDogZmFsc2U7XG4gIHZhciBzaW1wbGUgPSBvcHRpb25zID8gISFvcHRpb25zLmVudW1lcmFibGUgOiBmYWxzZTtcbiAgdmFyIG5vVGFyZ2V0R2V0ID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5ub1RhcmdldEdldCA6IGZhbHNlO1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PSAnc3RyaW5nJyAmJiAhaGFzKHZhbHVlLCAnbmFtZScpKSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkodmFsdWUsICduYW1lJywga2V5KTtcbiAgICBlbmZvcmNlSW50ZXJuYWxTdGF0ZSh2YWx1ZSkuc291cmNlID0gVEVNUExBVEUuam9pbih0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8ga2V5IDogJycpO1xuICB9XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbDtcbiIsInZhciBwYXRoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3BhdGgnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YXJpYWJsZSA9PSAnZnVuY3Rpb24nID8gdmFyaWFibGUgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24ocGF0aFtuYW1lc3BhY2VdKSB8fCBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pXG4gICAgOiBwYXRoW25hbWVzcGFjZV0gJiYgcGF0aFtuYW1lc3BhY2VdW21ldGhvZF0gfHwgZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5cbi8vIGBUb0ludGVnZXJgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9pbnRlZ2VyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNOYU4oYXJndW1lbnQgPSArYXJndW1lbnQpID8gMCA6IChhcmd1bWVudCA+IDAgPyBmbG9vciA6IGNlaWwpKGFyZ3VtZW50KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcblxudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBgVG9MZW5ndGhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbnRlZ2VyIDwgMCA/IG1heChpbnRlZ2VyICsgbGVuZ3RoLCAwKSA6IG1pbihpbnRlZ2VyLCBsZW5ndGgpO1xufTtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgaWYgKChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSAmJiBPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBjcmVhdGVNZXRob2QodHJ1ZSksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhcyhoaWRkZW5LZXlzLCBrZXkpICYmIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIElFOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSBbXG4gICdjb25zdHJ1Y3RvcicsXG4gICdoYXNPd25Qcm9wZXJ0eScsXG4gICdpc1Byb3RvdHlwZU9mJyxcbiAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgJ3RvTG9jYWxlU3RyaW5nJyxcbiAgJ3RvU3RyaW5nJyxcbiAgJ3ZhbHVlT2YnXG5dO1xuIiwidmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGFsbCBvYmplY3Qga2V5cywgaW5jbHVkZXMgbm9uLWVudW1lcmFibGUgYW5kIHN5bWJvbHNcbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignUmVmbGVjdCcsICdvd25LZXlzJykgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCkge1xuICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUuZihhbk9iamVjdChpdCkpO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHJldHVybiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPyBrZXlzLmNvbmNhdChnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpKSA6IGtleXM7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciBvd25LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL293bi1rZXlzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG4gIHZhciBrZXlzID0gb3duS2V5cyhzb3VyY2UpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuICB2YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBrZXlzW2ldO1xuICAgIGlmICghaGFzKHRhcmdldCwga2V5KSkgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICB9XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogdHlwZW9mIGRldGVjdGlvbiA9PSAnZnVuY3Rpb24nID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMubm9UYXJnZXRHZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbi8vIGBJc0FycmF5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzYXJyYXlcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY2xhc3NvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByaW1pdGl2ZScpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKGtleSk7XG4gIGlmIChwcm9wZXJ0eUtleSBpbiBvYmplY3QpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBwcm9wZXJ0eUtleSwgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W3Byb3BlcnR5S2V5XSA9IHZhbHVlO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICEhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBDaHJvbWUgMzggU3ltYm9sIGhhcyBpbmNvcnJlY3QgdG9TdHJpbmcgY29udmVyc2lvblxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgcmV0dXJuICFTdHJpbmcoU3ltYm9sKCkpO1xufSk7XG4iLCJ2YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTkFUSVZFX1NZTUJPTFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgJiYgIVN5bWJvbC5zaGFtXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnO1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wnKTtcbnZhciBVU0VfU1lNQk9MX0FTX1VJRCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZCcpO1xuXG52YXIgV2VsbEtub3duU3ltYm9sc1N0b3JlID0gc2hhcmVkKCd3a3MnKTtcbnZhciBTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyIGNyZWF0ZVdlbGxLbm93blN5bWJvbCA9IFVTRV9TWU1CT0xfQVNfVUlEID8gU3ltYm9sIDogU3ltYm9sICYmIFN5bWJvbC53aXRob3V0U2V0dGVyIHx8IHVpZDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICBpZiAoIWhhcyhXZWxsS25vd25TeW1ib2xzU3RvcmUsIG5hbWUpKSB7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzKFN5bWJvbCwgbmFtZSkpIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICBlbHNlIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IGNyZWF0ZVdlbGxLbm93blN5bWJvbCgnU3ltYm9sLicgKyBuYW1lKTtcbiAgfSByZXR1cm4gV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbi8vIGBBcnJheVNwZWNpZXNDcmVhdGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXlzcGVjaWVzY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbEFycmF5LCBsZW5ndGgpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsQXJyYXkpKSB7XG4gICAgQyA9IG9yaWdpbmFsQXJyYXkuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGVsc2UgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gbmV3IChDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEMpKGxlbmd0aCA9PT0gMCA/IDAgOiBsZW5ndGgpO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ25hdmlnYXRvcicsICd1c2VyQWdlbnQnKSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52ODtcbnZhciBtYXRjaCwgdmVyc2lvbjtcblxuaWYgKHY4KSB7XG4gIG1hdGNoID0gdjguc3BsaXQoJy4nKTtcbiAgdmVyc2lvbiA9IG1hdGNoWzBdICsgbWF0Y2hbMV07XG59IGVsc2UgaWYgKHVzZXJBZ2VudCkge1xuICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvRWRnZVxcLyhcXGQrKS8pO1xuICBpZiAoIW1hdGNoIHx8IG1hdGNoWzFdID49IDc0KSB7XG4gICAgbWF0Y2ggPSB1c2VyQWdlbnQubWF0Y2goL0Nocm9tZVxcLyhcXGQrKS8pO1xuICAgIGlmIChtYXRjaCkgdmVyc2lvbiA9IG1hdGNoWzFdO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvbiAmJiArdmVyc2lvbjtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4gIC8vIGRlb3B0aW1pemF0aW9uIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy82NzdcbiAgcmV0dXJuIFY4X1ZFUlNJT04gPj0gNTEgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICB2YXIgY29uc3RydWN0b3IgPSBhcnJheS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgIGNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHsgZm9vOiAxIH07XG4gICAgfTtcbiAgICByZXR1cm4gYXJyYXlbTUVUSE9EX05BTUVdKEJvb2xlYW4pLmZvbyAhPT0gMTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG52YXIgYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIFY4X1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcblxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFID0gd2VsbEtub3duU3ltYm9sKCdpc0NvbmNhdFNwcmVhZGFibGUnKTtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQgPSAnTWF4aW11bSBhbGxvd2VkIGluZGV4IGV4Y2VlZGVkJztcblxuLy8gV2UgY2FuJ3QgdXNlIHRoaXMgZmVhdHVyZSBkZXRlY3Rpb24gaW4gVjggc2luY2UgaXQgY2F1c2VzXG4vLyBkZW9wdGltaXphdGlvbiBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxudmFyIElTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQgPSBWOF9WRVJTSU9OID49IDUxIHx8ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBhcnJheSA9IFtdO1xuICBhcnJheVtJU19DT05DQVRfU1BSRUFEQUJMRV0gPSBmYWxzZTtcbiAgcmV0dXJuIGFycmF5LmNvbmNhdCgpWzBdICE9PSBhcnJheTtcbn0pO1xuXG52YXIgU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnY29uY2F0Jyk7XG5cbnZhciBpc0NvbmNhdFNwcmVhZGFibGUgPSBmdW5jdGlvbiAoTykge1xuICBpZiAoIWlzT2JqZWN0KE8pKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzcHJlYWRhYmxlID0gT1tJU19DT05DQVRfU1BSRUFEQUJMRV07XG4gIHJldHVybiBzcHJlYWRhYmxlICE9PSB1bmRlZmluZWQgPyAhIXNwcmVhZGFibGUgOiBpc0FycmF5KE8pO1xufTtcblxudmFyIEZPUkNFRCA9ICFJU19DT05DQVRfU1BSRUFEQUJMRV9TVVBQT1JUIHx8ICFTUEVDSUVTX1NVUFBPUlQ7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuY29uY2F0YCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5jb25jYXRcbi8vIHdpdGggYWRkaW5nIHN1cHBvcnQgb2YgQEBpc0NvbmNhdFNwcmVhZGFibGUgYW5kIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogRk9SQ0VEIH0sIHtcbiAgY29uY2F0OiBmdW5jdGlvbiBjb25jYXQoYXJnKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBBID0gYXJyYXlTcGVjaWVzQ3JlYXRlKE8sIDApO1xuICAgIHZhciBuID0gMDtcbiAgICB2YXIgaSwgaywgbGVuZ3RoLCBsZW4sIEU7XG4gICAgZm9yIChpID0gLTEsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgRSA9IGkgPT09IC0xID8gTyA6IGFyZ3VtZW50c1tpXTtcbiAgICAgIGlmIChpc0NvbmNhdFNwcmVhZGFibGUoRSkpIHtcbiAgICAgICAgbGVuID0gdG9MZW5ndGgoRS5sZW5ndGgpO1xuICAgICAgICBpZiAobiArIGxlbiA+IE1BWF9TQUZFX0lOVEVHRVIpIHRocm93IFR5cGVFcnJvcihNQVhJTVVNX0FMTE9XRURfSU5ERVhfRVhDRUVERUQpO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbGVuOyBrKyssIG4rKykgaWYgKGsgaW4gRSkgY3JlYXRlUHJvcGVydHkoQSwgbiwgRVtrXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobiA+PSBNQVhfU0FGRV9JTlRFR0VSKSB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0lOREVYX0VYQ0VFREVEKTtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkoQSwgbisrLCBFKTtcbiAgICAgIH1cbiAgICB9XG4gICAgQS5sZW5ndGggPSBuO1xuICAgIHJldHVybiBBO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgYXJndW1lbnQpIHtcbiAgdmFyIG1ldGhvZCA9IFtdW01FVEhPRF9OQU1FXTtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsLG5vLXRocm93LWxpdGVyYWxcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHRocm93IDE7IH0sIDEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG5cbnZhciBuYXRpdmVKb2luID0gW10uam9pbjtcblxudmFyIEVTM19TVFJJTkdTID0gSW5kZXhlZE9iamVjdCAhPSBPYmplY3Q7XG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2pvaW4nLCAnLCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmpvaW5gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmpvaW5cbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEVTM19TVFJJTkdTIHx8ICFTVFJJQ1RfTUVUSE9EIH0sIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbmF0aXZlSm9pbi5jYWxsKHRvSW5kZXhlZE9iamVjdCh0aGlzKSwgc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnLCcgOiBzZXBhcmF0b3IpO1xuICB9XG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZyA9IEZ1bmN0aW9uUHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIG5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLztcbnZhciBOQU1FID0gJ25hbWUnO1xuXG4vLyBGdW5jdGlvbiBpbnN0YW5jZXMgYC5uYW1lYCBwcm9wZXJ0eVxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZnVuY3Rpb24taW5zdGFuY2VzLW5hbWVcbmlmIChERVNDUklQVE9SUyAmJiAhKE5BTUUgaW4gRnVuY3Rpb25Qcm90b3R5cGUpKSB7XG4gIGRlZmluZVByb3BlcnR5KEZ1bmN0aW9uUHJvdG90eXBlLCBOQU1FLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEZ1bmN0aW9uUHJvdG90eXBlVG9TdHJpbmcuY2FsbCh0aGlzKS5tYXRjaChuYW1lUkUpWzFdO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG4iLCJ2YXIgaW50ZXJuYWxPYmplY3RLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmtleXNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgb2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cycpO1xudmFyIGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1zeW1ib2xzJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG5cbnZhciBuYXRpdmVBc3NpZ24gPSBPYmplY3QuYXNzaWduO1xudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG4vLyBgT2JqZWN0LmFzc2lnbmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG5tb2R1bGUuZXhwb3J0cyA9ICFuYXRpdmVBc3NpZ24gfHwgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBzaG91bGQgaGF2ZSBjb3JyZWN0IG9yZGVyIG9mIG9wZXJhdGlvbnMgKEVkZ2UgYnVnKVxuICBpZiAoREVTQ1JJUFRPUlMgJiYgbmF0aXZlQXNzaWduKHsgYjogMSB9LCBuYXRpdmVBc3NpZ24oZGVmaW5lUHJvcGVydHkoe30sICdhJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnYicsIHtcbiAgICAgICAgdmFsdWU6IDMsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9XG4gIH0pLCB7IGI6IDIgfSkpLmIgIT09IDEpIHJldHVybiB0cnVlO1xuICAvLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1ZylcbiAgdmFyIEEgPSB7fTtcbiAgdmFyIEIgPSB7fTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIHZhciBzeW1ib2wgPSBTeW1ib2woKTtcbiAgdmFyIGFscGhhYmV0ID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtzeW1ib2xdID0gNztcbiAgYWxwaGFiZXQuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24gKGNocikgeyBCW2Nocl0gPSBjaHI7IH0pO1xuICByZXR1cm4gbmF0aXZlQXNzaWduKHt9LCBBKVtzeW1ib2xdICE9IDcgfHwgb2JqZWN0S2V5cyhuYXRpdmVBc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBhbHBoYWJldDtcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgPSB0b09iamVjdCh0YXJnZXQpO1xuICB2YXIgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gMTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICB2YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZS5mO1xuICB3aGlsZSAoYXJndW1lbnRzTGVuZ3RoID4gaW5kZXgpIHtcbiAgICB2YXIgUyA9IEluZGV4ZWRPYmplY3QoYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICB2YXIga2V5cyA9IGdldE93blByb3BlcnR5U3ltYm9scyA/IG9iamVjdEtleXMoUykuY29uY2F0KGdldE93blByb3BlcnR5U3ltYm9scyhTKSkgOiBvYmplY3RLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikge1xuICAgICAga2V5ID0ga2V5c1tqKytdO1xuICAgICAgaWYgKCFERVNDUklQVE9SUyB8fCBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKFMsIGtleSkpIFRba2V5XSA9IFNba2V5XTtcbiAgICB9XG4gIH0gcmV0dXJuIFQ7XG59IDogbmF0aXZlQXNzaWduO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1hc3NpZ24nKTtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogT2JqZWN0LmFzc2lnbiAhPT0gYXNzaWduIH0sIHtcbiAgYXNzaWduOiBhc3NpZ25cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS5mbGFnc2AgZ2V0dGVyIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZXQtcmVnZXhwLnByb3RvdHlwZS5mbGFnc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aGF0ID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKHRoYXQuZ2xvYmFsKSByZXN1bHQgKz0gJ2cnO1xuICBpZiAodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZiAodGhhdC5tdWx0aWxpbmUpIHJlc3VsdCArPSAnbSc7XG4gIGlmICh0aGF0LmRvdEFsbCkgcmVzdWx0ICs9ICdzJztcbiAgaWYgKHRoYXQudW5pY29kZSkgcmVzdWx0ICs9ICd1JztcbiAgaWYgKHRoYXQuc3RpY2t5KSByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9mYWlscycpO1xuXG4vLyBiYWJlbC1taW5pZnkgdHJhbnNwaWxlcyBSZWdFeHAoJ2EnLCAneScpIC0+IC9hL3kgYW5kIGl0IGNhdXNlcyBTeW50YXhFcnJvcixcbi8vIHNvIHdlIHVzZSBhbiBpbnRlcm1lZGlhdGUgZnVuY3Rpb24uXG5mdW5jdGlvbiBSRShzLCBmKSB7XG4gIHJldHVybiBSZWdFeHAocywgZik7XG59XG5cbmV4cG9ydHMuVU5TVVBQT1JURURfWSA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCdhJywgJ3knKSAtPiAvYS95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbiAgdmFyIHJlID0gUkUoJ2EnLCAneScpO1xuICByZS5sYXN0SW5kZXggPSAyO1xuICByZXR1cm4gcmUuZXhlYygnYWJjZCcpICE9IG51bGw7XG59KTtcblxuZXhwb3J0cy5CUk9LRU5fQ0FSRVQgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTc3MzY4N1xuICB2YXIgcmUgPSBSRSgnXnInLCAnZ3knKTtcbiAgcmUubGFzdEluZGV4ID0gMjtcbiAgcmV0dXJuIHJlLmV4ZWMoJ3N0cicpICE9IG51bGw7XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWdleHBGbGFncyA9IHJlcXVpcmUoJy4vcmVnZXhwLWZsYWdzJyk7XG52YXIgc3RpY2t5SGVscGVycyA9IHJlcXVpcmUoJy4vcmVnZXhwLXN0aWNreS1oZWxwZXJzJyk7XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuLy8gVGhpcyBhbHdheXMgcmVmZXJzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIGJlY2F1c2UgdGhlXG4vLyBTdHJpbmcjcmVwbGFjZSBwb2x5ZmlsbCB1c2VzIC4vZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyxcbi8vIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBiZWZvcmUgcGF0Y2hpbmcgdGhlIG1ldGhvZC5cbnZhciBuYXRpdmVSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG52YXIgcGF0Y2hlZEV4ZWMgPSBuYXRpdmVFeGVjO1xuXG52YXIgVVBEQVRFU19MQVNUX0lOREVYX1dST05HID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlMSA9IC9hLztcbiAgdmFyIHJlMiA9IC9iKi9nO1xuICBuYXRpdmVFeGVjLmNhbGwocmUxLCAnYScpO1xuICBuYXRpdmVFeGVjLmNhbGwocmUyLCAnYScpO1xuICByZXR1cm4gcmUxLmxhc3RJbmRleCAhPT0gMCB8fCByZTIubGFzdEluZGV4ICE9PSAwO1xufSkoKTtcblxudmFyIFVOU1VQUE9SVEVEX1kgPSBzdGlja3lIZWxwZXJzLlVOU1VQUE9SVEVEX1kgfHwgc3RpY2t5SGVscGVycy5CUk9LRU5fQ0FSRVQ7XG5cbi8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwLCBjb3BpZWQgZnJvbSBlczUtc2hpbSdzIFN0cmluZyNzcGxpdCBwYXRjaC5cbnZhciBOUENHX0lOQ0xVREVEID0gLygpPz8vLmV4ZWMoJycpWzFdICE9PSB1bmRlZmluZWQ7XG5cbnZhciBQQVRDSCA9IFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyB8fCBOUENHX0lOQ0xVREVEIHx8IFVOU1VQUE9SVEVEX1k7XG5cbmlmIChQQVRDSCkge1xuICBwYXRjaGVkRXhlYyA9IGZ1bmN0aW9uIGV4ZWMoc3RyKSB7XG4gICAgdmFyIHJlID0gdGhpcztcbiAgICB2YXIgbGFzdEluZGV4LCByZUNvcHksIG1hdGNoLCBpO1xuICAgIHZhciBzdGlja3kgPSBVTlNVUFBPUlRFRF9ZICYmIHJlLnN0aWNreTtcbiAgICB2YXIgZmxhZ3MgPSByZWdleHBGbGFncy5jYWxsKHJlKTtcbiAgICB2YXIgc291cmNlID0gcmUuc291cmNlO1xuICAgIHZhciBjaGFyc0FkZGVkID0gMDtcbiAgICB2YXIgc3RyQ29weSA9IHN0cjtcblxuICAgIGlmIChzdGlja3kpIHtcbiAgICAgIGZsYWdzID0gZmxhZ3MucmVwbGFjZSgneScsICcnKTtcbiAgICAgIGlmIChmbGFncy5pbmRleE9mKCdnJykgPT09IC0xKSB7XG4gICAgICAgIGZsYWdzICs9ICdnJztcbiAgICAgIH1cblxuICAgICAgc3RyQ29weSA9IFN0cmluZyhzdHIpLnNsaWNlKHJlLmxhc3RJbmRleCk7XG4gICAgICAvLyBTdXBwb3J0IGFuY2hvcmVkIHN0aWNreSBiZWhhdmlvci5cbiAgICAgIGlmIChyZS5sYXN0SW5kZXggPiAwICYmICghcmUubXVsdGlsaW5lIHx8IHJlLm11bHRpbGluZSAmJiBzdHJbcmUubGFzdEluZGV4IC0gMV0gIT09ICdcXG4nKSkge1xuICAgICAgICBzb3VyY2UgPSAnKD86ICcgKyBzb3VyY2UgKyAnKSc7XG4gICAgICAgIHN0ckNvcHkgPSAnICcgKyBzdHJDb3B5O1xuICAgICAgICBjaGFyc0FkZGVkKys7XG4gICAgICB9XG4gICAgICAvLyBeKD8gKyByeCArICkgaXMgbmVlZGVkLCBpbiBjb21iaW5hdGlvbiB3aXRoIHNvbWUgc3RyIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeKD86JyArIHNvdXJjZSArICcpJywgZmxhZ3MpO1xuICAgIH1cblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZS5sYXN0SW5kZXg7XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChzdGlja3kgPyByZUNvcHkgOiByZSwgc3RyQ29weSk7XG5cbiAgICBpZiAoc3RpY2t5KSB7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgbWF0Y2guaW5wdXQgPSBtYXRjaC5pbnB1dC5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2hbMF0gPSBtYXRjaFswXS5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2guaW5kZXggPSByZS5sYXN0SW5kZXg7XG4gICAgICAgIHJlLmxhc3RJbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICB9IGVsc2UgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmUubGFzdEluZGV4ID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoZWRFeGVjO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYycpO1xuXG4kKHsgdGFyZ2V0OiAnUmVnRXhwJywgcHJvdG86IHRydWUsIGZvcmNlZDogLy4vLmV4ZWMgIT09IGV4ZWMgfSwge1xuICBleGVjOiBleGVjXG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIFRPRE86IFJlbW92ZSBmcm9tIGBjb3JlLWpzQDRgIHNpbmNlIGl0J3MgbW92ZWQgdG8gZW50cnkgcG9pbnRzXG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzLnJlZ2V4cC5leGVjJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMnKTtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbnZhciBSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vICNyZXBsYWNlIG5lZWRzIGJ1aWx0LWluIHN1cHBvcnQgZm9yIG5hbWVkIGdyb3Vwcy5cbiAgLy8gI21hdGNoIHdvcmtzIGZpbmUgYmVjYXVzZSBpdCBqdXN0IHJldHVybiB0aGUgZXhlYyByZXN1bHRzLCBldmVuIGlmIGl0IGhhc1xuICAvLyBhIFwiZ3JvcHNcIiBwcm9wZXJ0eS5cbiAgdmFyIHJlID0gLy4vO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXBzID0geyBhOiAnNycgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gJycucmVwbGFjZShyZSwgJyQ8YT4nKSAhPT0gJzcnO1xufSk7XG5cbi8vIElFIDw9IDExIHJlcGxhY2VzICQwIHdpdGggdGhlIHdob2xlIG1hdGNoLCBhcyBpZiBpdCB3YXMgJCZcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYwMjQ2NjYvZ2V0dGluZy1pZS10by1yZXBsYWNlLWEtcmVnZXgtd2l0aC10aGUtbGl0ZXJhbC1zdHJpbmctMFxudmFyIFJFUExBQ0VfS0VFUFNfJDAgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gJ2EnLnJlcGxhY2UoLy4vLCAnJDAnKSA9PT0gJyQwJztcbn0pKCk7XG5cbnZhciBSRVBMQUNFID0gd2VsbEtub3duU3ltYm9sKCdyZXBsYWNlJyk7XG4vLyBTYWZhcmkgPD0gMTMuMC4zKD8pIHN1YnN0aXR1dGVzIG50aCBjYXB0dXJlIHdoZXJlIG4+bSB3aXRoIGFuIGVtcHR5IHN0cmluZ1xudmFyIFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKC8uL1tSRVBMQUNFXSkge1xuICAgIHJldHVybiAvLi9bUkVQTEFDRV0oJ2EnLCAnJDAnKSA9PT0gJyc7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSkoKTtcblxuLy8gQ2hyb21lIDUxIGhhcyBhIGJ1Z2d5IFwic3BsaXRcIiBpbXBsZW1lbnRhdGlvbiB3aGVuIFJlZ0V4cCNleGVjICE9PSBuYXRpdmVFeGVjXG4vLyBXZWV4IEpTIGhhcyBmcm96ZW4gYnVpbHQtaW4gcHJvdG90eXBlcywgc28gdXNlIHRyeSAvIGNhdGNoIHdyYXBwZXJcbnZhciBTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUgPSAvKD86KS87XG4gIHZhciBvcmlnaW5hbEV4ZWMgPSByZS5leGVjO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3JpZ2luYWxFeGVjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gIHZhciByZXN1bHQgPSAnYWInLnNwbGl0KHJlKTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggIT09IDIgfHwgcmVzdWx0WzBdICE9PSAnYScgfHwgcmVzdWx0WzFdICE9PSAnYic7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMsIHNoYW0pIHtcbiAgdmFyIFNZTUJPTCA9IHdlbGxLbm93blN5bWJvbChLRVkpO1xuXG4gIHZhciBERUxFR0FURVNfVE9fU1lNQk9MID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTdHJpbmcgbWV0aG9kcyBjYWxsIHN5bWJvbC1uYW1lZCBSZWdFcCBtZXRob2RzXG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pO1xuXG4gIHZhciBERUxFR0FURVNfVE9fRVhFQyA9IERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTeW1ib2wtbmFtZWQgUmVnRXhwIG1ldGhvZHMgY2FsbCAuZXhlY1xuICAgIHZhciBleGVjQ2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlID0gL2EvO1xuXG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gV2UgY2FuJ3QgdXNlIHJlYWwgcmVnZXggaGVyZSBzaW5jZSBpdCBjYXVzZXMgZGVvcHRpbWl6YXRpb25cbiAgICAgIC8vIGFuZCBzZXJpb3VzIHBlcmZvcm1hbmNlIGRlZ3JhZGF0aW9uIGluIFY4XG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzA2XG4gICAgICByZSA9IHt9O1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgICAgcmUuZmxhZ3MgPSAnJztcbiAgICAgIHJlW1NZTUJPTF0gPSAvLi9bU1lNQk9MXTtcbiAgICB9XG5cbiAgICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyBleGVjQ2FsbGVkID0gdHJ1ZTsgcmV0dXJuIG51bGw7IH07XG5cbiAgICByZVtTWU1CT0xdKCcnKTtcbiAgICByZXR1cm4gIWV4ZWNDYWxsZWQ7XG4gIH0pO1xuXG4gIGlmIChcbiAgICAhREVMRUdBVEVTX1RPX1NZTUJPTCB8fFxuICAgICFERUxFR0FURVNfVE9fRVhFQyB8fFxuICAgIChLRVkgPT09ICdyZXBsYWNlJyAmJiAhKFxuICAgICAgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgJiZcbiAgICAgIFJFUExBQ0VfS0VFUFNfJDAgJiZcbiAgICAgICFSRUdFWFBfUkVQTEFDRV9TVUJTVElUVVRFU19VTkRFRklORURfQ0FQVFVSRVxuICAgICkpIHx8XG4gICAgKEtFWSA9PT0gJ3NwbGl0JyAmJiAhU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDKVxuICApIHtcbiAgICB2YXIgbmF0aXZlUmVnRXhwTWV0aG9kID0gLy4vW1NZTUJPTF07XG4gICAgdmFyIG1ldGhvZHMgPSBleGVjKFNZTUJPTCwgJydbS0VZXSwgZnVuY3Rpb24gKG5hdGl2ZU1ldGhvZCwgcmVnZXhwLCBzdHIsIGFyZzIsIGZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICBpZiAocmVnZXhwLmV4ZWMgPT09IHJlZ2V4cEV4ZWMpIHtcbiAgICAgICAgaWYgKERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgICAgLy8gVGhlIG5hdGl2ZSBTdHJpbmcgbWV0aG9kIGFscmVhZHkgZGVsZWdhdGVzIHRvIEBAbWV0aG9kICh0aGlzXG4gICAgICAgICAgLy8gcG9seWZpbGxlZCBmdW5jdGlvbiksIGxlYXNpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgIC8vIFdlIGF2b2lkIGl0IGJ5IGRpcmVjdGx5IGNhbGxpbmcgdGhlIG5hdGl2ZSBAQG1ldGhvZCBtZXRob2QuXG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZVJlZ0V4cE1ldGhvZC5jYWxsKHJlZ2V4cCwgc3RyLCBhcmcyKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVNZXRob2QuY2FsbChzdHIsIHJlZ2V4cCwgYXJnMikgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlIH07XG4gICAgfSwge1xuICAgICAgUkVQTEFDRV9LRUVQU18kMDogUkVQTEFDRV9LRUVQU18kMCxcbiAgICAgIFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFOiBSRUdFWFBfUkVQTEFDRV9TVUJTVElUVVRFU19VTkRFRklORURfQ0FQVFVSRVxuICAgIH0pO1xuICAgIHZhciBzdHJpbmdNZXRob2QgPSBtZXRob2RzWzBdO1xuICAgIHZhciByZWdleE1ldGhvZCA9IG1ldGhvZHNbMV07XG5cbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmluZ01ldGhvZCk7XG4gICAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24gKHN0cmluZywgYXJnKSB7IHJldHVybiByZWdleE1ldGhvZC5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uIChzdHJpbmcpIHsgcmV0dXJuIHJlZ2V4TWV0aG9kLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cblxuICBpZiAoc2hhbSkgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KFJlZ0V4cC5wcm90b3R5cGVbU1lNQk9MXSwgJ3NoYW0nLCB0cnVlKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IGNvZGVQb2ludEF0LCBhdCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKENPTlZFUlRfVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIHBvcykge1xuICAgIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoJHRoaXMpKTtcbiAgICB2YXIgcG9zaXRpb24gPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgc2l6ZSA9IFMubGVuZ3RoO1xuICAgIHZhciBmaXJzdCwgc2Vjb25kO1xuICAgIGlmIChwb3NpdGlvbiA8IDAgfHwgcG9zaXRpb24gPj0gc2l6ZSkgcmV0dXJuIENPTlZFUlRfVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgZmlyc3QgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24pO1xuICAgIHJldHVybiBmaXJzdCA8IDB4RDgwMCB8fCBmaXJzdCA+IDB4REJGRiB8fCBwb3NpdGlvbiArIDEgPT09IHNpemVcbiAgICAgIHx8IChzZWNvbmQgPSBTLmNoYXJDb2RlQXQocG9zaXRpb24gKyAxKSkgPCAweERDMDAgfHwgc2Vjb25kID4gMHhERkZGXG4gICAgICAgID8gQ09OVkVSVF9UT19TVFJJTkcgPyBTLmNoYXJBdChwb3NpdGlvbikgOiBmaXJzdFxuICAgICAgICA6IENPTlZFUlRfVE9fU1RSSU5HID8gUy5zbGljZShwb3NpdGlvbiwgcG9zaXRpb24gKyAyKSA6IChmaXJzdCAtIDB4RDgwMCA8PCAxMCkgKyAoc2Vjb25kIC0gMHhEQzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmNvZGVwb2ludGF0XG4gIGNvZGVBdDogY3JlYXRlTWV0aG9kKGZhbHNlKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuYXRgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4gIGNoYXJBdDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNoYXJBdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctbXVsdGlieXRlJykuY2hhckF0O1xuXG4vLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFkdmFuY2VzdHJpbmdpbmRleFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUywgaW5kZXgsIHVuaWNvZGUpIHtcbiAgcmV0dXJuIGluZGV4ICsgKHVuaWNvZGUgPyBjaGFyQXQoUywgaW5kZXgpLmxlbmd0aCA6IDEpO1xufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9jbGFzc29mLXJhdycpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL3JlZ2V4cC1leGVjJyk7XG5cbi8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGNsYXNzb2YoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cblxuICByZXR1cm4gcmVnZXhwRXhlYy5jYWxsKFIsIFMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxuLy8gQEBtYXRjaCBsb2dpY1xuZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ21hdGNoJywgMSwgZnVuY3Rpb24gKE1BVENILCBuYXRpdmVNYXRjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUubWF0Y2hgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubWF0Y2hcbiAgICBmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBtYXRjaGVyID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgICByZXR1cm4gbWF0Y2hlciAhPT0gdW5kZWZpbmVkID8gbWF0Y2hlci5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQG1hdGNoXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVNYXRjaCwgcmVnZXhwLCB0aGlzKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuXG4gICAgICBpZiAoIXJ4Lmdsb2JhbCkgcmV0dXJuIHJlZ0V4cEV4ZWMocngsIFMpO1xuXG4gICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBBID0gW107XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgd2hpbGUgKChyZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKSkgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIEFbbl0gPSBtYXRjaFN0cjtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgICAgbisrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4gPT09IDAgPyBudWxsIDogQTtcbiAgICB9XG4gIF07XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxuLy8gYElzUmVnRXhwYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWlzcmVnZXhwXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjbGFzc29mKGl0KSA9PSAnUmVnRXhwJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhpdCkgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG4vLyBgU3BlY2llc0NvbnN0cnVjdG9yYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IGRlZmF1bHRDb25zdHJ1Y3RvciA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYycpO1xudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXJlZ2V4cCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciBjYWxsUmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG52YXIgYXJyYXlQdXNoID0gW10ucHVzaDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBNQVhfVUlOVDMyID0gMHhGRkZGRkZGRjtcblxuLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCd4JywgJ3knKSAtPiAveC95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbnZhciBTVVBQT1JUU19ZID0gIWZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuICFSZWdFeHAoTUFYX1VJTlQzMiwgJ3knKTsgfSk7XG5cbi8vIEBAc3BsaXQgbG9naWNcbmZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdzcGxpdCcsIDIsIGZ1bmN0aW9uIChTUExJVCwgbmF0aXZlU3BsaXQsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICB2YXIgaW50ZXJuYWxTcGxpdDtcbiAgaWYgKFxuICAgICdhYmJjJy5zcGxpdCgvKGIpKi8pWzFdID09ICdjJyB8fFxuICAgICd0ZXN0Jy5zcGxpdCgvKD86KS8sIC0xKS5sZW5ndGggIT0gNCB8fFxuICAgICdhYicuc3BsaXQoLyg/OmFiKSovKS5sZW5ndGggIT0gMiB8fFxuICAgICcuJy5zcGxpdCgvKC4/KSguPykvKS5sZW5ndGggIT0gNCB8fFxuICAgICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDEgfHxcbiAgICAnJy5zcGxpdCgvLj8vKS5sZW5ndGhcbiAgKSB7XG4gICAgLy8gYmFzZWQgb24gZXM1LXNoaW0gaW1wbGVtZW50YXRpb24sIG5lZWQgdG8gcmV3b3JrIGl0XG4gICAgaW50ZXJuYWxTcGxpdCA9IGZ1bmN0aW9uIChzZXBhcmF0b3IsIGxpbWl0KSB7XG4gICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgICAgdmFyIGxpbSA9IGxpbWl0ID09PSB1bmRlZmluZWQgPyBNQVhfVUlOVDMyIDogbGltaXQgPj4+IDA7XG4gICAgICBpZiAobGltID09PSAwKSByZXR1cm4gW107XG4gICAgICBpZiAoc2VwYXJhdG9yID09PSB1bmRlZmluZWQpIHJldHVybiBbc3RyaW5nXTtcbiAgICAgIC8vIElmIGBzZXBhcmF0b3JgIGlzIG5vdCBhIHJlZ2V4LCB1c2UgbmF0aXZlIHNwbGl0XG4gICAgICBpZiAoIWlzUmVnRXhwKHNlcGFyYXRvcikpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVNwbGl0LmNhbGwoc3RyaW5nLCBzZXBhcmF0b3IsIGxpbSk7XG4gICAgICB9XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICB2YXIgZmxhZ3MgPSAoc2VwYXJhdG9yLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHNlcGFyYXRvci51bmljb2RlID8gJ3UnIDogJycpICtcbiAgICAgICAgICAgICAgICAgIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpO1xuICAgICAgdmFyIGxhc3RMYXN0SW5kZXggPSAwO1xuICAgICAgLy8gTWFrZSBgZ2xvYmFsYCBhbmQgYXZvaWQgYGxhc3RJbmRleGAgaXNzdWVzIGJ5IHdvcmtpbmcgd2l0aCBhIGNvcHlcbiAgICAgIHZhciBzZXBhcmF0b3JDb3B5ID0gbmV3IFJlZ0V4cChzZXBhcmF0b3Iuc291cmNlLCBmbGFncyArICdnJyk7XG4gICAgICB2YXIgbWF0Y2gsIGxhc3RJbmRleCwgbGFzdExlbmd0aDtcbiAgICAgIHdoaWxlIChtYXRjaCA9IHJlZ2V4cEV4ZWMuY2FsbChzZXBhcmF0b3JDb3B5LCBzdHJpbmcpKSB7XG4gICAgICAgIGxhc3RJbmRleCA9IHNlcGFyYXRvckNvcHkubGFzdEluZGV4O1xuICAgICAgICBpZiAobGFzdEluZGV4ID4gbGFzdExhc3RJbmRleCkge1xuICAgICAgICAgIG91dHB1dC5wdXNoKHN0cmluZy5zbGljZShsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkgYXJyYXlQdXNoLmFwcGx5KG91dHB1dCwgbWF0Y2guc2xpY2UoMSkpO1xuICAgICAgICAgIGxhc3RMZW5ndGggPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICBpZiAob3V0cHV0Lmxlbmd0aCA+PSBsaW0pIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCA9PT0gbWF0Y2guaW5kZXgpIHNlcGFyYXRvckNvcHkubGFzdEluZGV4Kys7IC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3BcbiAgICAgIH1cbiAgICAgIGlmIChsYXN0TGFzdEluZGV4ID09PSBzdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIGlmIChsYXN0TGVuZ3RoIHx8ICFzZXBhcmF0b3JDb3B5LnRlc3QoJycpKSBvdXRwdXQucHVzaCgnJyk7XG4gICAgICB9IGVsc2Ugb3V0cHV0LnB1c2goc3RyaW5nLnNsaWNlKGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgIHJldHVybiBvdXRwdXQubGVuZ3RoID4gbGltID8gb3V0cHV0LnNsaWNlKDAsIGxpbSkgOiBvdXRwdXQ7XG4gICAgfTtcbiAgLy8gQ2hha3JhLCBWOFxuICB9IGVsc2UgaWYgKCcwJy5zcGxpdCh1bmRlZmluZWQsIDApLmxlbmd0aCkge1xuICAgIGludGVybmFsU3BsaXQgPSBmdW5jdGlvbiAoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgcmV0dXJuIHNlcGFyYXRvciA9PT0gdW5kZWZpbmVkICYmIGxpbWl0ID09PSAwID8gW10gOiBuYXRpdmVTcGxpdC5jYWxsKHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgIH07XG4gIH0gZWxzZSBpbnRlcm5hbFNwbGl0ID0gbmF0aXZlU3BsaXQ7XG5cbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5zcGxpdGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5zcGxpdFxuICAgIGZ1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBzcGxpdHRlciA9IHNlcGFyYXRvciA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZXBhcmF0b3JbU1BMSVRdO1xuICAgICAgcmV0dXJuIHNwbGl0dGVyICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBzcGxpdHRlci5jYWxsKHNlcGFyYXRvciwgTywgbGltaXQpXG4gICAgICAgIDogaW50ZXJuYWxTcGxpdC5jYWxsKFN0cmluZyhPKSwgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHNwbGl0XG4gICAgLy9cbiAgICAvLyBOT1RFOiBUaGlzIGNhbm5vdCBiZSBwcm9wZXJseSBwb2x5ZmlsbGVkIGluIGVuZ2luZXMgdGhhdCBkb24ndCBzdXBwb3J0XG4gICAgLy8gdGhlICd5JyBmbGFnLlxuICAgIGZ1bmN0aW9uIChyZWdleHAsIGxpbWl0KSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKGludGVybmFsU3BsaXQsIHJlZ2V4cCwgdGhpcywgbGltaXQsIGludGVybmFsU3BsaXQgIT09IG5hdGl2ZVNwbGl0KTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgdmFyIEMgPSBzcGVjaWVzQ29uc3RydWN0b3IocngsIFJlZ0V4cCk7XG5cbiAgICAgIHZhciB1bmljb2RlTWF0Y2hpbmcgPSByeC51bmljb2RlO1xuICAgICAgdmFyIGZsYWdzID0gKHJ4Lmlnbm9yZUNhc2UgPyAnaScgOiAnJykgK1xuICAgICAgICAgICAgICAgICAgKHJ4Lm11bHRpbGluZSA/ICdtJyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAocngudW5pY29kZSA/ICd1JyA6ICcnKSArXG4gICAgICAgICAgICAgICAgICAoU1VQUE9SVFNfWSA/ICd5JyA6ICdnJyk7XG5cbiAgICAgIC8vIF4oPyArIHJ4ICsgKSBpcyBuZWVkZWQsIGluIGNvbWJpbmF0aW9uIHdpdGggc29tZSBTIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICB2YXIgc3BsaXR0ZXIgPSBuZXcgQyhTVVBQT1JUU19ZID8gcnggOiAnXig/OicgKyByeC5zb3VyY2UgKyAnKScsIGZsYWdzKTtcbiAgICAgIHZhciBsaW0gPSBsaW1pdCA9PT0gdW5kZWZpbmVkID8gTUFYX1VJTlQzMiA6IGxpbWl0ID4+PiAwO1xuICAgICAgaWYgKGxpbSA9PT0gMCkgcmV0dXJuIFtdO1xuICAgICAgaWYgKFMubGVuZ3RoID09PSAwKSByZXR1cm4gY2FsbFJlZ0V4cEV4ZWMoc3BsaXR0ZXIsIFMpID09PSBudWxsID8gW1NdIDogW107XG4gICAgICB2YXIgcCA9IDA7XG4gICAgICB2YXIgcSA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgd2hpbGUgKHEgPCBTLmxlbmd0aCkge1xuICAgICAgICBzcGxpdHRlci5sYXN0SW5kZXggPSBTVVBQT1JUU19ZID8gcSA6IDA7XG4gICAgICAgIHZhciB6ID0gY2FsbFJlZ0V4cEV4ZWMoc3BsaXR0ZXIsIFNVUFBPUlRTX1kgPyBTIDogUy5zbGljZShxKSk7XG4gICAgICAgIHZhciBlO1xuICAgICAgICBpZiAoXG4gICAgICAgICAgeiA9PT0gbnVsbCB8fFxuICAgICAgICAgIChlID0gbWluKHRvTGVuZ3RoKHNwbGl0dGVyLmxhc3RJbmRleCArIChTVVBQT1JUU19ZID8gMCA6IHEpKSwgUy5sZW5ndGgpKSA9PT0gcFxuICAgICAgICApIHtcbiAgICAgICAgICBxID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHEsIHVuaWNvZGVNYXRjaGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgQS5wdXNoKFMuc2xpY2UocCwgcSkpO1xuICAgICAgICAgIGlmIChBLmxlbmd0aCA9PT0gbGltKSByZXR1cm4gQTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8PSB6Lmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgQS5wdXNoKHpbaV0pO1xuICAgICAgICAgICAgaWYgKEEubGVuZ3RoID09PSBsaW0pIHJldHVybiBBO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxID0gcCA9IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIEEucHVzaChTLnNsaWNlKHApKTtcbiAgICAgIHJldHVybiBBO1xuICAgIH1cbiAgXTtcbn0sICFTVVBQT1JUU19ZKTtcbiIsInZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG52YXIgcXVvdCA9IC9cIi9nO1xuXG4vLyBCLjIuMy4yLjEgQ3JlYXRlSFRNTChzdHJpbmcsIHRhZywgYXR0cmlidXRlLCB2YWx1ZSlcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWNyZWF0ZWh0bWxcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIHZhciBTID0gU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUoc3RyaW5nKSk7XG4gIHZhciBwMSA9ICc8JyArIHRhZztcbiAgaWYgKGF0dHJpYnV0ZSAhPT0gJycpIHAxICs9ICcgJyArIGF0dHJpYnV0ZSArICc9XCInICsgU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHF1b3QsICcmcXVvdDsnKSArICdcIic7XG4gIHJldHVybiBwMSArICc+JyArIFMgKyAnPC8nICsgdGFnICsgJz4nO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBjaGVjayB0aGUgZXhpc3RlbmNlIG9mIGEgbWV0aG9kLCBsb3dlcmNhc2Vcbi8vIG9mIGEgdGFnIGFuZCBlc2NhcGluZyBxdW90ZXMgaW4gYXJndW1lbnRzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICByZXR1cm4gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXN0ID0gJydbTUVUSE9EX05BTUVdKCdcIicpO1xuICAgIHJldHVybiB0ZXN0ICE9PSB0ZXN0LnRvTG93ZXJDYXNlKCkgfHwgdGVzdC5zcGxpdCgnXCInKS5sZW5ndGggPiAzO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBjcmVhdGVIVE1MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1odG1sJyk7XG52YXIgZm9yY2VkU3RyaW5nSFRNTE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctaHRtbC1mb3JjZWQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUuYW5jaG9yYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuYW5jaG9yXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogZm9yY2VkU3RyaW5nSFRNTE1ldGhvZCgnYW5jaG9yJykgfSwge1xuICBhbmNob3I6IGZ1bmN0aW9uIGFuY2hvcihuYW1lKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnbmFtZScsIG5hbWUpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGNyZWF0ZUhUTUwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLWh0bWwnKTtcbnZhciBmb3JjZWRTdHJpbmdIVE1MTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1odG1sLWZvcmNlZCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5ib2xkYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUuYm9sZFxuJCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IGZvcmNlZFN0cmluZ0hUTUxNZXRob2QoJ2JvbGQnKSB9LCB7XG4gIGJvbGQ6IGZ1bmN0aW9uIGJvbGQoKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2InLCAnJywgJycpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGNyZWF0ZUhUTUwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLWh0bWwnKTtcbnZhciBmb3JjZWRTdHJpbmdIVE1MTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1odG1sLWZvcmNlZCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5saW5rYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubGlua1xuJCh7IHRhcmdldDogJ1N0cmluZycsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IGZvcmNlZFN0cmluZ0hUTUxNZXRob2QoJ2xpbmsnKSB9LCB7XG4gIGxpbms6IGZ1bmN0aW9uIGxpbmsodXJsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnaHJlZicsIHVybCk7XG4gIH1cbn0pO1xuIiwiY29uc3Qgc3ZnID0ge1xuICBibG9ja3F1b3RlOiBgPHN2ZyBoZWlnaHQ9XCIxOFwiIHdpZHRoPVwiMThcIj48cmVjdCB3aWR0aD1cIjVcIiBoZWlnaHQ9XCI1XCIgeD1cIjNcIiB5PVwiNFwiIHJ5PVwiMVwiLz48cmVjdCByeT1cIjFcIiB5PVwiNFwiIHg9XCIxMFwiIGhlaWdodD1cIjVcIiB3aWR0aD1cIjVcIi8+PHBhdGggZD1cIk04IDYuOTk5djNjMCAxLTEgMy0xIDNzLS4zMzEgMS0xLjMzMSAxaC0xYy0xIDAtLjY2OS0xLS42NjktMXMxLTIgMS0zdi0zem03IDB2M2MwIDEtMSAzLTEgM3MtLjMzMSAxLTEuMzMxIDFoLTFjLTEgMC0uNjY5LTEtLjY2OS0xczEtMiAxLTN2LTN6XCIvPjwvc3ZnPmAsXG4gIGJvbGQ6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNNCAyYTEgMSAwIDAwLTEgMXYxMmExIDEgMCAwMDEgMWg2YzQgMCA1LTIgNS00IDAtMS4zMjItLjQzNC0yLjYzNi0xLjg4NS0zLjM4MUMxMy43NzIgNy44ODUgMTQgNi45NDUgMTQgNmMwLTItMS00LTUtNHptMSAyaDRjMS42NjggMCAyLjMyLjM5MyAyLjYuNjcyLjI4LjI3OS40LjY2Mi40IDEuMzI4cy0uMTIgMS4wNTctLjQgMS4zMzhjLS4yNzUuMjc0LTEuMDE0LjY0Ni0yLjYuNjYySDV6bTUgNmMxLjY2Ni4wMDUgMi4zMTguMzg4IDIuNTk2LjY2Ni4yNzcuMjc4LjQwNC42NjcuNDA0IDEuMzM0cy0uMTI3IDEuMDYtLjQwNCAxLjMzOGMtLjI3OC4yNzgtLjkzLjY2LTIuNTk2LjY2MmwtNC45OTIuMDA0TDUgMTB6XCIvPjwvc3ZnPmAsXG4gIGNsZWFyX2Zvcm1hdHRpbmc6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMTEuMDMgMWExIDEgMCAwMC0uNzQuM2wtOSA5YTEgMSAwIDAwMCAxLjRsNCA0QTEgMSAwIDAwNiAxNmgyYTEgMSAwIDAwLjctLjNsOC04YTEgMSAwIDAwMC0xLjRsLTUtNWExIDEgMCAwMC0uNjctLjN6TTguNyA1LjdsMy41OCAzLjZMNy42IDE0SDYuNGwtMy0zIDUuMy01LjN6XCIvPjxyZWN0IHJ5PVwiLjhcIiByeD1cIi44XCIgeT1cIjE0XCIgeD1cIjE2XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMlwiLz48cmVjdCB3aWR0aD1cIjJcIiBoZWlnaHQ9XCIyXCIgeD1cIjEzXCIgeT1cIjE0XCIgcng9XCIuOFwiIHJ5PVwiLjhcIi8+PHJlY3Qgcnk9XCIuOFwiIHJ4PVwiLjhcIiB5PVwiMTRcIiB4PVwiMTBcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIyXCIvPjwvc3ZnPmAsXG4gIGNvZGU6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMTMuNSAyLjk5NGEuNS41IDAgMDAtLjUuNS41LjUgMCAwMDAgLjAzNFY0LjUzYTUuOTkzIDUuOTkzIDAgMDAtNy40NTEtLjQ0NUE2IDYgMCAxMDEyLjQ1IDEzLjlhNS45OSA1Ljk5IDAgMDAxLjM0Ni0xLjMzNC41LjUgMCAwMC4wOTYtLjEwMS41LjUgMCAwMC0uMTItLjY5OC41LjUgMCAwMC0uNjk3LjEybC0uMDA0LS4wMDVhNSA1IDAgMDEtMS4xOTcgMS4yIDUgNSAwIDExMS4yMTUtNi45NjUuNS41IDAgMDAuNjk3LjEyLjUuNSAwIDAwLjIxMS0uNDRWNC43NDVIMTRWMy40OTNhLjUuNSAwIDAwLS41LS41elwiLz48L3N2Zz5gLFxuICBoMTogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk0zIDJzMC0xIDEtMWgxYzEgMCAxIDEgMSAxdjZoNlYyczAtMSAxLTFoMWMxIDAgMSAxIDEgMXYxNHMwIDEtMSAxaC0xYy0xIDAtMS0xLTEtMXYtNkg2djZzMCAxLTEgMUg0Yy0xIDAtMS0xLTEtMXpcIi8+PC9zdmc+YCxcbiAgaDI6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNNCAyczAtMSAxLTEgMSAxIDEgMXY2YzEtMSAyLTEgNC0xIDMgMCA0IDIgNCA0djVzMCAxLTEgMS0xLTEtMS0xdi01YzAtMS4wOTQtMS0yLTItMi0yIDAtMyAwLTQgMnY1czAgMS0xIDEtMS0xLTEtMXpcIi8+PC9zdmc+YCxcbiAgaHI6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxyZWN0IHJ5PVwiMVwiIHk9XCI4XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMThcIiBzdHlsZT1cImZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOm5vcm1hbDttYXJrZXI6bm9uZVwiLz48L3N2Zz5gLFxuICBpbWFnZTogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk0xIDJ2MTRoMTZWMkgxem0yIDJoMTJ2N2wtMy0zLTQgNC0yLTItMyAzVjR6XCIvPjxjaXJjbGUgcj1cIjEuNVwiIGN5PVwiNi41XCIgY3g9XCI1LjVcIi8+PC9zdmc+YCxcbiAgaXRhbGljOiBgPHN2ZyBoZWlnaHQ9XCIxOFwiIHdpZHRoPVwiMThcIj48cGF0aCBkPVwiTTkgMmExIDEgMCAwMDAgMkw3IDE0YTEgMSAwIDEwMCAyaDJhMSAxIDAgMDAwLTJsMi0xMGExIDEgMCAxMDAtMnpcIi8+PC9zdmc+YCxcbiAgbGluazogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PHBhdGggZD1cIk05LjA3IDUuMThhMy45IDMuOSAwIDAwLTEuNTIuNDNDNi4zMSA2LjIyIDUuMyA3LjI5IDQuMyA4LjI5Yy0xIDEtMi4wNyAyLjAyLTIuNjggMy4yNi0uMzEuNjItLjUgMS4zMy0uNDEgMi4wNy4wOS43NS40OCAxLjQ3IDEuMSAyLjA5LjYxLjYxIDEuMzMgMSAyLjA4IDEuMS43NC4wOSAxLjQ1LS4xIDIuMDctLjQyIDEuMjQtLjYxIDIuMjYtMS42OCAzLjI2LTIuNjguNDYtLjQ3Ljk0LS45NCAxLjM5LTEuNDRsLS40My4yNmMtLjY4LjM0LTEuNDkuNTYtMi4zNi40Ni0uMi0uMDMtLjQtLjA4LS42LS4xNC0uNzkuNzYtMS41NSAxLjQ1LTIuMTYgMS43Ni0uMzguMTktLjY3LjI0LS45Mi4yMS0uMjYtLjAzLS41NC0uMTQtLjkyLS41My0uMzktLjM4LS41LS42Ni0uNTMtLjkxLS4wMy0uMjYuMDItLjU1LjIxLS45My4zOS0uNzYgMS4zMi0xLjc0IDIuMzItMi43NCAxLTEgMS45OC0xLjkzIDIuNzQtMi4zMi4zOC0uMTkuNjctLjI0LjkzLS4yMS4yNS4wMy41My4xNC45MS41My4zOS4zOC41LjY2LjUzLjkydi4wNmwxLjEyLTEuMDYuNDQtLjQ3Yy0uMTgtLjMtLjQtLjYtLjY3LS44Ny0uNjItLjYxLTEuMzQtMS0yLjA5LTEuMWEzLjA4IDMuMDggMCAwMC0uNTUtLjAxelwiLz48cGF0aCBkPVwiTTEzLjA3Ljg2YTMuOSAzLjkgMCAwMC0xLjUyLjQzYy0xLjI0LjYyLTIuMjYgMS42OS0zLjI2IDIuNjktLjQ2LjQ3LS45NC45NC0xLjM5IDEuNDMuMTUtLjA4LjI4LS4xOC40My0uMjVhNC40IDQuNCAwIDAxMi4zNi0uNDZjLjIuMDIuNC4wNy42LjE0Ljc5LS43NyAxLjU1LTEuNDYgMi4xNi0xLjc2LjM4LS4xOS42Ny0uMjUuOTMtLjIxLjI1LjAzLjUzLjE0LjkxLjUyLjM5LjM4LjUuNjYuNTMuOTIuMDMuMjYtLjAyLjU1LS4yMS45My0uMzkuNzYtMS4zMiAxLjc0LTIuMzIgMi43NC0xIDEtMS45OCAxLjkzLTIuNzQgMi4zMS0uMzguMi0uNjcuMjUtLjkzLjIyLS4yNS0uMDQtLjUzLS4xNS0uOTEtLjUzLS4zOS0uMzgtLjUtLjY2LS41My0uOTJWOWMtLjM2LjMzLS43My42Ny0xLjEyIDEuMDZsLS40My40NmMuMTcuMy40LjYuNjYuODcuNjIuNjIgMS4zNCAxIDIuMDggMS4xLjc1LjEgMS40Ni0uMSAyLjA4LS40MSAxLjI0LS42MiAyLjI2LTEuNjkgMy4yNi0yLjY5czIuMDctMi4wMiAyLjY4LTMuMjZjLjMxLS42Mi41LTEuMzIuNDEtMi4wN2EzLjYzIDMuNjMgMCAwMC0xLjEtMi4wOGMtLjYxLS42Mi0xLjMzLTEtMi4wNy0xLjFhMy4wOCAzLjA4IDAgMDAtLjU2LS4wMnpcIi8+PC9zdmc+YCxcbiAgb2w6IGA8c3ZnIGhlaWdodD1cIjE4XCIgd2lkdGg9XCIxOFwiPjxwYXRoIGQ9XCJNMS41IDdhLjUuNSAwIDEwMCAxaDFhLjUuNSAwIDAxLjUuNWMwIC4xNjQtLjA4LjMxLS4xNC4zNTVsLTEuNjU1IDEuMjVBLjQ5Mi40OTIgMCAwMDEgMTAuNWEuNS41IDAgMDAuNS41aDJhLjUuNSAwIDAwMC0xSDNsLjM5OC0uMjk5QTEuNSAxLjUgMCAwMDIuNSA3elwiLz48cGF0aCBkPVwiTTEuNSAxMmMtLjY2NyAwLS42NjcgMSAwIDFoMS4yNWMuMzMzIDAgLjMzMy41IDAgLjVIMi41Yy0uNjY3IDAtLjY2NyAxIDAgMWguMjVjLjMzMyAwIC4zMzMuNSAwIC41SDEuNWMtLjY2NyAwLS42NjcgMSAwIDFoMWMuMzk4IDAgLjc4LS4xMzEgMS4wNi0uMzY1LjI4Mi0uMjM1LjQ0LS41NTQuNDQtLjg4NWExLjEyMSAxLjEyMSAwIDAwLS4zMDMtLjc1Yy4xOTEtLjIwNC4zLS40Ny4zMDMtLjc1IDAtLjMzMi0uMTU4LS42NTEtLjQ0LS44ODUtLjMtLjI0MS0uNjc1LS4zNy0xLjA2LS4zNjV6XCIvPjxyZWN0IHk9XCIxM1wiIHg9XCI2XCIgaGVpZ2h0PVwiMlwiIHdpZHRoPVwiMTJcIiByeT1cIjFcIi8+PHJlY3Qgcnk9XCIxXCIgd2lkdGg9XCIxMlwiIGhlaWdodD1cIjJcIiB4PVwiNlwiIHk9XCI4XCIvPjxyZWN0IHk9XCIzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48cGF0aCBkPVwiTTEuNSAyYS41LjUgMCAxMDAgMUgydjJoLS41YS41LjUgMCAxMDAgMWgyYS41LjUgMCAxMDAtMUgzVjIuNWMwLS4yNzctLjIyMy0uNS0uNS0uNXpcIi8+PC9zdmc+YCxcbiAgc3RyaWtldGhyb3VnaDogYDxzdmcgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCI+PHBhdGggZD1cIk0xMCAyQzYgMiA0IDQgNCA2YzAgLjMzOC4wOC42NzIuMTkzIDFoMi4zNEM2LjExMyA2LjYyOSA2IDYuMjk1IDYgNmMwLS4zMzQuMTE3LS43MjUuNjkxLTEuMTU0QzcuMjY1IDQuNDE2IDguMzMxIDQgMTAgNGgzYTEgMSAwIDAwMC0yem0xLjQ3NyA5Yy40MTMuMzY4LjUyMy43MDYuNTIzIDEgMCAuMzM0LS4xMjcuNzEyLS43MDEgMS4xNDMtLjU3NS40My0xLjYzMi44NS0zLjI5OS44NTdsLTEuMDA2LjAwN1YxNEg1YTEgMSAwIDAwMCAyaDNjNCAwIDYtMiA2LTQgMC0uMzM4LS4wODEtLjY3Mi0uMTk1LTF6XCIvPjxyZWN0IHJ5PVwiMVwiIHk9XCI4XCIgeD1cIjFcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxNlwiLz48L3N2Zz5gLFxuICB1bDogYDxzdmcgaGVpZ2h0PVwiMThcIiB3aWR0aD1cIjE4XCI+PGNpcmNsZSBjeD1cIjJcIiBjeT1cIjlcIiByPVwiMlwiLz48Y2lyY2xlIGN5PVwiNFwiIGN4PVwiMlwiIHI9XCIyXCIvPjxyZWN0IHk9XCIzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48Y2lyY2xlIGN4PVwiMlwiIGN5PVwiMTRcIiByPVwiMlwiLz48cmVjdCByeT1cIjFcIiB3aWR0aD1cIjEyXCIgaGVpZ2h0PVwiMlwiIHg9XCI2XCIgeT1cIjhcIi8+PHJlY3QgeT1cIjEzXCIgeD1cIjZcIiBoZWlnaHQ9XCIyXCIgd2lkdGg9XCIxMlwiIHJ5PVwiMVwiLz48L3N2Zz5gXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzdmc7IiwiaW1wb3J0IHN2ZyBmcm9tICcuL3N2Zy9zdmcnO1xuXG5jb25zdCBpc01hY0xpa2UgPSAvKE1hY3xpUGhvbmV8aVBvZHxpUGFkKS9pLnRlc3QobmF2aWdhdG9yLnBsYXRmb3JtKTtcblxuY29uc3QgRGVmYXVsdENvbW1hbmRzID0ge1xuICAnYm9sZCc6IHtcbiAgICBuYW1lOiAnYm9sZCcsXG4gICAgYWN0aW9uOiAnYm9sZCcsXG4gICAgaW5uZXJIVE1MOiBzdmcuYm9sZCxcbiAgICB0aXRsZTogJ0JvbGQnLFxuICAgIGhvdGtleTogJ01vZC1CJyxcbiAgfSxcbiAgJ2l0YWxpYyc6IHtcbiAgICBuYW1lOiAnaXRhbGljJyxcbiAgICBhY3Rpb246ICdpdGFsaWMnLFxuICAgIGlubmVySFRNTDogc3ZnLml0YWxpYyxcbiAgICB0aXRsZTogJ0l0YWxpYycsXG4gICAgaG90a2V5OiAnTW9kLUknLFxuICB9LFxuICAnc3RyaWtldGhyb3VnaCc6IHtcbiAgICBuYW1lOiAnc3RyaWtldGhyb3VnaCcsXG4gICAgYWN0aW9uOiAnc3RyaWtldGhyb3VnaCcsXG4gICAgaW5uZXJIVE1MOiBzdmcuc3RyaWtldGhyb3VnaCxcbiAgICB0aXRsZTogJ1N0cmlrZXRocm91Z2gnLFxuICAgIGhvdGtleTogJ01vZDItU2hpZnQtNScsXG4gIH0sXG4gICdjb2RlJzoge1xuICAgIG5hbWU6ICdjb2RlJyxcbiAgICBhY3Rpb246ICdjb2RlJyxcbiAgICBpbm5lckhUTUw6IHN2Zy5jb2RlLFxuICAgIHRpdGxlOiAnRm9ybWF0IGFzIGNvZGUnLFxuICB9LFxuICAnaDEnOiB7XG4gICAgbmFtZTogJ2gxJyxcbiAgICBhY3Rpb246ICdoMScsXG4gICAgaW5uZXJIVE1MOiBzdmcuaDEsXG4gICAgdGl0bGU6ICdMZXZlbCAxIGhlYWRpbmcnLFxuICAgIGhvdGtleTogJ01vZC1TaGlmdC0xJyxcbiAgfSxcbiAgJ2gyJzoge1xuICAgIG5hbWU6ICdoMicsXG4gICAgYWN0aW9uOiAnaDInLFxuICAgIGlubmVySFRNTDogc3ZnLmgyLFxuICAgIHRpdGxlOiAnTGV2ZWwgMiBoZWFkaW5nJyxcbiAgICBob3RrZXk6ICdNb2QtU2hpZnQtMicsXG4gIH0sXG4gICd1bCc6IHtcbiAgICBuYW1lOiAndWwnLFxuICAgIGFjdGlvbjogJ3VsJyxcbiAgICBpbm5lckhUTUw6IHN2Zy51bCxcbiAgICB0aXRsZTogJ0J1bGxldGVkIGxpc3QnLFxuICB9LFxuICAnb2wnOiB7XG4gICAgbmFtZTogJ29sJyxcbiAgICBhY3Rpb246ICdvbCcsXG4gICAgaW5uZXJIVE1MOiBzdmcub2wsXG4gICAgdGl0bGU6ICdOdW1iZXJlZCBsaXN0JyxcbiAgfSxcbiAgJ2Jsb2NrcXVvdGUnOiB7XG4gICAgbmFtZTogJ2Jsb2NrcXVvdGUnLFxuICAgIGFjdGlvbjogJ2Jsb2NrcXVvdGUnLFxuICAgIGlubmVySFRNTDogc3ZnLmJsb2NrcXVvdGUsXG4gICAgdGl0bGU6ICdRdW90ZScsXG4gICAgaG90a2V5OiAnTW9kMi1TaGlmdC1RJyxcbiAgfSxcbiAgJ2luc2VydExpbmsnOiB7XG4gICAgbmFtZTogJ2luc2VydExpbmsnLFxuICAgIGFjdGlvbjogKGVkaXRvcikgPT4ge2lmIChlZGl0b3IuaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCgpKSBlZGl0b3Iud3JhcFNlbGVjdGlvbignWycsICddKCknKX0sXG4gICAgZW5hYmxlZDogKGVkaXRvciwgZm9jdXMsIGFuY2hvcikgPT4gZWRpdG9yLmlzSW5saW5lRm9ybWF0dGluZ0FsbG93ZWQoZm9jdXMsIGFuY2hvcikgPyBmYWxzZSA6IG51bGwsXG4gICAgaW5uZXJIVE1MOiBzdmcubGluayxcbiAgICB0aXRsZTogJ0luc2VydCBsaW5rJyxcbiAgICBob3RrZXk6ICdNb2QtSycsXG4gIH0sXG4gICdpbnNlcnRJbWFnZSc6IHtcbiAgICBuYW1lOiAnaW5zZXJ0SW1hZ2UnLFxuICAgIGFjdGlvbjogKGVkaXRvcikgPT4ge2lmIChlZGl0b3IuaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCgpKSBlZGl0b3Iud3JhcFNlbGVjdGlvbignIVsnLCAnXSgpJyl9LFxuICAgIGVuYWJsZWQ6IChlZGl0b3IsIGZvY3VzLCBhbmNob3IpID0+IGVkaXRvci5pc0lubGluZUZvcm1hdHRpbmdBbGxvd2VkKGZvY3VzLCBhbmNob3IpID8gZmFsc2UgOiBudWxsLFxuICAgIGlubmVySFRNTDogc3ZnLmltYWdlLFxuICAgIHRpdGxlOiAnSW5zZXJ0IGltYWdlJyxcbiAgICBob3RrZXk6ICdNb2QyLVNoaWZ0LUknLFxuICB9LFxuICAnaHInOiB7XG4gICAgbmFtZTogJ2hyJyxcbiAgICBhY3Rpb246IChlZGl0b3IpID0+IGVkaXRvci5wYXN0ZSgnXFxuKioqXFxuJyksXG4gICAgZW5hYmxlZDogKCkgPT4gZmFsc2UsXG4gICAgaW5uZXJIVE1MOiBzdmcuaHIsXG4gICAgdGl0bGU6ICdJbnNlcnQgaG9yaXpvbnRhbCBsaW5lJyxcbiAgICBob3RrZXk6ICdNb2QyLVNoaWZ0LUwnXG4gIH1cbn1cblxuXG5jbGFzcyBDb21tYW5kQmFyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICB0aGlzLmUgPSBudWxsO1xuICAgIHRoaXMuZWRpdG9yID0gbnVsbDtcbiAgICB0aGlzLmNvbW1hbmRzID0gW107XG4gICAgdGhpcy5idXR0b25zID0ge307XG4gICAgdGhpcy5zdGF0ZSA9IHt9O1xuICAgIHRoaXMuaG90a2V5cyA9IFtdO1xuXG4gICAgbGV0IGVsZW1lbnQgPSBwcm9wcy5lbGVtZW50O1xuICAgIGlmIChlbGVtZW50ICYmICFlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5lbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuYm9keTsgXG4gICAgfVxuICAgIHRoaXMuY3JlYXRlQ29tbWFuZEJhckVsZW1lbnQoZWxlbWVudCwgcHJvcHMuY29tbWFuZHMgfHwgWydib2xkJywgJ2l0YWxpYycsICdzdHJpa2V0aHJvdWdoJywgJ3wnLCAnY29kZScsICd8JywgJ2gxJywgJ2gyJywgJ3wnLCAndWwnLCAnb2wnLCAnfCcsICdibG9ja3F1b3RlJywgJ2hyJywgJ3wnLCAnaW5zZXJ0TGluaycsICdpbnNlcnRJbWFnZSddKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlS2V5ZG93bihlKSk7XG4gICAgaWYgKHByb3BzLmVkaXRvcikgdGhpcy5zZXRFZGl0b3IocHJvcHMuZWRpdG9yKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbW1hbmRCYXJFbGVtZW50KHBhcmVudEVsZW1lbnQsIGNvbW1hbmRzKSB7XG4gICAgdGhpcy5lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lLmNsYXNzTmFtZSA9ICdUTUNvbW1hbmRCYXInO1xuXG4gICAgZm9yIChsZXQgY29tbWFuZCBvZiBjb21tYW5kcykge1xuICAgICAgaWYgKGNvbW1hbmQgPT0gJ3wnKSB7XG4gICAgICAgIGxldCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSAnVE1Db21tYW5kRGl2aWRlcic7XG4gICAgICAgIHRoaXMuZS5hcHBlbmRDaGlsZChlbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY29tbWFuZE5hbWU7XG4gICAgICAgIGlmICh0eXBlb2YgY29tbWFuZCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgLy8gUmVmZXJlbmNlIHRvIGRlZmF1bHQgY29tbWFuZFxuXG4gICAgICAgICAgaWYgKERlZmF1bHRDb21tYW5kc1tjb21tYW5kXSkge1xuICAgICAgICAgICAgY29tbWFuZE5hbWUgPSBjb21tYW5kO1xuICAgICAgICAgICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSBEZWZhdWx0Q29tbWFuZHNbY29tbWFuZE5hbWVdO1xuXG4gICAgICAgICAgICBcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIFxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb21tYW5kID09IFwib2JqZWN0XCIgJiYgY29tbWFuZC5uYW1lKSB7XG4gICAgICAgICAgY29tbWFuZE5hbWUgPSBjb21tYW5kLm5hbWU7XG4gICAgICAgICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSB7fTsgXG4gICAgICAgICAgaWYgKERlZmF1bHRDb21tYW5kc1tjb21tYW5kTmFtZV0pIE9iamVjdC5hc3NpZ24odGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0sIERlZmF1bHRDb21tYW5kc1tjb21tYW5kTmFtZV0pO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0sIGNvbW1hbmQpO1xuICAgICAgICBcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHRpdGxlID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0udGl0bGUgfHwgY29tbWFuZE5hbWU7XG5cbiAgICAgICAgaWYgKHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmhvdGtleSkge1xuICAgICAgICAgIGNvbnN0IGtleXMgPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXS5ob3RrZXkuc3BsaXQoJy0nKTtcbiAgICAgICAgICAvLyBjb25zdHJ1Y3QgbW9kaWZpZXJzXG4gICAgICAgICAgbGV0IG1vZGlmaWVycyA9IFtdO1xuICAgICAgICAgIGxldCBtb2RpZmllcmV4cGxhbmF0aW9uID0gW107XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgc3dpdGNoIChrZXlzW2ldKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ0N0cmwnOiBtb2RpZmllcnMucHVzaCgnY3RybEtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ0N0cmwnKTsgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ0NtZCc6IG1vZGlmaWVycy5wdXNoKCdtZXRhS2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oyYJyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdBbHQnOiBtb2RpZmllcnMucHVzaCgnYWx0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgnQWx0Jyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdPcHRpb24nOiBtb2RpZmllcnMucHVzaCgnYWx0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oylJyk7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdXaW4nOiBtb2RpZmllcnMucHVzaCgnbWV0YUtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ+KKniBXaW4nKTsgYnJlYWs7XG5cbiAgICAgICAgICAgICAgY2FzZSAnU2hpZnQnOiAgbW9kaWZpZXJzLnB1c2goJ3NoaWZ0S2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oenJyk7IGJyZWFrO1xuXG4gICAgICAgICAgICAgIGNhc2UgJ01vZCc6IC8vIE1vZCBpcyBhIGNvbnZlbmllbmNlIG1lY2hhbmlzbTogQ3RybCBvbiBXaW5kb3dzLCBDbWQgb24gTWFjXG4gICAgICAgICAgICAgICAgaWYgKGlzTWFjTGlrZSkge21vZGlmaWVycy5wdXNoKCdtZXRhS2V5Jyk7IG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgn4oyYJyk7fSBcbiAgICAgICAgICAgICAgICBlbHNlIHttb2RpZmllcnMucHVzaCgnY3RybEtleScpOyBtb2RpZmllcmV4cGxhbmF0aW9uLnB1c2goJ0N0cmwnKTt9IFxuICAgICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgICAgY2FzZSAnTW9kMic6IFxuICAgICAgICAgICAgICAgIG1vZGlmaWVycy5wdXNoKCdhbHRLZXknKTsgXG4gICAgICAgICAgICAgICAgaWYgKGlzTWFjTGlrZSkgbW9kaWZpZXJleHBsYW5hdGlvbi5wdXNoKCfijKUnKTtcbiAgICAgICAgICAgICAgICBlbHNlIG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaCgnQWx0Jyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIE1vZDIgaXMgYSBjb252ZW5pZW5jZSBtZWNoYW5pc206IEFsdCBvbiBXaW5kb3dzLCBPcHRpb24gb24gTWFjXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIG1vZGlmaWVyZXhwbGFuYXRpb24ucHVzaChrZXlzW2tleXMubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgIGxldCBob3RrZXkgPSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1vZGlmaWVyczogbW9kaWZpZXJzLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZE5hbWUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICAvLyBUT0RPIFJpZ2h0IG5vdyB0aGlzIGlzIHdvcmtpbmcgb25seSBmb3IgbGV0dGVycyBhbmQgbnVtYmVyc1xuICAgICAgICAgIGlmIChrZXlzW2tleXMubGVuZ3RoIC0gMV0ubWF0Y2goL15bMC05XSQvKSkge1xuICAgICAgICAgICAgaG90a2V5LmNvZGUgPSBgRGlnaXQke2tleXNba2V5cy5sZW5ndGggLSAxXX1gO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBob3RrZXkua2V5ID0ga2V5c1trZXlzLmxlbmd0aCAtIDFdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuaG90a2V5cy5wdXNoKGhvdGtleSk7XG4gICAgICAgICAgdGl0bGUgPSB0aXRsZS5jb25jYXQoYCAoJHttb2RpZmllcmV4cGxhbmF0aW9uLmpvaW4oJysnKX0pYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZE5hbWVdID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uY2xhc3NOYW1lID0gJ1RNQ29tbWFuZEJ1dHRvbiBUTUNvbW1hbmRCdXR0b25fRGlzYWJsZWQnO1xuICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZE5hbWVdLnRpdGxlID0gdGl0bGU7XG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uaW5uZXJIVE1MID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0uaW5uZXJIVE1MO1xuXG4gICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKGUpID0+IHRoaXMuaGFuZGxlQ2xpY2soY29tbWFuZE5hbWUsIGUpKTtcbiAgICAgICAgdGhpcy5lLmFwcGVuZENoaWxkKHRoaXMuYnV0dG9uc1tjb21tYW5kTmFtZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZSk7XG4gIH1cblxuICBoYW5kbGVDbGljayhjb21tYW5kTmFtZSwgZXZlbnQpIHtcbiAgICBpZiAoIXRoaXMuZWRpdG9yKSByZXR1cm47XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodHlwZW9mIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbiA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtjb21tYW5kTmFtZV0gPT09IGZhbHNlKSB0aGlzLmVkaXRvci5zZXRDb21tYW5kU3RhdGUoY29tbWFuZE5hbWUsIHRydWUpO1xuICAgICAgZWxzZSB0aGlzLmVkaXRvci5zZXRDb21tYW5kU3RhdGUoY29tbWFuZE5hbWUsIGZhbHNlKTsgIFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbiA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdLmFjdGlvbih0aGlzLmVkaXRvcik7XG4gICAgfVxuICB9XG5cbiAgc2V0RWRpdG9yKGVkaXRvcikge1xuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgIGVkaXRvci5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3Rpb24nLCAoZSkgPT4gdGhpcy5oYW5kbGVTZWxlY3Rpb24oZSkpO1xuICB9XG5cbiAgaGFuZGxlU2VsZWN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNvbW1hbmRTdGF0ZSkge1xuICAgICAgZm9yIChsZXQgY29tbWFuZCBpbiB0aGlzLmNvbW1hbmRzKSB7XG4gICAgICAgIGlmIChldmVudC5jb21tYW5kU3RhdGVbY29tbWFuZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICh0aGlzLmNvbW1hbmRzW2NvbW1hbmRdLmVuYWJsZWQpIHRoaXMuc3RhdGVbY29tbWFuZF0gPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmRdLmVuYWJsZWQodGhpcy5lZGl0b3IsIGV2ZW50LmZvY3VzLCBldmVudC5hbmNob3IpO1xuICAgICAgICAgIGVsc2UgdGhpcy5zdGF0ZVtjb21tYW5kXSA9IGV2ZW50LmZvY3VzID8gZmFsc2UgOiBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3RhdGVbY29tbWFuZF0gPSBldmVudC5jb21tYW5kU3RhdGVbY29tbWFuZF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0ZVtjb21tYW5kXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuYnV0dG9uc1tjb21tYW5kXS5jbGFzc05hbWUgPSAnVE1Db21tYW5kQnV0dG9uIFRNQ29tbWFuZEJ1dHRvbl9BY3RpdmUnO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGVbY29tbWFuZF0gPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5idXR0b25zW2NvbW1hbmRdLmNsYXNzTmFtZSA9ICdUTUNvbW1hbmRCdXR0b24gVE1Db21tYW5kQnV0dG9uX0luYWN0aXZlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmJ1dHRvbnNbY29tbWFuZF0uY2xhc3NOYW1lID0gICdUTUNvbW1hbmRCdXR0b24gVE1Db21tYW5kQnV0dG9uX0Rpc2FibGVkJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleWRvd24oZXZlbnQpIHtcbiAgICBvdXRlcjogZm9yIChsZXQgaG90a2V5IG9mIHRoaXMuaG90a2V5cykge1xuICAgICAgaWYgKChob3RrZXkua2V5ICYmIGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpID09IGhvdGtleS5rZXkpIHx8IChob3RrZXkuY29kZSAmJiBldmVudC5jb2RlID09IGhvdGtleS5jb2RlKSkge1xuICAgICAgICAvLyBLZXkgbWF0Y2hlcyBob3RrZXkuIExvb2sgZm9yIGFueSByZXF1aXJlZCBtb2RpZmllciB0aGF0IHdhc24ndCBwcmVzc2VkXG4gICAgICAgIGZvciAobGV0IG1vZGlmaWVyIG9mIGhvdGtleS5tb2RpZmllcnMpIHtcbiAgICAgICAgICBpZiAoIWV2ZW50W21vZGlmaWVyXSkgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRXZlcnl0aGluZyBtYXRjaGVzLlxuICAgICAgICB0aGlzLmhhbmRsZUNsaWNrKGhvdGtleS5jb21tYW5kLCBldmVudCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tbWFuZEJhcjsiLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgb2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cycpO1xuXG4vLyBgT2JqZWN0LmRlZmluZVByb3BlcnRpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbm1vZHVsZS5leHBvcnRzID0gREVTQ1JJUFRPUlMgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsZW5ndGggPiBpbmRleCkgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihPLCBrZXkgPSBrZXlzW2luZGV4KytdLCBQcm9wZXJ0aWVzW2tleV0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRCdWlsdEluKCdkb2N1bWVudCcsICdkb2N1bWVudEVsZW1lbnQnKTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcblxudmFyIEdUID0gJz4nO1xudmFyIExUID0gJzwnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFNDUklQVCA9ICdzY3JpcHQnO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcblxudmFyIHNjcmlwdFRhZyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIHJldHVybiBMVCArIFNDUklQVCArIEdUICsgY29udGVudCArIExUICsgJy8nICsgU0NSSVBUICsgR1Q7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgQWN0aXZlWCBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVggPSBmdW5jdGlvbiAoYWN0aXZlWERvY3VtZW50KSB7XG4gIGFjdGl2ZVhEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJycpKTtcbiAgYWN0aXZlWERvY3VtZW50LmNsb3NlKCk7XG4gIHZhciB0ZW1wID0gYWN0aXZlWERvY3VtZW50LnBhcmVudFdpbmRvdy5PYmplY3Q7XG4gIGFjdGl2ZVhEb2N1bWVudCA9IG51bGw7IC8vIGF2b2lkIG1lbW9yeSBsZWFrXG4gIHJldHVybiB0ZW1wO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBKUyA9ICdqYXZhJyArIFNDUklQVCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvNDc1XG4gIGlmcmFtZS5zcmMgPSBTdHJpbmcoSlMpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnZG9jdW1lbnQuRj1PYmplY3QnKSk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIHJldHVybiBpZnJhbWVEb2N1bWVudC5GO1xufTtcblxuLy8gQ2hlY2sgZm9yIGRvY3VtZW50LmRvbWFpbiBhbmQgYWN0aXZlIHggc3VwcG9ydFxuLy8gTm8gbmVlZCB0byB1c2UgYWN0aXZlIHggYXBwcm9hY2ggd2hlbiBkb2N1bWVudC5kb21haW4gaXMgbm90IHNldFxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTUwXG4vLyB2YXJpYXRpb24gb2YgaHR0cHM6Ly9naXRodWIuY29tL2tpdGNhbWJyaWRnZS9lczUtc2hpbS9jb21taXQvNGY3MzhhYzA2NjM0NlxuLy8gYXZvaWQgSUUgR0MgYnVnXG52YXIgYWN0aXZlWERvY3VtZW50O1xudmFyIE51bGxQcm90b09iamVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAqL1xuICAgIGFjdGl2ZVhEb2N1bWVudCA9IGRvY3VtZW50LmRvbWFpbiAmJiBuZXcgQWN0aXZlWE9iamVjdCgnaHRtbGZpbGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogaWdub3JlICovIH1cbiAgTnVsbFByb3RvT2JqZWN0ID0gYWN0aXZlWERvY3VtZW50ID8gTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpIDogTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lKCk7XG4gIHZhciBsZW5ndGggPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkgZGVsZXRlIE51bGxQcm90b09iamVjdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2xlbmd0aF1dO1xuICByZXR1cm4gTnVsbFByb3RvT2JqZWN0KCk7XG59O1xuXG5oaWRkZW5LZXlzW0lFX1BST1RPXSA9IHRydWU7XG5cbi8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5jcmVhdGVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eUNvbnN0cnVjdG9yKCk7XG4gICAgRW1wdHlDb25zdHJ1Y3RvcltQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBOdWxsUHJvdG9PYmplY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1jcmVhdGUnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG5cbnZhciBVTlNDT1BBQkxFUyA9IHdlbGxLbm93blN5bWJvbCgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUtQEB1bnNjb3BhYmxlc1xuaWYgKEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHtcbiAgZGVmaW5lUHJvcGVydHlNb2R1bGUuZihBcnJheVByb3RvdHlwZSwgVU5TQ09QQUJMRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgdmFsdWU6IGNyZWF0ZShudWxsKVxuICB9KTtcbn1cblxuLy8gYWRkIGEga2V5IHRvIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG90eXBlW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIGNhY2hlID0ge307XG5cbnZhciB0aHJvd2VyID0gZnVuY3Rpb24gKGl0KSB7IHRocm93IGl0OyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSwgb3B0aW9ucykge1xuICBpZiAoaGFzKGNhY2hlLCBNRVRIT0RfTkFNRSkpIHJldHVybiBjYWNoZVtNRVRIT0RfTkFNRV07XG4gIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICB2YXIgQUNDRVNTT1JTID0gaGFzKG9wdGlvbnMsICdBQ0NFU1NPUlMnKSA/IG9wdGlvbnMuQUNDRVNTT1JTIDogZmFsc2U7XG4gIHZhciBhcmd1bWVudDAgPSBoYXMob3B0aW9ucywgMCkgPyBvcHRpb25zWzBdIDogdGhyb3dlcjtcbiAgdmFyIGFyZ3VtZW50MSA9IGhhcyhvcHRpb25zLCAxKSA/IG9wdGlvbnNbMV0gOiB1bmRlZmluZWQ7XG5cbiAgcmV0dXJuIGNhY2hlW01FVEhPRF9OQU1FXSA9ICEhbWV0aG9kICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgaWYgKEFDQ0VTU09SUyAmJiAhREVTQ1JJUFRPUlMpIHJldHVybiB0cnVlO1xuICAgIHZhciBPID0geyBsZW5ndGg6IC0xIH07XG5cbiAgICBpZiAoQUNDRVNTT1JTKSBkZWZpbmVQcm9wZXJ0eShPLCAxLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogdGhyb3dlciB9KTtcbiAgICBlbHNlIE9bMV0gPSAxO1xuXG4gICAgbWV0aG9kLmNhbGwoTywgYXJndW1lbnQwLCBhcmd1bWVudDEpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkaW5jbHVkZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmNsdWRlcztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FkZC10by11bnNjb3BhYmxlcycpO1xudmFyIGFycmF5TWV0aG9kVXNlc1RvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC11c2VzLXRvLWxlbmd0aCcpO1xuXG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnaW5kZXhPZicsIHsgQUNDRVNTT1JTOiB0cnVlLCAxOiAwIH0pO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKGVsIC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiAkaW5jbHVkZXModGhpcywgZWwsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS1AQHVuc2NvcGFibGVzXG5hZGRUb1Vuc2NvcGFibGVzKCdpbmNsdWRlcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBhcnJheVNwZWNpZXNDcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHknKTtcbnZhciBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LW1ldGhvZC1oYXMtc3BlY2llcy1zdXBwb3J0Jyk7XG52YXIgYXJyYXlNZXRob2RVc2VzVG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLXVzZXMtdG8tbGVuZ3RoJyk7XG5cbnZhciBIQVNfU1BFQ0lFU19TVVBQT1JUID0gYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCgnc3BsaWNlJyk7XG52YXIgVVNFU19UT19MRU5HVEggPSBhcnJheU1ldGhvZFVzZXNUb0xlbmd0aCgnc3BsaWNlJywgeyBBQ0NFU1NPUlM6IHRydWUsIDA6IDAsIDE6IDIgfSk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gMHgxRkZGRkZGRkZGRkZGRjtcbnZhciBNQVhJTVVNX0FMTE9XRURfTEVOR1RIX0VYQ0VFREVEID0gJ01heGltdW0gYWxsb3dlZCBsZW5ndGggZXhjZWVkZWQnO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnNwbGljZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc3BsaWNlXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfHwgIVVTRVNfVE9fTEVOR1RIIH0sIHtcbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50IC8qICwgLi4uaXRlbXMgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGFjdHVhbFN0YXJ0ID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW4pO1xuICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpbnNlcnRDb3VudCwgYWN0dWFsRGVsZXRlQ291bnQsIEEsIGssIGZyb20sIHRvO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPT09IDApIHtcbiAgICAgIGluc2VydENvdW50ID0gYWN0dWFsRGVsZXRlQ291bnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAxKSB7XG4gICAgICBpbnNlcnRDb3VudCA9IDA7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IGxlbiAtIGFjdHVhbFN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRDb3VudCA9IGFyZ3VtZW50c0xlbmd0aCAtIDI7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IG1pbihtYXgodG9JbnRlZ2VyKGRlbGV0ZUNvdW50KSwgMCksIGxlbiAtIGFjdHVhbFN0YXJ0KTtcbiAgICB9XG4gICAgaWYgKGxlbiArIGluc2VydENvdW50IC0gYWN0dWFsRGVsZXRlQ291bnQgPiBNQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCk7XG4gICAgfVxuICAgIEEgPSBhcnJheVNwZWNpZXNDcmVhdGUoTywgYWN0dWFsRGVsZXRlQ291bnQpO1xuICAgIGZvciAoayA9IDA7IGsgPCBhY3R1YWxEZWxldGVDb3VudDsgaysrKSB7XG4gICAgICBmcm9tID0gYWN0dWFsU3RhcnQgKyBrO1xuICAgICAgaWYgKGZyb20gaW4gTykgY3JlYXRlUHJvcGVydHkoQSwgaywgT1tmcm9tXSk7XG4gICAgfVxuICAgIEEubGVuZ3RoID0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgaWYgKGluc2VydENvdW50IDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgIGZvciAoayA9IGFjdHVhbFN0YXJ0OyBrIDwgbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsrKykge1xuICAgICAgICBmcm9tID0gayArIGFjdHVhbERlbGV0ZUNvdW50O1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudDtcbiAgICAgICAgaWYgKGZyb20gaW4gTykgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIH1cbiAgICAgIGZvciAoayA9IGxlbjsgayA+IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7IGstLSkgZGVsZXRlIE9bayAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaW5zZXJ0Q291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgZm9yIChrID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsgPiBhY3R1YWxTdGFydDsgay0tKSB7XG4gICAgICAgIGZyb20gPSBrICsgYWN0dWFsRGVsZXRlQ291bnQgLSAxO1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudCAtIDE7XG4gICAgICAgIGlmIChmcm9tIGluIE8pIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoayA9IDA7IGsgPCBpbnNlcnRDb3VudDsgaysrKSB7XG4gICAgICBPW2sgKyBhY3R1YWxTdGFydF0gPSBhcmd1bWVudHNbayArIDJdO1xuICAgIH1cbiAgICBPLmxlbmd0aCA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xuIiwidmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXJlZ2V4cCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXNSZWdFeHAoaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiVGhlIG1ldGhvZCBkb2Vzbid0IGFjY2VwdCByZWd1bGFyIGV4cHJlc3Npb25zXCIpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgdmFyIHJlZ2V4cCA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICByZWdleHBbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gJy8uLydbTUVUSE9EX05BTUVdKHJlZ2V4cCk7XG4gICAgfSBjYXRjaCAoZikgeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIG5vdEFSZWdFeHAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbm90LWEtcmVnZXhwJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciBjb3JyZWN0SXNSZWdFeHBMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LWlzLXJlZ2V4cC1sb2dpYycpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmluY2x1ZGVzXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogIWNvcnJlY3RJc1JlZ0V4cExvZ2ljKCdpbmNsdWRlcycpIH0sIHtcbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHJldHVybiAhIX5TdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKSlcbiAgICAgIC5pbmRleE9mKG5vdEFSZWdFeHAoc2VhcmNoU3RyaW5nKSwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmaXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MUyA9IC9cXCQoWyQmJ2BdfFxcZFxcZD98PFtePl0qPikvZztcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCA9IC9cXCQoWyQmJ2BdfFxcZFxcZD8pL2c7XG5cbnZhciBtYXliZVRvU3RyaW5nID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gaXQgOiBTdHJpbmcoaXQpO1xufTtcblxuLy8gQEByZXBsYWNlIGxvZ2ljXG5maXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYygncmVwbGFjZScsIDIsIGZ1bmN0aW9uIChSRVBMQUNFLCBuYXRpdmVSZXBsYWNlLCBtYXliZUNhbGxOYXRpdmUsIHJlYXNvbikge1xuICB2YXIgUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUgPSByZWFzb24uUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkU7XG4gIHZhciBSRVBMQUNFX0tFRVBTXyQwID0gcmVhc29uLlJFUExBQ0VfS0VFUFNfJDA7XG4gIHZhciBVTlNBRkVfU1VCU1RJVFVURSA9IFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID8gJyQnIDogJyQwJztcblxuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUucmVwbGFjZVxuICAgIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIE8gPSByZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHRoaXMpO1xuICAgICAgdmFyIHJlcGxhY2VyID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgICByZXR1cm4gcmVwbGFjZXIgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHJlcGxhY2VyLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgICAgOiBuYXRpdmVSZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEByZXBsYWNlXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICBpZiAoXG4gICAgICAgICghUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUgJiYgUkVQTEFDRV9LRUVQU18kMCkgfHxcbiAgICAgICAgKHR5cGVvZiByZXBsYWNlVmFsdWUgPT09ICdzdHJpbmcnICYmIHJlcGxhY2VWYWx1ZS5pbmRleE9mKFVOU0FGRV9TVUJTVElUVVRFKSA9PT0gLTEpXG4gICAgICApIHtcbiAgICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVSZXBsYWNlLCByZWdleHAsIHRoaXMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuXG4gICAgICB2YXIgZnVuY3Rpb25hbFJlcGxhY2UgPSB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFmdW5jdGlvbmFsUmVwbGFjZSkgcmVwbGFjZVZhbHVlID0gU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG5cbiAgICAgIHZhciBnbG9iYWwgPSByeC5nbG9iYWw7XG4gICAgICBpZiAoZ2xvYmFsKSB7XG4gICAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSBicmVhaztcblxuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuXG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgYWNjdW11bGF0ZWRSZXN1bHQgPSAnJztcbiAgICAgIHZhciBuZXh0U291cmNlUG9zaXRpb24gPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlc3VsdHNbaV07XG5cbiAgICAgICAgdmFyIG1hdGNoZWQgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gbWF4KG1pbih0b0ludGVnZXIocmVzdWx0LmluZGV4KSwgUy5sZW5ndGgpLCAwKTtcbiAgICAgICAgdmFyIGNhcHR1cmVzID0gW107XG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgZXF1aXZhbGVudCB0b1xuICAgICAgICAvLyAgIGNhcHR1cmVzID0gcmVzdWx0LnNsaWNlKDEpLm1hcChtYXliZVRvU3RyaW5nKVxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIGBuYXRpdmVTbGljZS5jYWxsKHJlc3VsdCwgMSwgcmVzdWx0Lmxlbmd0aClgIChjYWxsZWQgaW5cbiAgICAgICAgLy8gdGhlIHNsaWNlIHBvbHlmaWxsIHdoZW4gc2xpY2luZyBuYXRpdmUgYXJyYXlzKSBcImRvZXNuJ3Qgd29ya1wiIGluIHNhZmFyaSA5IGFuZFxuICAgICAgICAvLyBjYXVzZXMgYSBjcmFzaCAoaHR0cHM6Ly9wYXN0ZWJpbi5jb20vTjIxUXplUUEpIHdoZW4gdHJ5aW5nIHRvIGRlYnVnIGl0LlxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykgY2FwdHVyZXMucHVzaChtYXliZVRvU3RyaW5nKHJlc3VsdFtqXSkpO1xuICAgICAgICB2YXIgbmFtZWRDYXB0dXJlcyA9IHJlc3VsdC5ncm91cHM7XG4gICAgICAgIGlmIChmdW5jdGlvbmFsUmVwbGFjZSkge1xuICAgICAgICAgIHZhciByZXBsYWNlckFyZ3MgPSBbbWF0Y2hlZF0uY29uY2F0KGNhcHR1cmVzLCBwb3NpdGlvbiwgUyk7XG4gICAgICAgICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkgcmVwbGFjZXJBcmdzLnB1c2gobmFtZWRDYXB0dXJlcyk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG5cbiAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0c3Vic3RpdHV0aW9uXG4gIGZ1bmN0aW9uIGdldFN1YnN0aXR1dGlvbihtYXRjaGVkLCBzdHIsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZW1lbnQpIHtcbiAgICB2YXIgdGFpbFBvcyA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgdmFyIG0gPSBjYXB0dXJlcy5sZW5ndGg7XG4gICAgdmFyIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRDtcbiAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuYW1lZENhcHR1cmVzID0gdG9PYmplY3QobmFtZWRDYXB0dXJlcyk7XG4gICAgICBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFM7XG4gICAgfVxuICAgIHJldHVybiBuYXRpdmVSZXBsYWNlLmNhbGwocmVwbGFjZW1lbnQsIHN5bWJvbHMsIGZ1bmN0aW9uIChtYXRjaCwgY2gpIHtcbiAgICAgIHZhciBjYXB0dXJlO1xuICAgICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgICAgY2FzZSAnJCc6IHJldHVybiAnJCc7XG4gICAgICAgIGNhc2UgJyYnOiByZXR1cm4gbWF0Y2hlZDtcbiAgICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICBjYXNlIFwiJ1wiOiByZXR1cm4gc3RyLnNsaWNlKHRhaWxQb3MpO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBcXGRcXGQ/XG4gICAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgICAgaWYgKG4gPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICBpZiAobiA+IG0pIHtcbiAgICAgICAgICAgIHZhciBmID0gZmxvb3IobiAvIDEwKTtcbiAgICAgICAgICAgIGlmIChmID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICBpZiAoZiA8PSBtKSByZXR1cm4gY2FwdHVyZXNbZiAtIDFdID09PSB1bmRlZmluZWQgPyBjaC5jaGFyQXQoMSkgOiBjYXB0dXJlc1tmIC0gMV0gKyBjaC5jaGFyQXQoMSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tuIC0gMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FwdHVyZSA9PT0gdW5kZWZpbmVkID8gJycgOiBjYXB0dXJlO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIi8vIGEgc3RyaW5nIG9mIGFsbCB2YWxpZCB1bmljb2RlIHdoaXRlc3BhY2VzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxubW9kdWxlLmV4cG9ydHMgPSAnXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMERcXHUwMDIwXFx1MDBBMFxcdTE2ODBcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcXHUyMDI5XFx1RkVGRic7XG4iLCJ2YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciB3aGl0ZXNwYWNlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93aGl0ZXNwYWNlcycpO1xuXG52YXIgd2hpdGVzcGFjZSA9ICdbJyArIHdoaXRlc3BhY2VzICsgJ10nO1xudmFyIGx0cmltID0gUmVnRXhwKCdeJyArIHdoaXRlc3BhY2UgKyB3aGl0ZXNwYWNlICsgJyonKTtcbnZhciBydHJpbSA9IFJlZ0V4cCh3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJCcpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW0sIHRyaW1TdGFydCwgdHJpbUVuZCwgdHJpbUxlZnQsIHRyaW1SaWdodCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKFRZUEUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcykge1xuICAgIHZhciBzdHJpbmcgPSBTdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSgkdGhpcykpO1xuICAgIGlmIChUWVBFICYgMSkgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobHRyaW0sICcnKTtcbiAgICBpZiAoVFlQRSAmIDIpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1MZWZ0LCB0cmltU3RhcnQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1zdGFydFxuICBzdGFydDogY3JlYXRlTWV0aG9kKDEpLFxuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1SaWdodCwgdHJpbUVuZCB9YCBtZXRob2RzXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbWVuZFxuICBlbmQ6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUudHJpbWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbVxuICB0cmltOiBjcmVhdGVNZXRob2QoMylcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciB3aGl0ZXNwYWNlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93aGl0ZXNwYWNlcycpO1xuXG52YXIgbm9uID0gJ1xcdTIwMEJcXHUwMDg1XFx1MTgwRSc7XG5cbi8vIGNoZWNrIHRoYXQgYSBtZXRob2Qgd29ya3Mgd2l0aCB0aGUgY29ycmVjdCBsaXN0XG4vLyBvZiB3aGl0ZXNwYWNlcyBhbmQgaGFzIGEgY29ycmVjdCBuYW1lXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICByZXR1cm4gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXdoaXRlc3BhY2VzW01FVEhPRF9OQU1FXSgpIHx8IG5vbltNRVRIT0RfTkFNRV0oKSAhPSBub24gfHwgd2hpdGVzcGFjZXNbTUVUSE9EX05BTUVdLm5hbWUgIT09IE1FVEhPRF9OQU1FO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkdHJpbSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbScpLnRyaW07XG52YXIgZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctdHJpbS1mb3JjZWQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUudHJpbWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1cbiQoeyB0YXJnZXQ6ICdTdHJpbmcnLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBmb3JjZWRTdHJpbmdUcmltTWV0aG9kKCd0cmltJykgfSwge1xuICB0cmltOiBmdW5jdGlvbiB0cmltKCkge1xuICAgIHJldHVybiAkdHJpbSh0aGlzKTtcbiAgfVxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1rZXlzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxudmFyIEZBSUxTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IG5hdGl2ZUtleXMoMSk7IH0pO1xuXG4vLyBgT2JqZWN0LmtleXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtb2JqZWN0LmtleXNcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IEZBSUxTX09OX1BSSU1JVElWRVMgfSwge1xuICBrZXlzOiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXModG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpICYmIGl0ICE9PSBudWxsKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3Qgc2V0IFwiICsgU3RyaW5nKGl0KSArICcgYXMgYSBwcm90b3R5cGUnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGFQb3NzaWJsZVByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLXBvc3NpYmxlLXByb3RvdHlwZScpO1xuXG4vLyBgT2JqZWN0LnNldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLW9iamVjdC5zZXRwcm90b3R5cGVvZlxuLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gZnVuY3Rpb24gKCkge1xuICB2YXIgQ09SUkVDVF9TRVRURVIgPSBmYWxzZTtcbiAgdmFyIHRlc3QgPSB7fTtcbiAgdmFyIHNldHRlcjtcbiAgdHJ5IHtcbiAgICBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgc2V0dGVyLmNhbGwodGVzdCwgW10pO1xuICAgIENPUlJFQ1RfU0VUVEVSID0gdGVzdCBpbnN0YW5jZW9mIEFycmF5O1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgIGFuT2JqZWN0KE8pO1xuICAgIGFQb3NzaWJsZVByb3RvdHlwZShwcm90byk7XG4gICAgaWYgKENPUlJFQ1RfU0VUVEVSKSBzZXR0ZXIuY2FsbChPLCBwcm90byk7XG4gICAgZWxzZSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBPO1xuICB9O1xufSgpIDogdW5kZWZpbmVkKTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZicpO1xuXG4vLyBtYWtlcyBzdWJjbGFzc2luZyB3b3JrIGNvcnJlY3QgZm9yIHdyYXBwZWQgYnVpbHQtaW5zXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdGhpcywgZHVtbXksIFdyYXBwZXIpIHtcbiAgdmFyIE5ld1RhcmdldCwgTmV3VGFyZ2V0UHJvdG90eXBlO1xuICBpZiAoXG4gICAgLy8gaXQgY2FuIHdvcmsgb25seSB3aXRoIG5hdGl2ZSBgc2V0UHJvdG90eXBlT2ZgXG4gICAgc2V0UHJvdG90eXBlT2YgJiZcbiAgICAvLyB3ZSBoYXZlbid0IGNvbXBsZXRlbHkgY29ycmVjdCBwcmUtRVM2IHdheSBmb3IgZ2V0dGluZyBgbmV3LnRhcmdldGAsIHNvIHVzZSB0aGlzXG4gICAgdHlwZW9mIChOZXdUYXJnZXQgPSBkdW1teS5jb25zdHJ1Y3RvcikgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIE5ld1RhcmdldCAhPT0gV3JhcHBlciAmJlxuICAgIGlzT2JqZWN0KE5ld1RhcmdldFByb3RvdHlwZSA9IE5ld1RhcmdldC5wcm90b3R5cGUpICYmXG4gICAgTmV3VGFyZ2V0UHJvdG90eXBlICE9PSBXcmFwcGVyLnByb3RvdHlwZVxuICApIHNldFByb3RvdHlwZU9mKCR0aGlzLCBOZXdUYXJnZXRQcm90b3R5cGUpO1xuICByZXR1cm4gJHRoaXM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENPTlNUUlVDVE9SX05BTUUpIHtcbiAgdmFyIENvbnN0cnVjdG9yID0gZ2V0QnVpbHRJbihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgdmFyIGRlZmluZVByb3BlcnR5ID0gZGVmaW5lUHJvcGVydHlNb2R1bGUuZjtcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgQ29uc3RydWN0b3IgJiYgIUNvbnN0cnVjdG9yW1NQRUNJRVNdKSB7XG4gICAgZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFNQRUNJRVMsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICAgIH0pO1xuICB9XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5JykuZjtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJykuZjtcbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1yZWdleHAnKTtcbnZhciBnZXRGbGFncyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZmxhZ3MnKTtcbnZhciBzdGlja3lIZWxwZXJzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1zdGlja3ktaGVscGVycycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBzZXRJbnRlcm5hbFN0YXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJykuc2V0O1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LXNwZWNpZXMnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIE1BVENIID0gd2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xudmFyIE5hdGl2ZVJlZ0V4cCA9IGdsb2JhbC5SZWdFeHA7XG52YXIgUmVnRXhwUHJvdG90eXBlID0gTmF0aXZlUmVnRXhwLnByb3RvdHlwZTtcbnZhciByZTEgPSAvYS9nO1xudmFyIHJlMiA9IC9hL2c7XG5cbi8vIFwibmV3XCIgc2hvdWxkIGNyZWF0ZSBhIG5ldyBvYmplY3QsIG9sZCB3ZWJraXQgYnVnXG52YXIgQ09SUkVDVF9ORVcgPSBuZXcgTmF0aXZlUmVnRXhwKHJlMSkgIT09IHJlMTtcblxudmFyIFVOU1VQUE9SVEVEX1kgPSBzdGlja3lIZWxwZXJzLlVOU1VQUE9SVEVEX1k7XG5cbnZhciBGT1JDRUQgPSBERVNDUklQVE9SUyAmJiBpc0ZvcmNlZCgnUmVnRXhwJywgKCFDT1JSRUNUX05FVyB8fCBVTlNVUFBPUlRFRF9ZIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgcmUyW01BVENIXSA9IGZhbHNlO1xuICAvLyBSZWdFeHAgY29uc3RydWN0b3IgY2FuIGFsdGVyIGZsYWdzIGFuZCBJc1JlZ0V4cCB3b3JrcyBjb3JyZWN0IHdpdGggQEBtYXRjaFxuICByZXR1cm4gTmF0aXZlUmVnRXhwKHJlMSkgIT0gcmUxIHx8IE5hdGl2ZVJlZ0V4cChyZTIpID09IHJlMiB8fCBOYXRpdmVSZWdFeHAocmUxLCAnaScpICE9ICcvYS9pJztcbn0pKSk7XG5cbi8vIGBSZWdFeHBgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAtY29uc3RydWN0b3JcbmlmIChGT1JDRUQpIHtcbiAgdmFyIFJlZ0V4cFdyYXBwZXIgPSBmdW5jdGlvbiBSZWdFeHAocGF0dGVybiwgZmxhZ3MpIHtcbiAgICB2YXIgdGhpc0lzUmVnRXhwID0gdGhpcyBpbnN0YW5jZW9mIFJlZ0V4cFdyYXBwZXI7XG4gICAgdmFyIHBhdHRlcm5Jc1JlZ0V4cCA9IGlzUmVnRXhwKHBhdHRlcm4pO1xuICAgIHZhciBmbGFnc0FyZVVuZGVmaW5lZCA9IGZsYWdzID09PSB1bmRlZmluZWQ7XG4gICAgdmFyIHN0aWNreTtcblxuICAgIGlmICghdGhpc0lzUmVnRXhwICYmIHBhdHRlcm5Jc1JlZ0V4cCAmJiBwYXR0ZXJuLmNvbnN0cnVjdG9yID09PSBSZWdFeHBXcmFwcGVyICYmIGZsYWdzQXJlVW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9XG5cbiAgICBpZiAoQ09SUkVDVF9ORVcpIHtcbiAgICAgIGlmIChwYXR0ZXJuSXNSZWdFeHAgJiYgIWZsYWdzQXJlVW5kZWZpbmVkKSBwYXR0ZXJuID0gcGF0dGVybi5zb3VyY2U7XG4gICAgfSBlbHNlIGlmIChwYXR0ZXJuIGluc3RhbmNlb2YgUmVnRXhwV3JhcHBlcikge1xuICAgICAgaWYgKGZsYWdzQXJlVW5kZWZpbmVkKSBmbGFncyA9IGdldEZsYWdzLmNhbGwocGF0dGVybik7XG4gICAgICBwYXR0ZXJuID0gcGF0dGVybi5zb3VyY2U7XG4gICAgfVxuXG4gICAgaWYgKFVOU1VQUE9SVEVEX1kpIHtcbiAgICAgIHN0aWNreSA9ICEhZmxhZ3MgJiYgZmxhZ3MuaW5kZXhPZigneScpID4gLTE7XG4gICAgICBpZiAoc3RpY2t5KSBmbGFncyA9IGZsYWdzLnJlcGxhY2UoL3kvZywgJycpO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSBpbmhlcml0SWZSZXF1aXJlZChcbiAgICAgIENPUlJFQ1RfTkVXID8gbmV3IE5hdGl2ZVJlZ0V4cChwYXR0ZXJuLCBmbGFncykgOiBOYXRpdmVSZWdFeHAocGF0dGVybiwgZmxhZ3MpLFxuICAgICAgdGhpc0lzUmVnRXhwID8gdGhpcyA6IFJlZ0V4cFByb3RvdHlwZSxcbiAgICAgIFJlZ0V4cFdyYXBwZXJcbiAgICApO1xuXG4gICAgaWYgKFVOU1VQUE9SVEVEX1kgJiYgc3RpY2t5KSBzZXRJbnRlcm5hbFN0YXRlKHJlc3VsdCwgeyBzdGlja3k6IHN0aWNreSB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBrZXkgaW4gUmVnRXhwV3JhcHBlciB8fCBkZWZpbmVQcm9wZXJ0eShSZWdFeHBXcmFwcGVyLCBrZXksIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gTmF0aXZlUmVnRXhwW2tleV07IH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIChpdCkgeyBOYXRpdmVSZWdFeHBba2V5XSA9IGl0OyB9XG4gICAgfSk7XG4gIH07XG4gIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlOYW1lcyhOYXRpdmVSZWdFeHApO1xuICB2YXIgaW5kZXggPSAwO1xuICB3aGlsZSAoa2V5cy5sZW5ndGggPiBpbmRleCkgcHJveHkoa2V5c1tpbmRleCsrXSk7XG4gIFJlZ0V4cFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlZ0V4cFdyYXBwZXI7XG4gIFJlZ0V4cFdyYXBwZXIucHJvdG90eXBlID0gUmVnRXhwUHJvdG90eXBlO1xuICByZWRlZmluZShnbG9iYWwsICdSZWdFeHAnLCBSZWdFeHBXcmFwcGVyKTtcbn1cblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC1AQHNwZWNpZXNcbnNldFNwZWNpZXMoJ1JlZ0V4cCcpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgb2JqZWN0RGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIHJlZ0V4cEZsYWdzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1mbGFncycpO1xudmFyIFVOU1VQUE9SVEVEX1kgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLXN0aWNreS1oZWxwZXJzJykuVU5TVVBQT1JURURfWTtcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NgIGdldHRlclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC5wcm90b3R5cGUuZmxhZ3NcbmlmIChERVNDUklQVE9SUyAmJiAoLy4vZy5mbGFncyAhPSAnZycgfHwgVU5TVVBQT1JURURfWSkpIHtcbiAgb2JqZWN0RGVmaW5lUHJvcGVydHlNb2R1bGUuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogcmVnRXhwRmxhZ3NcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGZsYWdzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1mbGFncycpO1xuXG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBSZWdFeHBQcm90b3R5cGUgPSBSZWdFeHAucHJvdG90eXBlO1xudmFyIG5hdGl2ZVRvU3RyaW5nID0gUmVnRXhwUHJvdG90eXBlW1RPX1NUUklOR107XG5cbnZhciBOT1RfR0VORVJJQyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5hdGl2ZVRvU3RyaW5nLmNhbGwoeyBzb3VyY2U6ICdhJywgZmxhZ3M6ICdiJyB9KSAhPSAnL2EvYic7IH0pO1xuLy8gRkY0NC0gUmVnRXhwI3RvU3RyaW5nIGhhcyBhIHdyb25nIG5hbWVcbnZhciBJTkNPUlJFQ1RfTkFNRSA9IG5hdGl2ZVRvU3RyaW5nLm5hbWUgIT0gVE9fU1RSSU5HO1xuXG4vLyBgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG5pZiAoTk9UX0dFTkVSSUMgfHwgSU5DT1JSRUNUX05BTUUpIHtcbiAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHZhciBwID0gU3RyaW5nKFIuc291cmNlKTtcbiAgICB2YXIgcmYgPSBSLmZsYWdzO1xuICAgIHZhciBmID0gU3RyaW5nKHJmID09PSB1bmRlZmluZWQgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiAhKCdmbGFncycgaW4gUmVnRXhwUHJvdG90eXBlKSA/IGZsYWdzLmNhbGwoUikgOiByZik7XG4gICAgcmV0dXJuICcvJyArIHAgKyAnLycgKyBmO1xuICB9LCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cbiIsIi8vIGNvbnN0IHJlcGxhY2VtZW50cyA9IHtcbi8vICAgQVNDSUlQdW5jdHVhdGlvbjogJyFcIiMkJSZcXCcoKSorLFxcXFwtLi86Ozw9Pj9AXFxcXFtcXFxcXV5fYHt8fX4nLFxuLy8gICBUcmlnZ2VyQ2hhcnM6ICdgX1xcKlxcW1xcXVxcKFxcKScsXG4vLyAgIFNjaGVtZTogYFtBLVphLXpdW0EtWmEtejAtOVxcK1xcLlxcLV17MSwzMX1gLFxuLy8gICBFbWFpbDogYFthLXpBLVowLTkuISMkJSYnKisvPT9eX1xcYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFxcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKmAsIC8vIEZyb20gQ29tbW9uTWFyayBzcGVjXG5cbi8vIH1cbmNvbnN0IHJlcGxhY2VtZW50cyA9IHtcbiAgQVNDSUlQdW5jdHVhdGlvbjogL1shXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXV5fYHt8fX5cXFxcXS8sICBcbiAgTm90VHJpZ2dlckNoYXI6IC9bXmBfKltcXF0oKTw+IX5dLyxcbiAgU2NoZW1lOiAvW0EtWmEtel1bQS1aYS16MC05Ky4tXXsxLDMxfS8sXG4gIEVtYWlsOiAvW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSovLCAvLyBGcm9tIENvbW1vbk1hcmsgc3BlY1xuICBIVE1MT3BlblRhZzogLzxIVE1MVGFnTmFtZSg/OkhUTUxBdHRyaWJ1dGUpKlxccypcXC8/Pi8sXG4gIEhUTUxDbG9zZVRhZzogLzxcXC9IVE1MVGFnTmFtZVxccyo+LyxcbiAgSFRNTFRhZ05hbWU6IC9bQS1aYS16XVtBLVphLXowLTktXSovLCBcbiAgSFRNTENvbW1lbnQ6IC88IS0tKD86W14+LV18KD86W14+LV0oPzpbXi1dfC1bXi1dKSpbXi1dKSktLT4vLFxuICBIVE1MUEk6IC88XFw/KD86fC58KD86W14/XXxcXD9bXj5dKSopXFw/Pi8sXG4gIEhUTUxEZWNsYXJhdGlvbjogLzwhW0EtWl0rXFxzW14+XSo+LyxcbiAgSFRNTENEQVRBOiAvPCFcXFtDREFUQVxcWy4qP1xcXVxcXT4vLFxuICBIVE1MQXR0cmlidXRlOiAvXFxzK1tBLVphLXpfOl1bQS1aYS16MC05Xy46LV0qKD86SFRNTEF0dFZhbHVlKT8vLFxuICBIVE1MQXR0VmFsdWU6IC9cXHMqPVxccyooPzooPzonW14nXSonKXwoPzpcIlteXCJdKlwiKXwoPzpbXlxcc1wiJz08PmBdKykpLyxcbiAgS25vd25UYWc6IC9hZGRyZXNzfGFydGljbGV8YXNpZGV8YmFzZXxiYXNlZm9udHxibG9ja3F1b3RlfGJvZHl8Y2FwdGlvbnxjZW50ZXJ8Y29sfGNvbGdyb3VwfGRkfGRldGFpbHN8ZGlhbG9nfGRpcnxkaXZ8ZGx8ZHR8ZmllbGRzZXR8ZmlnY2FwdGlvbnxmaWd1cmV8Zm9vdGVyfGZvcm18ZnJhbWV8ZnJhbWVzZXR8aDF8aDJ8aDN8aDR8aDV8aDZ8aGVhZHxoZWFkZXJ8aHJ8aHRtbHxpZnJhbWV8bGVnZW5kfGxpfGxpbmt8bWFpbnxtZW51fG1lbnVpdGVtfG5hdnxub2ZyYW1lc3xvbHxvcHRncm91cHxvcHRpb258cHxwYXJhbXxzZWN0aW9ufHNvdXJjZXxzdW1tYXJ5fHRhYmxlfHRib2R5fHRkfHRmb290fHRofHRoZWFkfHRpdGxlfHRyfHRyYWNrfHVsL1xufVxuXG4vLyBGcm9tIENvbW1vbk1hcmsuanMuIFxuY29uc3QgcHVuY3R1YXRpb25MZWFkaW5nID0gbmV3IFJlZ0V4cCgvXig/OlshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXVxcXFxeX2B7fH1+XFx4QTFcXHhBN1xceEFCXFx4QjZcXHhCN1xceEJCXFx4QkZcXHUwMzdFXFx1MDM4N1xcdTA1NUEtXFx1MDU1RlxcdTA1ODlcXHUwNThBXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RjNcXHUwNUY0XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRFxcdTA2MUJcXHUwNjFFXFx1MDYxRlxcdTA2NkEtXFx1MDY2RFxcdTA2RDRcXHUwNzAwLVxcdTA3MERcXHUwN0Y3LVxcdTA3RjlcXHUwODMwLVxcdTA4M0VcXHUwODVFXFx1MDk2NFxcdTA5NjVcXHUwOTcwXFx1MEFGMFxcdTBERjRcXHUwRTRGXFx1MEU1QVxcdTBFNUJcXHUwRjA0LVxcdTBGMTJcXHUwRjE0XFx1MEYzQS1cXHUwRjNEXFx1MEY4NVxcdTBGRDAtXFx1MEZENFxcdTBGRDlcXHUwRkRBXFx1MTA0QS1cXHUxMDRGXFx1MTBGQlxcdTEzNjAtXFx1MTM2OFxcdTE0MDBcXHUxNjZEXFx1MTY2RVxcdTE2OUJcXHUxNjlDXFx1MTZFQi1cXHUxNkVEXFx1MTczNVxcdTE3MzZcXHUxN0Q0LVxcdTE3RDZcXHUxN0Q4LVxcdTE3REFcXHUxODAwLVxcdTE4MEFcXHUxOTQ0XFx1MTk0NVxcdTFBMUVcXHUxQTFGXFx1MUFBMC1cXHUxQUE2XFx1MUFBOC1cXHUxQUFEXFx1MUI1QS1cXHUxQjYwXFx1MUJGQy1cXHUxQkZGXFx1MUMzQi1cXHUxQzNGXFx1MUM3RVxcdTFDN0ZcXHUxQ0MwLVxcdTFDQzdcXHUxQ0QzXFx1MjAxMC1cXHUyMDI3XFx1MjAzMC1cXHUyMDQzXFx1MjA0NS1cXHUyMDUxXFx1MjA1My1cXHUyMDVFXFx1MjA3RFxcdTIwN0VcXHUyMDhEXFx1MjA4RVxcdTIzMDgtXFx1MjMwQlxcdTIzMjlcXHUyMzJBXFx1Mjc2OC1cXHUyNzc1XFx1MjdDNVxcdTI3QzZcXHUyN0U2LVxcdTI3RUZcXHUyOTgzLVxcdTI5OThcXHUyOUQ4LVxcdTI5REJcXHUyOUZDXFx1MjlGRFxcdTJDRjktXFx1MkNGQ1xcdTJDRkVcXHUyQ0ZGXFx1MkQ3MFxcdTJFMDAtXFx1MkUyRVxcdTJFMzAtXFx1MkU0MlxcdTMwMDEtXFx1MzAwM1xcdTMwMDgtXFx1MzAxMVxcdTMwMTQtXFx1MzAxRlxcdTMwMzBcXHUzMDNEXFx1MzBBMFxcdTMwRkJcXHVBNEZFXFx1QTRGRlxcdUE2MEQtXFx1QTYwRlxcdUE2NzNcXHVBNjdFXFx1QTZGMi1cXHVBNkY3XFx1QTg3NC1cXHVBODc3XFx1QThDRVxcdUE4Q0ZcXHVBOEY4LVxcdUE4RkFcXHVBOEZDXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM5XFx1RERDRFxcdUREREJcXHVERERELVxcdUREREZcXHVERTM4LVxcdURFM0RcXHVERUE5XXxcXHVEODA1W1xcdURDQzZcXHVEREMxLVxcdURERDdcXHVERTQxLVxcdURFNDNcXHVERjNDLVxcdURGM0VdfFxcdUQ4MDlbXFx1REM3MC1cXHVEQzc0XXxcXHVEODFBW1xcdURFNkVcXHVERTZGXFx1REVGNVxcdURGMzctXFx1REYzQlxcdURGNDRdfFxcdUQ4MkZcXHVEQzlGfFxcdUQ4MzZbXFx1REU4Ny1cXHVERThCXSkvKTtcblxuY29uc3QgcHVuY3R1YXRpb25UcmFpbGluZyA9IG5ldyBSZWdFeHAoLyg/OlshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AW1xcXVxcXFxeX2B7fH1+XFx4QTFcXHhBN1xceEFCXFx4QjZcXHhCN1xceEJCXFx4QkZcXHUwMzdFXFx1MDM4N1xcdTA1NUEtXFx1MDU1RlxcdTA1ODlcXHUwNThBXFx1MDVCRVxcdTA1QzBcXHUwNUMzXFx1MDVDNlxcdTA1RjNcXHUwNUY0XFx1MDYwOVxcdTA2MEFcXHUwNjBDXFx1MDYwRFxcdTA2MUJcXHUwNjFFXFx1MDYxRlxcdTA2NkEtXFx1MDY2RFxcdTA2RDRcXHUwNzAwLVxcdTA3MERcXHUwN0Y3LVxcdTA3RjlcXHUwODMwLVxcdTA4M0VcXHUwODVFXFx1MDk2NFxcdTA5NjVcXHUwOTcwXFx1MEFGMFxcdTBERjRcXHUwRTRGXFx1MEU1QVxcdTBFNUJcXHUwRjA0LVxcdTBGMTJcXHUwRjE0XFx1MEYzQS1cXHUwRjNEXFx1MEY4NVxcdTBGRDAtXFx1MEZENFxcdTBGRDlcXHUwRkRBXFx1MTA0QS1cXHUxMDRGXFx1MTBGQlxcdTEzNjAtXFx1MTM2OFxcdTE0MDBcXHUxNjZEXFx1MTY2RVxcdTE2OUJcXHUxNjlDXFx1MTZFQi1cXHUxNkVEXFx1MTczNVxcdTE3MzZcXHUxN0Q0LVxcdTE3RDZcXHUxN0Q4LVxcdTE3REFcXHUxODAwLVxcdTE4MEFcXHUxOTQ0XFx1MTk0NVxcdTFBMUVcXHUxQTFGXFx1MUFBMC1cXHUxQUE2XFx1MUFBOC1cXHUxQUFEXFx1MUI1QS1cXHUxQjYwXFx1MUJGQy1cXHUxQkZGXFx1MUMzQi1cXHUxQzNGXFx1MUM3RVxcdTFDN0ZcXHUxQ0MwLVxcdTFDQzdcXHUxQ0QzXFx1MjAxMC1cXHUyMDI3XFx1MjAzMC1cXHUyMDQzXFx1MjA0NS1cXHUyMDUxXFx1MjA1My1cXHUyMDVFXFx1MjA3RFxcdTIwN0VcXHUyMDhEXFx1MjA4RVxcdTIzMDgtXFx1MjMwQlxcdTIzMjlcXHUyMzJBXFx1Mjc2OC1cXHUyNzc1XFx1MjdDNVxcdTI3QzZcXHUyN0U2LVxcdTI3RUZcXHUyOTgzLVxcdTI5OThcXHUyOUQ4LVxcdTI5REJcXHUyOUZDXFx1MjlGRFxcdTJDRjktXFx1MkNGQ1xcdTJDRkVcXHUyQ0ZGXFx1MkQ3MFxcdTJFMDAtXFx1MkUyRVxcdTJFMzAtXFx1MkU0MlxcdTMwMDEtXFx1MzAwM1xcdTMwMDgtXFx1MzAxMVxcdTMwMTQtXFx1MzAxRlxcdTMwMzBcXHUzMDNEXFx1MzBBMFxcdTMwRkJcXHVBNEZFXFx1QTRGRlxcdUE2MEQtXFx1QTYwRlxcdUE2NzNcXHVBNjdFXFx1QTZGMi1cXHVBNkY3XFx1QTg3NC1cXHVBODc3XFx1QThDRVxcdUE4Q0ZcXHVBOEY4LVxcdUE4RkFcXHVBOEZDXFx1QTkyRVxcdUE5MkZcXHVBOTVGXFx1QTlDMS1cXHVBOUNEXFx1QTlERVxcdUE5REZcXHVBQTVDLVxcdUFBNUZcXHVBQURFXFx1QUFERlxcdUFBRjBcXHVBQUYxXFx1QUJFQlxcdUZEM0VcXHVGRDNGXFx1RkUxMC1cXHVGRTE5XFx1RkUzMC1cXHVGRTUyXFx1RkU1NC1cXHVGRTYxXFx1RkU2M1xcdUZFNjhcXHVGRTZBXFx1RkU2QlxcdUZGMDEtXFx1RkYwM1xcdUZGMDUtXFx1RkYwQVxcdUZGMEMtXFx1RkYwRlxcdUZGMUFcXHVGRjFCXFx1RkYxRlxcdUZGMjBcXHVGRjNCLVxcdUZGM0RcXHVGRjNGXFx1RkY1QlxcdUZGNURcXHVGRjVGLVxcdUZGNjVdfFxcdUQ4MDBbXFx1REQwMC1cXHVERDAyXFx1REY5RlxcdURGRDBdfFxcdUQ4MDFcXHVERDZGfFxcdUQ4MDJbXFx1REM1N1xcdUREMUZcXHVERDNGXFx1REU1MC1cXHVERTU4XFx1REU3RlxcdURFRjAtXFx1REVGNlxcdURGMzktXFx1REYzRlxcdURGOTktXFx1REY5Q118XFx1RDgwNFtcXHVEQzQ3LVxcdURDNERcXHVEQ0JCXFx1RENCQ1xcdURDQkUtXFx1RENDMVxcdURENDAtXFx1REQ0M1xcdURENzRcXHVERDc1XFx1RERDNS1cXHVEREM5XFx1RERDRFxcdUREREJcXHVERERELVxcdUREREZcXHVERTM4LVxcdURFM0RcXHVERUE5XXxcXHVEODA1W1xcdURDQzZcXHVEREMxLVxcdURERDdcXHVERTQxLVxcdURFNDNcXHVERjNDLVxcdURGM0VdfFxcdUQ4MDlbXFx1REM3MC1cXHVEQzc0XXxcXHVEODFBW1xcdURFNkVcXHVERTZGXFx1REVGNVxcdURGMzctXFx1REYzQlxcdURGNDRdfFxcdUQ4MkZcXHVEQzlGfFxcdUQ4MzZbXFx1REU4Ny1cXHVERThCXSkkLyk7XG5cbi8vIGV4cG9ydCBjb25zdCBpbmxpbmVUcmlnZ2VyQ2hhcnMgPSBuZXcgUmVnRXhwKGBbJHtyZXBsYWNlbWVudHMuVHJpZ2dlckNoYXJzfV1gKTtcblxuLyoqXG4gKiBUaGlzIGlzIENvbW1vbk1hcmsncyBibG9jayBncmFtbWFyLCBidXQgd2UncmUgaWdub3JpbmcgbmVzdGVkIGJsb2NrcyBoZXJlLiAgXG4gKi8gXG5jb25zdCBsaW5lR3JhbW1hciA9IHsgXG4gIFRNSDE6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jXFxzKSguKj8pKCg/OlxccysjK1xccyopPykkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1IMVwiPiQxPC9zcGFuPiQkMjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgxXCI+JDM8L3NwYW4+J1xuICB9LFxuICBUTUgyOiB7IFxuICAgIHJlZ2V4cDogL14oIHswLDN9IyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgyXCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDJcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDM6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUgzXCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDNcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDQ6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyMjXFxzKSguKj8pKCg/OlxccysjK1xccyopPykkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1INFwiPiQxPC9zcGFuPiQkMjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg0XCI+JDM8L3NwYW4+J1xuICB9LFxuICBUTUg1OiB7IFxuICAgIHJlZ2V4cDogL14oIHswLDN9IyMjIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg1XCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDVcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNSDY6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30jIyMjIyNcXHMpKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUg2XCI+JDE8L3NwYW4+JCQyPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSDZcIj4kMzwvc3Bhbj4nXG4gIH0sXG4gIFRNQmxvY2txdW90ZTogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfT5bIF0/KSguKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1CbG9ja3F1b3RlXCI+JDE8L3NwYW4+JCQyJ1xuICB9LFxuICBUTUNvZGVGZW5jZUJhY2t0aWNrT3BlbjogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5gYGBgKilcXHMqKShbXmBdKj8pKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlQmFja3RpY2tcIj4kMTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNSW5mb1N0cmluZ1wiPiQzPC9zcGFuPiQ0J1xuICB9LFxuICBUTUNvZGVGZW5jZVRpbGRlT3BlbjogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5+fn5+KilcXHMqKSguKj8pKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlVGlsZGVcIj4kMTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNSW5mb1N0cmluZ1wiPiQzPC9zcGFuPiQ0J1xuICB9LFxuICBUTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2U6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30oPzxzZXE+YGBgYCopKShcXHMqKSQvLCBcbiAgICByZXBsYWNlbWVudDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVGZW5jZUJhY2t0aWNrXCI+JDE8L3NwYW4+JDMnXG4gIH0sXG4gIFRNQ29kZUZlbmNlVGlsZGVDbG9zZTogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfSg/PHNlcT5+fn5+KikpKFxccyopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQ29kZUZlbmNlVGlsZGVcIj4kMTwvc3Bhbj4kMydcbiAgfSxcbiAgVE1CbGFua0xpbmU6IHsgXG4gICAgcmVnZXhwOiAvXihbIFxcdF0qKSQvLCBcbiAgICByZXBsYWNlbWVudDogJyQwJ1xuICB9LFxuICBUTVNldGV4dEgxTWFya2VyOiB7IFxuICAgIHJlZ2V4cDogL14gezAsM309K1xccyokLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1TZXRleHRIMU1hcmtlclwiPiQwPC9zcGFuPidcbiAgfSxcbiAgVE1TZXRleHRIMk1hcmtlcjogeyBcbiAgICByZWdleHA6IC9eIHswLDN9LStcXHMqJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNU2V0ZXh0SDFNYXJrZXJcIj4kMDwvc3Bhbj4nXG4gIH0sXG4gIFRNSFI6IHsgXG4gICAgcmVnZXhwOiAvXiggezAsM30oXFwqWyBcXHRdKlxcKlsgXFx0XSpcXCpbIFxcdCpdKil8KC1bIFxcdF0qLVsgXFx0XSotWyBcXHQtXSopfChfWyBcXHRdKl9bIFxcdF0qX1sgXFx0X10qKSkkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1IUlwiPiQwPC9zcGFuPidcbiAgfSxcbiAgVE1VTDogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfVsrKi1dIHsxLDR9KSguKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1VTFwiPiQxPC9zcGFuPiQkMidcbiAgfSxcbiAgVE1PTDogeyBcbiAgICByZWdleHA6IC9eKCB7MCwzfVxcZHsxLDl9Wy4pXSB7MSw0fSkoLiopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNT0xcIj4kMTwvc3Bhbj4kJDInXG4gIH0sXG4gIC8vIFRPRE86IFRoaXMgaXMgY3VycmVudGx5IHByZXZlbnRpbmcgc3VibGlzdHMgKGFuZCBhbnkgY29udGVudCB3aXRoaW4gbGlzdCBpdGVtcywgcmVhbGx5KSBmcm9tIHdvcmtpbmdcbiAgVE1JbmRlbnRlZENvZGU6IHsgXG4gICAgcmVnZXhwOiAvXiggezR9fFxcdCkoLiopJC8sIFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNSW5kZW50ZWRDb2RlXCI+JDE8L3NwYW4+JDInXG4gIH0sXG4gIFRNTGlua1JlZmVyZW5jZURlZmluaXRpb246IHtcbiAgICAvLyBUT0RPOiBMaW5rIGRlc3RpbmF0aW9uIGNhbid0IGluY2x1ZGUgdW5iYWxhbmNlZCBwYXJhbnRoZXNlcywgYnV0IHdlIGp1c3QgaWdub3JlIHRoYXQgaGVyZSBcbiAgICByZWdleHA6IC9eKCB7MCwzfVxcW1xccyopKFteXFxzXFxdXSg/OlteXFxdXXxcXFxcXFxdKSo/KShcXHMqXFxdOlxccyopKCg/OlteXFxzPD5dKyl8KD86PCg/OltePD5cXFxcXXxcXFxcLikqPikpPyhcXHMqKSgoPzpcXCgoPzpbXigpXFxcXF18XFxcXC4pKlxcKSl8KD86XCIoPzpbXlwiXFxcXF18XFxcXC4pKlwiKXwoPzonKD86W14nXFxcXF18XFxcXC4pKicpKT8oXFxzKikkLywgXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1MaW5rUmVmZXJlbmNlRGVmaW5pdGlvblwiPiQxPC9zcGFuPjxzcGFuIGNsYXNzPVwiVE1MaW5rTGFiZWwgVE1MaW5rTGFiZWxfRGVmaW5pdGlvblwiPiQyPC9zcGFuPjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUxpbmtSZWZlcmVuY2VEZWZpbml0aW9uXCI+JDM8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTUxpbmtEZXN0aW5hdGlvblwiPiQ0PC9zcGFuPiQ1PHNwYW4gY2xhc3M9XCJUTUxpbmtUaXRsZVwiPiQ2PC9zcGFuPiQ3JyxcbiAgICBsYWJlbFBsYWNlaG9sZGVyOiAyLCAvLyB0aGlzIGRlZmluZXMgd2hpY2ggcGxhY2Vob2xkZXIgaW4gdGhlIGFib3ZlIHJlZ2V4IGlzIHRoZSBsaW5rIFwibGFiZWxcIlxuICB9LFxufTtcblxuLyoqXG4gKiBIVE1MIGJsb2NrcyBoYXZlIG11bHRpcGxlIGRpZmZlcmVudCBjbGFzc2VzIG9mIG9wZW5lciBhbmQgY2xvc2VyLiBUaGlzIGFycmF5IGRlZmluZXMgYWxsIHRoZSBjYXNlc1xuICovXG52YXIgaHRtbEJsb2NrR3JhbW1hciA9IFtcbiAgeyBzdGFydDogL14gezAsM308KD86c2NyaXB0fHByZXxzdHlsZSkoPzpcXHN8PnwkKS9pLCBlbmQ6IC8oPzo8XFwvc2NyaXB0Pnw8XFwvcHJlPnw8XFwvc3R5bGU+KS9pLCBwYXJhSW50ZXJydXB0OiB0cnVlIH0sXG4gIHsgc3RhcnQ6IC9eIHswLDN9PCEtLS8sIGVuZDogLy0tPi8sIHBhcmFJbnRlcnJ1cHQ6IHRydWUgfSxcbiAgeyBzdGFydDogL14gezAsM308XFw/LywgZW5kOiAvXFw/Pi8sIHBhcmFJbnRlcnJ1cHQ6IHRydWUgfSxcbiAgeyBzdGFydDogL14gezAsM308IVtBLVpdLywgZW5kOiAvPi8sIHBhcmFJbnRlcnJ1cHQgOiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM308IVxcW0NEQVRBXFxbLywgZW5kOiAvXFxdXFxdPi8sIHBhcmFJbnRlcnJ1cHQgOiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM30oPzo8fDxcXC8pKD86S25vd25UYWcpKD86XFxzfD58XFwvPnwkKS9pLCBlbmQ6IGZhbHNlLCBwYXJhSW50ZXJydXB0OiB0cnVlfSxcbiAgeyBzdGFydDogL14gezAsM30oPzpIVE1MT3BlblRhZ3xIVE1MQ2xvc2VUYWcpXFxzKiQvLCBlbmQ6IGZhbHNlLCBwYXJhSW50ZXJydXB0OiBmYWxzZX0sXG5dO1xuXG4vKipcbiAqIFN0cnVjdHVyZSBvZiB0aGUgb2JqZWN0OlxuICogVG9wIGxldmVsIGVudHJpZXMgYXJlIHJ1bGVzLCBlYWNoIGNvbnNpc3Rpbmcgb2YgYSByZWd1bGFyIGV4cHJlc3Npb25zIChpbiBzdHJpbmcgZm9ybWF0KSBhcyB3ZWxsIGFzIGEgcmVwbGFjZW1lbnQuXG4gKiBJbiB0aGUgcmVndWxhciBleHByZXNzaW9ucywgcmVwbGFjZW1lbnRzIGZyb20gdGhlIG9iamVjdCAncmVwbGFjZW1lbnRzJyB3aWxsIGJlIHByb2Nlc3NlZCBiZWZvcmUgY29tcGlsaW5nIGludG8gdGhlIHByb3BlcnR5IHJlZ2V4cC5cbiAqL1xudmFyIGlubGluZUdyYW1tYXIgPSB7XG4gIGVzY2FwZSA6IHtcbiAgICByZWdleHA6IC9eXFxcXChBU0NJSVB1bmN0dWF0aW9uKS8sXG4gICAgcmVwbGFjZW1lbnQgOiAnPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNRXNjYXBlXCI+XFxcXDwvc3Bhbj4kMSdcbiAgfSxcbiAgY29kZSA6IHtcbiAgICByZWdleHA6IC9eKGArKSgoPzpbXmBdKXwoPzpbXmBdLio/W15gXSkpKFxcMSkvLFxuICAgIHJlcGxhY2VtZW50IDogJzxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVcIj4kMTwvc3Bhbj48Y29kZSBjbGFzcz1cIlRNQ29kZVwiPiQyPC9jb2RlPjxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya19UTUNvZGVcIj4kMzwvc3Bhbj4nIFxuICB9LFxuICBhdXRvbGluayA6IHtcbiAgICByZWdleHA6IC9ePCgoPzpTY2hlbWU6W15cXHM8Pl0qKXwoPzpFbWFpbCkpPi8sXG4gICAgcmVwbGFjZW1lbnQ6ICc8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfVE1BdXRvbGlua1wiPiZsdDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTUF1dG9saW5rXCI+JDE8L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrX1RNQXV0b2xpbmtcIj4mZ3Q7PC9zcGFuPidcbiAgfSxcbiAgaHRtbCA6IHtcbiAgICByZWdleHA6IC9eKCg/OkhUTUxPcGVuVGFnKXwoPzpIVE1MQ2xvc2VUYWcpfCg/OkhUTUxDb21tZW50KXwoPzpIVE1MUEkpfCg/OkhUTUxEZWNsYXJhdGlvbil8KD86SFRNTENEQVRBKSkvLFxuICAgIHJlcGxhY2VtZW50OiAnPHNwYW4gY2xhc3M9XCJUTUhUTUxcIj4kMTwvc3Bhbj4nLFxuICB9LFxuICBsaW5rT3BlbiA6IHtcbiAgICByZWdleHA6IC9eXFxbLyxcbiAgICByZXBsYWNlbWVudDogJydcbiAgfSxcbiAgaW1hZ2VPcGVuIDoge1xuICAgIHJlZ2V4cDogL14hXFxbLyxcbiAgICByZXBsYWNlbWVudCA6ICcnXG4gIH0sXG4gIGxpbmtMYWJlbCA6IHtcbiAgICByZWdleHA6IC9eKFxcW1xccyopKFteXFxdXSo/KShcXHMqXFxdKS8sXG4gICAgcmVwbGFjZW1lbnQ6ICcnLFxuICAgIGxhYmVsUGxhY2Vob2xkZXI6IDJcbiAgfSxcbiAgZGVmYXVsdCA6IHtcbiAgICByZWdleHA6IC9eKC58KD86Tm90VHJpZ2dlckNoYXIrKSkvLFxuICAgIHJlcGxhY2VtZW50OiAnJDEnXG4gIH1cbn07XG5cbi8vIFByb2Nlc3MgcmVwbGFjZW1lbnRzIGluIHJlZ2V4cHNcbmNvbnN0IHJlcGxhY2VtZW50UmVnZXhwID0gbmV3IFJlZ0V4cChPYmplY3Qua2V5cyhyZXBsYWNlbWVudHMpLmpvaW4oJ3wnKSk7XG5cbi8vIElubGluZVxuY29uc3QgaW5saW5lUnVsZXMgPVsuLi5PYmplY3Qua2V5cyhpbmxpbmVHcmFtbWFyKV07XG5mb3IgKGxldCBydWxlIG9mIGlubGluZVJ1bGVzKSB7XG4gIGxldCByZSA9IGlubGluZUdyYW1tYXJbcnVsZV0ucmVnZXhwLnNvdXJjZTtcbiAgLy8gUmVwbGFjZSB3aGlsZSB0aGVyZSBpcyBzb21ldGhpbmcgdG8gcmVwbGFjZS4gVGhpcyBtZWFucyBpdCBhbHNvIHdvcmtzIG92ZXIgbXVsdGlwbGUgbGV2ZWxzIChyZXBsYWNlbWVudHMgY29udGFpbmluZyByZXBsYWNlbWVudHMpXG4gIHdoaWxlIChyZS5tYXRjaChyZXBsYWNlbWVudFJlZ2V4cCkpIHtcbiAgICByZSA9IHJlLnJlcGxhY2UocmVwbGFjZW1lbnRSZWdleHAsIChzdHJpbmcpID0+IHsgcmV0dXJuIHJlcGxhY2VtZW50c1tzdHJpbmddLnNvdXJjZTsgfSk7XG4gIH1cbiAgaW5saW5lR3JhbW1hcltydWxlXS5yZWdleHAgPSBuZXcgUmVnRXhwKHJlLCBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlZ2V4cC5mbGFncyk7XG59XG5cbi8vIEhUTUwgQmxvY2sgKG9ubHkgb3BlbmluZyBydWxlIGlzIHByb2Nlc3NlZCBjdXJyZW50bHkpXG5mb3IgKGxldCBydWxlIG9mIGh0bWxCbG9ja0dyYW1tYXIpIHtcbiAgbGV0IHJlID0gcnVsZS5zdGFydC5zb3VyY2U7XG4gIC8vIFJlcGxhY2Ugd2hpbGUgdGhlcmUgaXMgc29tZXRoaW5nIHRvIHJlcGxhY2UuIFRoaXMgbWVhbnMgaXQgYWxzbyB3b3JrcyBvdmVyIG11bHRpcGxlIGxldmVscyAocmVwbGFjZW1lbnRzIGNvbnRhaW5pbmcgcmVwbGFjZW1lbnRzKVxuICB3aGlsZSAocmUubWF0Y2gocmVwbGFjZW1lbnRSZWdleHApKSB7XG4gICAgcmUgPSByZS5yZXBsYWNlKHJlcGxhY2VtZW50UmVnZXhwLCAoc3RyaW5nKSA9PiB7IHJldHVybiByZXBsYWNlbWVudHNbc3RyaW5nXS5zb3VyY2U7IH0pO1xuICB9XG4gIHJ1bGUuc3RhcnQgPSBuZXcgUmVnRXhwKHJlLCBydWxlLnN0YXJ0LmZsYWdzKTtcbn1cblxuLyoqXG4gKiBFc2NhcGVzIEhUTUwgc3BlY2lhbCBjaGFyYWN0ZXJzICg8LCA+LCBhbmQgJikgaW4gdGhlIHN0cmluZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHJhdyBzdHJpbmcgdG8gYmUgZXNjYXBlZFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHN0cmluZywgcmVhZHkgdG8gYmUgdXNlZCBpbiBIVE1MXG4gKi9cbmZ1bmN0aW9uIGh0bWxlc2NhcGUoc3RyaW5nKSB7XG4gIHJldHVybiAoc3RyaW5nID8gc3RyaW5nIDogJycpXG4gICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cbi8qKlxuICogQ29udGFpbnMgdGhlIGNvbW1hbmRzIHRoYXQgY2FuIGJlIHNlbnQgdG8gdGhlIGVkaXRvci4gQ29udGFpbnMgb2JqZWN0cyB3aXRoIGEgbmFtZSByZXByZXNlbnRpbmcgdGhlIG5hbWUgb2YgdGhlIGNvbW1hbmQuXG4gKiBFYWNoIG9mIHRoZSBvYmplY3RzIGNvbnRhaW5zIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqIFxuICogICAtIHR5cGU6IENhbiBiZSBlaXRoZXIgaW5saW5lIChmb3IgaW5saW5lIGZvcm1hdHRpbmcpIG9yIGxpbmUgKGZvciBibG9jayAvIGxpbmUgZm9ybWF0dGluZykuXG4gKiAgIC0gY2xhc3NOYW1lOiBVc2VkIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBjb21tYW5kIGlzIGFjdGl2ZSBhdCBhIGdpdmVuIHBvc2l0aW9uLiBcbiAqICAgICBGb3IgbGluZSBmb3JtYXR0aW5nLCB0aGlzIGxvb2tzIGF0IHRoZSBjbGFzcyBvZiB0aGUgbGluZSBlbGVtZW50LiBGb3IgaW5saW5lIGVsZW1lbnRzLCB0cmllcyB0byBmaW5kIGFuIGVuY2xvc2luZyBlbGVtZW50IHdpdGggdGhhdCBjbGFzcy5cbiAqICAgLSBzZXQgLyB1bnNldDogQ29udGFpbiBpbnN0cnVjdGlvbnMgaG93IHRvIHNldCBhbmQgdW5zZXQgdGhlIGNvbW1hbmQuIEZvciBsaW5lIHR5cGUgY29tbWFuZHMsIGJvdGggY29uc2lzdCBvZiBhIHBhdHRlcm4gYW5kIHJlcGxhY2VtZW50IHRoYXQgXG4gKiAgICAgd2lsbCBiZSBhcHBsaWVkIHRvIGVhY2ggbGluZSAodXNpbmcgU3RyaW5nLnJlcGxhY2UpLiBGb3IgaW5saW5lIHR5cGUgY29tbWFuZHMsIHRoZSBzZXQgb2JqZWN0IGNvbnRhaW5zIGEgcHJlIGFuZCBwb3N0IHN0cmluZyB3aGljaCB3aWxsXG4gKiAgICAgYmUgaW5zZXJ0ZWQgYmVmb3JlIGFuZCBhZnRlciB0aGUgc2VsZWN0aW9uLiBUaGUgdW5zZXQgb2JqZWN0IGNvbnRhaW5zIGEgcHJlUGF0dGVybiBhbmQgYSBwb3N0UGF0dGVybi4gQm90aCBzaG91bGQgYmUgcmVndWxhciBleHByZXNzaW9ucyBhbmQgXG4gKiAgICAgdGhleSB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIHBvcnRpb24gb2YgdGhlIGxpbmUgYmVmb3JlIGFuZCBhZnRlciB0aGUgc2VsZWN0aW9uICh1c2luZyBTdHJpbmcucmVwbGFjZSwgd2l0aCBhbiBlbXB0eSByZXBsYWNlbWVudCBzdHJpbmcpLlxuICovXG5jb25zdCBjb21tYW5kcyA9IHtcbiAgLy8gUmVwbGFjZW1lbnRzIGZvciB1bnNldCBmb3IgaW5saW5lIGNvbW1hbmRzIGFyZSAnJyBieSBkZWZhdWx0XG4gIGJvbGQ6IHtcbiAgICB0eXBlOiAnaW5saW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1TdHJvbmcnLCBcbiAgICBzZXQ6IHtwcmU6ICcqKicsIHBvc3Q6ICcqKid9LCBcbiAgICB1bnNldDoge3ByZVBhdHRlcm46IC8oPzpcXCpcXCp8X18pJC8sIHBvc3RQYXR0ZXJuOiAvXig/OlxcKlxcKnxfXykvfVxuICB9LCBcbiAgaXRhbGljOiB7XG4gICAgdHlwZTogJ2lubGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNRW0nLCBcbiAgICBzZXQ6IHtwcmU6ICcqJywgcG9zdDogJyonfSwgXG4gICAgdW5zZXQ6IHtwcmVQYXR0ZXJuOiAvKD86XFwqfF8pJC8sIHBvc3RQYXR0ZXJuOiAvXig/OlxcKnxfKS99XG4gIH0sXG4gIGNvZGU6IHtcbiAgICB0eXBlOiAnaW5saW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1Db2RlJywgXG4gICAgc2V0OiB7cHJlOiAnYCcsIHBvc3Q6ICdgJ30sIFxuICAgIHVuc2V0OiB7cHJlUGF0dGVybjogL2ArJC8sIHBvc3RQYXR0ZXJuOiAvXmArL30gLy8gRklYTUUgdGhpcyBkb2Vzbid0IGVuc3VyZSBiYWxhbmNlZCBiYWNrdGlja3MgcmlnaHQgbm93XG4gIH0sIFxuICBzdHJpa2V0aHJvdWdoOiB7XG4gICAgdHlwZTogJ2lubGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNU3RyaWtldGhyb3VnaCcsIFxuICAgIHNldDoge3ByZTogJ35+JywgcG9zdDogJ35+J30sIFxuICAgIHVuc2V0OiB7cHJlUGF0dGVybjovfn4kLywgcG9zdFBhdHRlcm46IC9efn4vIH1cbiAgfSxcbiAgaDE6IHtcbiAgICB0eXBlOiAnbGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNSDEnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJyMgJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30jXFxzKykoLio/KSgoPzpcXHMrIytcXHMqKT8pJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxuICBoMjoge1xuICAgIHR5cGU6ICdsaW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1IMicsIFxuICAgIHNldDoge3BhdHRlcm46IC9eKCB7MCwzfSg/Oig/OiMrfFswLTldezEsOX1bKS5dfFs+XFwtKitdKVxccyspPykoLiopJC8sIHJlcGxhY2VtZW50OiAnIyMgJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30jI1xccyspKC4qPykoKD86XFxzKyMrXFxzKik/KSQvLCByZXBsYWNlbWVudDogJyQyJ31cbiAgfSxcbiAgdWw6IHtcbiAgICB0eXBlOiAnbGluZScsIFxuICAgIGNsYXNzTmFtZTogJ1RNVUwnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJy0gJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM31bKyotXSB7MSw0fSkoLiopJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxuICBvbDoge1xuICAgIHR5cGU6ICdsaW5lJywgXG4gICAgY2xhc3NOYW1lOiAnVE1PTCcsIFxuICAgIHNldDoge3BhdHRlcm46IC9eKCB7MCwzfSg/Oig/OiMrfFswLTldezEsOX1bKS5dfFs+XFwtKitdKVxccyspPykoLiopJC8sIHJlcGxhY2VtZW50OiAnJCMuICQyJ30sIFxuICAgIHVuc2V0OiB7cGF0dGVybjogL14oIHswLDN9XFxkezEsOX1bLildIHsxLDR9KSguKikkLywgcmVwbGFjZW1lbnQ6ICckMid9XG4gIH0sIFxuICBibG9ja3F1b3RlOiB7XG4gICAgdHlwZTogJ2xpbmUnLCBcbiAgICBjbGFzc05hbWU6ICdUTUJsb2NrcXVvdGUnLCBcbiAgICBzZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30oPzooPzojK3xbMC05XXsxLDl9WykuXXxbPlxcLSorXSlcXHMrKT8pKC4qKSQvLCByZXBsYWNlbWVudDogJz4gJDInfSwgXG4gICAgdW5zZXQ6IHtwYXR0ZXJuOiAvXiggezAsM30+WyBdPykoLiopJC8sIHJlcGxhY2VtZW50OiAnJDInfVxuICB9LFxufTtcblxuZXhwb3J0IHsgbGluZUdyYW1tYXIsIGlubGluZUdyYW1tYXIsIHB1bmN0dWF0aW9uTGVhZGluZywgcHVuY3R1YXRpb25UcmFpbGluZywgaHRtbGVzY2FwZSwgaHRtbEJsb2NrR3JhbW1hciwgY29tbWFuZHMgfTsiLCJpbXBvcnQgeyBpbmxpbmVHcmFtbWFyLCBsaW5lR3JhbW1hciwgcHVuY3R1YXRpb25MZWFkaW5nLCBwdW5jdHVhdGlvblRyYWlsaW5nLCBodG1sZXNjYXBlLCBodG1sQmxvY2tHcmFtbWFyLCBjb21tYW5kcyB9IGZyb20gXCIuL2dyYW1tYXJcIjtcblxuY2xhc3MgRWRpdG9yIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcyA9IHt9KSB7ICAgIFxuICAgIHRoaXMuZSA9IG51bGw7XG4gICAgdGhpcy50ZXh0YXJlYSA9IG51bGw7XG4gICAgdGhpcy5saW5lcyA9IFtdO1xuICAgIHRoaXMubGluZUVsZW1lbnRzID0gW107XG4gICAgdGhpcy5saW5lVHlwZXMgPSBbXTtcbiAgICB0aGlzLmxpbmVDYXB0dXJlcyA9IFtdO1xuICAgIHRoaXMubGluZVJlcGxhY2VtZW50cyA9IFtdO1xuICAgIHRoaXMubGlua0xhYmVscyA9IFtdO1xuICAgIHRoaXMubGluZURpcnR5ID0gW107XG4gICAgdGhpcy5sYXN0Q29tbWFuZFN0YXRlID0gbnVsbDtcblxuICAgIHRoaXMubGlzdGVuZXJzID0ge1xuICAgICAgY2hhbmdlOiBbXSxcbiAgICAgIHNlbGVjdGlvbjogW10sXG4gICAgfTtcblxuICAgIGxldCBlbGVtZW50ID0gcHJvcHMuZWxlbWVudDtcbiAgICB0aGlzLnRleHRhcmVhID0gcHJvcHMudGV4dGFyZWE7XG5cbiAgICBpZiAodGhpcy50ZXh0YXJlYSAmJiAhdGhpcy50ZXh0YXJlYS50YWdOYW1lKSB7XG4gICAgICB0aGlzLnRleHRhcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZXh0YXJlYSk7XG4gICAgICBpZiAoIWVsZW1lbnQpIGVsZW1lbnQgPSB0aGlzLnRleHRhcmVhO1xuICAgIH1cblxuICAgIGlmIChlbGVtZW50ICYmICFlbGVtZW50LnRhZ05hbWUpIHtcbiAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5lbGVtZW50KTtcbiAgICB9XG4gICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXTsgXG4gICAgfVxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJykge1xuICAgICAgdGhpcy50ZXh0YXJlYSA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gdGhpcy50ZXh0YXJlYS5wYXJlbnROb2RlOyBcbiAgICB9XG5cbiAgICBpZiAodGhpcy50ZXh0YXJlYSkge1xuICAgICAgdGhpcy50ZXh0YXJlYS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlRWRpdG9yRWxlbWVudChlbGVtZW50KTtcbiAgICAvLyBUT0RPIFBsYWNlaG9sZGVyIGZvciBlbXB0eSBjb250ZW50XG4gICAgdGhpcy5zZXRDb250ZW50KHByb3BzLmNvbnRlbnQgfHwgKHRoaXMudGV4dGFyZWEgPyB0aGlzLnRleHRhcmVhLnZhbHVlIDogZmFsc2UpIHx8ICcjIEhlbGxvIFRpbnlNREUhXFxuRWRpdCAqKmhlcmUqKicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgdGhlIGVkaXRvciBlbGVtZW50IGluc2lkZSB0aGUgdGFyZ2V0IGVsZW1lbnQgb2YgdGhlIERPTSB0cmVlXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSB0YXJnZXQgZWxlbWVudCBvZiB0aGUgRE9NIHRyZWVcbiAgICovXG4gIGNyZWF0ZUVkaXRvckVsZW1lbnQoZWxlbWVudCkge1xuICAgIHRoaXMuZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZS5jbGFzc05hbWUgPSAnVGlueU1ERSc7XG4gICAgdGhpcy5lLmNvbnRlbnRFZGl0YWJsZSA9IHRydWU7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBpbXBvcnRhbnQgZm9yIGZvcm1hdHRpbmcgcHVycG9zZXMsIGJ1dCBhbHNvIHNpbmNlIG90aGVyd2lzZSB0aGUgYnJvd3NlciByZXBsYWNlcyBzdWJzZXF1ZW50IHNwYWNlcyB3aXRoICAmbmJzcDsgJm5ic3A7XG4gICAgLy8gVGhhdCBicmVha3MgYSBsb3Qgb2Ygc3R1ZmYsIHNvIHdlIGRvIHRoaXMgaGVyZSBhbmQgbm90IGluIENTU+KAlHRoZXJlZm9yZSwgeW91IGRvbid0IGhhdmUgdG8gcmVtZW1iZXIgdG8gYnV0IHRoaXMgaW4gdGhlIENTUyBmaWxlXG4gICAgdGhpcy5lLnN0eWxlLndoaXRlU3BhY2UgPSAncHJlLXdyYXAnOyBcbiAgICAvLyBBdm9pZCBmb3JtYXR0aW5nIChCIC8gSSAvIFUpIHBvcHBpbmcgdXAgb24gaU9TXG4gICAgdGhpcy5lLnN0eWxlLndlYmtpdFVzZXJNb2RpZnkgPSAncmVhZC13cml0ZS1wbGFpbnRleHQtb25seSc7XG4gICAgaWYgKHRoaXMudGV4dGFyZWEgJiYgdGhpcy50ZXh0YXJlYS5wYXJlbnROb2RlID09IGVsZW1lbnQgJiYgdGhpcy50ZXh0YXJlYS5uZXh0U2libGluZykge1xuICAgICAgZWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5lLCB0aGlzLnRleHRhcmVhLm5leHRTaWJsaW5nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZSk7XG4gICAgfVxuXG4gICAgdGhpcy5lLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4gdGhpcy5oYW5kbGVJbnB1dEV2ZW50KGUpKTtcbiAgICAvLyB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGUpID0+IHRoaXMuaGFuZGxlS2V5ZG93bkV2ZW50KGUpKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2VsZWN0aW9uY2hhbmdlXCIsIChlKSA9PiB0aGlzLmhhbmRsZVNlbGVjdGlvbkNoYW5nZUV2ZW50KGUpKTtcbiAgICB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIChlKSA9PiB0aGlzLmhhbmRsZVBhc3RlKGUpKTtcbiAgICAvLyB0aGlzLmUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChlKSA9PiB0aGlzLmhhbmRsZUtleURvd24oZSkpO1xuICAgIHRoaXMubGluZUVsZW1lbnRzID0gdGhpcy5lLmNoaWxkTm9kZXM7IC8vIHRoaXMgd2lsbCBhdXRvbWF0aWNhbGx5IHVwZGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGVkaXRvciBjb250ZW50LlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCBUaGUgbmV3IE1hcmtkb3duIGNvbnRlbnRcbiAgICovXG4gIHNldENvbnRlbnQoY29udGVudCkge1xuICAgIC8vIERlbGV0ZSBhbnkgZXhpc3RpbmcgY29udGVudFxuICAgIHdoaWxlICh0aGlzLmUuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5lLnJlbW92ZUNoaWxkKHRoaXMuZS5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgdGhpcy5saW5lcyA9IGNvbnRlbnQuc3BsaXQoLyg/OlxcclxcbnxcXHJ8XFxuKS8pO1xuICAgIHRoaXMubGluZURpcnR5ID0gW107XG4gICAgZm9yIChsZXQgbGluZU51bSA9IDA7IGxpbmVOdW0gPCB0aGlzLmxpbmVzLmxlbmd0aDsgbGluZU51bSsrKSB7XG4gICAgICBsZXQgbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIHRoaXMuZS5hcHBlbmRDaGlsZChsZSk7XG4gICAgICB0aGlzLmxpbmVEaXJ0eS5wdXNoKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLmxpbmVUeXBlcyA9IG5ldyBBcnJheSh0aGlzLmxpbmVzLmxlbmd0aCk7XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgdGhpcy5maXJlQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWRpdG9yIGNvbnRlbnQgYXMgYSBNYXJrZG93biBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBlZGl0b3IgY29udGVudCBhcyBhIG1hcmtkb3duIHN0cmluZ1xuICAgKi9cbiAgZ2V0Q29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcy5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGlzIHRoZSBtYWluIG1ldGhvZCB0byB1cGRhdGUgdGhlIGZvcm1hdHRpbmcgKGZyb20gdGhpcy5saW5lcyB0byBIVE1MIG91dHB1dClcbiAgICovXG4gIHVwZGF0ZUZvcm1hdHRpbmcoKSB7XG4gICAgLy8gRmlyc3QsIHBhcnNlIGxpbmUgdHlwZXMuIFRoaXMgd2lsbCB1cGRhdGUgdGhpcy5saW5lVHlwZXMsIHRoaXMubGluZVJlcGxhY2VtZW50cywgYW5kIHRoaXMubGluZUNhcHR1cmVzXG4gICAgLy8gV2UgZG9uJ3QgYXBwbHkgdGhlIGZvcm1hdHRpbmcgeWV0XG4gICAgdGhpcy51cGRhdGVMaW5lVHlwZXMoKTtcbiAgICAvLyBDb2xsZWN0IGFueSB2YWxpZCBsaW5rIGxhYmVscyBmcm9tIGxpbmsgcmVmZXJlbmNlIGRlZmluaXRpb25z4oCUd2UgbmVlZCB0aGF0IGZvciBmb3JtYXR0aW5nIHRvIGRldGVybWluZSB3aGF0J3MgYSB2YWxpZCBsaW5rXG4gICAgdGhpcy51cGRhdGVMaW5rTGFiZWxzKCk7XG4gICAgLy8gTm93LCBhcHBseSB0aGUgZm9ybWF0dGluZ1xuICAgIHRoaXMuYXBwbHlMaW5lVHlwZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoaXMubGlua0xhYmVsczogRm9yIGV2ZXJ5IGxpbmsgcmVmZXJlbmNlIGRlZmluaXRpb24gKGxpbmUgdHlwZSBUTUxpbmtSZWZlcmVuY2VEZWZpbml0aW9uKSwgd2UgY29sbGVjdCB0aGUgbGFiZWxcbiAgICovXG4gIHVwZGF0ZUxpbmtMYWJlbHMoKSB7XG4gICAgdGhpcy5saW5rTGFiZWxzID0gW107XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCB0aGlzLmxpbmVzLmxlbmd0aDsgbCsrKSB7XG4gICAgICBpZiAodGhpcy5saW5lVHlwZXNbbF0gPT0gJ1RNTGlua1JlZmVyZW5jZURlZmluaXRpb24nKSB7XG4gICAgICAgIHRoaXMubGlua0xhYmVscy5wdXNoKHRoaXMubGluZUNhcHR1cmVzW2xdW2xpbmVHcmFtbWFyLlRNTGlua1JlZmVyZW5jZURlZmluaXRpb24ubGFiZWxQbGFjZWhvbGRlcl0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gcmVwbGFjZSBwbGFjZWhvbGRlcnMgZnJvbSBhIFJlZ0V4cCBjYXB0dXJlLiBUaGUgcmVwbGFjZW1lbnQgc3RyaW5nIGNhbiBjb250YWluIHJlZ3VsYXIgZG9sbGFyIHBsYWNlaG9sZGVycyAoZS5nLiwgJDEpLFxuICAgKiB3aGljaCBhcmUgaW50ZXJwcmV0ZWQgbGlrZSBpbiBTdHJpbmcucmVwbGFjZSgpLCBidXQgYWxzbyBkb3VibGUgZG9sbGFyIHBsYWNlaG9sZGVycyAoJCQxKS4gSW4gdGhlIGNhc2Ugb2YgZG91YmxlIGRvbGxhciBwbGFjZWhvbGRlcnMsIFxuICAgKiBNYXJrZG93biBpbmxpbmUgZ3JhbW1hciBpcyBhcHBsaWVkIG9uIHRoZSBjb250ZW50IG9mIHRoZSBjYXB0dXJlZCBzdWJncm91cCwgaS5lLiwgJCQxIHByb2Nlc3NlcyBpbmxpbmUgTWFya2Rvd24gZ3JhbW1hciBpbiB0aGUgY29udGVudCBvZiB0aGVcbiAgICogZmlyc3QgY2FwdHVyZWQgc3ViZ3JvdXAsIGFuZCByZXBsYWNlcyBgJCQxYCB3aXRoIHRoZSByZXN1bHQuXG4gICAqIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVwbGFjZW1lbnQgVGhlIHJlcGxhY2VtZW50IHN0cmluZywgaW5jbHVkaW5nIHBsYWNlaG9sZGVycy5cbiAgICogQHBhcmFtICBjYXB0dXJlIFRoZSByZXN1bHQgb2YgYSBSZWdFeHAuZXhlYygpIGNhbGxcbiAgICogQHJldHVybnMgVGhlIHJlcGxhY2VtZW50IHN0cmluZywgd2l0aCBwbGFjZWhvbGRlcnMgcmVwbGFjZWQgZnJvbSB0aGUgY2FwdHVyZSByZXN1bHQuXG4gICAqL1xuICByZXBsYWNlKHJlcGxhY2VtZW50LCBjYXB0dXJlKSB7XG4gICAgcmV0dXJuIHJlcGxhY2VtZW50XG4gICAgICAucmVwbGFjZSgvXFwkXFwkKFswLTldKS9nLCAoc3RyLCBwMSkgPT4gYDxzcGFuIGNsYXNzPVwiVE1JbmxpbmVGb3JtYXR0ZWRcIj4ke3RoaXMucHJvY2Vzc0lubGluZVN0eWxlcyhjYXB0dXJlW3AxXSl9PC9zcGFuPmApIFxuICAgICAgLnJlcGxhY2UoL1xcJChbMC05XSkvZywgKHN0ciwgcDEpID0+IGh0bWxlc2NhcGUoY2FwdHVyZVtwMV0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBsaW5lIHR5cGVzIChmcm9tIHRoaXMubGluZVR5cGVzIGFzIHdlbGwgYXMgdGhlIGNhcHR1cmUgcmVzdWx0IGluIHRoaXMubGluZVJlcGxhY2VtZW50cyBhbmQgdGhpcy5saW5lQ2FwdHVyZXMpIFxuICAgKiBhbmQgcHJvY2Vzc2VzIGlubGluZSBmb3JtYXR0aW5nIGZvciBhbGwgbGluZXMuXG4gICAqL1xuICBhcHBseUxpbmVUeXBlcygpIHtcbiAgICBmb3IgKGxldCBsaW5lTnVtID0gMDsgbGluZU51bSA8IHRoaXMubGluZXMubGVuZ3RoOyBsaW5lTnVtKyspIHtcbiAgICAgIGlmICh0aGlzLmxpbmVEaXJ0eVtsaW5lTnVtXSkge1xuICAgICAgICBsZXQgY29udGVudEhUTUwgPSB0aGlzLnJlcGxhY2UodGhpcy5saW5lUmVwbGFjZW1lbnRzW2xpbmVOdW1dLCB0aGlzLmxpbmVDYXB0dXJlc1tsaW5lTnVtXSk7XG4gICAgICAgIC8vIHRoaXMubGluZUhUTUxbbGluZU51bV0gPSAoY29udGVudEhUTUwgPT0gJycgPyAnPGJyIC8+JyA6IGNvbnRlbnRIVE1MKTsgLy8gUHJldmVudCBlbXB0eSBlbGVtZW50cyB3aGljaCBjYW4ndCBiZSBzZWxlY3RlZCBldGMuXG4gICAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmNsYXNzTmFtZSA9IHRoaXMubGluZVR5cGVzW2xpbmVOdW1dO1xuICAgICAgICB0aGlzLmxpbmVFbGVtZW50c1tsaW5lTnVtXS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmlubmVySFRNTCA9IChjb250ZW50SFRNTCA9PSAnJyA/ICc8YnIgLz4nIDogY29udGVudEhUTUwpOyAvLyBQcmV2ZW50IGVtcHR5IGVsZW1lbnRzIHdoaWNoIGNhbid0IGJlIHNlbGVjdGVkIGV0Yy5cbiAgICAgIH1cbiAgICAgIHRoaXMubGluZUVsZW1lbnRzW2xpbmVOdW1dLmRhdGFzZXQubGluZU51bSA9IGxpbmVOdW07XG4gICAgfSAgICBcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGxpbmUgdHlwZXMgZm9yIGFsbCBsaW5lcyBiYXNlZCBvbiB0aGUgbGluZSAvIGJsb2NrIGdyYW1tYXIuIENhcHR1cmVzIHRoZSByZXN1bHRzIG9mIHRoZSByZXNwZWN0aXZlIGxpbmVcbiAgICogZ3JhbW1hciByZWd1bGFyIGV4cHJlc3Npb25zLlxuICAgKiBVcGRhdGVzIHRoaXMubGluZVR5cGVzLCB0aGlzLmxpbmVDYXB0dXJlcywgYW5kIHRoaXMubGluZVJlcGxhY2VtZW50cy5cbiAgICovXG4gIHVwZGF0ZUxpbmVUeXBlcygpIHtcbiAgICBsZXQgY29kZUJsb2NrVHlwZSA9IGZhbHNlO1xuICAgIGxldCBjb2RlQmxvY2tTZXFMZW5ndGggPSAwO1xuICAgIGxldCBodG1sQmxvY2sgPSBmYWxzZTtcblxuICAgIGZvciAobGV0IGxpbmVOdW0gPSAwOyBsaW5lTnVtIDwgdGhpcy5saW5lcy5sZW5ndGg7IGxpbmVOdW0rKykge1xuICAgICAgbGV0IGxpbmVUeXBlID0gJ1RNUGFyYSc7XG4gICAgICBsZXQgbGluZUNhcHR1cmUgPSBbdGhpcy5saW5lc1tsaW5lTnVtXV07XG4gICAgICBsZXQgbGluZVJlcGxhY2VtZW50ID0gJyQkMCc7IC8vIERlZmF1bHQgcmVwbGFjZW1lbnQgZm9yIHBhcmFncmFwaDogSW5saW5lIGZvcm1hdCB0aGUgZW50aXJlIGxpbmVcblxuICAgICAgLy8gQ2hlY2sgb25nb2luZyBjb2RlIGJsb2Nrc1xuICAgICAgLy8gaWYgKGxpbmVOdW0gPiAwICYmICh0aGlzLmxpbmVUeXBlc1tsaW5lTnVtIC0gMV0gPT0gJ1RNQ29kZUZlbmNlQmFja3RpY2tPcGVuJyB8fCB0aGlzLmxpbmVUeXBlc1tsaW5lTnVtIC0gMV0gPT0gJ1RNRmVuY2VkQ29kZUJhY2t0aWNrJykpIHtcbiAgICAgIGlmIChjb2RlQmxvY2tUeXBlID09ICdUTUNvZGVGZW5jZUJhY2t0aWNrT3BlbicpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gYSBiYWNrdGljay1mZW5jZWQgY29kZSBibG9jaywgY2hlY2sgaWYgdGhlIGN1cnJlbnQgbGluZSBjbG9zZXMgaXRcbiAgICAgICAgbGV0IGNhcHR1cmUgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2UucmVnZXhwLmV4ZWModGhpcy5saW5lc1tsaW5lTnVtXSk7XG4gICAgICAgIGlmIChjYXB0dXJlICYmIGNhcHR1cmUuZ3JvdXBzWydzZXEnXS5sZW5ndGggPj0gY29kZUJsb2NrU2VxTGVuZ3RoKSB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1Db2RlRmVuY2VCYWNrdGlja0Nsb3NlJztcbiAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZUJhY2t0aWNrQ2xvc2UucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgIGNvZGVCbG9ja1R5cGUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsaW5lVHlwZSA9ICdUTUZlbmNlZENvZGVCYWNrdGljayc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJztcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICAgIC8vIGlmIChsaW5lTnVtID4gMCAmJiAodGhpcy5saW5lVHlwZXNbbGluZU51bSAtIDFdID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bSAtIDFdID09ICdUTUZlbmNlZENvZGVUaWxkZScpKSB7XG4gICAgICBlbHNlIGlmIChjb2RlQmxvY2tUeXBlID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicpIHtcbiAgICAgICAgLy8gV2UncmUgaW4gYSB0aWxkZS1mZW5jZWQgY29kZSBibG9ja1xuICAgICAgICBsZXQgY2FwdHVyZSA9IGxpbmVHcmFtbWFyLlRNQ29kZUZlbmNlVGlsZGVDbG9zZS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgaWYgKGNhcHR1cmUgJiYgY2FwdHVyZS5ncm91cHNbJ3NlcSddLmxlbmd0aCA+PSBjb2RlQmxvY2tTZXFMZW5ndGgpICB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1Db2RlRmVuY2VUaWxkZUNsb3NlJztcbiAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSBsaW5lR3JhbW1hci5UTUNvZGVGZW5jZVRpbGRlQ2xvc2UucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgIGNvZGVCbG9ja1R5cGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBsaW5lVHlwZSA9ICdUTUZlbmNlZENvZGVUaWxkZSc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJztcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgfSBcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgSFRNTCBibG9jayB0eXBlc1xuICAgICAgaWYgKGxpbmVUeXBlID09ICdUTVBhcmEnICYmIGh0bWxCbG9jayA9PT0gZmFsc2UpIHtcbiAgICAgICAgZm9yIChsZXQgaHRtbEJsb2NrVHlwZSBvZiBodG1sQmxvY2tHcmFtbWFyKSB7XG4gICAgICAgICAgaWYgKHRoaXMubGluZXNbbGluZU51bV0ubWF0Y2goaHRtbEJsb2NrVHlwZS5zdGFydCkpIHtcbiAgICAgICAgICAgIC8vIE1hdGNoaW5nIHN0YXJ0IGNvbmRpdGlvbi4gQ2hlY2sgaWYgdGhpcyB0YWcgY2FuIHN0YXJ0IGhlcmUgKG5vdCBhbGwgc3RhcnQgY29uZGl0aW9ucyBhbGxvdyBicmVha2luZyBhIHBhcmFncmFwaCkuXG4gICAgICAgICAgICBpZiAoaHRtbEJsb2NrVHlwZS5wYXJhSW50ZXJydXB0IHx8IGxpbmVOdW0gPT0gMCB8fCAhKHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNUGFyYScgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1VTCcgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1PTCcgfHwgdGhpcy5saW5lVHlwZXNbbGluZU51bS0xXSA9PSAnVE1CbG9ja3F1b3RlJykpIHtcbiAgICAgICAgICAgICAgaHRtbEJsb2NrID0gaHRtbEJsb2NrVHlwZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChodG1sQmxvY2sgIT09IGZhbHNlKSB7XG4gICAgICAgIGxpbmVUeXBlID0gJ1RNSFRNTEJsb2NrJztcbiAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQwJzsgLy8gTm8gZm9ybWF0dGluZyBpbiBUTUhUTUxCbG9ja1xuICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTsgLy8gVGhpcyBzaG91bGQgYWxyZWFkeSBiZSBzZXQgYnV0IGJldHRlciBzYWZlIHRoYW4gc29ycnlcblxuICAgICAgICAvLyBDaGVjayBpZiBIVE1MIGJsb2NrIHNob3VsZCBiZSBjbG9zZWRcbiAgICAgICAgaWYgKGh0bWxCbG9jay5lbmQpIHtcbiAgICAgICAgICAvLyBTcGVjaWZpYyBlbmQgY29uZGl0aW9uXG4gICAgICAgICAgaWYgKHRoaXMubGluZXNbbGluZU51bV0ubWF0Y2goaHRtbEJsb2NrLmVuZCkpIHtcbiAgICAgICAgICAgIGh0bWxCbG9jayA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBObyBzcGVjaWZpYyBlbmQgY29uZGl0aW9uLCBlbmRzIHdpdGggYmxhbmsgbGluZVxuICAgICAgICAgIGlmIChsaW5lTnVtID09IHRoaXMubGluZXMubGVuZ3RoIC0gMSB8fCB0aGlzLmxpbmVzW2xpbmVOdW0rMV0ubWF0Y2gobGluZUdyYW1tYXIuVE1CbGFua0xpbmUucmVnZXhwKSkge1xuICAgICAgICAgICAgaHRtbEJsb2NrID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGFsbCByZWdleHBzIGlmIHdlIGhhdmVuJ3QgYXBwbGllZCBvbmUgb2YgdGhlIGNvZGUgYmxvY2sgdHlwZXNcbiAgICAgIGlmIChsaW5lVHlwZSA9PSAnVE1QYXJhJykge1xuICAgICAgICBmb3IgKGxldCB0eXBlIGluIGxpbmVHcmFtbWFyKSB7XG4gICAgICAgICAgaWYgKGxpbmVHcmFtbWFyW3R5cGVdLnJlZ2V4cCkge1xuICAgICAgICAgICAgbGV0IGNhcHR1cmUgPSBsaW5lR3JhbW1hclt0eXBlXS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgICAgIGlmIChjYXB0dXJlKSB7XG4gICAgICAgICAgICAgIGxpbmVUeXBlID0gdHlwZTtcbiAgICAgICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXJbdHlwZV0ucmVwbGFjZW1lbnQ7XG4gICAgICAgICAgICAgIGxpbmVDYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlJ3ZlIG9wZW5lZCBhIGNvZGUgYmxvY2ssIHJlbWVtYmVyIHRoYXRcbiAgICAgIGlmIChsaW5lVHlwZSA9PSAnVE1Db2RlRmVuY2VCYWNrdGlja09wZW4nIHx8IGxpbmVUeXBlID09ICdUTUNvZGVGZW5jZVRpbGRlT3BlbicpIHtcbiAgICAgICAgY29kZUJsb2NrVHlwZSA9IGxpbmVUeXBlO1xuICAgICAgICBjb2RlQmxvY2tTZXFMZW5ndGggPSBsaW5lQ2FwdHVyZS5ncm91cHNbJ3NlcSddLmxlbmd0aDtcbiAgICAgIH1cblxuICAgICAgLy8gTGluayByZWZlcmVuY2UgZGVmaW5pdGlvbiBhbmQgaW5kZW50ZWQgY29kZSBjYW4ndCBpbnRlcnJ1cHQgYSBwYXJhZ3JhcGhcbiAgICAgIGlmIChcbiAgICAgICAgKGxpbmVUeXBlID09ICdUTUluZGVudGVkQ29kZScgfHwgbGluZVR5cGUgPT0gJ1RNTGlua1JlZmVyZW5jZURlZmluaXRpb24nKSBcbiAgICAgICAgJiYgbGluZU51bSA+IDAgXG4gICAgICAgICYmICh0aGlzLmxpbmVUeXBlc1tsaW5lTnVtLTFdID09ICdUTVBhcmEnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNVUwnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNT0wnIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0tMV0gPT0gJ1RNQmxvY2txdW90ZScpXG4gICAgICApIHtcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIFRNUGFyYVxuICAgICAgICBsaW5lVHlwZSA9ICdUTVBhcmEnO1xuICAgICAgICBsaW5lQ2FwdHVyZSA9IFt0aGlzLmxpbmVzW2xpbmVOdW1dXTtcbiAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gJyQkMCc7XG4gICAgICB9XG5cbiAgICAgIC8vIFNldGV4dCBIMiBtYXJrZXJzIHRoYXQgY2FuIGFsc28gYmUgaW50ZXJwcmV0ZWQgYXMgYW4gZW1wdHkgbGlzdCBpdGVtIHNob3VsZCBiZSByZWdhcmRlZCBhcyBzdWNoIChhcyBwZXIgQ29tbW9uTWFyayBzcGVjKVxuICAgICAgaWYgKGxpbmVUeXBlID09ICdUTVNldGV4dEgyTWFya2VyJykge1xuICAgICAgICBsZXQgY2FwdHVyZSA9IGxpbmVHcmFtbWFyLlRNVUwucmVnZXhwLmV4ZWModGhpcy5saW5lc1tsaW5lTnVtXSk7XG4gICAgICAgIGlmIChjYXB0dXJlKSB7XG4gICAgICAgICAgbGluZVR5cGUgPSAnVE1VTCc7XG4gICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXIuVE1VTC5yZXBsYWNlbWVudDtcbiAgICAgICAgICBsaW5lQ2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgIH0gICAgICBcbiAgICAgIH1cblxuICAgICAgLy8gU2V0ZXh0IGhlYWRpbmdzIGFyZSBvbmx5IHZhbGlkIGlmIHByZWNlZGVkIGJ5IGEgcGFyYWdyYXBoIChhbmQgaWYgc28sIHRoZXkgY2hhbmdlIHRoZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBwYXJhZ3JhcGgpXG4gICAgICBpZiAobGluZVR5cGUgPT0gJ1RNU2V0ZXh0SDFNYXJrZXInIHx8IGxpbmVUeXBlID09ICdUTVNldGV4dEgyTWFya2VyJykge1xuICAgICAgICBpZiAobGluZU51bSA9PSAwIHx8IHRoaXMubGluZVR5cGVzW2xpbmVOdW0gLSAxXSAhPSAnVE1QYXJhJykge1xuICAgICAgICAgIC8vIFNldGV4dCBtYXJrZXIgaXMgaW52YWxpZC4gSG93ZXZlciwgYSBIMiBtYXJrZXIgbWlnaHQgc3RpbGwgYmUgYSB2YWxpZCBIUiwgc28gbGV0J3MgY2hlY2sgdGhhdFxuICAgICAgICAgIGxldCBjYXB0dXJlID0gbGluZUdyYW1tYXIuVE1IUi5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW2xpbmVOdW1dKTtcbiAgICAgICAgICBpZiAoY2FwdHVyZSkge1xuICAgICAgICAgICAgLy8gVmFsaWQgSFJcbiAgICAgICAgICAgIGxpbmVUeXBlID0gJ1RNSFInO1xuICAgICAgICAgICAgbGluZUNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICAgICAgbGluZVJlcGxhY2VtZW50ID0gbGluZUdyYW1tYXIuVE1IUi5yZXBsYWNlbWVudDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTm90IHZhbGlkIEhSLCBmb3JtYXQgYXMgVE1QYXJhXG4gICAgICAgICAgICBsaW5lVHlwZSA9ICdUTVBhcmEnO1xuICAgICAgICAgICAgbGluZUNhcHR1cmUgPSBbdGhpcy5saW5lc1tsaW5lTnVtXV07XG4gICAgICAgICAgICBsaW5lUmVwbGFjZW1lbnQgPSAnJCQwJztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVmFsaWQgc2V0ZXh0IG1hcmtlci4gQ2hhbmdlIHR5cGVzIG9mIHByZWNlZGluZyBwYXJhIGxpbmVzXG4gICAgICAgICAgbGV0IGhlYWRpbmdMaW5lID0gbGluZU51bSAtIDE7XG4gICAgICAgICAgY29uc3QgaGVhZGluZ0xpbmVUeXBlID0gKGxpbmVUeXBlID09ICdUTVNldGV4dEgxTWFya2VyJyA/ICdUTVNldGV4dEgxJyA6ICdUTVNldGV4dEgyJyk7XG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKHRoaXMubGluZVR5cGVzW2hlYWRpbmdMaW5lVHlwZV0gIT0gaGVhZGluZ0xpbmVUeXBlKSB7XG4gICAgICAgICAgICAgIHRoaXMubGluZVR5cGVzW2hlYWRpbmdMaW5lXSA9IGhlYWRpbmdMaW5lVHlwZTsgXG4gICAgICAgICAgICAgIHRoaXMubGluZURpcnR5W2hlYWRpbmdMaW5lVHlwZV0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saW5lUmVwbGFjZW1lbnRzW2hlYWRpbmdMaW5lXSA9ICckJDAnO1xuICAgICAgICAgICAgdGhpcy5saW5lQ2FwdHVyZXNbaGVhZGluZ0xpbmVdID0gW3RoaXMubGluZXNbaGVhZGluZ0xpbmVdXTtcblxuICAgICAgICAgICAgaGVhZGluZ0xpbmUtLTtcbiAgICAgICAgICB9IHdoaWxlKGhlYWRpbmdMaW5lID49IDAgJiYgdGhpcy5saW5lVHlwZXNbaGVhZGluZ0xpbmVdID09ICdUTVBhcmEnKTsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIExhc3RseSwgc2F2ZSB0aGUgbGluZSBzdHlsZSB0byBiZSBhcHBsaWVkIGxhdGVyXG4gICAgICBpZiAodGhpcy5saW5lVHlwZXNbbGluZU51bV0gIT0gbGluZVR5cGUpIHtcbiAgICAgICAgdGhpcy5saW5lVHlwZXNbbGluZU51bV0gPSBsaW5lVHlwZTtcbiAgICAgICAgdGhpcy5saW5lRGlydHlbbGluZU51bV0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5saW5lUmVwbGFjZW1lbnRzW2xpbmVOdW1dID0gbGluZVJlcGxhY2VtZW50O1xuICAgICAgdGhpcy5saW5lQ2FwdHVyZXNbbGluZU51bV0gPSBsaW5lQ2FwdHVyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyBhbGwgbGluZSBjb250ZW50cyBmcm9tIHRoZSBIVE1MLCB0aGVuIHJlLWFwcGxpZXMgZm9ybWF0dGluZy5cbiAgICovXG4gIHVwZGF0ZUxpbmVDb250ZW50c0FuZEZvcm1hdHRpbmcoKSB7XG4gICAgdGhpcy5jbGVhckRpcnR5RmxhZygpO1xuICAgIHRoaXMudXBkYXRlTGluZUNvbnRlbnRzKCk7XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gcGFyc2UgYSBsaW5rIG9yIGltYWdlIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLiBUaGlzIGFzc3VtZXMgdGhhdCB0aGUgb3BlbmluZyBbIG9yICFbIGhhcyBhbHJlYWR5IGJlZW4gbWF0Y2hlZC4gXG4gICAqIFJldHVybnMgZmFsc2UgaWYgdGhpcyBpcyBub3QgYSB2YWxpZCBsaW5rLCBpbWFnZS4gU2VlIGJlbG93IGZvciBtb3JlIGluZm9ybWF0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBvcmlnaW5hbFN0cmluZyBUaGUgb3JpZ2luYWwgc3RyaW5nLCBzdGFydGluZyBhdCB0aGUgb3BlbmluZyBtYXJrZXIgKFsgb3IgIVspXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNJbWFnZSBXaGV0aGVyIG9yIG5vdCB0aGlzIGlzIGFuIGltYWdlIChvcGVuZXIgPT0gIVspXG4gICAqIEByZXR1cm5zIGZhbHNlIGlmIG5vdCBhIHZhbGlkIGxpbmsgLyBpbWFnZS4gXG4gICAqIE90aGVyd2lzZSByZXR1cm5zIGFuIG9iamVjdCB3aXRoIHR3byBwcm9wZXJ0aWVzOiBvdXRwdXQgaXMgdGhlIHN0cmluZyB0byBiZSBpbmNsdWRlZCBpbiB0aGUgcHJvY2Vzc2VkIG91dHB1dCwgXG4gICAqIGNoYXJDb3VudCBpcyB0aGUgbnVtYmVyIG9mIGlucHV0IGNoYXJhY3RlcnMgKGZyb20gb3JpZ2luYWxTdHJpbmcpIGNvbnN1bWVkLlxuICAgKi9cbiAgcGFyc2VMaW5rT3JJbWFnZShvcmlnaW5hbFN0cmluZywgaXNJbWFnZSkge1xuICAgIC8vIFNraXAgdGhlIG9wZW5pbmcgYnJhY2tldFxuICAgIGxldCB0ZXh0T2Zmc2V0ID0gaXNJbWFnZSA/IDIgOiAxO1xuICAgIGxldCBvcGVuZXIgPSBvcmlnaW5hbFN0cmluZy5zdWJzdHIoMCwgdGV4dE9mZnNldCk7XG4gICAgbGV0IHR5cGUgPSBpc0ltYWdlID8gJ1RNSW1hZ2UnIDogJ1RNTGluayc7XG4gICAgbGV0IGN1cnJlbnRPZmZzZXQgPSB0ZXh0T2Zmc2V0O1xuICAgIFxuICAgIGxldCBicmFja2V0TGV2ZWwgPSAxO1xuICAgIGxldCBsaW5rVGV4dCA9IGZhbHNlO1xuICAgIGxldCBsaW5rUmVmID0gZmFsc2U7XG4gICAgbGV0IGxpbmtMYWJlbCA9IFtdO1xuICAgIGxldCBsaW5rRGV0YWlscyA9IFtdOyAvLyBJZiBtYXRjaGVkLCB0aGlzIHdpbGwgYmUgYW4gYXJyYXk6IFt3aGl0ZXNwYWNlICsgbGluayBkZXN0aW5hdGlvbiBkZWxpbWl0ZXIsIGxpbmsgZGVzdGluYXRpb24sIGxpbmsgZGVzdGluYXRpb24gZGVsaW1pdGVyLCB3aGl0ZXNwYWNlLCBsaW5rIHRpdGxlIGRlbGltaXRlciwgbGluayB0aXRsZSwgbGluayB0aXRsZSBkZWxpbWl0ZXIgKyB3aGl0ZXNwYWNlXS4gQWxsIGNhbiBiZSBlbXB0eSBzdHJpbmdzLlxuXG4gIFxuICAgIHRleHRPdXRlcjogd2hpbGUgKGN1cnJlbnRPZmZzZXQgPCBvcmlnaW5hbFN0cmluZy5sZW5ndGggJiYgbGlua1RleHQgPT09IGZhbHNlIC8qIGVtcHR5IHN0cmluZyBpcyBva2F5ICovKSB7XG4gICAgICBsZXQgc3RyaW5nID0gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKGN1cnJlbnRPZmZzZXQpO1xuICBcbiAgICAgIC8vIENhcHR1cmUgYW55IGVzY2FwZXMgYW5kIGNvZGUgYmxvY2tzIGF0IGN1cnJlbnQgcG9zaXRpb24sIHRoZXkgYmluZCBtb3JlIHN0cm9uZ2x5IHRoYW4gbGlua3NcbiAgICAgIC8vIFdlIGRvbid0IGhhdmUgdG8gYWN0dWFsbHkgcHJvY2VzcyB0aGVtIGhlcmUsIHRoYXQnbGwgYmUgZG9uZSBsYXRlciBpbiBjYXNlIHRoZSBsaW5rIC8gaW1hZ2UgaXMgdmFsaWQsIGJ1dCB3ZSBuZWVkIHRvIHNraXAgb3ZlciB0aGVtLlxuICAgICAgZm9yIChsZXQgcnVsZSBvZiBbJ2VzY2FwZScsICdjb2RlJywgJ2F1dG9saW5rJywgJ2h0bWwnXSkge1xuICAgICAgICBsZXQgY2FwID0gaW5saW5lR3JhbW1hcltydWxlXS5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgY3VycmVudE9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIGNvbnRpbnVlIHRleHRPdXRlcjsgXG4gICAgICAgIH1cbiAgICAgIH1cbiAgXG4gICAgICAvLyBDaGVjayBmb3IgaW1hZ2UuIEl0J3Mgb2theSBmb3IgYW4gaW1hZ2UgdG8gYmUgaW5jbHVkZWQgaW4gYSBsaW5rIG9yIGltYWdlXG4gICAgICBpZiAoc3RyaW5nLm1hdGNoKGlubGluZUdyYW1tYXIuaW1hZ2VPcGVuLnJlZ2V4cCkpIHtcbiAgICAgICAgLy8gT3BlbmluZyBpbWFnZS4gSXQncyBva2F5IGlmIHRoaXMgaXMgYSBtYXRjaGluZyBwYWlyIG9mIGJyYWNrZXRzXG4gICAgICAgIGJyYWNrZXRMZXZlbCsrO1xuICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IDI7XG4gICAgICAgIGNvbnRpbnVlIHRleHRPdXRlcjtcbiAgICAgIH1cbiAgXG4gICAgICAvLyBDaGVjayBmb3IgbGluayAobm90IGFuIGltYWdlIGJlY2F1c2UgdGhhdCB3b3VsZCBoYXZlIGJlZW4gY2FwdHVyZWQgYW5kIHNraXBwZWQgb3ZlciBhYm92ZSlcbiAgICAgIGlmIChzdHJpbmcubWF0Y2goaW5saW5lR3JhbW1hci5saW5rT3Blbi5yZWdleHApKSB7XG4gICAgICAgIC8vIE9wZW5pbmcgYnJhY2tldC4gVHdvIHRoaW5ncyB0byBkbzpcbiAgICAgICAgLy8gMSkgaXQncyBva2F5IGlmIHRoaXMgcGFydCBvZiBhIHBhaXIgb2YgYnJhY2tldHMuXG4gICAgICAgIC8vIDIpIElmIHdlIGFyZSBjdXJyZW50bHkgdHJ5aW5nIHRvIHBhcnNlIGEgbGluaywgdGhpcyBuZXN0ZWQgYnJhY2tldCBtdXNuJ3Qgc3RhcnQgYSB2YWxpZCBsaW5rIChubyBuZXN0ZWQgbGlua3MgYWxsb3dlZClcbiAgICAgICAgYnJhY2tldExldmVsKys7XG4gICAgICAgIC8vIGlmIChicmFja2V0TGV2ZWwgPj0gMikgcmV0dXJuIGZhbHNlOyAvLyBOZXN0ZWQgdW5lc2NhcGVkIGJyYWNrZXRzLCB0aGlzIGRvZXNuJ3QgcXVhbGlmeSBhcyBhIGxpbmsgLyBpbWFnZVxuICAgICAgICBpZiAoIWlzSW1hZ2UpIHtcbiAgICAgICAgICBpZiAodGhpcy5wYXJzZUxpbmtPckltYWdlKHN0cmluZywgZmFsc2UpKSB7XG4gICAgICAgICAgICAvLyBWYWxpZCBsaW5rIGluc2lkZSB0aGlzIHBvc3NpYmxlIGxpbmssIHdoaWNoIG1ha2VzIHRoaXMgbGluayBpbnZhbGlkIChpbm5lciBsaW5rcyBiZWF0IG91dGVyIG9uZXMpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRPZmZzZXQgKz0gMTtcbiAgICAgICAgY29udGludWUgdGV4dE91dGVyO1xuICAgICAgfVxuICBcbiAgICAgIC8vIENoZWNrIGZvciBjbG9zaW5nIGJyYWNrZXRcbiAgICAgIGlmIChzdHJpbmcubWF0Y2goL15cXF0vKSkge1xuICAgICAgICBicmFja2V0TGV2ZWwtLTtcbiAgICAgICAgaWYgKGJyYWNrZXRMZXZlbCA9PSAwKSB7XG4gICAgICAgICAgLy8gRm91bmQgbWF0Y2hpbmcgYnJhY2tldCBhbmQgaGF2ZW4ndCBmb3VuZCBhbnl0aGluZyBkaXNxdWFsaWZ5aW5nIHRoaXMgYXMgbGluayAvIGltYWdlLlxuICAgICAgICAgIGxpbmtUZXh0ID0gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKHRleHRPZmZzZXQsIGN1cnJlbnRPZmZzZXQgLSB0ZXh0T2Zmc2V0KTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgdGV4dE91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gIFxuICAgICAgLy8gTm90aGluZyBtYXRjaGVzLCBwcm9jZWVkIHRvIG5leHQgY2hhclxuICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgIH1cbiAgXG4gICAgLy8gRGlkIHdlIGZpbmQgYSBsaW5rIHRleHQgKGkuZS4sIGZpbmQgYSBtYXRjaGluZyBjbG9zaW5nIGJyYWNrZXQ/KVxuICAgIGlmIChsaW5rVGV4dCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTsgLy8gTm9wZVxuICBcbiAgICAvLyBTbyBmYXIsIHNvIGdvb2QuIFdlJ3ZlIGdvdCBhIHZhbGlkIGxpbmsgdGV4dC4gTGV0J3Mgc2VlIHdoYXQgdHlwZSBvZiBsaW5rIHRoaXMgaXNcbiAgICBsZXQgbmV4dENoYXIgPSBjdXJyZW50T2Zmc2V0IDwgb3JpZ2luYWxTdHJpbmcubGVuZ3RoID8gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKGN1cnJlbnRPZmZzZXQsIDEpIDogJyc7IFxuXG4gICAgLy8gUkVGRVJFTkNFIExJTktTXG4gICAgaWYgKG5leHRDaGFyID09ICdbJykge1xuICAgICAgbGV0IHN0cmluZyA9IG9yaWdpbmFsU3RyaW5nLnN1YnN0cihjdXJyZW50T2Zmc2V0KTtcbiAgICAgIGxldCBjYXAgPSBpbmxpbmVHcmFtbWFyLmxpbmtMYWJlbC5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICAvLyBWYWxpZCBsaW5rIGxhYmVsXG4gICAgICAgIGN1cnJlbnRPZmZzZXQgKz0gY2FwWzBdLmxlbmd0aDtcbiAgICAgICAgbGlua0xhYmVsLnB1c2goY2FwWzFdLCBjYXBbMl0sIGNhcFszXSk7XG4gICAgICAgIGlmIChjYXBbaW5saW5lR3JhbW1hci5saW5rTGFiZWwubGFiZWxQbGFjZWhvbGRlcl0pIHtcbiAgICAgICAgICAvLyBGdWxsIHJlZmVyZW5jZSBsaW5rXG4gICAgICAgICAgbGlua1JlZiA9IGNhcFtpbmxpbmVHcmFtbWFyLmxpbmtMYWJlbC5sYWJlbFBsYWNlaG9sZGVyXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDb2xsYXBzZWQgcmVmZXJlbmNlIGxpbmtcbiAgICAgICAgICBsaW5rUmVmID0gbGlua1RleHQudHJpbSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3QgYSB2YWxpZCBsaW5rIGxhYmVsXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gICBcbiAgICB9IGVsc2UgaWYgKG5leHRDaGFyICE9ICcoJykge1xuICAgICAgXG4gICAgICAvLyBTaG9ydGN1dCByZWYgbGlua1xuICAgICAgbGlua1JlZiA9IGxpbmtUZXh0LnRyaW0oKTtcblxuICAgIC8vIElOTElORSBMSU5LU1xuICAgIH0gZWxzZSB7IC8vIG5leHRDaGFyID09ICcoJ1xuICAgICAgXG4gICAgICAvLyBQb3RlbnRpYWwgaW5saW5lIGxpbmtcbiAgICAgIGN1cnJlbnRPZmZzZXQrKztcblxuICAgICAgbGV0IHBhcmVudGhlc2lzTGV2ZWwgPSAxO1xuICAgICAgaW5saW5lT3V0ZXI6IHdoaWxlIChjdXJyZW50T2Zmc2V0IDwgb3JpZ2luYWxTdHJpbmcubGVuZ3RoICYmIHBhcmVudGhlc2lzTGV2ZWwgPiAwKSB7XG4gICAgICAgIGxldCBzdHJpbmcgPSBvcmlnaW5hbFN0cmluZy5zdWJzdHIoY3VycmVudE9mZnNldCk7XG5cbiAgICAgICAgLy8gUHJvY2VzcyB3aGl0ZXNwYWNlXG4gICAgICAgIGxldCBjYXAgPSAvXlxccysvLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgaWYgKGNhcCkge1xuICAgICAgICAgIHN3aXRjaCAobGlua0RldGFpbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDA6IGxpbmtEZXRhaWxzLnB1c2goY2FwWzBdKTsgYnJlYWs7IC8vIE9wZW5pbmcgd2hpdGVzcGFjZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOy8vIE9wZW4gZGVzdGluYXRpb24sIGJ1dCBub3QgYSBkZXN0aW5hdGlvbiB5ZXQ7IGRlc2luYXRpb24gb3BlbmVkIHdpdGggPFxuICAgICAgICAgICAgY2FzZSAyOiAvLyBPcGVuIGRlc3RpbmF0aW9uIHdpdGggY29udGVudCBpbiBpdC4gV2hpdGVzcGFjZSBvbmx5IGFsbG93ZWQgaWYgb3BlbmVkIGJ5IGFuZ2xlIGJyYWNrZXQsIG90aGVyd2lzZSB0aGlzIGNsb3NlcyB0aGUgZGVzdGluYXRpb25cbiAgICAgICAgICAgICAgaWYgKGxpbmtEZXRhaWxzWzBdLm1hdGNoKC88LykpIHtcbiAgICAgICAgICAgICAgICBsaW5rRGV0YWlsc1sxXSA9IGxpbmtEZXRhaWxzWzFdLmNvbmNhdChjYXBbMF0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsICE9IDEpIHJldHVybiBmYWxzZTsgLy8gVW5iYWxhbmNlZCBwYXJlbnRoZXNpc1xuICAgICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBFbXB0eSBlbmQgZGVsaW1pdGVyIGZvciBkZXN0aW5hdGlvblxuICAgICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goY2FwWzBdKTsgLy8gV2hpdGVzcGFjZSBpbiBiZXR3ZWVuIGRlc3RpbmF0aW9uIGFuZCB0aXRsZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGJldHdlZW4gZGVzdGluYXRpb24gYW5kIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmYWxzZTsgLy8gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuIChubyBvcGVuZXIgZm9yIHRpdGxlIHlldCwgYnV0IG1vcmUgd2hpdGVzcGFjZSB0byBjYXB0dXJlKVxuICAgICAgICAgICAgY2FzZSA1OiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gV2hpdGVzcGFjZSBhdCBiZWdpbm5pbmcgb2YgdGl0bGUsIHB1c2ggZW1wdHkgdGl0bGUgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBjYXNlIDY6IGxpbmtEZXRhaWxzWzVdID0gbGlua0RldGFpbHNbNV0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGluIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDc6IGxpbmtEZXRhaWxzWzZdID0gbGlua0RldGFpbHNbNl0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBXaGl0ZXNwYWNlIGFmdGVyIGNsb3NpbmcgZGVsaW1pdGVyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7IC8vIFdlIHNob3VsZCBuZXZlciBnZXQgaGVyZVxuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIGJhY2tzbGFzaCBlc2NhcGVzXG4gICAgICAgIGNhcCA9IGlubGluZUdyYW1tYXIuZXNjYXBlLnJlZ2V4cC5leGVjKHN0cmluZyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICBzd2l0Y2ggKGxpbmtEZXRhaWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gdGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYWRkIGVtcHR5IG9wZW5pbmcgZGVsaW1pdGVyIGFuZCBwcm9jZWVkIHRvIG5leHQgY2FzZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7IGJyZWFrOyAvLyBUaGlzIG9wZW5zIHRoZSBsaW5rIGRlc3RpbmF0aW9uLCBhcHBlbmQgaXRcbiAgICAgICAgICAgIGNhc2UgMjogbGlua0RldGFpbHNbMV0gPSBsaW5rRGV0YWlsc1sxXS5jb25jYXQoY2FwWzBdKTsgYnJlYWs7IC8vIFBhcnQgb2YgdGhlIGxpbmsgZGVzdGluYXRpb25cbiAgICAgICAgICAgIGNhc2UgMzogcmV0dXJuIGZhbHNlOyAvLyBMYWNraW5nIG9wZW5pbmcgZGVsaW1pdGVyIGZvciBsaW5rIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBmYWxzZTsgLy8gTGNha2luZyBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA1OiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gVGhpcyBvcGVucyB0aGUgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA2OiBsaW5rRGV0YWlsc1s1XSA9IGxpbmtEZXRhaWxzWzVdLmNvbmNhdChjYXBbMF0pOyBicmVhazsgLy8gUGFydCBvZiB0aGUgbGluayB0aXRsZVxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGZhbHNlOyAvLyBBZnRlciBsaW5rIHRpdGxlIHdhcyBjbG9zZWQsIHdpdGhvdXQgY2xvc2luZyBwYXJlbnRoZXNpc1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50T2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIG9wZW5pbmcgYW5nbGUgYnJhY2tldCBhcyBkZWlsaW1pdGVyIG9mIGRlc3RpbmF0aW9uXG4gICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPCAyICYmIHN0cmluZy5tYXRjaCgvXjwvKSkge1xuICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gMCkgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgbGlua0RldGFpbHNbMF0gPSBsaW5rRGV0YWlsc1swXS5jb25jYXQoJzwnKTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzIGNsb3NpbmcgYW5nbGUgYnJhY2tldCBhcyBkZWxpbWl0ZXIgb2YgZGVzdGluYXRpb25cbiAgICAgICAgaWYgKChsaW5rRGV0YWlscy5sZW5ndGggPT0gMSB8fCBsaW5rRGV0YWlscy5sZW5ndGggPT0gMikgJiYgc3RyaW5nLm1hdGNoKC9ePi8pKSB7XG4gICAgICAgICAgaWYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAxKSBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gRW1wdHkgbGluayBkZXN0aW5hdGlvblxuICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJz4nKTtcbiAgICAgICAgICBjdXJyZW50T2Zmc2V0Kys7XG4gICAgICAgICAgY29udGludWUgaW5saW5lT3V0ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQcm9jZXNzICBub24tcGFyZW50aGVzaXMgZGVsaW1pdGVyIGZvciB0aXRsZS4gXG4gICAgICAgIGNhcCA9IC9eW1wiJ10vLmV4ZWMoc3RyaW5nKVxuICAgICAgICAvLyBGb3IgdGhpcyB0byBiZSBhIHZhbGlkIG9wZW5lciwgd2UgaGF2ZSB0byBlaXRoZXIgaGF2ZSBubyBkZXN0aW5hdGlvbiwgb25seSB3aGl0ZXNwYWNlIHNvIGZhcixcbiAgICAgICAgLy8gb3IgYSBkZXN0aW5hdGlvbiB3aXRoIHRyYWlsaW5nIHdoaXRlc3BhY2UuXG4gICAgICAgIGlmIChjYXAgJiYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAwIHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSAxIHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA0KSkge1xuICAgICAgICAgIHdoaWxlIChsaW5rRGV0YWlscy5sZW5ndGggPCA0KSBsaW5rRGV0YWlscy5wdXNoKCcnKTtcbiAgICAgICAgICBsaW5rRGV0YWlscy5wdXNoKGNhcFswXSk7XG4gICAgICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRm9yIHRoaXMgdG8gYmUgYSB2YWxpZCBjbG9zZXIsIHdlIGhhdmUgdG8gaGF2ZSBhbiBvcGVuZXIgYW5kIHNvbWUgb3Igbm8gdGl0bGUsIGFuZCB0aGlzIGhhcyB0byBtYXRjaCB0aGUgb3BlbmVyXG4gICAgICAgIGlmIChjYXAgJiYgKGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA1IHx8IGxpbmtEZXRhaWxzLmxlbmd0aCA9PSA2KSAmJiBsaW5rRGV0YWlsc1s0XSA9PSBjYXBbMF0pIHtcbiAgICAgICAgICBpZiAobGlua0RldGFpbHMubGVuZ3RoID09IDUpIGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBFbXB0eSBsaW5rIHRpdGxlXG4gICAgICAgICAgbGlua0RldGFpbHMucHVzaChjYXBbMF0pO1xuICAgICAgICAgIGN1cnJlbnRPZmZzZXQrKztcbiAgICAgICAgICBjb250aW51ZSBpbmxpbmVPdXRlcjtcbiAgICAgICAgfVxuICAgICAgICAvLyBPdGhlciBjYXNlcyAobGlua0RldGFpbHMubGVuZ3RoID09IDIsIDMsIDcpIHdpbGwgYmUgaGFuZGxlZCB3aXRoIHRoZSBcImRlZmF1bHRcIiBjYXNlIGJlbG93LlxuXG4gICAgICAgIC8vIFByb2Nlc3Mgb3BlbmluZyBwYXJlbnRoZXNpc1xuICAgICAgICBpZiAoc3RyaW5nLm1hdGNoKC9eXFwoLykpIHtcbiAgICAgICAgICBzd2l0Y2ggKGxpbmtEZXRhaWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gdGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYWRkIGVtcHR5IG9wZW5pbmcgZGVsaW1pdGVyIGFuZCBwcm9jZWVkIHRvIG5leHQgY2FzZVxuICAgICAgICAgICAgY2FzZSAxOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgLy8gVGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvblxuICAgICAgICAgICAgY2FzZSAyOiAvLyBQYXJ0IG9mIHRoZSBsaW5rIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICAgIGxpbmtEZXRhaWxzWzFdID0gbGlua0RldGFpbHNbMV0uY29uY2F0KCcoJyk7IFxuICAgICAgICAgICAgICBpZiAoIWxpbmtEZXRhaWxzWzBdLm1hdGNoKC88JC8pKSBwYXJlbnRoZXNpc0xldmVsKys7ICBcbiAgICAgICAgICAgICAgYnJlYWs7IFxuICAgICAgICAgICAgY2FzZSAzOiBsaW5rRGV0YWlscy5wdXNoKCcnKTsgIC8vICBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA0OiBsaW5rRGV0YWlscy5wdXNoKCcoJyk7IGJyZWFrOy8vIG9wZW5pbmcgZGVsaW1pdGVyIGZvciBsaW5rIHRpdGxlXG4gICAgICAgICAgICBjYXNlIDU6IGxpbmtEZXRhaWxzLnB1c2goJycpOyAvLyBvcGVucyB0aGUgbGluayB0aXRsZSwgYWRkIGVtcHR5IHRpdGxlIGNvbnRlbnQgYW5kIHByb2NlZWQgdG8gbmV4dCBjYXNlIFxuICAgICAgICAgICAgY2FzZSA2Oi8vIFBhcnQgb2YgdGhlIGxpbmsgdGl0bGUuIFVuLWVzY2FwZWQgcGFyZW50aGVzaXMgb25seSBhbGxvd2VkIGluIFwiIG9yICcgZGVsaW1pdGVkIHRpdGxlXG4gICAgICAgICAgICAgIGlmIChsaW5rRGV0YWlsc1s0XSA9PSAnKCcpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgbGlua0RldGFpbHNbNV0gPSBsaW5rRGV0YWlsc1s1XS5jb25jYXQoJygnKTsgXG4gICAgICAgICAgICAgIGJyZWFrOyBcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTsgLy8gQWZ0ZXIgbGluayB0aXRsZSB3YXMgY2xvc2VkLCB3aXRob3V0IGNsb3NpbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudE9mZnNldCsrO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUHJvY2VzcyBjbG9zaW5nIHBhcmVudGhlc2lzXG4gICAgICAgIGlmIChzdHJpbmcubWF0Y2goL15cXCkvKSkge1xuICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPD0gMikge1xuICAgICAgICAgICAgLy8gV2UgYXJlIGluc2lkZSB0aGUgbGluayBkZXN0aW5hdGlvbi4gUGFyZW50aGVzZXMgaGF2ZSB0byBiZSBtYXRjaGVkIGlmIG5vdCBpbiBhbmdsZSBicmFja2V0c1xuICAgICAgICAgICAgd2hpbGUgKGxpbmtEZXRhaWxzLmxlbmd0aCA8IDIpIGxpbmtEZXRhaWxzLnB1c2goJycpO1xuXG4gICAgICAgICAgICBpZiAoIWxpbmtEZXRhaWxzWzBdLm1hdGNoKC88JC8pKSBwYXJlbnRoZXNpc0xldmVsLS07XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID4gMCkge1xuICAgICAgICAgICAgICBsaW5rRGV0YWlsc1sxXSA9IGxpbmtEZXRhaWxzWzFdLmNvbmNhdCgnKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSBlbHNlIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gNSB8fCBsaW5rRGV0YWlscy5sZW5ndGggPT0gNikge1xuICAgICAgICAgICAgLy8gV2UgYXJlIGluc2lkZSB0aGUgbGluayB0aXRsZS4gXG4gICAgICAgICAgICBpZiAobGlua0RldGFpbHNbNF0gPT0gJygnKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgY2xvc2VzIHRoZSBsaW5rIHRpdGxlXG4gICAgICAgICAgICAgIGlmIChsaW5rRGV0YWlscy5sZW5ndGggPT0gNSkgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgICAgIGxpbmtEZXRhaWxzLnB1c2goJyknKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEp1c3QgcmVndWxhciBvbCcgY29udGVudFxuICAgICAgICAgICAgICBpZiAobGlua0RldGFpbHMubGVuZ3RoID09IDUpIGxpbmtEZXRhaWxzLnB1c2goJyknKTtcbiAgICAgICAgICAgICAgZWxzZSBsaW5rRGV0YWlsc1s1XSA9IGxpbmtEZXRhaWxzWzVdLmNvbmNhdCgnKScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSAge1xuICAgICAgICAgICAgcGFyZW50aGVzaXNMZXZlbC0tOyAvLyBUaGlzIHNob3VsZCBkZWNyZWFzZSBpdCBmcm9tIDEgdG8gMC4uLlxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID09IDApIHtcbiAgICAgICAgICAgIC8vIE5vIGludmFsaWQgY29uZGl0aW9uLCBsZXQncyBtYWtlIHN1cmUgdGhlIGxpbmtEZXRhaWxzIGFycmF5IGlzIGNvbXBsZXRlXG4gICAgICAgICAgICB3aGlsZSAobGlua0RldGFpbHMubGVuZ3RoIDwgNykgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICAgICAgfSBcblxuICAgICAgICAgIGN1cnJlbnRPZmZzZXQrKztcbiAgICAgICAgICBjb250aW51ZSBpbmxpbmVPdXRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFueSBvbGQgY2hhcmFjdGVyXG4gICAgICAgIGNhcCA9IC9eLi8uZXhlYyhzdHJpbmcpO1xuICAgICAgICBpZiAoY2FwKSB7XG4gICAgICAgICAgc3dpdGNoIChsaW5rRGV0YWlscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMDogbGlua0RldGFpbHMucHVzaCgnJyk7IC8vIHRoaXMgb3BlbnMgdGhlIGxpbmsgZGVzdGluYXRpb24sIGFkZCBlbXB0eSBvcGVuaW5nIGRlbGltaXRlciBhbmQgcHJvY2VlZCB0byBuZXh0IGNhc2VcbiAgICAgICAgICAgIGNhc2UgMTogbGlua0RldGFpbHMucHVzaChjYXBbMF0pOyBicmVhazsgLy8gVGhpcyBvcGVucyB0aGUgbGluayBkZXN0aW5hdGlvbiwgYXBwZW5kIGl0XG4gICAgICAgICAgICBjYXNlIDI6IGxpbmtEZXRhaWxzWzFdID0gbGlua0RldGFpbHNbMV0uY29uY2F0KGNhcFswXSk7IGJyZWFrOyAvLyBQYXJ0IG9mIHRoZSBsaW5rIGRlc3RpbmF0aW9uXG4gICAgICAgICAgICBjYXNlIDM6IHJldHVybiBmYWxzZTsgLy8gTGFja2luZyBvcGVuaW5nIGRlbGltaXRlciBmb3IgbGluayB0aXRsZVxuICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gZmFsc2U7IC8vIExjYWtpbmcgb3BlbmluZyBkZWxpbWl0ZXIgZm9yIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGNhc2UgNTogbGlua0RldGFpbHMucHVzaCgnJyk7IC8vIFRoaXMgb3BlbnMgdGhlIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGNhc2UgNjogbGlua0RldGFpbHNbNV0gPSBsaW5rRGV0YWlsc1s1XS5jb25jYXQoY2FwWzBdKTsgYnJlYWs7IC8vIFBhcnQgb2YgdGhlIGxpbmsgdGl0bGVcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBmYWxzZTsgLy8gQWZ0ZXIgbGluayB0aXRsZSB3YXMgY2xvc2VkLCB3aXRob3V0IGNsb3NpbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudE9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIGNvbnRpbnVlIGlubGluZU91dGVyO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IFwiSW5maW5pdGUgbG9vcFwiOyAvLyB3ZSBzaG91bGQgbmV2ZXIgZ2V0IGhlcmUgc2luY2UgdGhlIGxhc3QgdGVzdCBtYXRjaGVzIGFueSBjaGFyYWN0ZXJcbiAgICAgIH1cbiAgICAgIGlmIChwYXJlbnRoZXNpc0xldmVsID4gMCkgcmV0dXJuIGZhbHNlOyAvLyBQYXJlbnRoZXMoZXMpIG5vdCBjbG9zZWRcblxuICAgIH1cblxuICAgIGlmIChsaW5rUmVmICE9PSBmYWxzZSkge1xuICAgICAgLy8gUmVmIGxpbms7IGNoZWNrIHRoYXQgbGlua1JlZiBpcyB2YWxpZFxuICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG4gICAgICBmb3IgKGxldCBsYWJlbCBvZiB0aGlzLmxpbmtMYWJlbHMpIHtcbiAgICAgICAgaWYgKGxhYmVsID09IGxpbmtSZWYpIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxldCBsYWJlbCA9IHZhbGlkID8gXCJUTUxpbmtMYWJlbCBUTUxpbmtMYWJlbF9WYWxpZFwiIDogXCJUTUxpbmtMYWJlbCBUTUxpbmtMYWJlbF9JbnZhbGlkXCJcbiAgICAgIGxldCBvdXRwdXQgPSBgPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke29wZW5lcn08L3NwYW4+PHNwYW4gY2xhc3M9XCIke3R5cGV9ICR7KGxpbmtMYWJlbC5sZW5ndGggPCAzIHx8ICFsaW5rTGFiZWxbMV0pID8gbGFiZWwgOiBcIlwifVwiPiR7dGhpcy5wcm9jZXNzSW5saW5lU3R5bGVzKGxpbmtUZXh0KX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj5dPC9zcGFuPmA7XG5cbiAgICAgIGlmIChsaW5rTGFiZWwubGVuZ3RoID49IDMpIHtcbiAgICAgICAgb3V0cHV0ID0gb3V0cHV0LmNvbmNhdChcbiAgICAgICAgICBgPHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke2xpbmtMYWJlbFswXX08L3NwYW4+YCxcbiAgICAgICAgICBgPHNwYW4gY2xhc3M9XCIke2xhYmVsfVwiPiR7bGlua0xhYmVsWzFdfTwvc3Bhbj5gLFxuICAgICAgICAgIGA8c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfJHt0eXBlfVwiPiR7bGlua0xhYmVsWzJdfTwvc3Bhbj5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvdXRwdXQgOiBvdXRwdXQsXG4gICAgICAgIGNoYXJDb3VudCA6ICBjdXJyZW50T2Zmc2V0XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGxpbmtEZXRhaWxzKSB7XG4gICAgICAvLyBJbmxpbmUgbGlua1xuXG4gICAgICAvLyBUaGlzIHNob3VsZCBuZXZlciBoYXBwZW4sIGJ1dCBiZXR0ZXIgc2FmZSB0aGFuIHNvcnJ5LlxuICAgICAgd2hpbGUgKGxpbmtEZXRhaWxzLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgbGlua0RldGFpbHMucHVzaCgnJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG91dHB1dDogYDxzcGFuIGNsYXNzPVwiVE1NYXJrIFRNTWFya18ke3R5cGV9XCI+JHtvcGVuZXJ9PC9zcGFuPjxzcGFuIGNsYXNzPVwiJHt0eXBlfVwiPiR7dGhpcy5wcm9jZXNzSW5saW5lU3R5bGVzKGxpbmtUZXh0KX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj5dKCR7bGlua0RldGFpbHNbMF19PC9zcGFuPjxzcGFuIGNsYXNzPVwiJHt0eXBlfURlc3RpbmF0aW9uXCI+JHtsaW5rRGV0YWlsc1sxXX08L3NwYW4+PHNwYW4gY2xhc3M9XCJUTU1hcmsgVE1NYXJrXyR7dHlwZX1cIj4ke2xpbmtEZXRhaWxzWzJdfSR7bGlua0RldGFpbHNbM119JHtsaW5rRGV0YWlsc1s0XX08L3NwYW4+PHNwYW4gY2xhc3M9XCIke3R5cGV9VGl0bGVcIj4ke2xpbmtEZXRhaWxzWzVdfTwvc3Bhbj48c3BhbiBjbGFzcz1cIlRNTWFyayBUTU1hcmtfJHt0eXBlfVwiPiR7bGlua0RldGFpbHNbNl19KTwvc3Bhbj5gLFxuICAgICAgICBjaGFyQ291bnQ6IGN1cnJlbnRPZmZzZXRcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgbWFya2Rvd24gc3RyaW5nIGFzIEhUTUwsIHVzaW5nIE1hcmtkb3duIGlubGluZSBmb3JtYXR0aW5nLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gb3JpZ2luYWxTdHJpbmcgVGhlIGlucHV0IChtYXJrZG93biBpbmxpbmUgZm9ybWF0dGVkKSBzdHJpbmdcbiAgICogQHJldHVybnMge3N0cmluZ30gVGhlIEhUTUwgZm9ybWF0dGVkIG91dHB1dFxuICAgKi9cbiAgcHJvY2Vzc0lubGluZVN0eWxlcyhvcmlnaW5hbFN0cmluZykge1xuICAgIGxldCBwcm9jZXNzZWQgPSAnJztcbiAgICBsZXQgc3RhY2sgPSBbXTsgLy8gU3RhY2sgaXMgYW4gYXJyYXkgb2Ygb2JqZWN0cyBvZiB0aGUgZm9ybWF0OiB7ZGVsaW1pdGVyLCBkZWxpbVN0cmluZywgY291bnQsIG91dHB1dH1cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgc3RyaW5nID0gb3JpZ2luYWxTdHJpbmc7XG4gIFxuICBcbiAgICBvdXRlcjogd2hpbGUgKHN0cmluZykge1xuICAgICAgLy8gUHJvY2VzcyBzaW1wbGUgcnVsZXMgKG5vbi1kZWxpbWl0ZXIpXG4gICAgICBmb3IgKGxldCBydWxlIG9mIFsnZXNjYXBlJywgJ2NvZGUnLCAnYXV0b2xpbmsnLCAnaHRtbCddKSB7XG4gICAgICAgIGxldCBjYXAgPSBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlZ2V4cC5leGVjKHN0cmluZyk7XG4gICAgICAgIGlmIChjYXApIHtcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyKGNhcFswXS5sZW5ndGgpO1xuICAgICAgICAgIG9mZnNldCArPSBjYXBbMF0ubGVuZ3RoO1xuICAgICAgICAgIHByb2Nlc3NlZCArPSBpbmxpbmVHcmFtbWFyW3J1bGVdLnJlcGxhY2VtZW50XG4gICAgICAgICAgICAvLyAucmVwbGFjZSgvXFwkXFwkKFsxLTldKS9nLCAoc3RyLCBwMSkgPT4gcHJvY2Vzc0lubGluZVN0eWxlcyhjYXBbcDFdKSkgLy8gdG9kbyByZWN1cnNpdmUgY2FsbGluZ1xuICAgICAgICAgICAgLnJlcGxhY2UoL1xcJChbMS05XSkvZywgKHN0ciwgcDEpID0+IGh0bWxlc2NhcGUoY2FwW3AxXSkpO1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyOyBcbiAgICAgICAgfVxuICAgICAgfVxuICBcbiAgICAgIC8vIENoZWNrIGZvciBsaW5rcyAvIGltYWdlc1xuICAgICAgbGV0IHBvdGVudGlhbExpbmsgPSBzdHJpbmcubWF0Y2goaW5saW5lR3JhbW1hci5saW5rT3Blbi5yZWdleHApO1xuICAgICAgbGV0IHBvdGVudGlhbEltYWdlID0gc3RyaW5nLm1hdGNoKGlubGluZUdyYW1tYXIuaW1hZ2VPcGVuLnJlZ2V4cCk7XG4gICAgICBpZiAocG90ZW50aWFsSW1hZ2UgfHwgcG90ZW50aWFsTGluaykge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5wYXJzZUxpbmtPckltYWdlKHN0cmluZywgcG90ZW50aWFsSW1hZ2UpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gYCR7cHJvY2Vzc2VkfSR7cmVzdWx0Lm91dHB1dH1gO1xuICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIocmVzdWx0LmNoYXJDb3VudCk7XG4gICAgICAgICAgb2Zmc2V0ICs9IHJlc3VsdC5jaGFyQ291bnQ7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQ2hlY2sgZm9yIGVtIC8gc3Ryb25nIGRlbGltaXRlcnNcbiAgICAgIGxldCBjYXAgPSAvKF5cXCorKXwoXl8rKS8uZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICBsZXQgZGVsaW1Db3VudCA9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIGNvbnN0IGRlbGltU3RyaW5nID0gY2FwWzBdO1xuICAgICAgICBjb25zdCBjdXJyZW50RGVsaW1pdGVyID0gY2FwWzBdWzBdOyAvLyBUaGlzIHNob3VsZCBiZSAqIG9yIF9cbiAgXG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIoY2FwWzBdLmxlbmd0aCk7XG4gICAgICBcbiAgICAgICAgLy8gV2UgaGF2ZSBhIGRlbGltaXRlciBydW4uIExldCdzIGNoZWNrIGlmIGl0IGNhbiBvcGVuIG9yIGNsb3NlIGFuIGVtcGhhc2lzLlxuICAgICAgICBcbiAgICAgICAgY29uc3QgcHJlY2VkaW5nID0gKG9mZnNldCA+IDApID8gb3JpZ2luYWxTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCkgOiAnICc7IC8vIGJlZ2lubmluZyBhbmQgZW5kIG9mIGxpbmUgY291bnQgYXMgd2hpdGVzcGFjZVxuICAgICAgICBjb25zdCBmb2xsb3dpbmcgPSAob2Zmc2V0ICsgY2FwWzBdLmxlbmd0aCA8IG9yaWdpbmFsU3RyaW5nLmxlbmd0aCkgPyBzdHJpbmcgOiAnICc7XG4gIFxuICAgICAgICBjb25zdCBwdW5jdHVhdGlvbkZvbGxvd3MgPSBmb2xsb3dpbmcubWF0Y2gocHVuY3R1YXRpb25MZWFkaW5nKTtcbiAgICAgICAgY29uc3QgcHVuY3R1YXRpb25QcmVjZWRlcyA9IHByZWNlZGluZy5tYXRjaChwdW5jdHVhdGlvblRyYWlsaW5nKTtcbiAgICAgICAgY29uc3Qgd2hpdGVzcGFjZUZvbGxvd3MgPSBmb2xsb3dpbmcubWF0Y2goL15cXHMvKTtcbiAgICAgICAgY29uc3Qgd2hpdGVzcGFjZVByZWNlZGVzID0gcHJlY2VkaW5nLm1hdGNoKC9cXHMkLyk7XG4gIFxuICAgICAgICAvLyBUaGVzZSBhcmUgdGhlIHJ1bGVzIGZvciByaWdodC1mbGFua2luZyBhbmQgbGVmdC1mbGFua2luZyBkZWxpbWl0ZXIgcnVucyBhcyBwZXIgQ29tbW9uTWFyayBzcGVjXG4gICAgICAgIGxldCBjYW5PcGVuID0gIXdoaXRlc3BhY2VGb2xsb3dzICYmICghcHVuY3R1YXRpb25Gb2xsb3dzIHx8ICEhd2hpdGVzcGFjZVByZWNlZGVzIHx8ICEhcHVuY3R1YXRpb25QcmVjZWRlcyk7XG4gICAgICAgIGxldCBjYW5DbG9zZSA9ICF3aGl0ZXNwYWNlUHJlY2VkZXMgJiYgKCFwdW5jdHVhdGlvblByZWNlZGVzIHx8ICEhd2hpdGVzcGFjZUZvbGxvd3MgfHwgISFwdW5jdHVhdGlvbkZvbGxvd3MpO1xuICBcbiAgICAgICAgLy8gVW5kZXJzY29yZXMgaGF2ZSBtb3JlIGRldGFpbGVkIHJ1bGVzIHRoYW4ganVzdCBiZWluZyBwYXJ0IG9mIGxlZnQtIG9yIHJpZ2h0LWZsYW5raW5nIHJ1bjpcbiAgICAgICAgaWYgKGN1cnJlbnREZWxpbWl0ZXIgPT0gJ18nICYmIGNhbk9wZW4gJiYgY2FuQ2xvc2UpIHtcbiAgICAgICAgICBjYW5PcGVuID0gcHVuY3R1YXRpb25QcmVjZWRlcztcbiAgICAgICAgICBjYW5DbG9zZSA9IHB1bmN0dWF0aW9uRm9sbG93cztcbiAgICAgICAgfVxuICBcbiAgICAgICAgLy8gSWYgdGhlIGRlbGltaXRlciBjYW4gY2xvc2UsIGNoZWNrIHRoZSBzdGFjayBpZiB0aGVyZSdzIHNvbWV0aGluZyBpdCBjYW4gY2xvc2VcbiAgICAgICAgaWYgKGNhbkNsb3NlKSB7XG4gICAgICAgICAgbGV0IHN0YWNrUG9pbnRlciA9IHN0YWNrLmxlbmd0aCAtIDE7XG4gICAgICAgICAgLy8gU2VlIGlmIHdlIGNhbiBmaW5kIGEgbWF0Y2hpbmcgb3BlbmluZyBkZWxpbWl0ZXIsIG1vdmUgZG93biB0aHJvdWdoIHRoZSBzdGFja1xuICAgICAgICAgIHdoaWxlIChkZWxpbUNvdW50ICYmIHN0YWNrUG9pbnRlciA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5kZWxpbWl0ZXIgPT0gY3VycmVudERlbGltaXRlcikge1xuICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGRlbGltaXRlciwgbGV0J3MgY29uc3RydWN0IHRoZSBmb3JtYXR0ZWQgc3RyaW5nXG4gIFxuICAgICAgICAgICAgICAvLyBGaXJzdGx5LCBpZiB3ZSBza2lwcGVkIGFueSBzdGFjayBsZXZlbHMsIHBvcCB0aGVtIGltbWVkaWF0ZWx5IChub24tbWF0Y2hpbmcgZGVsaW1pdGVycylcbiAgICAgICAgICAgICAgd2hpbGUgKHN0YWNrUG9pbnRlciA8IHN0YWNrLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZCA9IGAke2VudHJ5Lm91dHB1dH0ke2VudHJ5LmRlbGltU3RyaW5nLnN1YnN0cigwLCBlbnRyeS5jb3VudCl9JHtwcm9jZXNzZWR9YDtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgICAgLy8gVGhlbiwgZm9ybWF0IHRoZSBzdHJpbmdcbiAgICAgICAgICAgICAgaWYgKGRlbGltQ291bnQgPj0gMiAmJiBzdGFja1tzdGFja1BvaW50ZXJdLmNvdW50ID49IDIpIHtcbiAgICAgICAgICAgICAgICAvLyBTdHJvbmdcbiAgICAgICAgICAgICAgICBwcm9jZXNzZWQgPSBgPHNwYW4gY2xhc3M9XCJUTU1hcmtcIj4ke2N1cnJlbnREZWxpbWl0ZXJ9JHtjdXJyZW50RGVsaW1pdGVyfTwvc3Bhbj48c3Ryb25nIGNsYXNzPVwiVE1TdHJvbmdcIj4ke3Byb2Nlc3NlZH08L3N0cm9uZz48c3BhbiBjbGFzcz1cIlRNTWFya1wiPiR7Y3VycmVudERlbGltaXRlcn0ke2N1cnJlbnREZWxpbWl0ZXJ9PC9zcGFuPmA7XG4gICAgICAgICAgICAgICAgZGVsaW1Db3VudCAtPSAyO1xuICAgICAgICAgICAgICAgIHN0YWNrW3N0YWNrUG9pbnRlcl0uY291bnQgLT0gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBFbVxuICAgICAgICAgICAgICAgIHByb2Nlc3NlZCA9IGA8c3BhbiBjbGFzcz1cIlRNTWFya1wiPiR7Y3VycmVudERlbGltaXRlcn08L3NwYW4+PGVtIGNsYXNzPVwiVE1FbVwiPiR7cHJvY2Vzc2VkfTwvZW0+PHNwYW4gY2xhc3M9XCJUTU1hcmtcIj4ke2N1cnJlbnREZWxpbWl0ZXJ9PC9zcGFuPmA7XG4gICAgICAgICAgICAgICAgZGVsaW1Db3VudCAtPSAxO1xuICAgICAgICAgICAgICAgIHN0YWNrW3N0YWNrUG9pbnRlcl0uY291bnQgLT0gMTtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgICAgLy8gSWYgdGhhdCBzdGFjayBsZXZlbCBpcyBlbXB0eSBub3csIHBvcCBpdFxuICAgICAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5jb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IGVudHJ5ID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7cHJvY2Vzc2VkfWBcbiAgICAgICAgICAgICAgICBzdGFja1BvaW50ZXItLTtcbiAgICAgICAgICAgICAgfVxuICBcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgc3RhY2sgbGV2ZWwncyBkZWxpbWl0ZXIgdHlwZSBkb2Vzbid0IG1hdGNoIHRoZSBjdXJyZW50IGRlbGltaXRlciB0eXBlXG4gICAgICAgICAgICAgIC8vIEdvIGRvd24gb25lIGxldmVsIGluIHRoZSBzdGFja1xuICAgICAgICAgICAgICBzdGFja1BvaW50ZXItLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgdGhlcmUgYXJlIHN0aWxsIGRlbGltaXRlcnMgbGVmdCwgYW5kIHRoZSBkZWxpbWl0ZXIgcnVuIGNhbiBvcGVuLCBwdXNoIGl0IG9uIHRoZSBzdGFja1xuICAgICAgICBpZiAoZGVsaW1Db3VudCAmJiBjYW5PcGVuKSB7XG4gICAgICAgICAgc3RhY2sucHVzaCh7XG4gICAgICAgICAgICBkZWxpbWl0ZXI6IGN1cnJlbnREZWxpbWl0ZXIsXG4gICAgICAgICAgICBkZWxpbVN0cmluZzogZGVsaW1TdHJpbmcsXG4gICAgICAgICAgICBjb3VudDogZGVsaW1Db3VudCxcbiAgICAgICAgICAgIG91dHB1dDogcHJvY2Vzc2VkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gJyc7IC8vIEN1cnJlbnQgZm9ybWF0dGVkIG91dHB1dCBoYXMgYmVlbiBwdXNoZWQgb24gdGhlIHN0YWNrIGFuZCB3aWxsIGJlIHByZXBlbmRlZCB3aGVuIHRoZSBzdGFjayBnZXRzIHBvcHBlZFxuICAgICAgICAgIGRlbGltQ291bnQgPSAwO1xuICAgICAgICB9XG4gIFxuICAgICAgICAvLyBBbnkgZGVsaW1pdGVycyB0aGF0IGFyZSBsZWZ0IChjbG9zaW5nIHVubWF0Y2hlZCkgYXJlIGFwcGVuZGVkIHRvIHRoZSBvdXRwdXQuXG4gICAgICAgIGlmIChkZWxpbUNvdW50KSB7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gYCR7cHJvY2Vzc2VkfSR7ZGVsaW1TdHJpbmcuc3Vic3RyKDAsZGVsaW1Db3VudCl9YDtcbiAgICAgICAgfVxuICBcbiAgICAgICAgb2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3Igc3RyaWtldGhyb3VnaCBkZWxpbWl0ZXJcbiAgICAgIGNhcCA9IC9efn4vLmV4ZWMoc3RyaW5nKTtcbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgbGV0IGNvbnN1bWVkID0gZmFsc2U7XG4gICAgICAgIGxldCBzdGFja1BvaW50ZXIgPSBzdGFjay5sZW5ndGggLSAxO1xuICAgICAgICAvLyBTZWUgaWYgd2UgY2FuIGZpbmQgYSBtYXRjaGluZyBvcGVuaW5nIGRlbGltaXRlciwgbW92ZSBkb3duIHRocm91Z2ggdGhlIHN0YWNrXG4gICAgICAgIHdoaWxlICghY29uc3VtZWQgJiYgc3RhY2tQb2ludGVyID49IDApIHtcbiAgICAgICAgICBpZiAoc3RhY2tbc3RhY2tQb2ludGVyXS5kZWxpbWl0ZXIgPT0gJ34nKSB7XG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGRlbGltaXRlciwgbGV0J3MgY29uc3RydWN0IHRoZSBmb3JtYXR0ZWQgc3RyaW5nXG5cbiAgICAgICAgICAgIC8vIEZpcnN0bHksIGlmIHdlIHNraXBwZWQgYW55IHN0YWNrIGxldmVscywgcG9wIHRoZW0gaW1tZWRpYXRlbHkgKG5vbi1tYXRjaGluZyBkZWxpbWl0ZXJzKVxuICAgICAgICAgICAgd2hpbGUgKHN0YWNrUG9pbnRlciA8IHN0YWNrLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7ZW50cnkuZGVsaW1TdHJpbmcuc3Vic3RyKDAsIGVudHJ5LmNvdW50KX0ke3Byb2Nlc3NlZH1gO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGVuLCBmb3JtYXQgdGhlIHN0cmluZ1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0gYDxzcGFuIGNsYXNzPVwiVE1NYXJrXCI+fn48L3NwYW4+PGRlbCBjbGFzcz1cIlRNU3RyaWtldGhyb3VnaFwiPiR7cHJvY2Vzc2VkfTwvZGVsPjxzcGFuIGNsYXNzPVwiVE1NYXJrXCI+fn48L3NwYW4+YDtcbiAgICAgICAgICAgIGxldCBlbnRyeSA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgcHJvY2Vzc2VkID0gYCR7ZW50cnkub3V0cHV0fSR7cHJvY2Vzc2VkfWBcbiAgICAgICAgICAgIGNvbnN1bWVkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhpcyBzdGFjayBsZXZlbCdzIGRlbGltaXRlciB0eXBlIGRvZXNuJ3QgbWF0Y2ggdGhlIGN1cnJlbnQgZGVsaW1pdGVyIHR5cGVcbiAgICAgICAgICAgIC8vIEdvIGRvd24gb25lIGxldmVsIGluIHRoZSBzdGFja1xuICAgICAgICAgICAgc3RhY2tQb2ludGVyLS07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgc3RpbGwgZGVsaW1pdGVycyBsZWZ0LCBhbmQgdGhlIGRlbGltaXRlciBydW4gY2FuIG9wZW4sIHB1c2ggaXQgb24gdGhlIHN0YWNrXG4gICAgICAgIGlmICghY29uc3VtZWQpIHtcbiAgICAgICAgICBzdGFjay5wdXNoKHtcbiAgICAgICAgICAgIGRlbGltaXRlcjogJ34nLFxuICAgICAgICAgICAgZGVsaW1TdHJpbmc6ICd+ficsXG4gICAgICAgICAgICBjb3VudDogMixcbiAgICAgICAgICAgIG91dHB1dDogcHJvY2Vzc2VkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcHJvY2Vzc2VkID0gJyc7IC8vIEN1cnJlbnQgZm9ybWF0dGVkIG91dHB1dCBoYXMgYmVlbiBwdXNoZWQgb24gdGhlIHN0YWNrIGFuZCB3aWxsIGJlIHByZXBlbmRlZCB3aGVuIHRoZSBzdGFjayBnZXRzIHBvcHBlZFxuICAgICAgICB9XG5cbiAgICAgICAgb2Zmc2V0ICs9IGNhcFswXS5sZW5ndGg7XG4gICAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHIoY2FwWzBdLmxlbmd0aCk7IFxuICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgIH1cbiAgICAgIFxuICBcbiAgICAgIC8vIFByb2Nlc3MgJ2RlZmF1bHQnIHJ1bGVcbiAgICAgIGNhcCA9IGlubGluZUdyYW1tYXIuZGVmYXVsdC5yZWdleHAuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKGNhcCkge1xuICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyKGNhcFswXS5sZW5ndGgpO1xuICAgICAgICBvZmZzZXQgKz0gY2FwWzBdLmxlbmd0aDtcbiAgICAgICAgcHJvY2Vzc2VkICs9IGlubGluZUdyYW1tYXIuZGVmYXVsdC5yZXBsYWNlbWVudFxuICAgICAgICAgIC5yZXBsYWNlKC9cXCQoWzEtOV0pL2csIChzdHIsIHAxKSA9PiBodG1sZXNjYXBlKGNhcFtwMV0pKTtcbiAgICAgICAgY29udGludWUgb3V0ZXI7IFxuICAgICAgfVxuICAgICAgdGhyb3cgJ0luZmluaXRlIGxvb3AhJztcbiAgICB9XG4gIFxuICAgIC8vIEVtcHR5IHRoZSBzdGFjaywgYW55IG9wZW5pbmcgZGVsaW1pdGVycyBhcmUgdW51c2VkXG4gICAgd2hpbGUgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW50cnkgPSBzdGFjay5wb3AoKTtcbiAgICAgIHByb2Nlc3NlZCA9IGAke2VudHJ5Lm91dHB1dH0ke2VudHJ5LmRlbGltU3RyaW5nLnN1YnN0cigwLCBlbnRyeS5jb3VudCl9JHtwcm9jZXNzZWR9YDtcbiAgICB9XG4gIFxuICAgIHJldHVybiBwcm9jZXNzZWQ7XG4gIH1cblxuICAvKiogXG4gICAqIENsZWFycyB0aGUgbGluZSBkaXJ0eSBmbGFnIChyZXNldHMgaXQgdG8gYW4gYXJyYXkgb2YgZmFsc2UpXG4gICAqL1xuICBjbGVhckRpcnR5RmxhZygpIHtcbiAgICB0aGlzLmxpbmVEaXJ0eSA9IG5ldyBBcnJheSh0aGlzLmxpbmVzLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmVEaXJ0eS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5saW5lRGlydHlbaV0gPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY2xhc3MgcHJvcGVydGllcyAobGluZXMsIGxpbmVFbGVtZW50cykgZnJvbSB0aGUgRE9NLlxuICAgKiBAcmV0dXJucyB0cnVlIGlmIGNvbnRlbnRzIGNoYW5nZWRcbiAgICovXG4gIHVwZGF0ZUxpbmVDb250ZW50cygpIHtcbiAgICAvLyB0aGlzLmxpbmVEaXJ0eSA9IFtdOyBcbiAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIGNoYW5nZWQgYW55dGhpbmcgYWJvdXQgdGhlIG51bWJlciBvZiBsaW5lcyAoaW5zZXJ0ZWQgb3IgZGVsZXRlZCBhIHBhcmFncmFwaClcbiAgICAvLyA8IDAgbWVhbnMgbGluZShzKSByZW1vdmVkOyA+IDAgbWVhbnMgbGluZShzKSBhZGRlZFxuICAgIGxldCBsaW5lRGVsdGEgPSB0aGlzLmUuY2hpbGRFbGVtZW50Q291bnQgLSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgICBpZiAobGluZURlbHRhKSB7XG4gICAgICAvLyB5dXAuIExldCdzIHRyeSBob3cgbXVjaCB3ZSBjYW4gc2FsdmFnZSAoZmluZCBvdXQgd2hpY2ggbGluZXMgZnJvbSBiZWdpbm5pbmcgYW5kIGVuZCB3ZXJlIHVuY2hhbmdlZClcbiAgICAgIC8vIEZpbmQgbGluZXMgZnJvbSB0aGUgYmVnaW5uaW5nIHRoYXQgaGF2ZW4ndCBjaGFuZ2VkLi4uXG4gICAgICBsZXQgZmlyc3RDaGFuZ2VkTGluZSA9IDA7XG4gICAgICB3aGlsZSAoXG4gICAgICAgICAgZmlyc3RDaGFuZ2VkTGluZSA8PSB0aGlzLmxpbmVzLmxlbmd0aCBcbiAgICAgICAgICAmJiBmaXJzdENoYW5nZWRMaW5lIDw9IHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aFxuICAgICAgICAgICYmIHRoaXMubGluZUVsZW1lbnRzW2ZpcnN0Q2hhbmdlZExpbmVdIC8vIENoZWNrIHRoYXQgdGhlIGxpbmUgZWxlbWVudCBoYXNuJ3QgYmVlbiBkZWxldGVkXG4gICAgICAgICAgJiYgdGhpcy5saW5lc1tmaXJzdENoYW5nZWRMaW5lXSA9PSB0aGlzLmxpbmVFbGVtZW50c1tmaXJzdENoYW5nZWRMaW5lXS50ZXh0Q29udGVudFxuICAgICAgKSB7XG4gICAgICAgIGZpcnN0Q2hhbmdlZExpbmUrKztcbiAgICAgIH1cblxuICAgICAgLy8gRW5kIGFsc28gZnJvbSB0aGUgZW5kXG4gICAgICBsZXQgbGFzdENoYW5nZWRMaW5lID0gLTE7XG4gICAgICB3aGlsZSAoXG4gICAgICAgICAgLWxhc3RDaGFuZ2VkTGluZSA8IHRoaXMubGluZXMubGVuZ3RoIFxuICAgICAgICAgICYmIC1sYXN0Q2hhbmdlZExpbmUgPCB0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGhcbiAgICAgICAgICAmJiB0aGlzLmxpbmVzW3RoaXMubGluZXMubGVuZ3RoICsgbGFzdENoYW5nZWRMaW5lXSA9PSB0aGlzLmxpbmVFbGVtZW50c1t0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGggKyBsYXN0Q2hhbmdlZExpbmVdLnRleHRDb250ZW50XG4gICAgICApIHtcbiAgICAgICAgbGFzdENoYW5nZWRMaW5lLS07XG4gICAgICB9XG5cbiAgICAgIGxldCBsaW5lc1RvRGVsZXRlID0gdGhpcy5saW5lcy5sZW5ndGggKyBsYXN0Q2hhbmdlZExpbmUgKyAxIC0gZmlyc3RDaGFuZ2VkTGluZTtcbiAgICAgIGlmIChsaW5lc1RvRGVsZXRlIDwgLWxpbmVEZWx0YSkgbGluZXNUb0RlbGV0ZSA9IC1saW5lRGVsdGE7XG4gICAgICBpZiAobGluZXNUb0RlbGV0ZSA8IDApIGxpbmVzVG9EZWxldGUgPSAwO1xuXG4gICAgICBsZXQgbGluZXNUb0FkZCA9IFtdO1xuICAgICAgZm9yIChsZXQgbCA9IDA7IGwgPCBsaW5lc1RvRGVsZXRlICsgbGluZURlbHRhOyBsKyspIHtcbiAgICAgICAgbGluZXNUb0FkZC5wdXNoKHRoaXMubGluZUVsZW1lbnRzW2ZpcnN0Q2hhbmdlZExpbmUgKyBsXS50ZXh0Q29udGVudCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNwbGljZUxpbmVzKGZpcnN0Q2hhbmdlZExpbmUsIGxpbmVzVG9EZWxldGUsIGxpbmVzVG9BZGQsIGZhbHNlKTtcbiAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBObyBsaW5lcyBhZGRlZCBvciByZW1vdmVkXG4gICAgICBmb3IgKGxldCBsaW5lID0gMDsgbGluZSA8IHRoaXMubGluZUVsZW1lbnRzLmxlbmd0aDsgbGluZSsrKSB7XG4gICAgICAgIGxldCBlID0gdGhpcy5saW5lRWxlbWVudHNbbGluZV07XG4gICAgICAgIGxldCBjdCA9IGUudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmICh0aGlzLmxpbmVzW2xpbmVdICE9PSBjdCkge1xuICAgICAgICAgIC8vIExpbmUgY2hhbmdlZCwgdXBkYXRlIGl0XG4gICAgICAgICAgdGhpcy5saW5lc1tsaW5lXSA9IGN0O1xuICAgICAgICAgIHRoaXMubGluZURpcnR5W2xpbmVdID0gdHJ1ZTsgXG4gICAgICAgIH0gXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhIG5ldyBwYXJhZ3JhcGguXG4gICAqIEBwYXJhbSBzZWwgVGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAqL1xuICBwcm9jZXNzTmV3UGFyYWdyYXBoKHNlbCkge1xuICAgIGlmICghc2VsKSByZXR1cm47XG5cbiAgICAvLyBVcGRhdGUgbGluZXMgZnJvbSBjb250ZW50XG4gICAgdGhpcy51cGRhdGVMaW5lQ29udGVudHMoKTtcblxuICAgIGxldCBjb250aW51YWJsZVR5cGUgPSBmYWxzZTtcbiAgICAvLyBMZXQncyBzZWUgaWYgd2UgbmVlZCB0byBjb250aW51ZSBhIGxpc3RcblxuICAgIGxldCBjaGVja0xpbmUgPSBzZWwuY29sID4gMCA/IHNlbC5yb3cgOiBzZWwucm93IC0gMTtcbiAgICBzd2l0Y2ggKHRoaXMubGluZVR5cGVzW2NoZWNrTGluZV0pIHtcbiAgICAgIGNhc2UgJ1RNVUwnOiBjb250aW51YWJsZVR5cGUgPSAnVE1VTCc7IGJyZWFrO1xuICAgICAgY2FzZSAnVE1PTCc6IGNvbnRpbnVhYmxlVHlwZSA9ICdUTU9MJzsgYnJlYWs7XG4gICAgICBjYXNlICdUTUluZGVudGVkQ29kZSc6IGNvbnRpbnVhYmxlVHlwZSA9ICdUTUluZGVudGVkQ29kZSc7IGJyZWFrO1xuICAgIH1cblxuICAgIGxldCBsaW5lcyA9IHRoaXMubGluZXNbc2VsLnJvd10ucmVwbGFjZSgvXFxuXFxuJC8sICdcXG4nKS5zcGxpdCgvKD86XFxyXFxufFxcbnxcXHIpLyk7XG4gICAgaWYgKGxpbmVzLmxlbmd0aCA9PSAxKSB7XG4gICAgICAvLyBObyBuZXcgbGluZVxuICAgICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuc3BsaWNlTGluZXMoc2VsLnJvdywgMSwgbGluZXMsIHRydWUpO1xuICAgIHNlbC5yb3crKztcbiAgICBzZWwuY29sID0gMDtcblxuICAgIGlmIChjb250aW51YWJsZVR5cGUpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBwcmV2aW91cyBsaW5lIHdhcyBub24tZW1wdHlcbiAgICAgIGxldCBjYXB0dXJlID0gbGluZUdyYW1tYXJbY29udGludWFibGVUeXBlXS5yZWdleHAuZXhlYyh0aGlzLmxpbmVzW3NlbC5yb3cgLSAxXSk7XG4gICAgICBpZiAoY2FwdHVyZSkge1xuICAgICAgICAvLyBDb252ZW50aW9uOiBjYXB0dXJlWzFdIGlzIHRoZSBsaW5lIHR5cGUgbWFya2VyLCBjYXB0dXJlWzJdIGlzIHRoZSBjb250ZW50XG4gICAgICAgIGlmIChjYXB0dXJlWzJdKSB7XG4gICAgICAgICAgLy8gUHJldmlvdXMgbGluZSBoYXMgY29udGVudCwgY29udGludWUgdGhlIGNvbnRpbnVhYmxlIHR5cGVcblxuICAgICAgICAgIC8vIEhhY2sgZm9yIE9MOiBpbmNyZW1lbnQgbnVtYmVyXG4gICAgICAgICAgaWYgKGNvbnRpbnVhYmxlVHlwZSA9PSAnVE1PTCcpIHtcbiAgICAgICAgICAgIGNhcHR1cmVbMV0gPSBjYXB0dXJlWzFdLnJlcGxhY2UoL1xcZHsxLDl9LywgKHJlc3VsdCkgPT4geyByZXR1cm4gcGFyc2VJbnQocmVzdWx0WzBdKSArIDF9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5saW5lc1tzZWwucm93XSA9IGAke2NhcHR1cmVbMV19JHt0aGlzLmxpbmVzW3NlbC5yb3ddfWA7XG4gICAgICAgICAgdGhpcy5saW5lRGlydHlbc2VsLnJvd10gPSB0cnVlO1xuICAgICAgICAgIHNlbC5jb2wgPSBjYXB0dXJlWzFdLmxlbmd0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBQcmV2aW91cyBsaW5lIGhhcyBubyBjb250ZW50LCByZW1vdmUgdGhlIGNvbnRpbnVhYmxlIHR5cGUgZnJvbSB0aGUgcHJldmlvdXMgcm93XG4gICAgICAgICAgdGhpcy5saW5lc1tzZWwucm93IC0gMV0gPSAnJztcbiAgICAgICAgICB0aGlzLmxpbmVEaXJ0eVtzZWwucm93IC0gMV0gPSB0cnVlO1xuICAgICAgICB9ICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gIH1cblxuICAvLyAvKipcbiAgLy8gICogUHJvY2Vzc2VzIGEgXCJkZWxldGVcIiBpbnB1dCBhY3Rpb24uXG4gIC8vICAqIEBwYXJhbSB7b2JqZWN0fSBmb2N1cyBUaGUgc2VsZWN0aW9uXG4gIC8vICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm9yd2FyZCBJZiB0cnVlLCBwZXJmb3JtcyBhIGZvcndhcmQgZGVsZXRlLCBvdGhlcndpc2UgcGVyZm9ybXMgYSBiYWNrd2FyZCBkZWxldGVcbiAgLy8gICovXG4gIC8vIHByb2Nlc3NEZWxldGUoZm9jdXMsIGZvcndhcmQpIHtcbiAgLy8gICBpZiAoIWZvY3VzKSByZXR1cm47XG4gIC8vICAgbGV0IGFuY2hvciA9IHRoaXMuZ2V0U2VsZWN0aW9uKHRydWUpO1xuICAvLyAgIC8vIERvIHdlIGhhdmUgYSBub24tZW1wdHkgc2VsZWN0aW9uPyBcbiAgLy8gICBpZiAoZm9jdXMuY29sICE9IGFuY2hvci5jb2wgfHwgZm9jdXMucm93ICE9IGFuY2hvci5yb3cpIHtcbiAgLy8gICAgIC8vIG5vbi1lbXB0eS4gZGlyZWN0aW9uIGRvZXNuJ3QgbWF0dGVyLlxuICAvLyAgICAgdGhpcy5wYXN0ZSgnJywgYW5jaG9yLCBmb2N1cyk7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGlmIChmb3J3YXJkKSB7XG4gIC8vICAgICAgIGlmIChmb2N1cy5jb2wgPCB0aGlzLmxpbmVzW2ZvY3VzLnJvd10ubGVuZ3RoKSB0aGlzLnBhc3RlKCcnLCB7cm93OiBmb2N1cy5yb3csIGNvbDogZm9jdXMuY29sICsgMX0sIGZvY3VzKTtcbiAgLy8gICAgICAgZWxzZSBpZiAoZm9jdXMuY29sIDwgdGhpcy5saW5lcy5sZW5ndGgpIHRoaXMucGFzdGUoJycsIHtyb3c6IGZvY3VzLnJvdyArIDEsIGNvbDogMH0sIGZvY3VzKTtcbiAgLy8gICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSdyZSBhdCB0aGUgdmVyeSBlbmQgYW5kIGNhbid0IGRlbGV0ZSBmb3J3YXJkXG4gIC8vICAgICB9IGVsc2Uge1xuICAvLyAgICAgICBpZiAoZm9jdXMuY29sID4gMCkgdGhpcy5wYXN0ZSgnJywge3JvdzogZm9jdXMucm93LCBjb2w6IGZvY3VzLmNvbCAtIDF9LCBmb2N1cyk7XG4gIC8vICAgICAgIGVsc2UgaWYgKGZvY3VzLnJvdyA+IDApIHRoaXMucGFzdGUoJycsIHtyb3c6IGZvY3VzLnJvdyAtIDEsIGNvbDogdGhpcy5saW5lc1tmb2N1cy5yb3cgLSAxXS5sZW5ndGggLSAxfSwgZm9jdXMpO1xuICAvLyAgICAgICAvLyBPdGhlcndpc2UsIHdlJ3JlIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBhbmQgY2FuJ3QgZGVsZXRlIGJhY2t3YXJkc1xuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGN1cnJlbnQgcG9zaXRpb24gb2YgdGhlIHNlbGVjdGlvbiBjb3VudGVkIGJ5IHJvdyBhbmQgY29sdW1uIG9mIHRoZSBlZGl0b3IgTWFya2Rvd24gY29udGVudCAoYXMgb3Bwb3NlZCB0byB0aGUgcG9zaXRpb24gaW4gdGhlIERPTSkuXG4gICAqIFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGdldEFuY2hvciBpZiBzZXQgdG8gdHJ1ZSwgZ2V0cyB0aGUgc2VsZWN0aW9uIGFuY2hvciAoc3RhcnQgcG9pbnQgb2YgdGhlIHNlbGVjdGlvbiksIG90aGVyd2lzZSBnZXRzIHRoZSBmb2N1cyAoZW5kIHBvaW50KS5cbiAgICogQHJldHVybiB7b2JqZWN0fSBBbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzZWxlY3Rpb24sIHdpdGggcHJvcGVydGllcyBjb2wgYW5kIHJvdy5cbiAgICovXG4gIGdldFNlbGVjdGlvbihnZXRBbmNob3IgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcbiAgICBsZXQgc3RhcnROb2RlID0gKGdldEFuY2hvciA/IHNlbGVjdGlvbi5hbmNob3JOb2RlIDogc2VsZWN0aW9uLmZvY3VzTm9kZSk7XG4gICAgaWYgKCFzdGFydE5vZGUpIHJldHVybiBudWxsO1xuICAgIGxldCBvZmZzZXQgPSBzdGFydE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFID8gKGdldEFuY2hvciA/IHNlbGVjdGlvbi5hbmNob3JPZmZzZXQgOiBzZWxlY3Rpb24uZm9jdXNPZmZzZXQpIDogMDtcbiAgXG4gICAgaWYgKHN0YXJ0Tm9kZSA9PSB0aGlzLmUpIHtcbiAgICAgIHJldHVybiB7cm93OiAwLCBjb2w6IG9mZnNldH07XG4gICAgfVxuXG4gICAgbGV0IGNvbCA9IHRoaXMuY29tcHV0ZUNvbHVtbihzdGFydE5vZGUsIG9mZnNldCk7ICAgIFxuICAgIGlmIChjb2wgPT09IG51bGwpIHJldHVybiBudWxsOyAvLyBXZSBhcmUgb3V0c2lkZSBvZiB0aGUgZWRpdG9yXG5cbiAgICAvLyBGaW5kIHRoZSByb3cgbm9kZVxuICAgIGxldCBub2RlID0gc3RhcnROb2RlO1xuICAgIHdoaWxlIChub2RlLnBhcmVudEVsZW1lbnQgIT0gdGhpcy5lKSB7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50O1xuICAgIH1cblxuICAgIGxldCByb3cgPSAwO1xuICAgIC8vIENoZWNrIGlmIHdlIGNhbiByZWFkIGEgbGluZSBudW1iZXIgZnJvbSB0aGUgZGF0YS1saW5lLW51bSBhdHRyaWJ1dGUuXG4gICAgLy8gVGhlIGxhc3QgY29uZGl0aW9uIGlzIGEgc2VjdXJpdHkgbWVhc3VyZSBzaW5jZSBpbnNlcnRpbmcgYSBuZXcgcGFyYWdyYXBoIGNvcGllcyB0aGUgcHJldmlvdXMgcm93cycgbGluZSBudW1iZXJcbiAgICBpZiAobm9kZS5kYXRhc2V0ICYmIG5vZGUuZGF0YXNldC5saW5lTnVtICYmICghbm9kZS5wcmV2aW91c1NpYmxpbmcgfHwgbm9kZS5wcmV2aW91c1NpYmxpbmcuZGF0YXNldC5saW5lTnVtICE9IG5vZGUuZGF0YXNldC5saW5lTnVtICkpIHtcbiAgICAgIHJvdyA9IHBhcnNlSW50KG5vZGUuZGF0YXNldC5saW5lTnVtKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKG5vZGUucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgIHJvdysrO1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7cm93OiByb3csIGNvbDogY29sLCBub2RlOiBzdGFydE5vZGV9O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIGEgY29sdW1uIHdpdGhpbiBhbiBlZGl0b3IgbGluZSBmcm9tIGEgbm9kZSBhbmQgb2Zmc2V0IHdpdGhpbiB0aGF0IG5vZGUuXG4gICAqIEBwYXJhbSB7Tm9kZX0gc3RhcnROb2RlIFRoZSBub2RlXG4gICAqIEBwYXJhbSB7aW50fSBvZmZzZXQgVEhlIHNlbGVjdGlvblxuICAgKiBAcmV0dXJucyB7aW50fSB0aGUgY29sdW1uLCBvciBudWxsIGlmIHRoZSBub2RlIGlzIG5vdCBpbnNpZGUgdGhlIGVkaXRvclxuICAgKi9cbiAgY29tcHV0ZUNvbHVtbihzdGFydE5vZGUsIG9mZnNldCkge1xuICAgIGxldCBub2RlID0gc3RhcnROb2RlO1xuICAgIGxldCBjb2wgPSBvZmZzZXQ7XG4gICAgLy8gRmlyc3QsIG1ha2Ugc3VyZSB3ZSdyZSBhY3R1YWxseSBpbiB0aGUgZWRpdG9yLlxuICAgIHdoaWxlIChub2RlICYmIG5vZGUucGFyZW50Tm9kZSAhPSB0aGlzLmUpIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIGlmIChub2RlID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIFxuICAgIG5vZGUgPSBzdGFydE5vZGU7XG4gICAgd2hpbGUgKG5vZGUucGFyZW50Tm9kZSAhPSB0aGlzLmUpIHtcbiAgICAgIGlmIChub2RlLnByZXZpb3VzU2libGluZykge1xuICAgICAgICBub2RlID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7XG4gICAgICAgIGNvbCArPSBub2RlLnRleHRDb250ZW50Lmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2w7XG4gIH1cblxuICAvKipcbiAgICogQ29tcHV0ZXMgRE9NIG5vZGUgYW5kIG9mZnNldCB3aXRoaW4gdGhhdCBub2RlIGZyb20gYSBwb3NpdGlvbiBleHByZXNzZWQgYXMgcm93IGFuZCBjb2x1bW4uXG4gICAqIEBwYXJhbSB7aW50fSByb3cgUm93IChsaW5lIG51bWJlcilcbiAgICogQHBhcmFtIHtpbnR9IGNvbCBDb2x1bW5cbiAgICogQHJldHVybnMgQW4gb2JqZWN0IHdpdGggdHdvIHByb3BlcnRpZXM6IG5vZGUgYW5kIG9mZnNldC4gb2Zmc2V0IG1heSBiZSBudWxsO1xuICAgKi9cbiAgY29tcHV0ZU5vZGVBbmRPZmZzZXQocm93LCBjb2wsIGJpbmRSaWdodCA9IGZhbHNlKSB7XG4gICAgaWYgKHJvdyA+PSB0aGlzLmxpbmVFbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIFNlbGVjdGlvbiBwYXN0IHRoZSBlbmQgb2YgdGV4dCwgc2V0IHNlbGVjdGlvbiB0byBlbmQgb2YgdGV4dFxuICAgICAgcm93ID0gdGhpcy5saW5lRWxlbWVudHMubGVuZ3RoIC0gMTtcbiAgICAgIGNvbCA9IHRoaXMubGluZXNbcm93XS5sZW5ndGg7XG4gICAgfSBcbiAgICBpZiAoY29sID4gdGhpcy5saW5lc1tyb3ddLmxlbmd0aCkge1xuICAgICAgY29sID0gdGhpcy5saW5lc1tyb3ddLmxlbmd0aDtcbiAgICB9XG4gICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubGluZUVsZW1lbnRzW3Jvd107XG4gICAgbGV0IG5vZGUgPSBwYXJlbnROb2RlLmZpcnN0Q2hpbGQ7XG5cbiAgICBsZXQgY2hpbGRyZW5Db21wbGV0ZSA9IGZhbHNlO1xuICAgIC8vIGRlZmF1bHQgcmV0dXJuIHZhbHVlXG4gICAgbGV0IHJ2ID0ge25vZGU6IHBhcmVudE5vZGUuZmlyc3RDaGlsZCA/IHBhcmVudE5vZGUuZmlyc3RDaGlsZCA6IHBhcmVudE5vZGUsIG9mZnNldDogMH07XG5cbiAgICB3aGlsZSAobm9kZSAhPSBwYXJlbnROb2RlKSB7XG4gICAgICBpZiAoIWNoaWxkcmVuQ29tcGxldGUgJiYgbm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUpIHtcbiAgICAgICAgaWYgKG5vZGUubm9kZVZhbHVlLmxlbmd0aCA+PSBjb2wpIHtcbiAgICAgICAgICBpZiAoYmluZFJpZ2h0ICYmIG5vZGUubm9kZVZhbHVlLmxlbmd0aCA9PSBjb2wpIHtcbiAgICAgICAgICAgIC8vIFNlbGVjdGlvbiBpcyBhdCB0aGUgZW5kIG9mIHRoaXMgdGV4dCBub2RlLCBidXQgd2UgYXJlIGJpbmRpbmcgcmlnaHQgKHByZWZlciBhbiBvZmZzZXQgb2YgMCBpbiB0aGUgbmV4dCB0ZXh0IG5vZGUpXG4gICAgICAgICAgICAvLyBSZW1lbWJlciByZXR1cm4gdmFsdWUgaW4gY2FzZSB3ZSBkb24ndCBmaW5kIGFub3RoZXIgdGV4dCBub2RlXG4gICAgICAgICAgICBydiA9IHtub2RlOiBub2RlLCBvZmZzZXQ6IGNvbH07XG4gICAgICAgICAgICBjb2wgPSAwO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybih7bm9kZTogbm9kZSwgb2Zmc2V0OiBjb2x9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29sIC09IG5vZGUubm9kZVZhbHVlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIGlmICghY2hpbGRyZW5Db21wbGV0ZSAmJiBub2RlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuZmlyc3RDaGlsZDtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5uZXh0U2libGluZykge1xuICAgICAgICBjaGlsZHJlbkNvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGRyZW5Db21wbGV0ZSA9IHRydWU7XG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRWl0aGVyLCB0aGUgcG9zaXRpb24gd2FzIGludmFsaWQgYW5kIHdlIGp1c3QgcmV0dXJuIHRoZSBkZWZhdWx0IHJldHVybiB2YWx1ZVxuICAgIC8vIE9yIHdlIGFyZSBiaW5kaW5nIHJpZ2h0IGFuZCB0aGUgc2VsZWN0aW9uIGlzIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmVcbiAgICByZXR1cm4gcnY7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc2VsZWN0aW9uIGJhc2VkIG9uIHJvd3MgYW5kIGNvbHVtbnMgd2l0aGluIHRoZSBlZGl0b3IgTWFya2Rvd24gY29udGVudC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGZvY3VzIE9iamVjdCByZXByZXNlbnRpbmcgdGhlIHNlbGVjdGlvbiwgbmVlZHMgdG8gaGF2ZSBwcm9wZXJ0aWVzIHJvdyBhbmQgY29sLlxuICAgKi9cbiAgc2V0U2VsZWN0aW9uKGZvY3VzLCBhbmNob3IgPSBudWxsKSB7XG4gICAgaWYgKCFmb2N1cykgcmV0dXJuO1xuXG4gICAgbGV0IHJhbmdlID0gZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKTtcblxuICAgIGxldCB7bm9kZTogZm9jdXNOb2RlLCBvZmZzZXQ6IGZvY3VzT2Zmc2V0fSA9IHRoaXMuY29tcHV0ZU5vZGVBbmRPZmZzZXQoZm9jdXMucm93LCBmb2N1cy5jb2wsIChhbmNob3IgJiYgYW5jaG9yLnJvdyA9PSBmb2N1cy5yb3cgJiYgYW5jaG9yLmNvbCA+IGZvY3VzLmNvbCkpOyAvLyBCaW5kIHNlbGVjdGlvbiByaWdodCBpZiBhbmNob3IgaXMgaW4gdGhlIHNhbWUgcm93IGFuZCBiZWhpbmQgdGhlIGZvY3VzXG4gICAgbGV0IGFuY2hvck5vZGUgPSBudWxsLCBhbmNob3JPZmZzZXQgPSBudWxsO1xuICAgIGlmIChhbmNob3IgJiYgKGFuY2hvci5yb3cgIT0gZm9jdXMucm93IHx8IGFuY2hvci5jb2wgIT0gZm9jdXMuY29sKSkge1xuICAgICAgbGV0IHtub2RlLCBvZmZzZXR9ID0gdGhpcy5jb21wdXRlTm9kZUFuZE9mZnNldChhbmNob3Iucm93LCBhbmNob3IuY29sLCBmb2N1cy5yb3cgPT0gYW5jaG9yLnJvdyAmJiBmb2N1cy5jb2wgPiBhbmNob3IuY29sKTtcbiAgICAgIGFuY2hvck5vZGUgPSBub2RlO1xuICAgICAgYW5jaG9yT2Zmc2V0ID0gb2Zmc2V0O1xuICAgIH1cblxuICAgIGlmIChhbmNob3JOb2RlKSByYW5nZS5zZXRTdGFydChhbmNob3JOb2RlLCBhbmNob3JPZmZzZXQpO1xuICAgIGVsc2UgcmFuZ2Uuc2V0U3RhcnQoZm9jdXNOb2RlLCBmb2N1c09mZnNldCk7XG4gICAgcmFuZ2Uuc2V0RW5kKGZvY3VzTm9kZSwgZm9jdXNPZmZzZXQpO1xuICAgIFxuICAgIGxldCB3aW5kb3dTZWxlY3Rpb24gPSB3aW5kb3cuZ2V0U2VsZWN0aW9uKCk7XG4gICAgd2luZG93U2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xuICAgIHdpbmRvd1NlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XG4gIH1cblxuICAvKiogXG4gICAqIEV2ZW50IGhhbmRsZXIgZm9yIGlucHV0IGV2ZW50cyBcbiAgICovXG4gIGhhbmRsZUlucHV0RXZlbnQoZXZlbnQpIHtcbiAgICBsZXQgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbigpO1xuXG4gICAgaWYgKChldmVudC5pbnB1dFR5cGUgPT0gJ2luc2VydFBhcmFncmFwaCcgfHwgZXZlbnQuaW5wdXRUeXBlID09ICdpbnNlcnRMaW5lQnJlYWsnKSAmJiBmb2N1cykge1xuICAgICAgdGhpcy5jbGVhckRpcnR5RmxhZygpO1xuICAgICAgdGhpcy5wcm9jZXNzTmV3UGFyYWdyYXBoKGZvY3VzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmUuZmlyc3RDaGlsZCkge1xuICAgICAgICB0aGlzLmUuaW5uZXJIVE1MID0gJzxkaXYgY2xhc3M9XCJUTUJsYW5rTGluZVwiPjxicj48L2Rpdj4nO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGNoaWxkTm9kZSA9IHRoaXMuZS5maXJzdENoaWxkOyBjaGlsZE5vZGU7IGNoaWxkTm9kZSA9IGNoaWxkTm9kZS5uZXh0U2libGluZykge1xuICAgICAgICAgIGlmIChjaGlsZE5vZGUubm9kZVR5cGUgIT0gMyB8fCBjaGlsZE5vZGUudGFnTmFtZSAhPSAnRElWJykge1xuICAgICAgICAgICAgLy8gRm91bmQgYSBjaGlsZCBub2RlIHRoYXQncyBlaXRoZXIgbm90IGFuIGVsZW1lbnQgb3Igbm90IGEgZGl2LiBXcmFwIGl0IGluIGEgZGl2LlxuICAgICAgICAgICAgbGV0IGRpdldyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRoaXMuZS5pbnNlcnRCZWZvcmUoZGl2V3JhcHBlciwgY2hpbGROb2RlKTtcbiAgICAgICAgICAgIHRoaXMuZS5yZW1vdmVDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgICAgZGl2V3JhcHBlci5hcHBlbmRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVMaW5lQ29udGVudHNBbmRGb3JtYXR0aW5nKCk7ICBcbiAgICB9XG4gICAgaWYgKGZvY3VzKSB0aGlzLnNldFNlbGVjdGlvbihmb2N1cyk7XG4gICAgdGhpcy5maXJlQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogRXZlbnQgaGFuZGxlciBmb3IgXCJzZWxlY3Rpb25jaGFuZ2VcIiBldmVudHMuXG4gICAqL1xuICBoYW5kbGVTZWxlY3Rpb25DaGFuZ2VFdmVudCgpIHtcbiAgICB0aGlzLmZpcmVTZWxlY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZW5pZW5jZSBmdW5jdGlvbiB0byBcInNwbGljZVwiIG5ldyBsaW5lcyBpbnRvIHRoZSBhcnJheXMgdGhpcy5saW5lcywgdGhpcy5saW5lRGlydHksIHRoaXMubGluZVR5cGVzLCBhbmQgdGhlIERPTSBlbGVtZW50cyBcbiAgICogdW5kZXJuZWF0aCB0aGUgZWRpdG9yIGVsZW1lbnQuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGVzc2VudGlhbGx5IEFycmF5LnNwbGljZSwgb25seSB0aGF0IHRoZSB0aGlyZCBwYXJhbWV0ZXIgdGFrZXMgYW4gdW4tc3ByZWFkIGFycmF5IChhbmQgdGhlIGZvcnRoIHBhcmFtZXRlcilcbiAgICogZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBET00gc2hvdWxkIGFsc28gYmUgYWRqdXN0ZWQuXG4gICAqIFxuICAgKiBAcGFyYW0ge2ludH0gc3RhcnRMaW5lIFBvc2l0aW9uIGF0IHdoaWNoIHRvIHN0YXJ0IGNoYW5naW5nIHRoZSBhcnJheSBvZiBsaW5lc1xuICAgKiBAcGFyYW0ge2ludH0gbGluZXNUb0RlbGV0ZSBOdW1iZXIgb2YgbGluZXMgdG8gZGVsZXRlXG4gICAqIEBwYXJhbSB7YXJyYXl9IGxpbmVzVG9JbnNlcnQgQXJyYXkgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgdGhlIGxpbmVzIHRvIGJlIGluc2VydGVkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gYWRqdXN0TGluZUVsZW1lbnRzIElmIHRydWUsIHRoZW4gPGRpdj4gZWxlbWVudHMgYXJlIGFsc28gaW5zZXJ0ZWQgaW4gdGhlIERPTSBhdCB0aGUgcmVzcGVjdGl2ZSBwb3NpdGlvblxuICAgKi9cbiAgc3BsaWNlTGluZXMoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlID0gMCwgbGluZXNUb0luc2VydCA9IFtdLCBhZGp1c3RMaW5lRWxlbWVudHMgPSB0cnVlKSB7XG4gICAgaWYgKGFkanVzdExpbmVFbGVtZW50cykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc1RvRGVsZXRlOyBpKyspIHtcbiAgICAgICAgdGhpcy5lLnJlbW92ZUNoaWxkKHRoaXMuZS5jaGlsZE5vZGVzW3N0YXJ0TGluZV0pO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBsZXQgaW5zZXJ0ZWRCbGFuayA9IFtdO1xuICAgIGxldCBpbnNlcnRlZERpcnR5ID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzVG9JbnNlcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluc2VydGVkQmxhbmsucHVzaCgnJyk7XG4gICAgICBpbnNlcnRlZERpcnR5LnB1c2godHJ1ZSk7XG4gICAgICBpZiAoYWRqdXN0TGluZUVsZW1lbnRzKSB7XG4gICAgICAgIGlmICh0aGlzLmUuY2hpbGROb2Rlc1tzdGFydExpbmVdKSB0aGlzLmUuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLHRoaXMuZS5jaGlsZE5vZGVzW3N0YXJ0TGluZV0pO1xuICAgICAgICBlbHNlIHRoaXMuZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5saW5lcy5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5saW5lc1RvSW5zZXJ0KTtcbiAgICB0aGlzLmxpbmVUeXBlcy5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5pbnNlcnRlZEJsYW5rKTtcbiAgICB0aGlzLmxpbmVEaXJ0eS5zcGxpY2Uoc3RhcnRMaW5lLCBsaW5lc1RvRGVsZXRlLCAuLi5pbnNlcnRlZERpcnR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFdmVudCBoYW5kbGVyIGZvciB0aGUgXCJwYXN0ZVwiIGV2ZW50XG4gICAqL1xuICBoYW5kbGVQYXN0ZShldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIFxuICAgIC8vIGdldCB0ZXh0IHJlcHJlc2VudGF0aW9uIG9mIGNsaXBib2FyZFxuICAgIGxldCB0ZXh0ID0gKGV2ZW50Lm9yaWdpbmFsRXZlbnQgfHwgZXZlbnQpLmNsaXBib2FyZERhdGEuZ2V0RGF0YSgndGV4dC9wbGFpbicpO1xuXG4gICAgLy8gaW5zZXJ0IHRleHQgbWFudWFsbHlcbiAgICB0aGlzLnBhc3RlKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3RlcyB0aGUgdGV4dCBhdCB0aGUgY3VycmVudCBzZWxlY3Rpb24gKG9yIGF0IHRoZSBlbmQsIGlmIG5vIGN1cnJlbnQgc2VsZWN0aW9uKVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBcbiAgICovXG4gIHBhc3RlKHRleHQsIGFuY2hvciA9IG51bGwsIGZvY3VzID0gbnVsbCkge1xuICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSB0aGlzLmdldFNlbGVjdGlvbih0cnVlKTtcbiAgICBpZiAoIWZvY3VzKSBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICBsZXQgYmVnaW5uaW5nLCBlbmQ7XG4gICAgaWYgKCFmb2N1cykge1xuICAgICAgZm9jdXMgPSB7IHJvdzogdGhpcy5saW5lcy5sZW5ndGggLSAxLCBjb2w6IHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXS5sZW5ndGggfTsgLy8gSW5zZXJ0IGF0IGVuZFxuICAgIH1cbiAgICBpZiAoIWFuY2hvcikge1xuICAgICAgYW5jaG9yID0gZm9jdXM7XG4gICAgfVxuICAgIGlmIChhbmNob3Iucm93IDwgZm9jdXMucm93IHx8IChhbmNob3Iucm93ID09IGZvY3VzLnJvdyAmJiBhbmNob3IuY29sIDw9IGZvY3VzLmNvbCkpIHtcbiAgICAgIGJlZ2lubmluZyA9IGFuY2hvcjtcbiAgICAgIGVuZCA9IGZvY3VzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGJlZ2lubmluZyA9IGZvY3VzO1xuICAgICAgZW5kID0gYW5jaG9yO1xuICAgIH1cbiAgICBsZXQgaW5zZXJ0ZWRMaW5lcyA9IHRleHQuc3BsaXQoLyg/OlxcclxcbnxcXHJ8XFxuKS8pO1xuICAgIGxldCBsaW5lQmVmb3JlID0gdGhpcy5saW5lc1tiZWdpbm5pbmcucm93XS5zdWJzdHIoMCwgYmVnaW5uaW5nLmNvbCk7XG4gICAgbGV0IGxpbmVFbmQgPSB0aGlzLmxpbmVzW2VuZC5yb3ddLnN1YnN0cihlbmQuY29sKTtcbiAgICBpbnNlcnRlZExpbmVzWzBdID0gbGluZUJlZm9yZS5jb25jYXQoaW5zZXJ0ZWRMaW5lc1swXSk7XG4gICAgbGV0IGVuZENvbFBvcyA9IGluc2VydGVkTGluZXNbaW5zZXJ0ZWRMaW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG4gICAgaW5zZXJ0ZWRMaW5lc1tpbnNlcnRlZExpbmVzLmxlbmd0aCAtIDFdID0gaW5zZXJ0ZWRMaW5lc1tpbnNlcnRlZExpbmVzLmxlbmd0aCAtIDFdLmNvbmNhdChsaW5lRW5kKTtcbiAgICB0aGlzLnNwbGljZUxpbmVzKGJlZ2lubmluZy5yb3csIDEgKyBlbmQucm93IC0gYmVnaW5uaW5nLnJvdywgaW5zZXJ0ZWRMaW5lcyk7XG4gICAgZm9jdXMucm93ID0gYmVnaW5uaW5nLnJvdyArIGluc2VydGVkTGluZXMubGVuZ3RoIC0gMTtcbiAgICBmb2N1cy5jb2wgPSBlbmRDb2xQb3M7XG4gICAgdGhpcy51cGRhdGVGb3JtYXR0aW5nKCk7XG4gICAgdGhpcy5zZXRTZWxlY3Rpb24oZm9jdXMpO1xuICAgIHRoaXMuZmlyZUNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXB1dGVzIHRoZSAobG93ZXN0IGluIHRoZSBET00gdHJlZSkgY29tbW9uIGFuY2VzdG9yIG9mIHR3byBET00gbm9kZXMuXG4gICAqIEBwYXJhbSB7Tm9kZX0gbm9kZTEgdGhlIGZpcnN0IG5vZGVcbiAgICogQHBhcmFtIHtOb2RlfSBub2RlMiB0aGUgc2Vjb25kIG5vZGVcbiAgICogQHJldHVybnMge05vZGV9IFRoZSBjb21tZW4gYW5jZXN0b3Igbm9kZSwgb3IgbnVsbCBpZiB0aGVyZSBpcyBubyBjb21tb24gYW5jZXN0b3JcbiAgICovXG4gIGNvbXB1dGVDb21tb25BbmNlc3Rvcihub2RlMSwgbm9kZTIpIHtcbiAgICBpZiAoIW5vZGUxIHx8ICFub2RlMikgcmV0dXJuIG51bGw7XG4gICAgaWYgKG5vZGUxID09IG5vZGUyKSByZXR1cm4gbm9kZTE7XG4gICAgY29uc3QgYW5jZXN0cnkgPSAobm9kZSkgPT4ge1xuICAgICAgbGV0IGFuY2VzdHJ5ID0gW107XG4gICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICBhbmNlc3RyeS51bnNoaWZ0KG5vZGUpO1xuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFuY2VzdHJ5O1xuICAgIH1cblxuICAgIGNvbnN0IGFuY2VzdHJ5MSA9IGFuY2VzdHJ5KG5vZGUxKTtcbiAgICBjb25zdCBhbmNlc3RyeTIgPSBhbmNlc3RyeShub2RlMik7XG5cbiAgICBpZiAoYW5jZXN0cnkxWzBdICE9IGFuY2VzdHJ5MlswXSkgcmV0dXJuIG51bGw7XG4gICAgbGV0IGk7XG4gICAgZm9yIChpID0gMDsgYW5jZXN0cnkxW2ldID09IGFuY2VzdHJ5MltpXTsgaSsrKTtcbiAgICByZXR1cm4gYW5jZXN0cnkxW2ktMV07XG4gIH1cblxuICAvKipcbiAgICogRmluZHMgdGhlIChsb3dlc3QgaW4gdGhlIERPTSB0cmVlKSBlbmNsb3NpbmcgRE9NIG5vZGUgd2l0aCBhIGdpdmVuIGNsYXNzLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZm9jdXMgVGhlIGZvY3VzIHNlbGVjdGlvbiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGFuY2hvciBUaGUgYW5jaG9yIHNlbGVjdGlvbiBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSB0byBmaW5kXG4gICAqIEByZXR1cm5zIHtOb2RlfSBUaGUgZW5jbG9zaW5nIERPTSBub2RlIHdpdGggdGhlIHJlc3BlY3RpdmUgY2xhc3MgKGluc2lkZSB0aGUgZWRpdG9yKSwgaWYgdGhlcmUgaXMgb25lOyBudWxsIG90aGVyd2lzZS5cbiAgICovXG4gIGNvbXB1dGVFbmNsb3NpbmdNYXJrdXBOb2RlKGZvY3VzLCBhbmNob3IsIGNsYXNzTmFtZSkge1xuICAgIGxldCBub2RlID0gbnVsbDtcbiAgICBpZiAoIWZvY3VzKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoIWFuY2hvcikge1xuICAgICAgbm9kZSA9IGZvY3VzLm5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChmb2N1cy5yb3cgIT0gYW5jaG9yLnJvdykgcmV0dXJuIG51bGw7XG4gICAgICBub2RlID0gdGhpcy5jb21wdXRlQ29tbW9uQW5jZXN0b3IoZm9jdXMubm9kZSwgYW5jaG9yLm5vZGUpO1xuICAgIH1cbiAgICBpZiAoIW5vZGUpIHJldHVybiBudWxsO1xuICAgIHdoaWxlIChub2RlICE9IHRoaXMuZSkge1xuICAgICAgaWYgKG5vZGUuY2xhc3NOYW1lICYmIG5vZGUuY2xhc3NOYW1lLmluY2x1ZGVzKGNsYXNzTmFtZSkpIHJldHVybiBub2RlO1xuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgLy8gQXNjZW5kZWQgYWxsIHRoZSB3YXkgdG8gdGhlIGVkaXRvciBlbGVtZW50XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc3RhdGUgKHRydWUgLyBmYWxzZSkgb2YgYWxsIGNvbW1hbmRzLlxuICAgKiBAcGFyYW0gZm9jdXMgRm9jdXMgb2YgdGhlIHNlbGVjdGlvbi4gSWYgbm90IGdpdmVuLCBhc3N1bWVzIHRoZSBjdXJyZW50IGZvY3VzLlxuICAgKi9cbiAgZ2V0Q29tbWFuZFN0YXRlKGZvY3VzID0gbnVsbCwgYW5jaG9yID0gbnVsbCkge1xuICAgIGxldCBjb21tYW5kU3RhdGUgPSB7fTtcbiAgICBpZiAoIWZvY3VzKSBmb2N1cyA9IHRoaXMuZ2V0U2VsZWN0aW9uKGZhbHNlKTtcbiAgICBpZiAoIWFuY2hvcikgYW5jaG9yID0gdGhpcy5nZXRTZWxlY3Rpb24odHJ1ZSk7XG4gICAgaWYgKCFmb2N1cykge1xuICAgICAgZm9yIChsZXQgY21kIGluIGNvbW1hbmRzKSB7XG4gICAgICAgIGNvbW1hbmRTdGF0ZVtjbWRdID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb21tYW5kU3RhdGU7XG4gICAgfVxuICAgIGlmICghYW5jaG9yKSBhbmNob3IgPSBmb2N1czsgXG4gICAgXG4gICAgbGV0IHN0YXJ0LCBlbmQ7XG4gICAgaWYgKGFuY2hvci5yb3cgPCBmb2N1cy5yb3cgfHwgKGFuY2hvci5yb3cgPT0gZm9jdXMucm93ICYmIGFuY2hvci5jb2wgPCBmb2N1cy5jb2wpKSB7XG4gICAgICBzdGFydCA9IGFuY2hvcjtcbiAgICAgIGVuZCA9IGZvY3VzO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydCA9IGZvY3VzO1xuICAgICAgZW5kID0gYW5jaG9yO1xuICAgIH1cbiAgICBpZiAoZW5kLnJvdyA+IHN0YXJ0LnJvdyAmJiBlbmQuY29sID09IDApIHtcbiAgICAgIGVuZC5yb3ctLTtcbiAgICAgIGVuZC5jb2wgPSB0aGlzLmxpbmVzW2VuZC5yb3ddLmxlbmd0aDsgLy8gU2VsZWN0aW9uIHRvIGJlZ2lubmluZyBvZiBuZXh0IGxpbmUgaXMgc2FpZCB0byBlbmQgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGFzdCBsaW5lXG4gICAgfVxuXG4gICAgZm9yIChsZXQgY21kIGluIGNvbW1hbmRzKSB7XG4gICAgICBpZiAoY29tbWFuZHNbY21kXS50eXBlID09ICdpbmxpbmUnKSB7XG5cbiAgICAgICAgaWYgKCFmb2N1cyB8fCBmb2N1cy5yb3cgIT0gYW5jaG9yLnJvdyB8fCAhdGhpcy5pc0lubGluZUZvcm1hdHRpbmdBbGxvd2VkKGZvY3VzLCBhbmNob3IpKSB7XG4gICAgICAgICAgY29tbWFuZFN0YXRlW2NtZF0gPSBudWxsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFRoZSBjb21tYW5kIHN0YXRlIGlzIHRydWUgaWYgdGhlcmUgaXMgYSByZXNwZWN0aXZlIGVuY2xvc2luZyBtYXJrdXAgbm9kZSAoZS5nLiwgdGhlIHNlbGVjdGlvbiBpcyBlbmNsb3NlZCBpbiBhIDxiPi4uPC9iPikgLi4uIFxuICAgICAgICAgIGNvbW1hbmRTdGF0ZVtjbWRdID0gXG4gICAgICAgICAgICAhIXRoaXMuY29tcHV0ZUVuY2xvc2luZ01hcmt1cE5vZGUoZm9jdXMsIGFuY2hvciwgY29tbWFuZHNbY21kXS5jbGFzc05hbWUpIHx8XG4gICAgICAgICAgLy8gLi4uIG9yIGlmIGl0J3MgYW4gZW1wdHkgc3RyaW5nIHByZWNlZGVkIGJ5IGFuZCBmb2xsb3dlZCBieSBmb3JtYXR0aW5nIG1hcmtlcnMsIGUuZy4gKip8Kiogd2hlcmUgfCBpcyB0aGUgY3Vyc29yXG4gICAgICAgICAgICAoXG4gICAgICAgICAgICAgIGZvY3VzLmNvbCA9PSBhbmNob3IuY29sIFxuICAgICAgICAgICAgICAmJiAhIXRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoMCwgZm9jdXMuY29sKS5tYXRjaChjb21tYW5kc1tjbWRdLnVuc2V0LnByZVBhdHRlcm4pXG4gICAgICAgICAgICAgICYmICEhdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cihmb2N1cy5jb2wpLm1hdGNoKGNvbW1hbmRzW2NtZF0udW5zZXQucG9zdFBhdHRlcm4pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IFxuICAgICAgaWYgKGNvbW1hbmRzW2NtZF0udHlwZSA9PSAnbGluZScpIHtcbiAgICAgICAgaWYgKCFmb2N1cykge1xuICAgICAgICAgIGNvbW1hbmRTdGF0ZVtjbWRdID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmxpbmVUeXBlc1tzdGFydC5yb3ddID09IGNvbW1hbmRzW2NtZF0uY2xhc3NOYW1lO1xuICAgICAgICAgIFxuICAgICAgICAgIGZvciAobGV0IGxpbmUgPSBzdGFydC5yb3c7IGxpbmUgPD0gZW5kLnJvdzsgbGluZSArKykge1xuICAgICAgICAgICAgaWYgKCh0aGlzLmxpbmVUeXBlc1tsaW5lXSA9PSBjb21tYW5kc1tjbWRdLmNsYXNzTmFtZSkgIT0gc3RhdGUpIHtcbiAgICAgICAgICAgICAgc3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29tbWFuZFN0YXRlW2NtZF0gPSBzdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbW1hbmRTdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgY29tbWFuZCBzdGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWFuZCBcbiAgICogQHBhcmFtIHtib29sZWFufSBzdGF0ZSBcbiAgICovXG4gIHNldENvbW1hbmRTdGF0ZShjb21tYW5kLCBzdGF0ZSkge1xuICAgIGlmIChjb21tYW5kc1tjb21tYW5kXS50eXBlID09ICdpbmxpbmUnKSB7XG4gICAgICBsZXQgYW5jaG9yID0gdGhpcy5nZXRTZWxlY3Rpb24odHJ1ZSk7XG4gICAgICBsZXQgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbihmYWxzZSk7XG4gICAgICBpZiAoIWFuY2hvcikgYW5jaG9yID0gZm9jdXM7XG4gICAgICBpZiAoIWFuY2hvcikgcmV0dXJuO1xuICAgICAgaWYgKGFuY2hvci5yb3cgIT0gZm9jdXMucm93KSByZXR1cm47XG4gICAgICBpZiAoIXRoaXMuaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZChmb2N1cywgYW5jaG9yKSkgcmV0dXJuOyBcbiAgICAgIGxldCBtYXJrdXBOb2RlID0gdGhpcy5jb21wdXRlRW5jbG9zaW5nTWFya3VwTm9kZShmb2N1cywgYW5jaG9yLCBjb21tYW5kc1tjb21tYW5kXS5jbGFzc05hbWUpO1xuICAgICAgdGhpcy5jbGVhckRpcnR5RmxhZygpO1xuICAgICAgXG4gICAgICAvLyBGaXJzdCBjYXNlOiBUaGVyZSdzIGFuIGVuY2xvc2luZyBtYXJrdXAgbm9kZSwgcmVtb3ZlIHRoZSBtYXJrZXJzIGFyb3VuZCB0aGF0IG1hcmt1cCBub2RlXG4gICAgICBpZiAobWFya3VwTm9kZSkge1xuICAgICAgICB0aGlzLmxpbmVEaXJ0eVtmb2N1cy5yb3ddID0gdHJ1ZTtcbiAgICAgICAgY29uc3Qgc3RhcnRDb2wgPSB0aGlzLmNvbXB1dGVDb2x1bW4obWFya3VwTm9kZSwgMCk7XG4gICAgICAgIGNvbnN0IGxlbiA9IG1hcmt1cE5vZGUudGV4dENvbnRlbnQubGVuZ3RoO1xuICAgICAgICBjb25zdCBsZWZ0ID0gdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cigwLCBzdGFydENvbCkucmVwbGFjZShjb21tYW5kc1tjb21tYW5kXS51bnNldC5wcmVQYXR0ZXJuLCAnJyk7XG4gICAgICAgIGNvbnN0IG1pZCA9IHRoaXMubGluZXNbZm9jdXMucm93XS5zdWJzdHIoc3RhcnRDb2wsIGxlbik7XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cihzdGFydENvbCArIGxlbikucmVwbGFjZShjb21tYW5kc1tjb21tYW5kXS51bnNldC5wb3N0UGF0dGVybiwgJycpO1xuICAgICAgICB0aGlzLmxpbmVzW2ZvY3VzLnJvd10gPSBsZWZ0LmNvbmNhdChtaWQsIHJpZ2h0KTtcbiAgICAgICAgYW5jaG9yLmNvbCA9IGxlZnQubGVuZ3RoO1xuICAgICAgICBmb2N1cy5jb2wgPSBhbmNob3IuY29sICsgbGVuO1xuICAgICAgICB0aGlzLnVwZGF0ZUZvcm1hdHRpbmcoKTtcbiAgICAgICAgdGhpcy5zZXRTZWxlY3Rpb24oZm9jdXMsIGFuY2hvcik7ICBcblxuICAgICAgLy8gU2Vjb25kIGNhc2U6IEVtcHR5IHNlbGVjdGlvbiB3aXRoIHN1cnJvdW5kaW5nIGZvcm1hdHRpbmcgbWFya2VycywgcmVtb3ZlIHRob3NlXG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBmb2N1cy5jb2wgPT0gYW5jaG9yLmNvbCBcbiAgICAgICAgJiYgISF0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKDAsIGZvY3VzLmNvbCkubWF0Y2goY29tbWFuZHNbY29tbWFuZF0udW5zZXQucHJlUGF0dGVybilcbiAgICAgICAgJiYgISF0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKGZvY3VzLmNvbCkubWF0Y2goY29tbWFuZHNbY29tbWFuZF0udW5zZXQucG9zdFBhdHRlcm4pXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5saW5lRGlydHlbZm9jdXMucm93XSA9IHRydWU7XG4gICAgICAgIGNvbnN0IGxlZnQgPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKDAsIGZvY3VzLmNvbCkucmVwbGFjZShjb21tYW5kc1tjb21tYW5kXS51bnNldC5wcmVQYXR0ZXJuLCAnJyk7XG4gICAgICAgIGNvbnN0IHJpZ2h0ID0gdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cihmb2N1cy5jb2wpLnJlcGxhY2UoY29tbWFuZHNbY29tbWFuZF0udW5zZXQucG9zdFBhdHRlcm4sICcnKTtcbiAgICAgICAgdGhpcy5saW5lc1tmb2N1cy5yb3ddID0gbGVmdC5jb25jYXQocmlnaHQpO1xuICAgICAgICBmb2N1cy5jb2wgPSBhbmNob3IuY29sID0gbGVmdC5sZW5ndGg7XG4gICAgICAgIHRoaXMudXBkYXRlRm9ybWF0dGluZygpO1xuICAgICAgICB0aGlzLnNldFNlbGVjdGlvbihmb2N1cywgYW5jaG9yKTtcblxuICAgICAgLy8gTm90IGN1cnJlbnRseSBmb3JtYXR0ZWQsIGluc2VydCBmb3JtYXR0aW5nIG1hcmtlcnNcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFxuICAgICAgICAvLyBUcmltIGFueSBzcGFjZXMgZnJvbSB0aGUgc2VsZWN0aW9uXG4gICAgICAgIGxldCB7c3RhcnRDb2wsIGVuZENvbH0gPSBmb2N1cy5jb2wgPCBhbmNob3IuY29sID8ge3N0YXJ0Q29sOiBmb2N1cy5jb2wsIGVuZENvbDogYW5jaG9yLmNvbH0gOiB7c3RhcnRDb2w6IGFuY2hvci5jb2wsIGVuZENvbDogZm9jdXMuY29sfTtcblxuICAgICAgICBsZXQgbWF0Y2ggPSB0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKHN0YXJ0Q29sLCBlbmRDb2wgLSBzdGFydENvbCkubWF0Y2goL14oPzxsZWFkaW5nPlxccyopLipcXFMoPzx0cmFpbGluZz5cXHMqKSQvKTtcbiAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgc3RhcnRDb2wgKz0gbWF0Y2guZ3JvdXBzLmxlYWRpbmcubGVuZ3RoO1xuICAgICAgICAgIGVuZENvbCAtPSBtYXRjaC5ncm91cHMudHJhaWxpbmcubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9jdXMuY29sID0gc3RhcnRDb2w7XG4gICAgICAgIGFuY2hvci5jb2wgPSBlbmRDb2w7XG5cbiAgICAgICAgLy8gSnVzdCBpbnNlcnQgbWFya3VwIGJlZm9yZSBhbmQgYWZ0ZXIgYW5kIGhvcGUgZm9yIHRoZSBiZXN0LiBcbiAgICAgICAgdGhpcy53cmFwU2VsZWN0aW9uKGNvbW1hbmRzW2NvbW1hbmRdLnNldC5wcmUsIGNvbW1hbmRzW2NvbW1hbmRdLnNldC5wb3N0LCBmb2N1cywgYW5jaG9yKTtcbiAgICAgICAgLy8gVE9ETyBjbGVhbiB0aGlzIHVwIHNvIHRoYXQgbWFya3VwIHJlbWFpbnMgcHJvcGVybHkgbmVzdGVkXG4gICAgICB9XG5cbiAgICB9IGVsc2UgaWYgKGNvbW1hbmRzW2NvbW1hbmRdLnR5cGUgPT0gJ2xpbmUnKSB7XG4gICAgICBsZXQgYW5jaG9yID0gdGhpcy5nZXRTZWxlY3Rpb24odHJ1ZSk7XG4gICAgICBsZXQgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbihmYWxzZSk7XG4gICAgICBpZiAoIWFuY2hvcikgYW5jaG9yID0gZm9jdXM7XG4gICAgICBpZiAoIWZvY3VzKSByZXR1cm47XG4gICAgICB0aGlzLmNsZWFyRGlydHlGbGFnKCk7XG4gICAgICBsZXQgc3RhcnQgPSBhbmNob3Iucm93ID4gZm9jdXMucm93ID8gZm9jdXMgOiBhbmNob3I7XG4gICAgICBsZXQgZW5kID0gIGFuY2hvci5yb3cgPiBmb2N1cy5yb3cgPyBhbmNob3IgOiBmb2N1cztcbiAgICAgIGlmIChlbmQucm93ID4gc3RhcnQucm93ICYmIGVuZC5jb2wgPT0gMCkge1xuICAgICAgICBlbmQucm93LS07XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGxpbmUgPSBzdGFydC5yb3c7IGxpbmUgPD0gZW5kLnJvdzsgbGluZSsrKSB7XG4gICAgICAgIGlmIChzdGF0ZSAmJiB0aGlzLmxpbmVUeXBlc1tsaW5lXSAhPSBjb21tYW5kc1tjb21tYW5kXS5jbGFzc05hbWUpIHtcbiAgICAgICAgICB0aGlzLmxpbmVzW2xpbmVdID0gdGhpcy5saW5lc1tsaW5lXS5yZXBsYWNlKGNvbW1hbmRzW2NvbW1hbmRdLnNldC5wYXR0ZXJuLCBjb21tYW5kc1tjb21tYW5kXS5zZXQucmVwbGFjZW1lbnQucmVwbGFjZSgnJCMnLCAobGluZSAtIHN0YXJ0LnJvdyArIDEpKSk7XG4gICAgICAgICAgdGhpcy5saW5lRGlydHlbbGluZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RhdGUgJiYgdGhpcy5saW5lVHlwZXNbbGluZV0gPT0gY29tbWFuZHNbY29tbWFuZF0uY2xhc3NOYW1lKSB7XG4gICAgICAgICAgdGhpcy5saW5lc1tsaW5lXSA9IHRoaXMubGluZXNbbGluZV0ucmVwbGFjZShjb21tYW5kc1tjb21tYW5kXS51bnNldC5wYXR0ZXJuLCBjb21tYW5kc1tjb21tYW5kXS51bnNldC5yZXBsYWNlbWVudCk7XG4gICAgICAgICAgdGhpcy5saW5lRGlydHlbbGluZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnVwZGF0ZUZvcm1hdHRpbmcoKTtcbiAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKHtyb3c6IGVuZC5yb3csIGNvbDogdGhpcy5saW5lc1tlbmQucm93XS5sZW5ndGh9LCB7cm93OiBzdGFydC5yb3csIGNvbDogMH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGlubGluZSBmb3JtYXR0aW5nIGlzIGFsbG93ZWQgYXQgdGhlIGN1cnJlbnQgZm9jdXMgXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmb2N1cyBUaGUgY3VycmVudCBmb2N1c1xuICAgKi9cbiAgaXNJbmxpbmVGb3JtYXR0aW5nQWxsb3dlZCgpIHtcbiAgICAvLyBUT0RPIFJlbW92ZSBwYXJhbWV0ZXJzIGZyb20gYWxsIGNhbGxzXG4gICAgY29uc3Qgc2VsID0gd2luZG93LmdldFNlbGVjdGlvbigpO1xuICAgIGlmICghc2VsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBDaGVjayBpZiB3ZSBjYW4gZmluZCBhIGNvbW1vbiBhbmNlc3RvciB3aXRoIHRoZSBjbGFzcyBgVE1JbmxpbmVGb3JtYXR0ZWRgIFxuXG4gICAgLy8gU3BlY2lhbCBjYXNlOiBFbXB0eSBzZWxlY3Rpb24gcmlnaHQgYmVmb3JlIGBUTUlubGluZUZvcm1hdHRlZGBcbiAgICBpZiAoc2VsLmlzQ29sbGFwc2VkICYmIHNlbC5mb2N1c05vZGUubm9kZVR5cGUgPT0gMyAmJiBzZWwuZm9jdXNPZmZzZXQgPT0gc2VsLmZvY3VzTm9kZS5ub2RlVmFsdWUubGVuZ3RoKSB7XG4gICAgICBsZXQgbm9kZTtcbiAgICAgIGZvciAobm9kZSA9IHNlbC5mb2N1c05vZGU7IG5vZGUgJiYgbm9kZS5uZXh0U2libGluZyA9PSBudWxsOyBub2RlID0gbm9kZS5wYXJlbnROb2RlKTtcbiAgICAgIGlmIChub2RlICYmIG5vZGUubmV4dFNpYmxpbmcuY2xhc3NOYW1lICYmIG5vZGUubmV4dFNpYmxpbmcuY2xhc3NOYW1lLmluY2x1ZGVzKCdUTUlubGluZUZvcm1hdHRlZCcpKSByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBMb29rIGZvciBhIGNvbW1vbiBhbmNlc3RvclxuICAgIGxldCBhbmNlc3RvciA9IHRoaXMuY29tcHV0ZUNvbW1vbkFuY2VzdG9yKHNlbC5mb2N1c05vZGUsIHNlbC5hbmNob3JOb2RlKTtcbiAgICBpZiAoIWFuY2VzdG9yKSByZXR1cm4gZmFsc2U7XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSdzIGFuIGFuY2VzdG9yIG9mIGNsYXNzICdUTUlubGluZUZvcm1hdHRlZCcgb3IgJ1RNQmxhbmtMaW5lJ1xuICAgIHdoaWxlIChhbmNlc3RvciAmJiBhbmNlc3RvciAhPSB0aGlzLmUpIHtcbiAgICAgIGlmIChhbmNlc3Rvci5jbGFzc05hbWUgJiYgKGFuY2VzdG9yLmNsYXNzTmFtZS5pbmNsdWRlcygnVE1JbmxpbmVGb3JtYXR0ZWQnKSB8fCBhbmNlc3Rvci5jbGFzc05hbWUuaW5jbHVkZXMoJ1RNQmxhbmtMaW5lJykpKSByZXR1cm4gdHJ1ZTtcbiAgICAgIGFuY2VzdG9yID0gYW5jZXN0b3IucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIGluIHRoZSBzdHJpbmdzIHByZSBhbmQgcG9zdC4gSWYgdGhlIHNlbGVjdGlvbiBpcyBub3Qgb24gb25lIGxpbmUsIHJldHVybnMuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcmUgVGhlIHN0cmluZyB0byBpbnNlcnQgYmVmb3JlIHRoZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwb3N0IFRoZSBzdHJpbmcgdG8gaW5zZXJ0IGFmdGVyIHRoZSBzZWxlY3Rpb24uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmb2N1cyBUaGUgY3VycmVudCBzZWxlY3Rpb24gZm9jdXMuIElmIG51bGwsIHNlbGVjdGlvbiB3aWxsIGJlIGNvbXB1dGVkLlxuICAgKiBAcGFyYW0ge29iamVjdH0gYW5jaG9yIFRoZSBjdXJyZW50IHNlbGVjdGlvbiBmb2N1cy4gSWYgbnVsbCwgc2VsZWN0aW9uIHdpbGwgYmUgY29tcHV0ZWQuXG4gICAqL1xuICB3cmFwU2VsZWN0aW9uKHByZSwgcG9zdCwgZm9jdXMgPSBudWxsLCBhbmNob3IgPSBudWxsKSB7XG4gICAgaWYgKCFmb2N1cykgZm9jdXMgPSB0aGlzLmdldFNlbGVjdGlvbihmYWxzZSk7XG4gICAgaWYgKCFhbmNob3IpIGFuY2hvciA9IHRoaXMuZ2V0U2VsZWN0aW9uKHRydWUpO1xuICAgIGlmICghZm9jdXMgfHwgIWFuY2hvciB8fCBmb2N1cy5yb3cgIT0gYW5jaG9yLnJvdykgcmV0dXJuO1xuICAgIHRoaXMubGluZURpcnR5W2ZvY3VzLnJvd10gPSB0cnVlO1xuXG4gICAgY29uc3Qgc3RhcnRDb2wgPSBmb2N1cy5jb2wgPCBhbmNob3IuY29sID8gZm9jdXMuY29sIDogYW5jaG9yLmNvbDtcbiAgICBjb25zdCBlbmRDb2wgPSBmb2N1cy5jb2wgPCBhbmNob3IuY29sID8gYW5jaG9yLmNvbCA6IGZvY3VzLmNvbDtcbiAgICBjb25zdCBsZWZ0ID0gdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cigwLCBzdGFydENvbCkuY29uY2F0KHByZSk7XG4gICAgY29uc3QgbWlkID0gKGVuZENvbCA9PSBzdGFydENvbCA/ICcnIDogdGhpcy5saW5lc1tmb2N1cy5yb3ddLnN1YnN0cihzdGFydENvbCwgZW5kQ29sIC0gc3RhcnRDb2wpKTsgXG4gICAgY29uc3QgcmlnaHQgPSBwb3N0LmNvbmNhdCh0aGlzLmxpbmVzW2ZvY3VzLnJvd10uc3Vic3RyKGVuZENvbCkpO1xuICAgIHRoaXMubGluZXNbZm9jdXMucm93XSA9IGxlZnQuY29uY2F0KG1pZCwgcmlnaHQpO1xuICAgIGFuY2hvci5jb2wgPSBsZWZ0Lmxlbmd0aDtcbiAgICBmb2N1cy5jb2wgPSBhbmNob3IuY29sICsgbWlkLmxlbmd0aDtcblxuICAgIHRoaXMudXBkYXRlRm9ybWF0dGluZygpO1xuICAgIHRoaXMuc2V0U2VsZWN0aW9uKGZvY3VzLCBhbmNob3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGNvbW1hbmQgc3RhdGUgZm9yIGEgY29tbWFuZCAodHJ1ZSA8LT4gZmFsc2UpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tYW5kIFRoZSBlZGl0b3IgY29tbWFuZFxuICAgKi9cbiAgdG9nZ2xlQ29tbWFuZFN0YXRlKGNvbW1hbmQpIHtcbiAgICBpZiAoIXRoaXMubGFzdENvbW1hbmRTdGF0ZSkgdGhpcy5sYXN0Q29tbWFuZFN0YXRlID0gdGhpcy5nZXRDb21tYW5kU3RhdGUoKTtcbiAgICB0aGlzLnNldENvbW1hbmRTdGF0ZShjb21tYW5kLCAhdGhpcy5sYXN0Q29tbWFuZFN0YXRlW2NvbW1hbmRdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaXJlcyBhIGNoYW5nZSBldmVudC4gVXBkYXRlcyB0aGUgbGlua2VkIHRleHRhcmVhIGFuZCBub3RpZmllcyBhbnkgZXZlbnQgbGlzdGVuZXJzLlxuICAgKi9cbiAgZmlyZUNoYW5nZSgpIHtcbiAgICBpZiAoIXRoaXMudGV4dGFyZWEgJiYgIXRoaXMubGlzdGVuZXJzLmNoYW5nZS5sZW5ndGgpIHJldHVybjtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KCk7XG4gICAgaWYgKHRoaXMudGV4dGFyZWEpIHRoaXMudGV4dGFyZWEudmFsdWUgPSBjb250ZW50O1xuICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMubGlzdGVuZXJzLmNoYW5nZSkge1xuICAgICAgbGlzdGVuZXIoe1xuICAgICAgICBjb250ZW50OiBjb250ZW50LFxuICAgICAgICBsaW5lc0RpcnR5OiB0aGlzLmxpbmVzRGlydHksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRmlyZXMgYSBcInNlbGVjdGlvbiBjaGFuZ2VkXCIgZXZlbnQuXG4gICAqL1xuICBmaXJlU2VsZWN0aW9uKCkge1xuICAgIGlmICh0aGlzLmxpc3RlbmVycy5zZWxlY3Rpb24gJiYgdGhpcy5saXN0ZW5lcnMuc2VsZWN0aW9uLmxlbmd0aCkge1xuICAgICAgbGV0IGZvY3VzID0gdGhpcy5nZXRTZWxlY3Rpb24oZmFsc2UpO1xuICAgICAgbGV0IGFuY2hvciA9IHRoaXMuZ2V0U2VsZWN0aW9uKHRydWUpO1xuICAgICAgbGV0IGNvbW1hbmRTdGF0ZSA9IHRoaXMuZ2V0Q29tbWFuZFN0YXRlKGZvY3VzLCBhbmNob3IpO1xuICAgICAgaWYgKHRoaXMubGFzdENvbW1hbmRTdGF0ZSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMubGFzdENvbW1hbmRTdGF0ZSwgY29tbWFuZFN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGFzdENvbW1hbmRTdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIGNvbW1hbmRTdGF0ZSk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBsaXN0ZW5lciBvZiB0aGlzLmxpc3RlbmVycy5zZWxlY3Rpb24pIHtcbiAgICAgICAgbGlzdGVuZXIoe1xuICAgICAgICAgIGZvY3VzOiBmb2N1cyxcbiAgICAgICAgICBhbmNob3I6IGFuY2hvcixcbiAgICAgICAgICBjb21tYW5kU3RhdGU6IHRoaXMubGFzdENvbW1hbmRTdGF0ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIFRoZSB0eXBlIG9mIGV2ZW50IHRvIGxpc3RlbiB0by4gQ2FuIGJlICdjaGFuZ2UnIG9yICdzZWxlY3Rpb24nXG4gICAqIEBwYXJhbSB7Kn0gbGlzdGVuZXIgRnVuY3Rpb24gb2YgdGhlIHR5cGUgKGV2ZW50KSA9PiB7fSB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgb2NjdXJzLlxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgIGlmICh0eXBlLm1hdGNoKC9eKD86Y2hhbmdlfGlucHV0KSQvaSkpIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzLmNoYW5nZS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gICAgaWYgKHR5cGUubWF0Y2goL14oPzpzZWxlY3Rpb258c2VsZWN0aW9uY2hhbmdlKSQvaSkpIHtcbiAgICAgIHRoaXMubGlzdGVuZXJzLnNlbGVjdGlvbi5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRWRpdG9yO1xuIl0sIm5hbWVzIjpbImNoZWNrIiwiaXQiLCJNYXRoIiwibW9kdWxlIiwiZ2xvYmFsVGhpcyIsIndpbmRvdyIsInNlbGYiLCJnbG9iYWwiLCJGdW5jdGlvbiIsImV4ZWMiLCJlcnJvciIsImZhaWxzIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSIsInByb3BlcnR5SXNFbnVtZXJhYmxlIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiTkFTSE9STl9CVUciLCJjYWxsIiwiZXhwb3J0cyIsIlYiLCJkZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImJpdG1hcCIsInZhbHVlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJ0b1N0cmluZyIsInNsaWNlIiwic3BsaXQiLCJjbGFzc29mIiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwiSW5kZXhlZE9iamVjdCIsInJlcXVpcmVPYmplY3RDb2VyY2libGUiLCJpbnB1dCIsIlBSRUZFUlJFRF9TVFJJTkciLCJpc09iamVjdCIsImZuIiwidmFsIiwidmFsdWVPZiIsImhhc093blByb3BlcnR5Iiwia2V5IiwiZG9jdW1lbnQiLCJFWElTVFMiLCJjcmVhdGVFbGVtZW50IiwiREVTQ1JJUFRPUlMiLCJhIiwibmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiTyIsIlAiLCJ0b0luZGV4ZWRPYmplY3QiLCJ0b1ByaW1pdGl2ZSIsIklFOF9ET01fREVGSU5FIiwiaGFzIiwiY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUiLCJmIiwiU3RyaW5nIiwibmF0aXZlRGVmaW5lUHJvcGVydHkiLCJBdHRyaWJ1dGVzIiwiYW5PYmplY3QiLCJvYmplY3QiLCJkZWZpbmVQcm9wZXJ0eU1vZHVsZSIsImNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSIsIlNIQVJFRCIsInN0b3JlIiwic2V0R2xvYmFsIiwiZnVuY3Rpb25Ub1N0cmluZyIsImluc3BlY3RTb3VyY2UiLCJXZWFrTWFwIiwidGVzdCIsInB1c2giLCJ2ZXJzaW9uIiwibW9kZSIsImNvcHlyaWdodCIsImlkIiwicG9zdGZpeCIsInJhbmRvbSIsImtleXMiLCJzaGFyZWQiLCJ1aWQiLCJzZXQiLCJlbmZvcmNlIiwiZ2V0dGVyRm9yIiwiVFlQRSIsInN0YXRlIiwidHlwZSIsIk5BVElWRV9XRUFLX01BUCIsIndtZ2V0Iiwid21oYXMiLCJ3bXNldCIsIm1ldGFkYXRhIiwiU1RBVEUiLCJzaGFyZWRLZXkiLCJoaWRkZW5LZXlzIiwib2JqZWN0SGFzIiwiZ2V0SW50ZXJuYWxTdGF0ZSIsIkludGVybmFsU3RhdGVNb2R1bGUiLCJlbmZvcmNlSW50ZXJuYWxTdGF0ZSIsIlRFTVBMQVRFIiwib3B0aW9ucyIsInVuc2FmZSIsInNpbXBsZSIsIm5vVGFyZ2V0R2V0Iiwic291cmNlIiwiam9pbiIsInByb3RvdHlwZSIsImFGdW5jdGlvbiIsInZhcmlhYmxlIiwibmFtZXNwYWNlIiwibWV0aG9kIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwicGF0aCIsImNlaWwiLCJmbG9vciIsImFyZ3VtZW50IiwiaXNOYU4iLCJtaW4iLCJ0b0ludGVnZXIiLCJtYXgiLCJpbmRleCIsImludGVnZXIiLCJjcmVhdGVNZXRob2QiLCJJU19JTkNMVURFUyIsIiR0aGlzIiwiZWwiLCJmcm9tSW5kZXgiLCJ0b0xlbmd0aCIsInRvQWJzb2x1dGVJbmRleCIsImluY2x1ZGVzIiwiaW5kZXhPZiIsInJlcXVpcmUiLCJuYW1lcyIsImkiLCJyZXN1bHQiLCJlbnVtQnVnS2V5cyIsImNvbmNhdCIsImdldE93blByb3BlcnR5TmFtZXMiLCJpbnRlcm5hbE9iamVjdEtleXMiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHMiLCJnZXRCdWlsdEluIiwib3duS2V5cyIsImdldE93blByb3BlcnR5TmFtZXNNb2R1bGUiLCJnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUiLCJ0YXJnZXQiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUiLCJyZXBsYWNlbWVudCIsImlzRm9yY2VkIiwiZmVhdHVyZSIsImRldGVjdGlvbiIsImRhdGEiLCJub3JtYWxpemUiLCJQT0xZRklMTCIsIk5BVElWRSIsInN0cmluZyIsInJlcGxhY2UiLCJ0b0xvd2VyQ2FzZSIsIlRBUkdFVCIsIkdMT0JBTCIsIlNUQVRJQyIsInN0YXQiLCJGT1JDRUQiLCJ0YXJnZXRQcm9wZXJ0eSIsInNvdXJjZVByb3BlcnR5IiwiZm9yY2VkIiwiY29weUNvbnN0cnVjdG9yUHJvcGVydGllcyIsInNoYW0iLCJyZWRlZmluZSIsIkFycmF5IiwiaXNBcnJheSIsImFyZyIsInByb3BlcnR5S2V5IiwiU3ltYm9sIiwiTkFUSVZFX1NZTUJPTCIsIml0ZXJhdG9yIiwiV2VsbEtub3duU3ltYm9sc1N0b3JlIiwiY3JlYXRlV2VsbEtub3duU3ltYm9sIiwiVVNFX1NZTUJPTF9BU19VSUQiLCJ3aXRob3V0U2V0dGVyIiwibmFtZSIsIlNQRUNJRVMiLCJ3ZWxsS25vd25TeW1ib2wiLCJvcmlnaW5hbEFycmF5IiwiQyIsImNvbnN0cnVjdG9yIiwicHJvY2VzcyIsInZlcnNpb25zIiwidjgiLCJtYXRjaCIsInVzZXJBZ2VudCIsIk1FVEhPRF9OQU1FIiwiVjhfVkVSU0lPTiIsImFycmF5IiwiZm9vIiwiQm9vbGVhbiIsIklTX0NPTkNBVF9TUFJFQURBQkxFIiwiTUFYX1NBRkVfSU5URUdFUiIsIk1BWElNVU1fQUxMT1dFRF9JTkRFWF9FWENFRURFRCIsIklTX0NPTkNBVF9TUFJFQURBQkxFX1NVUFBPUlQiLCJTUEVDSUVTX1NVUFBPUlQiLCJhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0IiwiaXNDb25jYXRTcHJlYWRhYmxlIiwic3ByZWFkYWJsZSIsIiQiLCJwcm90byIsInRvT2JqZWN0IiwiQSIsImFycmF5U3BlY2llc0NyZWF0ZSIsIm4iLCJrIiwibGVuIiwiRSIsImNyZWF0ZVByb3BlcnR5IiwibmF0aXZlSm9pbiIsIkVTM19TVFJJTkdTIiwiU1RSSUNUX01FVEhPRCIsImFycmF5TWV0aG9kSXNTdHJpY3QiLCJzZXBhcmF0b3IiLCJGdW5jdGlvblByb3RvdHlwZSIsIkZ1bmN0aW9uUHJvdG90eXBlVG9TdHJpbmciLCJuYW1lUkUiLCJOQU1FIiwibmF0aXZlQXNzaWduIiwiYXNzaWduIiwiYiIsIkIiLCJzeW1ib2wiLCJhbHBoYWJldCIsImZvckVhY2giLCJjaHIiLCJvYmplY3RLZXlzIiwiVCIsImFyZ3VtZW50c0xlbmd0aCIsIlMiLCJqIiwidGhhdCIsImlnbm9yZUNhc2UiLCJtdWx0aWxpbmUiLCJkb3RBbGwiLCJ1bmljb2RlIiwic3RpY2t5IiwiUkUiLCJzIiwiUmVnRXhwIiwicmUiLCJsYXN0SW5kZXgiLCJuYXRpdmVFeGVjIiwibmF0aXZlUmVwbGFjZSIsInBhdGNoZWRFeGVjIiwiVVBEQVRFU19MQVNUX0lOREVYX1dST05HIiwicmUxIiwicmUyIiwiVU5TVVBQT1JURURfWSIsInN0aWNreUhlbHBlcnMiLCJCUk9LRU5fQ0FSRVQiLCJOUENHX0lOQ0xVREVEIiwiUEFUQ0giLCJzdHIiLCJyZUNvcHkiLCJmbGFncyIsInJlZ2V4cEZsYWdzIiwiY2hhcnNBZGRlZCIsInN0ckNvcHkiLCJSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUyIsImdyb3VwcyIsIlJFUExBQ0VfS0VFUFNfJDAiLCJSRVBMQUNFIiwiUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUiLCJTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMiLCJvcmlnaW5hbEV4ZWMiLCJhcHBseSIsIktFWSIsIlNZTUJPTCIsIkRFTEVHQVRFU19UT19TWU1CT0wiLCJERUxFR0FURVNfVE9fRVhFQyIsImV4ZWNDYWxsZWQiLCJuYXRpdmVSZWdFeHBNZXRob2QiLCJtZXRob2RzIiwibmF0aXZlTWV0aG9kIiwicmVnZXhwIiwiYXJnMiIsImZvcmNlU3RyaW5nTWV0aG9kIiwicmVnZXhwRXhlYyIsImRvbmUiLCJzdHJpbmdNZXRob2QiLCJyZWdleE1ldGhvZCIsIkNPTlZFUlRfVE9fU1RSSU5HIiwicG9zIiwicG9zaXRpb24iLCJzaXplIiwiZmlyc3QiLCJzZWNvbmQiLCJjaGFyQ29kZUF0IiwiY2hhckF0IiwiY29kZUF0IiwiUiIsImZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljIiwiTUFUQ0giLCJuYXRpdmVNYXRjaCIsIm1heWJlQ2FsbE5hdGl2ZSIsIm1hdGNoZXIiLCJyZXMiLCJyeCIsInJlZ0V4cEV4ZWMiLCJmdWxsVW5pY29kZSIsIm1hdGNoU3RyIiwiYWR2YW5jZVN0cmluZ0luZGV4IiwiaXNSZWdFeHAiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJhcnJheVB1c2giLCJNQVhfVUlOVDMyIiwiU1VQUE9SVFNfWSIsIlNQTElUIiwibmF0aXZlU3BsaXQiLCJpbnRlcm5hbFNwbGl0IiwibGltaXQiLCJsaW0iLCJvdXRwdXQiLCJsYXN0TGFzdEluZGV4Iiwic2VwYXJhdG9yQ29weSIsImxhc3RMZW5ndGgiLCJzcGxpdHRlciIsInNwZWNpZXNDb25zdHJ1Y3RvciIsInVuaWNvZGVNYXRjaGluZyIsImNhbGxSZWdFeHBFeGVjIiwicCIsInEiLCJ6IiwiZSIsInF1b3QiLCJ0YWciLCJhdHRyaWJ1dGUiLCJwMSIsImZvcmNlZFN0cmluZ0hUTUxNZXRob2QiLCJhbmNob3IiLCJjcmVhdGVIVE1MIiwiYm9sZCIsImxpbmsiLCJ1cmwiLCJzdmciLCJibG9ja3F1b3RlIiwiY2xlYXJfZm9ybWF0dGluZyIsImNvZGUiLCJoMSIsImgyIiwiaHIiLCJpbWFnZSIsIml0YWxpYyIsIm9sIiwic3RyaWtldGhyb3VnaCIsInVsIiwiaXNNYWNMaWtlIiwibmF2aWdhdG9yIiwicGxhdGZvcm0iLCJEZWZhdWx0Q29tbWFuZHMiLCJhY3Rpb24iLCJpbm5lckhUTUwiLCJ0aXRsZSIsImhvdGtleSIsImVkaXRvciIsImlzSW5saW5lRm9ybWF0dGluZ0FsbG93ZWQiLCJ3cmFwU2VsZWN0aW9uIiwiZW5hYmxlZCIsImZvY3VzIiwicGFzdGUiLCJDb21tYW5kQmFyIiwicHJvcHMiLCJjb21tYW5kcyIsImJ1dHRvbnMiLCJob3RrZXlzIiwiZWxlbWVudCIsInRhZ05hbWUiLCJnZXRFbGVtZW50QnlJZCIsImJvZHkiLCJjcmVhdGVDb21tYW5kQmFyRWxlbWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVLZXlkb3duIiwic2V0RWRpdG9yIiwicGFyZW50RWxlbWVudCIsImNsYXNzTmFtZSIsImNvbW1hbmQiLCJhcHBlbmRDaGlsZCIsImNvbW1hbmROYW1lIiwibW9kaWZpZXJzIiwibW9kaWZpZXJleHBsYW5hdGlvbiIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInNldENvbW1hbmRTdGF0ZSIsImhhbmRsZVNlbGVjdGlvbiIsImNvbW1hbmRTdGF0ZSIsIm91dGVyIiwibW9kaWZpZXIiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiUHJvcGVydGllcyIsIkdUIiwiTFQiLCJQUk9UT1RZUEUiLCJTQ1JJUFQiLCJJRV9QUk9UTyIsIkVtcHR5Q29uc3RydWN0b3IiLCJzY3JpcHRUYWciLCJjb250ZW50IiwiTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWCIsImFjdGl2ZVhEb2N1bWVudCIsIndyaXRlIiwiY2xvc2UiLCJ0ZW1wIiwicGFyZW50V2luZG93IiwiTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lIiwiaWZyYW1lIiwiZG9jdW1lbnRDcmVhdGVFbGVtZW50IiwiSlMiLCJpZnJhbWVEb2N1bWVudCIsInN0eWxlIiwiZGlzcGxheSIsImh0bWwiLCJzcmMiLCJjb250ZW50V2luZG93Iiwib3BlbiIsIkYiLCJOdWxsUHJvdG9PYmplY3QiLCJkb21haW4iLCJBY3RpdmVYT2JqZWN0IiwiY3JlYXRlIiwiVU5TQ09QQUJMRVMiLCJBcnJheVByb3RvdHlwZSIsImNhY2hlIiwidGhyb3dlciIsIkFDQ0VTU09SUyIsImFyZ3VtZW50MCIsImFyZ3VtZW50MSIsIiRpbmNsdWRlcyIsIlVTRVNfVE9fTEVOR1RIIiwiYXJyYXlNZXRob2RVc2VzVG9MZW5ndGgiLCJhZGRUb1Vuc2NvcGFibGVzIiwiSEFTX1NQRUNJRVNfU1VQUE9SVCIsIk1BWElNVU1fQUxMT1dFRF9MRU5HVEhfRVhDRUVERUQiLCJzcGxpY2UiLCJzdGFydCIsImRlbGV0ZUNvdW50IiwiYWN0dWFsU3RhcnQiLCJpbnNlcnRDb3VudCIsImFjdHVhbERlbGV0ZUNvdW50IiwiZnJvbSIsInRvIiwiY29ycmVjdElzUmVnRXhwTG9naWMiLCJzZWFyY2hTdHJpbmciLCJub3RBUmVnRXhwIiwiU1VCU1RJVFVUSU9OX1NZTUJPTFMiLCJTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCIsIm1heWJlVG9TdHJpbmciLCJyZWFzb24iLCJVTlNBRkVfU1VCU1RJVFVURSIsInNlYXJjaFZhbHVlIiwicmVwbGFjZVZhbHVlIiwicmVwbGFjZXIiLCJmdW5jdGlvbmFsUmVwbGFjZSIsInJlc3VsdHMiLCJhY2N1bXVsYXRlZFJlc3VsdCIsIm5leHRTb3VyY2VQb3NpdGlvbiIsIm1hdGNoZWQiLCJjYXB0dXJlcyIsIm5hbWVkQ2FwdHVyZXMiLCJyZXBsYWNlckFyZ3MiLCJnZXRTdWJzdGl0dXRpb24iLCJ0YWlsUG9zIiwibSIsInN5bWJvbHMiLCJjaCIsImNhcHR1cmUiLCJ3aGl0ZXNwYWNlIiwid2hpdGVzcGFjZXMiLCJsdHJpbSIsInJ0cmltIiwiZW5kIiwidHJpbSIsIm5vbiIsIiR0cmltIiwiZm9yY2VkU3RyaW5nVHJpbU1ldGhvZCIsIkZBSUxTX09OX1BSSU1JVElWRVMiLCJuYXRpdmVLZXlzIiwic2V0UHJvdG90eXBlT2YiLCJDT1JSRUNUX1NFVFRFUiIsInNldHRlciIsImFQb3NzaWJsZVByb3RvdHlwZSIsIl9fcHJvdG9fXyIsImR1bW15IiwiV3JhcHBlciIsIk5ld1RhcmdldCIsIk5ld1RhcmdldFByb3RvdHlwZSIsIkNPTlNUUlVDVE9SX05BTUUiLCJDb25zdHJ1Y3RvciIsInNldEludGVybmFsU3RhdGUiLCJOYXRpdmVSZWdFeHAiLCJSZWdFeHBQcm90b3R5cGUiLCJDT1JSRUNUX05FVyIsIlJlZ0V4cFdyYXBwZXIiLCJwYXR0ZXJuIiwidGhpc0lzUmVnRXhwIiwicGF0dGVybklzUmVnRXhwIiwiZmxhZ3NBcmVVbmRlZmluZWQiLCJnZXRGbGFncyIsImluaGVyaXRJZlJlcXVpcmVkIiwicHJveHkiLCJzZXRTcGVjaWVzIiwib2JqZWN0RGVmaW5lUHJvcGVydHlNb2R1bGUiLCJyZWdFeHBGbGFncyIsIlRPX1NUUklORyIsIm5hdGl2ZVRvU3RyaW5nIiwiTk9UX0dFTkVSSUMiLCJJTkNPUlJFQ1RfTkFNRSIsInJmIiwicmVwbGFjZW1lbnRzIiwiQVNDSUlQdW5jdHVhdGlvbiIsIk5vdFRyaWdnZXJDaGFyIiwiU2NoZW1lIiwiRW1haWwiLCJIVE1MT3BlblRhZyIsIkhUTUxDbG9zZVRhZyIsIkhUTUxUYWdOYW1lIiwiSFRNTENvbW1lbnQiLCJIVE1MUEkiLCJIVE1MRGVjbGFyYXRpb24iLCJIVE1MQ0RBVEEiLCJIVE1MQXR0cmlidXRlIiwiSFRNTEF0dFZhbHVlIiwiS25vd25UYWciLCJwdW5jdHVhdGlvbkxlYWRpbmciLCJwdW5jdHVhdGlvblRyYWlsaW5nIiwibGluZUdyYW1tYXIiLCJUTUgxIiwiVE1IMiIsIlRNSDMiLCJUTUg0IiwiVE1INSIsIlRNSDYiLCJUTUJsb2NrcXVvdGUiLCJUTUNvZGVGZW5jZUJhY2t0aWNrT3BlbiIsIlRNQ29kZUZlbmNlVGlsZGVPcGVuIiwiVE1Db2RlRmVuY2VCYWNrdGlja0Nsb3NlIiwiVE1Db2RlRmVuY2VUaWxkZUNsb3NlIiwiVE1CbGFua0xpbmUiLCJUTVNldGV4dEgxTWFya2VyIiwiVE1TZXRleHRIMk1hcmtlciIsIlRNSFIiLCJUTVVMIiwiVE1PTCIsIlRNSW5kZW50ZWRDb2RlIiwiVE1MaW5rUmVmZXJlbmNlRGVmaW5pdGlvbiIsImxhYmVsUGxhY2Vob2xkZXIiLCJodG1sQmxvY2tHcmFtbWFyIiwicGFyYUludGVycnVwdCIsImlubGluZUdyYW1tYXIiLCJlc2NhcGUiLCJhdXRvbGluayIsImxpbmtPcGVuIiwiaW1hZ2VPcGVuIiwibGlua0xhYmVsIiwiZGVmYXVsdCIsInJlcGxhY2VtZW50UmVnZXhwIiwiaW5saW5lUnVsZXMiLCJydWxlIiwiaHRtbGVzY2FwZSIsInByZSIsInBvc3QiLCJ1bnNldCIsInByZVBhdHRlcm4iLCJwb3N0UGF0dGVybiIsIkVkaXRvciIsInRleHRhcmVhIiwibGluZXMiLCJsaW5lRWxlbWVudHMiLCJsaW5lVHlwZXMiLCJsaW5lQ2FwdHVyZXMiLCJsaW5lUmVwbGFjZW1lbnRzIiwibGlua0xhYmVscyIsImxpbmVEaXJ0eSIsImxhc3RDb21tYW5kU3RhdGUiLCJsaXN0ZW5lcnMiLCJjaGFuZ2UiLCJzZWxlY3Rpb24iLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsInBhcmVudE5vZGUiLCJjcmVhdGVFZGl0b3JFbGVtZW50Iiwic2V0Q29udGVudCIsImNvbnRlbnRFZGl0YWJsZSIsIndoaXRlU3BhY2UiLCJ3ZWJraXRVc2VyTW9kaWZ5IiwibmV4dFNpYmxpbmciLCJpbnNlcnRCZWZvcmUiLCJoYW5kbGVJbnB1dEV2ZW50IiwiaGFuZGxlU2VsZWN0aW9uQ2hhbmdlRXZlbnQiLCJoYW5kbGVQYXN0ZSIsImNoaWxkTm9kZXMiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJsaW5lTnVtIiwibGUiLCJ1cGRhdGVGb3JtYXR0aW5nIiwiZmlyZUNoYW5nZSIsInVwZGF0ZUxpbmVUeXBlcyIsInVwZGF0ZUxpbmtMYWJlbHMiLCJhcHBseUxpbmVUeXBlcyIsImwiLCJwcm9jZXNzSW5saW5lU3R5bGVzIiwiY29udGVudEhUTUwiLCJyZW1vdmVBdHRyaWJ1dGUiLCJkYXRhc2V0IiwiY29kZUJsb2NrVHlwZSIsImNvZGVCbG9ja1NlcUxlbmd0aCIsImh0bWxCbG9jayIsImxpbmVUeXBlIiwibGluZUNhcHR1cmUiLCJsaW5lUmVwbGFjZW1lbnQiLCJodG1sQmxvY2tUeXBlIiwiaGVhZGluZ0xpbmUiLCJoZWFkaW5nTGluZVR5cGUiLCJjbGVhckRpcnR5RmxhZyIsInVwZGF0ZUxpbmVDb250ZW50cyIsIm9yaWdpbmFsU3RyaW5nIiwiaXNJbWFnZSIsInRleHRPZmZzZXQiLCJvcGVuZXIiLCJzdWJzdHIiLCJjdXJyZW50T2Zmc2V0IiwiYnJhY2tldExldmVsIiwibGlua1RleHQiLCJsaW5rUmVmIiwibGlua0RldGFpbHMiLCJ0ZXh0T3V0ZXIiLCJjYXAiLCJwYXJzZUxpbmtPckltYWdlIiwibmV4dENoYXIiLCJwYXJlbnRoZXNpc0xldmVsIiwiaW5saW5lT3V0ZXIiLCJ2YWxpZCIsImxhYmVsIiwiY2hhckNvdW50IiwicHJvY2Vzc2VkIiwic3RhY2siLCJvZmZzZXQiLCJwb3RlbnRpYWxMaW5rIiwicG90ZW50aWFsSW1hZ2UiLCJkZWxpbUNvdW50IiwiZGVsaW1TdHJpbmciLCJjdXJyZW50RGVsaW1pdGVyIiwicHJlY2VkaW5nIiwiZm9sbG93aW5nIiwicHVuY3R1YXRpb25Gb2xsb3dzIiwicHVuY3R1YXRpb25QcmVjZWRlcyIsIndoaXRlc3BhY2VGb2xsb3dzIiwid2hpdGVzcGFjZVByZWNlZGVzIiwiY2FuT3BlbiIsImNhbkNsb3NlIiwic3RhY2tQb2ludGVyIiwiZGVsaW1pdGVyIiwiZW50cnkiLCJwb3AiLCJjb3VudCIsImNvbnN1bWVkIiwibGluZURlbHRhIiwiY2hpbGRFbGVtZW50Q291bnQiLCJmaXJzdENoYW5nZWRMaW5lIiwidGV4dENvbnRlbnQiLCJsYXN0Q2hhbmdlZExpbmUiLCJsaW5lc1RvRGVsZXRlIiwibGluZXNUb0FkZCIsInNwbGljZUxpbmVzIiwibGluZSIsImN0Iiwic2VsIiwiY29udGludWFibGVUeXBlIiwiY2hlY2tMaW5lIiwiY29sIiwicm93IiwicGFyc2VJbnQiLCJnZXRBbmNob3IiLCJnZXRTZWxlY3Rpb24iLCJzdGFydE5vZGUiLCJhbmNob3JOb2RlIiwiZm9jdXNOb2RlIiwibm9kZVR5cGUiLCJOb2RlIiwiVEVYVF9OT0RFIiwiYW5jaG9yT2Zmc2V0IiwiZm9jdXNPZmZzZXQiLCJjb21wdXRlQ29sdW1uIiwibm9kZSIsInByZXZpb3VzU2libGluZyIsImJpbmRSaWdodCIsImNoaWxkcmVuQ29tcGxldGUiLCJydiIsIm5vZGVWYWx1ZSIsInJhbmdlIiwiY3JlYXRlUmFuZ2UiLCJjb21wdXRlTm9kZUFuZE9mZnNldCIsInNldFN0YXJ0Iiwic2V0RW5kIiwid2luZG93U2VsZWN0aW9uIiwicmVtb3ZlQWxsUmFuZ2VzIiwiYWRkUmFuZ2UiLCJpbnB1dFR5cGUiLCJwcm9jZXNzTmV3UGFyYWdyYXBoIiwiY2hpbGROb2RlIiwiZGl2V3JhcHBlciIsInVwZGF0ZUxpbmVDb250ZW50c0FuZEZvcm1hdHRpbmciLCJzZXRTZWxlY3Rpb24iLCJmaXJlU2VsZWN0aW9uIiwic3RhcnRMaW5lIiwibGluZXNUb0luc2VydCIsImFkanVzdExpbmVFbGVtZW50cyIsImluc2VydGVkQmxhbmsiLCJpbnNlcnRlZERpcnR5IiwidGV4dCIsIm9yaWdpbmFsRXZlbnQiLCJjbGlwYm9hcmREYXRhIiwiZ2V0RGF0YSIsImJlZ2lubmluZyIsImluc2VydGVkTGluZXMiLCJsaW5lQmVmb3JlIiwibGluZUVuZCIsImVuZENvbFBvcyIsIm5vZGUxIiwibm9kZTIiLCJhbmNlc3RyeSIsInVuc2hpZnQiLCJhbmNlc3RyeTEiLCJhbmNlc3RyeTIiLCJjb21wdXRlQ29tbW9uQW5jZXN0b3IiLCJjbWQiLCJjb21wdXRlRW5jbG9zaW5nTWFya3VwTm9kZSIsIm1hcmt1cE5vZGUiLCJzdGFydENvbCIsImxlZnQiLCJtaWQiLCJyaWdodCIsImVuZENvbCIsImxlYWRpbmciLCJ0cmFpbGluZyIsImlzQ29sbGFwc2VkIiwiYW5jZXN0b3IiLCJnZXRDb21tYW5kU3RhdGUiLCJnZXRDb250ZW50IiwibGlzdGVuZXIiLCJsaW5lc0RpcnR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQUEsSUFBSUEsS0FBSyxHQUFHLFVBQVVDLEVBQVYsRUFBYztDQUN4QixTQUFPQSxFQUFFLElBQUlBLEVBQUUsQ0FBQ0MsSUFBSCxJQUFXQSxJQUFqQixJQUF5QkQsRUFBaEM7Q0FDRCxDQUZEOzs7Q0FLQUUsWUFBQTtDQUVFSCxLQUFLLENBQUMsT0FBT0ksVUFBUCxJQUFxQixRQUFyQixJQUFpQ0EsVUFBbEMsQ0FBTCxJQUNBSixLQUFLLENBQUMsT0FBT0ssTUFBUCxJQUFpQixRQUFqQixJQUE2QkEsTUFBOUIsQ0FETCxJQUVBTCxLQUFLLENBQUMsT0FBT00sSUFBUCxJQUFlLFFBQWYsSUFBMkJBLElBQTVCLENBRkwsSUFHQU4sS0FBSyxDQUFDLE9BQU9PLGNBQVAsSUFBaUIsUUFBakIsSUFBNkJBLGNBQTlCLENBSEw7Q0FL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