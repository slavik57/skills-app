"use strict";
var pathHelper_1 = require('../../common/pathHelper');
var expressSkillsServer_1 = require('../expressSkillsServer');
module.exports = {
    get_index: function (request, response) {
        var webpackMiddleware = expressSkillsServer_1.ExpressSkillsServer.instance.webpackMiddleware;
        response.write(webpackMiddleware.fileSystem.readFileSync(pathHelper_1.PathHelper.getPathFromRoot('dist', 'home.html')));
        response.end();
    }
};
//# sourceMappingURL=homeController.js.map