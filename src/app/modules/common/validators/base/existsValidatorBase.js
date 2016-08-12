"use strict";
var Observable_1 = require('rxjs/Observable');
var ExistsValidatorBase = (function () {
    function ExistsValidatorBase(allowedValues, errorOnExists, errorOnFailChecking) {
        this.allowedValues = allowedValues;
        this.errorOnExists = errorOnExists;
        this.errorOnFailChecking = errorOnFailChecking;
    }
    ExistsValidatorBase.prototype.bindControl = function (control) {
        var _this = this;
        this._valueChangesSubscription =
            control.valueChanges
                .debounceTime(500)
                .subscribe(function (newValue) {
                if (!_this._subscriber) {
                    return;
                }
                if (!newValue) {
                    _this._resolveSubscriber(_this._subscriber, null);
                    return;
                }
                _this.isValueExists(newValue)
                    .subscribe(function (isExistsResult) { return _this._handleResult(isExistsResult, _this._subscriber); }, function (error) { return _this._handleError(error, _this._subscriber); });
            });
    };
    ExistsValidatorBase.prototype.isExists = function (control) {
        var _this = this;
        return new Observable_1.Observable(function (subscriber) {
            if (_this.allowedValues.indexOf(control.value) >= 0) {
                _this._subscriber = null;
                _this._resolveSubscriber(subscriber, null);
                return;
            }
            _this._subscriber = subscriber;
        });
    };
    ExistsValidatorBase.prototype.destroy = function () {
        this._subscriber = null;
        if (this._valueChangesSubscription) {
            this._valueChangesSubscription.unsubscribe();
        }
        this._valueChangesSubscription = null;
    };
    ExistsValidatorBase.prototype._handleResult = function (isExistsResult, subscriber) {
        if (!isExistsResult) {
            this._resolveSubscriber(subscriber, null);
        }
        else {
            var validationErrorResult = {};
            validationErrorResult[this.errorOnExists] = true;
            this._resolveSubscriber(subscriber, validationErrorResult);
        }
    };
    ExistsValidatorBase.prototype._handleError = function (error, subscriber) {
        var validationFailedErrorResult = {};
        validationFailedErrorResult[this.errorOnFailChecking] = true;
        this._resolveSubscriber(subscriber, validationFailedErrorResult);
    };
    ExistsValidatorBase.prototype._resolveSubscriber = function (subscriber, value) {
        subscriber.next(value);
        subscriber.complete();
    };
    return ExistsValidatorBase;
}());
exports.ExistsValidatorBase = ExistsValidatorBase;
//# sourceMappingURL=existsValidatorBase.js.map