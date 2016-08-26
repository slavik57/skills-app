import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import { ISkillNameDetails } from "../../../common/interfaces/iSkillNameDetails";
import {SkillsSettingsComponent} from "./skillsSettings.component";
import {SkillServiceMockFactory} from "../../../../testUtils/mockFactories/skillServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide, NgZone} from '@angular/core';
import {expect} from 'chai';
import {IUserService, UserService} from "../../../common/services/userService";
import {ISkillService, SkillService} from "../../../common/services/skillService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('SkillsSettingsComponent', () => {

  var skillServiceMock: ISkillService;
  var userServiceMock: IUserService;
  var getSkillsDetailsSpy: SinonSpy;
  var getCanUserModifySkillsListSpy: SinonSpy;
  var getSkillsDetailsResult: Subject<ISkillNameDetails[]>;
  var getCanUserModifySkillsListResult: Subject<boolean>;
  var zoneMock: NgZone;
  var zoneRunSpy: SinonSpy;

  var component: SkillsSettingsComponent;

  beforeEachProviders(() => {

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();
    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getSkillsDetailsSpy =
      stub(skillServiceMock, 'getSkillsDetails', () => {
        getSkillsDetailsResult = new Subject<ISkillNameDetails[]>();
        return getSkillsDetailsResult;
      });

    getCanUserModifySkillsListSpy =
      stub(userServiceMock, 'canUserModifySkills', () => {
        getCanUserModifySkillsListResult = new Subject<boolean>();
        return getCanUserModifySkillsListResult;
      });

    zoneMock = <any>{
      run: () => null
    }

    zoneRunSpy = stub(zoneMock, 'run', (func) => func());

    return [
      provide(NgZone, { useValue: zoneMock }),
      provide(UserService, { useValue: userServiceMock }),
      provide(SkillService, { useValue: skillServiceMock }),
      SkillsSettingsComponent
    ];
  });

  beforeEach(inject([SkillsSettingsComponent], (_component: SkillsSettingsComponent) => {
    component = _component;

    component.skillSettingsModal = {
      nativeElement: {}
    }

    component.creatingSkillModal = {
      nativeElement: {}
    }

    component.deleteSkillModal = {
      nativeElement: {}
    }

    component.ngOnInit();
  }));

  it('isLoadingSkills should be true', () => {
    expect(component.isLoadingSkills).to.be.true;
  });

  it('loadingSkillsError should be null', () => {
    expect(component.loadingSkillsError).to.be.null;
  });

  it('should call skillService.getSkillsDetails()', () => {
    expect(getSkillsDetailsSpy.callCount).to.be.equal(1);
  });

  it('should call userService.canUserModifySkills()', () => {
    expect(getCanUserModifySkillsListSpy.callCount).to.be.equal(1);
  });

  it('skillsDetails should be null', () => {
    expect(component.skillsDetails).to.be.null;
  });

  it('selectedSkill should be null', () => {
    expect(component.selectedSkill).to.be.null;
  });

  it('isCreatingSkill should be false', () => {
    expect(component.isCreatingSkill).to.be.false;
  });

  it('canUserModifySkills should be false', () => {
    expect(component.canUserModifySkills).to.be.false;
  });

  it('skillToDelete should be null', () => {
    expect(component.skillToDelete).to.be.null;
  });

  it('isDeletingSkill should be false', () => {
    expect(component.isDeletingSkill).to.be.false;
  });

  it('deletingSkillError should be correct', () => {
    expect(component.deletingSkillError).to.be.null;
  });

  var onOneError = (returnError: (error: string) => void) => {
    return () => {

      var error: string;

      beforeEach(() => {
        error = 'some error';
        returnError(error);
      });

      it('isLoadingSkills should be false', () => {
        expect(component.isLoadingSkills).to.be.false;
      });

      it('loadingSkillsError should be correct', () => {
        expect(component.loadingSkillsError).to.be.equal(error);
      });

      it('skillsDetails should be null', () => {
        expect(component.skillsDetails).to.be.null;
      });

      it('selectedSkill should be null', () => {
        expect(component.selectedSkill).to.be.null;
      });

      it('isCreatingSkill should be false', () => {
        expect(component.isCreatingSkill).to.be.false;
      });

      it('canUserModifySkills should be false', () => {
        expect(component.canUserModifySkills).to.be.false;
      });

      describe('reload', () => {

        beforeEach(() => {
          getSkillsDetailsSpy.reset();
          getCanUserModifySkillsListSpy.reset();

          component.reload();
        });

        it('isLoadingSkills should be true', () => {
          expect(component.isLoadingSkills).to.be.true;
        });

        it('loadingSkillsError should be null', () => {
          expect(component.loadingSkillsError).to.be.null;
        });

        it('should call skillService.getSkillsDetails()', () => {
          expect(getSkillsDetailsSpy.callCount).to.be.equal(1);
        });

        it('should call userService.canUserModifySkills()', () => {
          expect(getCanUserModifySkillsListSpy.callCount).to.be.equal(1);
        });

        it('skillsDetails should be null', () => {
          expect(component.skillsDetails).to.be.null;
        });

        it('selectedSkill should be null', () => {
          expect(component.selectedSkill).to.be.null;
        });

        it('isCreatingSkill should be false', () => {
          expect(component.isCreatingSkill).to.be.false;
        });

        it('canUserModifySkills should be false', () => {
          expect(component.canUserModifySkills).to.be.false;
        });

      })

    }
  }

  describe('getting skills details fails',
    onOneError((error: string) => {
      getSkillsDetailsResult.error(error);

      getCanUserModifySkillsListResult.next(true);
      getCanUserModifySkillsListResult.complete();
    })
  );

  describe('getting can user modify skills list fails',
    onOneError((error: string) => {
      getCanUserModifySkillsListResult.error(error);

      var skillsDetails: ISkillNameDetails[] =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, skillName: _id.toString() };
        });

      getSkillsDetailsResult.next(skillsDetails);
      getSkillsDetailsResult.complete();
    })
  );

  describe('all succeeds', () => {

    var skillsDetails: ISkillNameDetails[];
    var canModifySkills: boolean;

    beforeEach(() => {
      skillsDetails =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, skillName: _id.toString() };
        });
      canModifySkills = true;

      getSkillsDetailsResult.next(skillsDetails);
      getSkillsDetailsResult.complete();

      getCanUserModifySkillsListResult.next(canModifySkills);
      getCanUserModifySkillsListResult.complete();

    });

    it('isLoadingSkills should be false', () => {
      expect(component.isLoadingSkills).to.be.false;
    });

    it('loadingSkillsError should be null', () => {
      expect(component.loadingSkillsError).to.be.null;
    });

    it('skillsDetails should be correct', () => {
      expect(component.skillsDetails).to.deep.equal(skillsDetails);
    });

    it('selectedSkill should be null', () => {
      expect(component.selectedSkill).to.be.null;
    });

    it('isCreatingSkill should be false', () => {
      expect(component.isCreatingSkill).to.be.false;
    });

    it('canUserModifySkills should be correct', () => {
      expect(component.canUserModifySkills).to.be.equal(canModifySkills);
    });

    describe('selectSkill', () => {

      var skillToSelect: ISkillNameDetails;
      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;

      beforeEach(() => {
        skillToSelect = skillsDetails[1];

        var jqueryResult = {
          openModal: () => null
        }

        openModalSpy = spy(jqueryResult, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryResult);

        component.selectSkill(skillToSelect);
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('should update the selectedSkill correctly', () => {
        expect(component.selectedSkill).to.be.equal(skillToSelect);
      });

      it('should open the modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.skillSettingsModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
        expect(openModalSpy.args[0]).to.be.length(1);
        expect(openModalSpy.args[0][0].complete).to.exist;
      });

      it('isCreatingSkill should be false', () => {
        expect(component.isCreatingSkill).to.be.false;
      });

      describe('reload', () => {

        beforeEach(() => {
          component.reload();
        });

        it('should set selectedSkill to null', () => {
          expect(component.selectedSkill).to.be.null;
        });

        it('isCreatingSkill should be false', () => {
          expect(component.isCreatingSkill).to.be.false;
        });

      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('isCreatingSkill should be false', () => {
          expect(component.isCreatingSkill).to.be.false;
        });

      });

    });

    describe('setAsCreatingSkill', () => {

      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;
      var jqueryMock: any;

      beforeEach(() => {
        jqueryMock = {
          openModal: () => null
        }

        openModalSpy = spy(jqueryMock, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryMock);

        component.setAsCreatingSkill();
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('should set isCreatingSkill to true', () => {
        expect(component.isCreatingSkill).to.be.true;
      });

      it('should open the modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.creatingSkillModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
        expect(openModalSpy.args[0]).to.be.length(1);
        expect(openModalSpy.args[0][0].complete).to.exist;
      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('isCreatingSkill should be false', () => {
          expect(component.isCreatingSkill).to.be.false;
        });

      });

      describe('onSkillCreated', () => {

        var originalSkillsDetails: ISkillNameDetails[];
        var createdSkillDetails: ISkillNameDetails;
        var closeModalSpy: SinonSpy;

        beforeEach(() => {
          createdSkillDetails = {
            skillName: 'some new skill name',
            id: 123123
          }

          jqueryMock.closeModal = () => {
            openModalSpy.args[0][0].complete();
          };

          closeModalSpy = spy(jqueryMock, 'closeModal');

          jquerySpy.reset();

          originalSkillsDetails =
            _.map(component.skillsDetails, _ => _);

          component.onSkillCreated(createdSkillDetails);
        })

        it('should close the create skill modal and open the skill modal', () => {
          expect(jquerySpy.callCount, 'should use the jquery twice').to.be.equal(2);
          expect(jquerySpy.args[0].length, 'should use jquery with one argument the first time').to.be.equal(1);
          expect(jquerySpy.args[0][0], 'the jquery arument on the first call should be the creating skill modal').to.be.equal(component.creatingSkillModal.nativeElement);
          expect(closeModalSpy.callCount, 'close modal should be called once').to.be.equal(1);
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('should set isCreatingSkill to false', () => {
          expect(component.isCreatingSkill).to.be.false;
        });

        it('should add the created skill details to the skills details list', () => {
          expect(component.skillsDetails).to.be.length(originalSkillsDetails.length + 1);
        });

        it('should add the created skill details as first skill details', () => {
          expect(component.skillsDetails[0]).to.be.equal(createdSkillDetails);
        });

        it('should select the created skill details', () => {
          expect(component.selectedSkill).to.be.equal(createdSkillDetails);
        });

        it('should open the selected skill modal', () => {
          expect(jquerySpy.callCount).to.be.equal(2);
          expect(jquerySpy.args[1].length).to.be.equal(1);
          expect(jquerySpy.args[1][0]).to.be.equal(component.skillSettingsModal.nativeElement);
          expect(openModalSpy.callCount).to.be.equal(2);
          expect(openModalSpy.args[1]).to.be.length(1);
          expect(openModalSpy.args[1][0].complete).to.exist;
        });

      });
    });

    describe('delete skill', () => {

      var skillToDelete: ISkillNameDetails;
      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;
      var jqueryResult: any;

      beforeEach(() => {
        skillToDelete = skillsDetails[2];

        jqueryResult = {
          openModal: () => null,
        }

        openModalSpy = spy(jqueryResult, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryResult);

        component.deleteSkill(skillToDelete);
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('skillToDelete should be correct', () => {
        expect(component.skillToDelete).to.be.equal(skillToDelete);
      });

      it('isDeletingSkill should be false', () => {
        expect(component.isDeletingSkill).to.be.false;
      });

      it('deletingSkillError should be correct', () => {
        expect(component.deletingSkillError).to.be.null;
      });

      it('should open the delete skill modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.deleteSkillModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
        expect(openModalSpy.args[0]).to.be.length(1);
        expect(openModalSpy.args[0][0].complete).to.exist;
      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('skillToDelete should be null', () => {
          expect(component.skillToDelete).to.be.null;
        });

        it('isDeletingSkill should be false', () => {
          expect(component.isDeletingSkill).to.be.false;
        });

        it('deletingSkillError should be correct', () => {
          expect(component.deletingSkillError).to.be.null;
        });

      });

      describe('confirm deleting skill', () => {

        var closeModalSpy: SinonSpy;
        var deleteSkillSpy: SinonSpy;
        var deleteSkillResult: Subject<void>;

        beforeEach(() => {
          jqueryResult.closeModal = () => openModalSpy.args[0][0].complete();

          closeModalSpy = spy(jqueryResult, 'closeModal');

          jquerySpy.reset();

          deleteSkillSpy = stub(skillServiceMock, 'deleteSkill', () => {
            deleteSkillResult = new Subject<void>();
            return deleteSkillResult;
          })

          component.confirmDeletingSkill();
        });

        it('isDeletingSkill should be true', () => {
          expect(component.isDeletingSkill).to.be.true;
        });

        it('should not close the modal', () => {
          expect(jquerySpy.callCount).to.be.equal(0);
          expect(closeModalSpy.callCount).to.be.equal(0);
        });

        it('skillToDelete should be correct', () => {
          expect(component.skillToDelete).to.be.equal(skillToDelete);
        });

        it('should call skillService.deleteSkill', () => {
          expect(deleteSkillSpy.callCount).to.be.equal(1);
          expect(deleteSkillSpy.args[0]).to.deep.equal([skillToDelete.id]);
        });

        it('deletingSkillError should be correct', () => {
          expect(component.deletingSkillError).to.be.null;
        });

        describe('deleting skill fails', () => {

          var error: any;

          beforeEach(() => {
            error = 'error deleting skill';
            deleteSkillResult.error(error);
          });

          it('should not close the modal', () => {
            expect(jquerySpy.callCount).to.be.equal(0);
            expect(closeModalSpy.callCount).to.be.equal(0);
          });

          it('skillToDelete should be correct', () => {
            expect(component.skillToDelete).to.be.equal(skillToDelete);
          });

          it('isDeletingSkill should be false', () => {
            expect(component.isDeletingSkill).to.be.false;
          });

          it('deletingSkillError should be correct', () => {
            expect(component.deletingSkillError).to.be.equal(error);
          });

          describe('try deleting again', () => {

            beforeEach(() => {
              deleteSkillSpy.reset();

              component.confirmDeletingSkill();
            });

            it('isDeletingSkill should be true', () => {
              expect(component.isDeletingSkill).to.be.true;
            });

            it('should not close the modal', () => {
              expect(jquerySpy.callCount).to.be.equal(0);
              expect(closeModalSpy.callCount).to.be.equal(0);
            });

            it('skillToDelete should be correct', () => {
              expect(component.skillToDelete).to.be.equal(skillToDelete);
            });

            it('should call skillService.deleteSkill', () => {
              expect(deleteSkillSpy.callCount).to.be.equal(1);
              expect(deleteSkillSpy.args[0]).to.deep.equal([skillToDelete.id]);
            });

            it('deletingSkillError should be correct', () => {
              expect(component.deletingSkillError).to.be.null;
            });

          })

        });

        describe('deleting skill succeeds', () => {

          var originalSkillsDetailsLength: number;

          beforeEach(() => {
            originalSkillsDetailsLength = skillsDetails.length;

            deleteSkillResult.next(null);
            deleteSkillResult.complete();
          });

          it('should close the modal', () => {
            expect(jquerySpy.callCount).to.be.equal(1);
            expect(jquerySpy.args[0].length).to.be.equal(1);
            expect(jquerySpy.args[0][0]).to.be.equal(component.deleteSkillModal.nativeElement);
            expect(closeModalSpy.callCount).to.be.equal(1);
            expect(closeModalSpy.args[0]).to.be.empty;
          });

          it('isDeletingSkill should be false', () => {
            expect(component.isDeletingSkill).to.be.false;
          });

          it('skill to delete should be null', () => {
            expect(component.skillToDelete).to.be.null;
          });

          it('deletingSkillError should be correct', () => {
            expect(component.deletingSkillError).to.be.null;
          });

          it('should remove the skill from skills list', () => {
            expect(skillsDetails).to.be.length(originalSkillsDetailsLength - 1);
            expect(skillsDetails).not.to.contain(skillToDelete);
          })

        });


      });

    });

  });

});
