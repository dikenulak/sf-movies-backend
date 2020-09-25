"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getList = void 0;

var _enum = require("./enum");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var request = require('request');

var NodeGeocoder = require('node-geocoder');

var url = 'https://data.sfgov.org/resource/yitu-d5am.json';
var options = {
  provider: 'opencage',
  // Optional depending on the providers
  apiKey: '0ba20dd7daf348ac8bc2496adb7397f5'
};
var geocoder = NodeGeocoder(options);

var filterData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
    var allDataWithoutNullLocation, locations, response, geocoderResponse;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            allDataWithoutNullLocation = data.filter(function (list) {
              return list.locations;
            }).slice(0, 400);
            locations = allDataWithoutNullLocation.map(function (d) {
              return d.locations;
            }).slice(0, 10);
            _context.next = 4;
            return geocoder.batchGeocode(Array.from(_construct(Set, [locations])));

          case 4:
            _context.next = 6;
            return _context.sent.map(function (data) {
              return data.value[0];
            });

          case 6:
            response = _context.sent;
            geocoderResponse = locations.map(function (location, index) {
              return {
                location: location,
                latlng: response[index]
              };
            });
            return _context.abrupt("return", {
              locationData: allDataWithoutNullLocation.map(function (data, index) {
                return _objectSpread(_objectSpread({}, data), {}, {
                  latlng: geocoderResponse.filter(function (resp) {
                    return resp.location === data.locations;
                  })[0] ? geocoderResponse.filter(function (resp) {
                    return resp.location === data.locations;
                  })[0].latlng : []
                });
              })
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function filterData(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getList = function getList(req, resp) {
  request.get({
    url: url,
    json: true,
    headers: {
      'User-Agent': 'request'
    }
  }, /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(err, res, data) {
      var _yield$filterData, locationData;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!err) {
                _context2.next = 4;
                break;
              }

              console.log('Error:', err);
              _context2.next = 13;
              break;

            case 4:
              if (!(res.statusCode !== 200)) {
                _context2.next = 8;
                break;
              }

              console.log('Status:', res.statusCode);
              _context2.next = 13;
              break;

            case 8:
              _context2.next = 10;
              return filterData(data);

            case 10:
              _yield$filterData = _context2.sent;
              locationData = _yield$filterData.locationData;
              resp.status(_enum.HTTP_STATUS_CODE.OK).json({
                status: _enum.HTTP_STATUS_CODE.OK,
                data: locationData,
                count: locationData.length
              });

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x2, _x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};

exports.getList = getList;