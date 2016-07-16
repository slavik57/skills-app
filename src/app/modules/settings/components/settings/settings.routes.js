"use strict";
var skillsSettings_component_1 = require("../skillsSettings/skillsSettings.component");
var teamsSettings_component_1 = require("../teamsSettings/teamsSettings.component");
var usersSettings_component_1 = require("../usersSettings/usersSettings.component");
var settings_component_1 = require("./settings.component");
exports.settingsRoutes = [
    {
        path: 'settings',
        component: settings_component_1.SettingsComponent,
        children: [
            {
                path: '',
                redirectTo: 'users'
            },
            {
                path: 'users',
                component: usersSettings_component_1.UsersSettingsComponent
            },
            {
                path: 'teams',
                component: teamsSettings_component_1.TeamsSettingsComponent
            },
            {
                path: 'skills',
                component: skillsSettings_component_1.SkillsSettingsComponent
            }
        ]
    }];
//# sourceMappingURL=settings.routes.js.map