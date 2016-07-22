"use strict";
var LoadingComponentBase = (function () {
    function LoadingComponentBase() {
    }
    LoadingComponentBase.prototype.ngOnInit = function () {
        this.load();
    };
    LoadingComponentBase.prototype.reload = function () {
        this.load();
    };
    LoadingComponentBase.prototype.load = function () {
        var _this = this;
        this.setIsLoading(true);
        this.setLoadingError(null);
        this.setLoadingResult(null);
        this.get()
            .finally(function () { return _this.setIsLoading(false); })
            .subscribe(function (_result) { return _this.setLoadingResult(_result); }, function (_error) { return _this.setLoadingError(_error); });
    };
    return LoadingComponentBase;
}());
exports.LoadingComponentBase = LoadingComponentBase;
//# sourceMappingURL=loadingComponentBase.js.map