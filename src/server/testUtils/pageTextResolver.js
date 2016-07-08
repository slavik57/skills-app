"use strict";
var pathHelper_1 = require("../../common/pathHelper");
var PageTextResolver = (function () {
    function PageTextResolver() {
    }
    PageTextResolver.getSigninPage = function (expressServer) {
        return this.getFile(expressServer, 'signin.html');
    };
    PageTextResolver.getHomePage = function (expressServer) {
        return this.getFile(expressServer, 'home.html');
    };
    PageTextResolver.getFile = function (expressServer, pageName) {
        var webpackMiddleware = expressServer.webpackMiddleware;
        var buffer = webpackMiddleware.fileSystem.readFileSync(pathHelper_1.PathHelper.getPathFromRoot('dist', pageName));
        return new Buffer(buffer).toString();
    };
    return PageTextResolver;
}());
exports.PageTextResolver = PageTextResolver;
//# sourceMappingURL=pageTextResolver.js.map