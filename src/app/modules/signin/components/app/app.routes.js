"use strict";
var register_component_1 = require("../register/register.component");
var signin_component_1 = require("../signin/signin.component");
var router_1 = require('@angular/router');
var routes = [
    {
        path: '',
        component: signin_component_1.SigninComponent
    },
    {
        path: 'register',
        component: register_component_1.RegisterComponent
    }
];
exports.signinRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map