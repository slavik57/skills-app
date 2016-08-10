"use strict";
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var teamSettings_component_1 = require('./teamSettings.component');
var teamService_1 = require("../../../common/services/teamService");
testing_1.describe('TeamSettingsComponent', function () {
    var teamServiceMock;
    var teamDetails;
    var component;
    testing_1.beforeEachProviders(function () {
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        return [
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            teamSettings_component_1.TeamSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamSettings_component_1.TeamSettingsComponent], function (_component) {
        component = _component;
        teamDetails = {
            id: 12321,
            teamName: 'some team name'
        };
        component.teamDetails = teamDetails;
        component.availableTeamSettings = {
            nativeElement: {}
        };
        component.ngOnInit();
    }));
    testing_1.describe('ngAfterViewInit', function () {
        var jquerySpy;
        var jqueryResultTabsSpy;
        testing_1.beforeEach(function () {
            var jqueryResult = {
                tabs: function () { return null; }
            };
            jqueryResultTabsSpy = sinon_1.spy(jqueryResult, 'tabs');
            jquerySpy = sinon_1.stub(window, '$', function () {
                return jqueryResult;
            });
            component.ngAfterViewInit();
        });
        afterEach(function () {
            jquerySpy.restore();
        });
        testing_1.it('should initialize tabs', function () {
            chai_1.expect(jquerySpy.callCount).to.be.equal(1);
            chai_1.expect(jquerySpy.args[0]).to.be.length(1);
            chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableTeamSettings.nativeElement);
            chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
        });
    });
});
//# sourceMappingURL=teamSettings.component.test.js.map