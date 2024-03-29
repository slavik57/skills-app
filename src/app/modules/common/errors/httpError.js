"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var HttpError = (function (_super) {
    __extends(HttpError, _super);
    function HttpError() {
        _super.apply(this, arguments);
    }
    HttpError.prototype.json = function () {
        return this.body;
    };
    return HttpError;
}(Error));
exports.HttpError = HttpError;
//# sourceMappingURL=httpError.js.map