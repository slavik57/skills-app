"use strict";
var expressSkillsServer_1 = require('./expressSkillsServer');
expressSkillsServer_1.ExpressSkillsServer.instance
    .initialize()
    .then(function (_expressServer) { return _expressServer.start(); });
//# sourceMappingURL=server.js.map