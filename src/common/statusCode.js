"use strict";
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    StatusCode[StatusCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(exports.StatusCode || (exports.StatusCode = {}));
var StatusCode = exports.StatusCode;
//# sourceMappingURL=statusCode.js.map