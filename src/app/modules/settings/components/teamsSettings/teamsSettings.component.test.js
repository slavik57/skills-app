"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var teamsSettings_component_1 = require("./teamsSettings.component");
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var teamService_1 = require("../../../common/services/teamService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('TeamsSettingsComponent', function () {
    var teamServiceMock;
    var userServiceMock;
    var getTeamsDetailsSpy;
    var getCanUserModifyTeamsListSpy;
    var getTeamsDetailsResult;
    var getCanUserModifyTeamsListResult;
    var zoneMock;
    var zoneRunSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getTeamsDetailsSpy =
            sinon_1.stub(teamServiceMock, 'getTeamsDetails', function () {
                getTeamsDetailsResult = new Subject_1.Subject();
                return getTeamsDetailsResult;
            });
        getCanUserModifyTeamsListSpy =
            sinon_1.stub(userServiceMock, 'canUserModifyTeams', function () {
                getCanUserModifyTeamsListResult = new Subject_1.Subject();
                return getCanUserModifyTeamsListResult;
            });
        zoneMock = {
            run: function () { return null; }
        };
        zoneRunSpy = sinon_1.stub(zoneMock, 'run', function (func) { return func(); });
        return [
            core_1.provide(core_1.NgZone, { useValue: zoneMock }),
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            teamsSettings_component_1.TeamsSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamsSettings_component_1.TeamsSettingsComponent], function (_component) {
        component = _component;
        component.teamSettingsModal = {
            nativeElement: {}
        };
        component.creatingTeamModal = {
            nativeElement: {}
        };
        component.ngOnInit();
    }));
    testing_1.it('isLoadingTeams should be true', function () {
        chai_1.expect(component.isLoadingTeams).to.be.true;
    });
    testing_1.it('loadingTeamsError should be null', function () {
        chai_1.expect(component.loadingTeamsError).to.be.null;
    });
    testing_1.it('should call teamService.getTeamsDetails()', function () {
        chai_1.expect(getTeamsDetailsSpy.callCount).to.be.equal(1);
    });
    testing_1.it('should call userService.canUserModifyTeams()', function () {
        chai_1.expect(getCanUserModifyTeamsListSpy.callCount).to.be.equal(1);
    });
    testing_1.it('teamsDetails should be null', function () {
        chai_1.expect(component.teamsDetails).to.be.null;
    });
    testing_1.it('selectedTeam should be null', function () {
        chai_1.expect(component.selectedTeam).to.be.null;
    });
    testing_1.it('isCreatingTeam should be false', function () {
        chai_1.expect(component.isCreatingTeam).to.be.false;
    });
    testing_1.it('canUserModifyTeams should be false', function () {
        chai_1.expect(component.canUserModifyTeams).to.be.false;
    });
    var onOneError = function (returnError) {
        return function () {
            var error;
            testing_1.beforeEach(function () {
                error = 'some error';
                returnError(error);
            });
            testing_1.it('isLoadingTeams should be false', function () {
                chai_1.expect(component.isLoadingTeams).to.be.false;
            });
            testing_1.it('loadingTeamsError should be correct', function () {
                chai_1.expect(component.loadingTeamsError).to.be.equal(error);
            });
            testing_1.it('teamsDetails should be null', function () {
                chai_1.expect(component.teamsDetails).to.be.null;
            });
            testing_1.it('selectedTeam should be null', function () {
                chai_1.expect(component.selectedTeam).to.be.null;
            });
            testing_1.it('isCreatingTeam should be false', function () {
                chai_1.expect(component.isCreatingTeam).to.be.false;
            });
            testing_1.it('canUserModifyTeams should be false', function () {
                chai_1.expect(component.canUserModifyTeams).to.be.false;
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    getTeamsDetailsSpy.reset();
                    getCanUserModifyTeamsListSpy.reset();
                    component.reload();
                });
                testing_1.it('isLoadingTeams should be true', function () {
                    chai_1.expect(component.isLoadingTeams).to.be.true;
                });
                testing_1.it('loadingTeamsError should be null', function () {
                    chai_1.expect(component.loadingTeamsError).to.be.null;
                });
                testing_1.it('should call teamService.getTeamsDetails()', function () {
                    chai_1.expect(getTeamsDetailsSpy.callCount).to.be.equal(1);
                });
                testing_1.it('should call userService.canUserModifyTeams()', function () {
                    chai_1.expect(getCanUserModifyTeamsListSpy.callCount).to.be.equal(1);
                });
                testing_1.it('teamsDetails should be null', function () {
                    chai_1.expect(component.teamsDetails).to.be.null;
                });
                testing_1.it('selectedTeam should be null', function () {
                    chai_1.expect(component.selectedTeam).to.be.null;
                });
                testing_1.it('isCreatingTeam should be false', function () {
                    chai_1.expect(component.isCreatingTeam).to.be.false;
                });
                testing_1.it('canUserModifyTeams should be false', function () {
                    chai_1.expect(component.canUserModifyTeams).to.be.false;
                });
            });
        };
    };
    testing_1.describe('getting teams details fails', onOneError(function (error) {
        getTeamsDetailsResult.error(error);
        getCanUserModifyTeamsListResult.next(true);
        getCanUserModifyTeamsListResult.complete();
    }));
    testing_1.describe('getting can user modify teams list fails', onOneError(function (error) {
        getCanUserModifyTeamsListResult.error(error);
        var teamsDetails = _.map([1, 2, 3], function (_id) {
            return { id: _id, teamName: _id.toString() };
        });
        getTeamsDetailsResult.next(teamsDetails);
        getTeamsDetailsResult.complete();
    }));
    testing_1.describe('all succeeds', function () {
        var teamsDetails;
        var canModifyTeams;
        testing_1.beforeEach(function () {
            teamsDetails =
                _.map([1, 2, 3], function (_id) {
                    return { id: _id, teamName: _id.toString() };
                });
            canModifyTeams = true;
            getTeamsDetailsResult.next(teamsDetails);
            getTeamsDetailsResult.complete();
            getCanUserModifyTeamsListResult.next(canModifyTeams);
            getCanUserModifyTeamsListResult.complete();
        });
        testing_1.it('isLoadingTeams should be false', function () {
            chai_1.expect(component.isLoadingTeams).to.be.false;
        });
        testing_1.it('loadingTeamsError should be null', function () {
            chai_1.expect(component.loadingTeamsError).to.be.null;
        });
        testing_1.it('teamsDetails should be correct', function () {
            chai_1.expect(component.teamsDetails).to.deep.equal(teamsDetails);
        });
        testing_1.it('selectedTeam should be null', function () {
            chai_1.expect(component.selectedTeam).to.be.null;
        });
        testing_1.it('isCreatingTeam should be false', function () {
            chai_1.expect(component.isCreatingTeam).to.be.false;
        });
        testing_1.it('canUserModifyTeams should be correct', function () {
            chai_1.expect(component.canUserModifyTeams).to.be.equal(canModifyTeams);
        });
        testing_1.describe('selectTeam', function () {
            var teamToSelect;
            var jquerySpy;
            var openModalSpy;
            testing_1.beforeEach(function () {
                teamToSelect = teamsDetails[1];
                var jqueryResult = {
                    openModal: function () { return null; }
                };
                openModalSpy = sinon_1.spy(jqueryResult, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryResult; });
                component.selectTeam(teamToSelect);
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('should update the selectedTeam correctly', function () {
                chai_1.expect(component.selectedTeam).to.be.equal(teamToSelect);
            });
            testing_1.it('should open the modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.teamSettingsModal.nativeElement);
                chai_1.expect(openModalSpy.callCount).to.be.equal(1);
                chai_1.expect(openModalSpy.args[0]).to.be.length(1);
                chai_1.expect(openModalSpy.args[0][0].complete).to.exist;
            });
            testing_1.it('isCreatingTeam should be false', function () {
                chai_1.expect(component.isCreatingTeam).to.be.false;
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    component.reload();
                });
                testing_1.it('should set selectedTeam to null', function () {
                    chai_1.expect(component.selectedTeam).to.be.null;
                });
                testing_1.it('isCreatingTeam should be false', function () {
                    chai_1.expect(component.isCreatingTeam).to.be.false;
                });
            });
            testing_1.describe('close the modal', function () {
                testing_1.beforeEach(function () {
                    openModalSpy.args[0][0].complete();
                });
                testing_1.it('should call zone.run()', function () {
                    chai_1.expect(zoneRunSpy.callCount).to.be.equal(1);
                });
                testing_1.it('isCreatingTeam should be false', function () {
                    chai_1.expect(component.isCreatingTeam).to.be.false;
                });
            });
        });
        testing_1.describe('setAsCreatingTeam', function () {
            var jquerySpy;
            var openModalSpy;
            testing_1.beforeEach(function () {
                var jqueryResult = {
                    openModal: function () { return null; }
                };
                openModalSpy = sinon_1.spy(jqueryResult, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryResult; });
                component.setAsCreatingTeam();
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('should set isCreatingTeam to true', function () {
                chai_1.expect(component.isCreatingTeam).to.be.true;
            });
            testing_1.it('should open the modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.creatingTeamModal.nativeElement);
                chai_1.expect(openModalSpy.callCount).to.be.equal(1);
                chai_1.expect(openModalSpy.args[0]).to.be.length(1);
                chai_1.expect(openModalSpy.args[0][0].complete).to.exist;
            });
            testing_1.describe('close the modal', function () {
                testing_1.beforeEach(function () {
                    openModalSpy.args[0][0].complete();
                });
                testing_1.it('should call zone.run()', function () {
                    chai_1.expect(zoneRunSpy.callCount).to.be.equal(1);
                });
                testing_1.it('isCreatingTeam should be false', function () {
                    chai_1.expect(component.isCreatingTeam).to.be.false;
                });
            });
        });
    });
});
//# sourceMappingURL=teamsSettings.component.test.js.map