"use strict";
var settings_routes_1 = require("../../../settings/components/settings/settings.routes");
var userProfile_component_1 = require("../../../user/components/userProfile/userProfile.component");
var home_component_1 = require("../home/home.component");
var router_1 = require('@angular/router');
var routes = [
    {
        path: '',
        component: home_component_1.HomeComponent
    },
    {
        path: 'profile',
        component: userProfile_component_1.UserProfileComponent
    }
].concat(settings_routes_1.settingsRoutes, [
    {
        path: 'skillsPrerequisites',
        component: home_component_1.HomeComponent
    },
    {
        path: 'skills',
        component: home_component_1.HomeComponent
    },
    {
        path: 'teams',
        component: home_component_1.HomeComponent
    }
]);
exports.appRouterProviders = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map