"use strict";
var statusCode_1 = require("../../../../../common/statusCode");
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var HttpServiceBase = (function () {
    function HttpServiceBase(http) {
        this.http = http;
    }
    HttpServiceBase.prototype._get = function (url) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get(url, options);
    };
    HttpServiceBase.prototype._post = function (url, body) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, body, options);
    };
    HttpServiceBase.prototype._put = function (url, body) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(url, body, options);
    };
    HttpServiceBase.prototype._delete = function (url) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(url, options);
    };
    HttpServiceBase.prototype._handleServerError = function (error) {
        console.log(error);
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw(HttpServiceBase.UNAUTHORIZED_ERROR);
        }
        if (typeof error === 'string') {
            return Observable_1.Observable.throw(HttpServiceBase.GENERIC_ERROR);
        }
        try {
            var result = error.json();
            if (!!result && !!result.error) {
                return Observable_1.Observable.throw(result.error);
            }
        }
        catch (e) {
        }
        return Observable_1.Observable.throw(HttpServiceBase.GENERIC_ERROR);
    };
    HttpServiceBase.prototype._extractAllBody = function (response) {
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result) {
            throw 'Unexpected result';
        }
        return result;
    };
    HttpServiceBase.prototype._extractPropertyFromBody = function (response, propertyName) {
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(propertyName in result)) {
            throw 'Unexpected result';
        }
        return result[propertyName];
    };
    HttpServiceBase.prototype._parseBodyAsArray = function (response) {
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(result instanceof Array)) {
            throw 'Unexpected result';
        }
        return result;
    };
    HttpServiceBase.prototype._failWithGenericError = function (error) {
        console.log(error);
        return Observable_1.Observable.throw(HttpServiceBase.GENERIC_ERROR);
    };
    HttpServiceBase.prototype._throwOnUnauthorizedOrGenericError = function (error) {
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw(HttpServiceBase.UNAUTHORIZED_ERROR);
        }
        else {
            return Observable_1.Observable.throw(HttpServiceBase.GENERIC_ERROR);
        }
    };
    HttpServiceBase.prototype._throwErrorIfStatusIsNotOk = function (response) {
        if (response.status !== statusCode_1.StatusCode.OK) {
            throw 'Invalid result';
        }
    };
    HttpServiceBase.UNAUTHORIZED_ERROR = 'Unauthorized';
    HttpServiceBase.GENERIC_ERROR = 'Oops. Something went wrong. Please try again';
    return HttpServiceBase;
}());
exports.HttpServiceBase = HttpServiceBase;
//# sourceMappingURL=httpServiceBase.js.map