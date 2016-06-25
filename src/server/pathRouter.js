"use strict";
var PathRouter = (function () {
    function PathRouter(request, response, nextFunction) {
        this.request = request;
        this.response = response;
        this.nextFunction = nextFunction;
        this._allowedNotAuthenticatedPaths = ['/dist/', '/fonts/'];
        this._homePath = '/';
        this._signinPath = '/signin';
    }
    PathRouter.prototype.routeRequest = function () {
        if (this.request.isAuthenticated()) {
            this._routeAuthenticatedRequest();
        }
        else {
            this._routeNotAuthenticatedRequest();
        }
    };
    PathRouter.prototype._routeAuthenticatedRequest = function () {
        if (this._isSigninPath()) {
            this.response.redirect(this._homePath);
        }
        else {
            this.request.url = this._homePath;
            this.nextFunction();
        }
    };
    PathRouter.prototype._routeNotAuthenticatedRequest = function () {
        if (this._isAllowedNotAuthenticatedPath()) {
            this.nextFunction();
            return;
        }
        if (this._isSigninPath()) {
            this.request.url = this._signinPath;
            this.nextFunction();
            return;
        }
        this.response.redirect(this._signinPath);
    };
    PathRouter.prototype._isSigninPath = function () {
        return this.request.path.indexOf(this._signinPath) === 0;
    };
    PathRouter.prototype._isAllowedNotAuthenticatedPath = function () {
        for (var i = 0; i < this._allowedNotAuthenticatedPaths.length; i++) {
            var allowedNotAuthenticatedPath = this._allowedNotAuthenticatedPaths[i];
            if (this.request.path.indexOf(allowedNotAuthenticatedPath) === 0) {
                return true;
            }
        }
        return false;
    };
    return PathRouter;
}());
exports.PathRouter = PathRouter;
//# sourceMappingURL=pathRouter.js.map