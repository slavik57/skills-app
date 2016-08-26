"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var skillsSettings_component_1 = require("./skillsSettings.component");
var skillServiceMockFactory_1 = require("../../../../testUtils/mockFactories/skillServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var skillService_1 = require("../../../common/services/skillService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('SkillsSettingsComponent', function () {
    var skillServiceMock;
    var userServiceMock;
    var getSkillsDetailsSpy;
    var getCanUserModifySkillsListSpy;
    var getSkillsDetailsResult;
    var getCanUserModifySkillsListResult;
    var zoneMock;
    var zoneRunSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getSkillsDetailsSpy =
            sinon_1.stub(skillServiceMock, 'getSkillsDetails', function () {
                getSkillsDetailsResult = new Subject_1.Subject();
                return getSkillsDetailsResult;
            });
        getCanUserModifySkillsListSpy =
            sinon_1.stub(userServiceMock, 'canUserModifySkills', function () {
                getCanUserModifySkillsListResult = new Subject_1.Subject();
                return getCanUserModifySkillsListResult;
            });
        zoneMock = {
            run: function () { return null; }
        };
        zoneRunSpy = sinon_1.stub(zoneMock, 'run', function (func) { return func(); });
        return [
            core_1.provide(core_1.NgZone, { useValue: zoneMock }),
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            skillsSettings_component_1.SkillsSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillsSettings_component_1.SkillsSettingsComponent], function (_component) {
        component = _component;
        component.skillSettingsModal = {
            nativeElement: {}
        };
        component.creatingSkillModal = {
            nativeElement: {}
        };
        component.deleteSkillModal = {
            nativeElement: {}
        };
        component.ngOnInit();
    }));
    testing_1.it('isLoadingSkills should be true', function () {
        chai_1.expect(component.isLoadingSkills).to.be.true;
    });
    testing_1.it('loadingSkillsError should be null', function () {
        chai_1.expect(component.loadingSkillsError).to.be.null;
    });
    testing_1.it('should call skillService.getSkillsDetails()', function () {
        chai_1.expect(getSkillsDetailsSpy.callCount).to.be.equal(1);
    });
    testing_1.it('should call userService.canUserModifySkills()', function () {
        chai_1.expect(getCanUserModifySkillsListSpy.callCount).to.be.equal(1);
    });
    testing_1.it('skillsDetails should be null', function () {
        chai_1.expect(component.skillsDetails).to.be.null;
    });
    testing_1.it('selectedSkill should be null', function () {
        chai_1.expect(component.selectedSkill).to.be.null;
    });
    testing_1.it('isCreatingSkill should be false', function () {
        chai_1.expect(component.isCreatingSkill).to.be.false;
    });
    testing_1.it('canUserModifySkills should be false', function () {
        chai_1.expect(component.canUserModifySkills).to.be.false;
    });
    testing_1.it('skillToDelete should be null', function () {
        chai_1.expect(component.skillToDelete).to.be.null;
    });
    testing_1.it('isDeletingSkill should be false', function () {
        chai_1.expect(component.isDeletingSkill).to.be.false;
    });
    testing_1.it('deletingSkillError should be correct', function () {
        chai_1.expect(component.deletingSkillError).to.be.null;
    });
    var onOneError = function (returnError) {
        return function () {
            var error;
            testing_1.beforeEach(function () {
                error = 'some error';
                returnError(error);
            });
            testing_1.it('isLoadingSkills should be false', function () {
                chai_1.expect(component.isLoadingSkills).to.be.false;
            });
            testing_1.it('loadingSkillsError should be correct', function () {
                chai_1.expect(component.loadingSkillsError).to.be.equal(error);
            });
            testing_1.it('skillsDetails should be null', function () {
                chai_1.expect(component.skillsDetails).to.be.null;
            });
            testing_1.it('selectedSkill should be null', function () {
                chai_1.expect(component.selectedSkill).to.be.null;
            });
            testing_1.it('isCreatingSkill should be false', function () {
                chai_1.expect(component.isCreatingSkill).to.be.false;
            });
            testing_1.it('canUserModifySkills should be false', function () {
                chai_1.expect(component.canUserModifySkills).to.be.false;
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    getSkillsDetailsSpy.reset();
                    getCanUserModifySkillsListSpy.reset();
                    component.reload();
                });
                testing_1.it('isLoadingSkills should be true', function () {
                    chai_1.expect(component.isLoadingSkills).to.be.true;
                });
                testing_1.it('loadingSkillsError should be null', function () {
                    chai_1.expect(component.loadingSkillsError).to.be.null;
                });
                testing_1.it('should call skillService.getSkillsDetails()', function () {
                    chai_1.expect(getSkillsDetailsSpy.callCount).to.be.equal(1);
                });
                testing_1.it('should call userService.canUserModifySkills()', function () {
                    chai_1.expect(getCanUserModifySkillsListSpy.callCount).to.be.equal(1);
                });
                testing_1.it('skillsDetails should be null', function () {
                    chai_1.expect(component.skillsDetails).to.be.null;
                });
                testing_1.it('selectedSkill should be null', function () {
                    chai_1.expect(component.selectedSkill).to.be.null;
                });
                testing_1.it('isCreatingSkill should be false', function () {
                    chai_1.expect(component.isCreatingSkill).to.be.false;
                });
                testing_1.it('canUserModifySkills should be false', function () {
                    chai_1.expect(component.canUserModifySkills).to.be.false;
                });
            });
        };
    };
    testing_1.describe('getting skills details fails', onOneError(function (error) {
        getSkillsDetailsResult.error(error);
        getCanUserModifySkillsListResult.next(true);
        getCanUserModifySkillsListResult.complete();
    }));
    testing_1.describe('getting can user modify skills list fails', onOneError(function (error) {
        getCanUserModifySkillsListResult.error(error);
        var skillsDetails = _.map([1, 2, 3], function (_id) {
            return { id: _id, skillName: _id.toString() };
        });
        getSkillsDetailsResult.next(skillsDetails);
        getSkillsDetailsResult.complete();
    }));
    testing_1.describe('all succeeds', function () {
        var skillsDetails;
        var canModifySkills;
        testing_1.beforeEach(function () {
            skillsDetails =
                _.map([1, 2, 3], function (_id) {
                    return { id: _id, skillName: _id.toString() };
                });
            canModifySkills = true;
            getSkillsDetailsResult.next(skillsDetails);
            getSkillsDetailsResult.complete();
            getCanUserModifySkillsListResult.next(canModifySkills);
            getCanUserModifySkillsListResult.complete();
        });
        testing_1.it('isLoadingSkills should be false', function () {
            chai_1.expect(component.isLoadingSkills).to.be.false;
        });
        testing_1.it('loadingSkillsError should be null', function () {
            chai_1.expect(component.loadingSkillsError).to.be.null;
        });
        testing_1.it('skillsDetails should be correct', function () {
            chai_1.expect(component.skillsDetails).to.deep.equal(skillsDetails);
        });
        testing_1.it('selectedSkill should be null', function () {
            chai_1.expect(component.selectedSkill).to.be.null;
        });
        testing_1.it('isCreatingSkill should be false', function () {
            chai_1.expect(component.isCreatingSkill).to.be.false;
        });
        testing_1.it('canUserModifySkills should be correct', function () {
            chai_1.expect(component.canUserModifySkills).to.be.equal(canModifySkills);
        });
        testing_1.describe('selectSkill', function () {
            var skillToSelect;
            var jquerySpy;
            var openModalSpy;
            testing_1.beforeEach(function () {
                skillToSelect = skillsDetails[1];
                var jqueryResult = {
                    openModal: function () { return null; }
                };
                openModalSpy = sinon_1.spy(jqueryResult, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryResult; });
                component.selectSkill(skillToSelect);
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('should update the selectedSkill correctly', function () {
                chai_1.expect(component.selectedSkill).to.be.equal(skillToSelect);
            });
            testing_1.it('should open the modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.skillSettingsModal.nativeElement);
                chai_1.expect(openModalSpy.callCount).to.be.equal(1);
                chai_1.expect(openModalSpy.args[0]).to.be.length(1);
                chai_1.expect(openModalSpy.args[0][0].complete).to.exist;
            });
            testing_1.it('isCreatingSkill should be false', function () {
                chai_1.expect(component.isCreatingSkill).to.be.false;
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    component.reload();
                });
                testing_1.it('should set selectedSkill to null', function () {
                    chai_1.expect(component.selectedSkill).to.be.null;
                });
                testing_1.it('isCreatingSkill should be false', function () {
                    chai_1.expect(component.isCreatingSkill).to.be.false;
                });
            });
            testing_1.describe('close the modal', function () {
                testing_1.beforeEach(function () {
                    openModalSpy.args[0][0].complete();
                });
                testing_1.it('should call zone.run()', function () {
                    chai_1.expect(zoneRunSpy.callCount).to.be.equal(1);
                });
                testing_1.it('isCreatingSkill should be false', function () {
                    chai_1.expect(component.isCreatingSkill).to.be.false;
                });
            });
        });
        testing_1.describe('setAsCreatingSkill', function () {
            var jquerySpy;
            var openModalSpy;
            var jqueryMock;
            testing_1.beforeEach(function () {
                jqueryMock = {
                    openModal: function () { return null; }
                };
                openModalSpy = sinon_1.spy(jqueryMock, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryMock; });
                component.setAsCreatingSkill();
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('should set isCreatingSkill to true', function () {
                chai_1.expect(component.isCreatingSkill).to.be.true;
            });
            testing_1.it('should open the modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.creatingSkillModal.nativeElement);
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
                testing_1.it('isCreatingSkill should be false', function () {
                    chai_1.expect(component.isCreatingSkill).to.be.false;
                });
            });
            testing_1.describe('onSkillCreated', function () {
                var originalSkillsDetails;
                var createdSkillDetails;
                var closeModalSpy;
                testing_1.beforeEach(function () {
                    createdSkillDetails = {
                        skillName: 'some new skill name',
                        id: 123123
                    };
                    jqueryMock.closeModal = function () {
                        openModalSpy.args[0][0].complete();
                    };
                    closeModalSpy = sinon_1.spy(jqueryMock, 'closeModal');
                    jquerySpy.reset();
                    originalSkillsDetails =
                        _.map(component.skillsDetails, function (_) { return _; });
                    component.onSkillCreated(createdSkillDetails);
                });
                testing_1.it('should close the create skill modal and open the skill modal', function () {
                    chai_1.expect(jquerySpy.callCount, 'should use the jquery twice').to.be.equal(2);
                    chai_1.expect(jquerySpy.args[0].length, 'should use jquery with one argument the first time').to.be.equal(1);
                    chai_1.expect(jquerySpy.args[0][0], 'the jquery arument on the first call should be the creating skill modal').to.be.equal(component.creatingSkillModal.nativeElement);
                    chai_1.expect(closeModalSpy.callCount, 'close modal should be called once').to.be.equal(1);
                });
                testing_1.it('should call zone.run()', function () {
                    chai_1.expect(zoneRunSpy.callCount).to.be.equal(1);
                });
                testing_1.it('should set isCreatingSkill to false', function () {
                    chai_1.expect(component.isCreatingSkill).to.be.false;
                });
                testing_1.it('should add the created skill details to the skills details list', function () {
                    chai_1.expect(component.skillsDetails).to.be.length(originalSkillsDetails.length + 1);
                });
                testing_1.it('should add the created skill details as first skill details', function () {
                    chai_1.expect(component.skillsDetails[0]).to.be.equal(createdSkillDetails);
                });
                testing_1.it('should select the created skill details', function () {
                    chai_1.expect(component.selectedSkill).to.be.equal(createdSkillDetails);
                });
                testing_1.it('should open the selected skill modal', function () {
                    chai_1.expect(jquerySpy.callCount).to.be.equal(2);
                    chai_1.expect(jquerySpy.args[1].length).to.be.equal(1);
                    chai_1.expect(jquerySpy.args[1][0]).to.be.equal(component.skillSettingsModal.nativeElement);
                    chai_1.expect(openModalSpy.callCount).to.be.equal(2);
                    chai_1.expect(openModalSpy.args[1]).to.be.length(1);
                    chai_1.expect(openModalSpy.args[1][0].complete).to.exist;
                });
            });
        });
        testing_1.describe('delete skill', function () {
            var skillToDelete;
            var jquerySpy;
            var openModalSpy;
            var jqueryResult;
            testing_1.beforeEach(function () {
                skillToDelete = skillsDetails[2];
                jqueryResult = {
                    openModal: function () { return null; },
                };
                openModalSpy = sinon_1.spy(jqueryResult, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryResult; });
                component.deleteSkill(skillToDelete);
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('skillToDelete should be correct', function () {
                chai_1.expect(component.skillToDelete).to.be.equal(skillToDelete);
            });
            testing_1.it('isDeletingSkill should be false', function () {
                chai_1.expect(component.isDeletingSkill).to.be.false;
            });
            testing_1.it('deletingSkillError should be correct', function () {
                chai_1.expect(component.deletingSkillError).to.be.null;
            });
            testing_1.it('should open the delete skill modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.deleteSkillModal.nativeElement);
                chai_1.expect(openModalSpy.callCount).to.be.equal(1);
                chai_1.expect(openModalSpy.args[0]).to.be.length(1);
                chai_1.expect(openModalSpy.args[0][0].complete).to.exist;
            });
            testing_1.describe('close the modal', function () {
                testing_1.beforeEach(function () {
                    openModalSpy.args[0][0].complete();
                });
                testing_1.it('skillToDelete should be null', function () {
                    chai_1.expect(component.skillToDelete).to.be.null;
                });
                testing_1.it('isDeletingSkill should be false', function () {
                    chai_1.expect(component.isDeletingSkill).to.be.false;
                });
                testing_1.it('deletingSkillError should be correct', function () {
                    chai_1.expect(component.deletingSkillError).to.be.null;
                });
            });
            testing_1.describe('confirm deleting skill', function () {
                var closeModalSpy;
                var deleteSkillSpy;
                var deleteSkillResult;
                testing_1.beforeEach(function () {
                    jqueryResult.closeModal = function () { return openModalSpy.args[0][0].complete(); };
                    closeModalSpy = sinon_1.spy(jqueryResult, 'closeModal');
                    jquerySpy.reset();
                    deleteSkillSpy = sinon_1.stub(skillServiceMock, 'deleteSkill', function () {
                        deleteSkillResult = new Subject_1.Subject();
                        return deleteSkillResult;
                    });
                    component.confirmDeletingSkill();
                });
                testing_1.it('isDeletingSkill should be true', function () {
                    chai_1.expect(component.isDeletingSkill).to.be.true;
                });
                testing_1.it('should not close the modal', function () {
                    chai_1.expect(jquerySpy.callCount).to.be.equal(0);
                    chai_1.expect(closeModalSpy.callCount).to.be.equal(0);
                });
                testing_1.it('skillToDelete should be correct', function () {
                    chai_1.expect(component.skillToDelete).to.be.equal(skillToDelete);
                });
                testing_1.it('should call skillService.deleteSkill', function () {
                    chai_1.expect(deleteSkillSpy.callCount).to.be.equal(1);
                    chai_1.expect(deleteSkillSpy.args[0]).to.deep.equal([skillToDelete.id]);
                });
                testing_1.it('deletingSkillError should be correct', function () {
                    chai_1.expect(component.deletingSkillError).to.be.null;
                });
                testing_1.describe('deleting skill fails', function () {
                    var error;
                    testing_1.beforeEach(function () {
                        error = 'error deleting skill';
                        deleteSkillResult.error(error);
                    });
                    testing_1.it('should not close the modal', function () {
                        chai_1.expect(jquerySpy.callCount).to.be.equal(0);
                        chai_1.expect(closeModalSpy.callCount).to.be.equal(0);
                    });
                    testing_1.it('skillToDelete should be correct', function () {
                        chai_1.expect(component.skillToDelete).to.be.equal(skillToDelete);
                    });
                    testing_1.it('isDeletingSkill should be false', function () {
                        chai_1.expect(component.isDeletingSkill).to.be.false;
                    });
                    testing_1.it('deletingSkillError should be correct', function () {
                        chai_1.expect(component.deletingSkillError).to.be.equal(error);
                    });
                    testing_1.describe('try deleting again', function () {
                        testing_1.beforeEach(function () {
                            deleteSkillSpy.reset();
                            component.confirmDeletingSkill();
                        });
                        testing_1.it('isDeletingSkill should be true', function () {
                            chai_1.expect(component.isDeletingSkill).to.be.true;
                        });
                        testing_1.it('should not close the modal', function () {
                            chai_1.expect(jquerySpy.callCount).to.be.equal(0);
                            chai_1.expect(closeModalSpy.callCount).to.be.equal(0);
                        });
                        testing_1.it('skillToDelete should be correct', function () {
                            chai_1.expect(component.skillToDelete).to.be.equal(skillToDelete);
                        });
                        testing_1.it('should call skillService.deleteSkill', function () {
                            chai_1.expect(deleteSkillSpy.callCount).to.be.equal(1);
                            chai_1.expect(deleteSkillSpy.args[0]).to.deep.equal([skillToDelete.id]);
                        });
                        testing_1.it('deletingSkillError should be correct', function () {
                            chai_1.expect(component.deletingSkillError).to.be.null;
                        });
                    });
                });
                testing_1.describe('deleting skill succeeds', function () {
                    var originalSkillsDetailsLength;
                    testing_1.beforeEach(function () {
                        originalSkillsDetailsLength = skillsDetails.length;
                        deleteSkillResult.next(null);
                        deleteSkillResult.complete();
                    });
                    testing_1.it('should close the modal', function () {
                        chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                        chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                        chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.deleteSkillModal.nativeElement);
                        chai_1.expect(closeModalSpy.callCount).to.be.equal(1);
                        chai_1.expect(closeModalSpy.args[0]).to.be.empty;
                    });
                    testing_1.it('isDeletingSkill should be false', function () {
                        chai_1.expect(component.isDeletingSkill).to.be.false;
                    });
                    testing_1.it('skill to delete should be null', function () {
                        chai_1.expect(component.skillToDelete).to.be.null;
                    });
                    testing_1.it('deletingSkillError should be correct', function () {
                        chai_1.expect(component.deletingSkillError).to.be.null;
                    });
                    testing_1.it('should remove the skill from skills list', function () {
                        chai_1.expect(skillsDetails).to.be.length(originalSkillsDetailsLength - 1);
                        chai_1.expect(skillsDetails).not.to.contain(skillToDelete);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=skillsSettings.component.test.js.map