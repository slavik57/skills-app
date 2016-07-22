"use strict";
var EnumUtils = (function () {
    function EnumUtils() {
    }
    EnumUtils.getNamesAndValues = function (e) {
        return this.getNames(e).map(function (_name) { return { name: _name, value: e[_name] }; });
    };
    EnumUtils.getNames = function (e) {
        return this.getObjectValues(e).filter(function (v) { return typeof v === "string"; });
    };
    EnumUtils.getValues = function (e) {
        return this.getObjectValues(e).filter(function (v) { return typeof v === "number"; });
    };
    EnumUtils.getObjectValues = function (e) {
        return Object.keys(e).map(function (k) { return e[k]; });
    };
    return EnumUtils;
}());
exports.EnumUtils = EnumUtils;
//# sourceMappingURL=enumUtils.js.map