import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {ITeamMemberDetails} from "../../../common/interfaces/iTeamMemberDetails";
import {TeamUsersListComponent} from "./teamUsersList.component";
import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from '@angular/core/testing';
import {provide, ElementRef} from '@angular/core';
import {expect} from 'chai';
import {ITeamService, TeamService} from "../../../common/services/teamService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('TeamUsersListComponent', () => {

  var teamServiceMock: ITeamService;
  var getTeamMembersSpy: SinonSpy;
  var getTeamMembersResult: Subject<ITeamMemberDetails[]>;
  var teamDetails: ITeamNameDetails;
  var teamMembersChangedRaises: ITeamMemberDetails[][];
  var changingTeamMemberRaises: boolean[];
  var teamMembersListElement: ElementRef;
  var jquerySpy: SinonSpy;
  var jqueryResultCollapsibleSpy: SinonSpy;

  var component: TeamUsersListComponent;

  beforeEachProviders(() => {

    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    getTeamMembersSpy =
      stub(teamServiceMock, 'getTeamMembers', () => {
        getTeamMembersResult = new Subject<ITeamMemberDetails[]>();
        return getTeamMembersResult;
      });

    return [
      provide(TeamService, { useValue: teamServiceMock }),
      TeamUsersListComponent
    ];
  });

  beforeEach(inject([TeamUsersListComponent], (_component: TeamUsersListComponent) => {
    component = _component;

    teamDetails = {
      id: 12321,
      teamName: 'some team name'
    };

    component.teamDetails = teamDetails;
    teamMembersChangedRaises = [];
    component.teamMembersChangedEvent.subscribe((_teamMembers: ITeamMemberDetails[]) => {
      teamMembersChangedRaises.push(_teamMembers);
    });
    changingTeamMemberRaises = [];
    component.changingTeamMemberEvent.subscribe((_isRemoving: boolean) => {
      changingTeamMemberRaises.push(_isRemoving);
    });

    teamMembersListElement = {
      nativeElement: {}
    }
    component.teamMembersListElement = teamMembersListElement

    var jqueryResult = {
      collapsible: () => null
    }

    jqueryResultCollapsibleSpy = spy(jqueryResult, 'collapsible');

    jquerySpy = stub(window, '$', () => {
      return jqueryResult;
    });

    component.ngOnInit();
  }));

  afterEach(() => {
    jquerySpy.restore();
  });

  it('isLoadingTeamMembers should be true', () => {
    expect(component.isLoadingTeamMembers).to.be.true;
  });

  it('loadingTeamMembersError should be null', () => {
    expect(component.loadingTeamMembersError).to.be.null;
  });

  it('should call tamService.getTeamMembers()', () => {
    expect(getTeamMembersSpy.callCount).to.be.equal(1);
    expect(getTeamMembersSpy.args[0]).to.be.deep.equal([teamDetails.id]);
  });

  it('teamMembers should be null', () => {
    expect(component.teamMembers).to.be.null;
  });

  it('teamMembersChanged should exist', () => {
    expect(component.teamMembersChangedEvent).to.exist;
  });

  it('teamMembersChanged should not be raised', () => {
    expect(teamMembersChangedRaises).to.deep.equal([]);
  });

  it('should set as not updating team member', () => {
    expect(component.updatingTeamMember).to.be.false;
  });

  it('updatingTeamMemberError should be null', () => {
    expect(component.updatingTeamMemberError).to.be.null;
  });

  describe('getting team members fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getTeamMembersResult.error(error);
    });

    it('isLoadingTeamMembers should be false', () => {
      expect(component.isLoadingTeamMembers).to.be.false;
    });

    it('loadingTeamMembersError should be correct', () => {
      expect(component.loadingTeamMembersError).to.be.equal(error);
    });

    it('teamMembers should be null', () => {
      expect(component.teamMembers).to.be.null;
    });

    it('teamMembersChangedRaises should not be raised', () => {
      expect(teamMembersChangedRaises).to.deep.equal([]);
    });


    describe('reload', () => {

      beforeEach(() => {
        getTeamMembersSpy.reset();

        component.reload();
      });

      it('isLoadingTeamMembers should be true', () => {
        expect(component.isLoadingTeamMembers).to.be.true;
      });

      it('loadingTeamMembersError should be null', () => {
        expect(component.loadingTeamMembersError).to.be.null;
      });

      it('should call teamService.getTeamMembers()', () => {
        expect(getTeamMembersSpy.callCount).to.be.equal(1);
        expect(getTeamMembersSpy.args[0]).to.be.deep.equal([teamDetails.id]);
      });

      it('teamMembers should be null', () => {
        expect(component.teamMembers).to.be.null;
      });

      it('teamMembersChangedRaises should not be raised', () => {
        expect(teamMembersChangedRaises).to.deep.equal([]);
      });

    })

  });

  describe('getting team members succeeds', () => {

    var teamMembers: ITeamMemberDetails[];

    beforeEach(fakeAsync(() => {
      teamMembers = [
        { id: 0, username: 'a', isAdmin: true },
        { id: 1, username: 'b', isAdmin: false },
        { id: 2, username: 'c', isAdmin: true },
      ];

      getTeamMembersResult.next(teamMembers);
      getTeamMembersResult.complete();

      tick();
    }));

    it('isLoadingTeamMembers should be false', () => {
      expect(component.isLoadingTeamMembers).to.be.false;
    });

    it('loadingTeamMembersError should be null', () => {
      expect(component.loadingTeamMembersError).to.be.null;
    });

    it('teamMembers should be correct', () => {
      expect(component.teamMembers).to.deep.equal(teamMembers);
    });

    it('teamMembersChangedRaises should be raised correctly', () => {
      expect(teamMembersChangedRaises).to.deep.equal([teamMembers]);
    });

    it('should initialize the collapisble element', () => {
      expect(jquerySpy.callCount).to.be.equal(1);
      expect(jquerySpy.args[0]).to.deep.equal([teamMembersListElement.nativeElement]);
      expect(jqueryResultCollapsibleSpy.callCount).to.be.equal(1);
      expect(jqueryResultCollapsibleSpy.args[0]).to.deep.equal([{ accordion: true }]);
    });

    describe('removeTeamMember', () => {

      var userToRemove: ITeamMemberDetails;
      var removeTeamMemberSpy: SinonSpy;
      var removeTeamMemberResult: Subject<void>;

      beforeEach(() => {
        userToRemove = teamMembers[1];

        removeTeamMemberSpy = stub(teamServiceMock, 'removeTeamMember', () => {
          removeTeamMemberResult = new Subject<void>();

          return removeTeamMemberResult;
        })

        component.removeTeamMember(userToRemove);
      });

      it('should set updating team member', () => {
        expect(component.updatingTeamMember).to.be.true;
      });

      it('should call teamService.removeTeamMember', () => {
        expect(removeTeamMemberSpy.callCount).to.be.equal(1);
        expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, userToRemove.id]);
      });

      it('updatingTeamMemberError should be null', () => {
        expect(component.updatingTeamMemberError).to.be.null;
      });

      it('should raise changing team member event correctly', () => {
        expect(changingTeamMemberRaises).to.deep.equal([true]);
      });

      describe('removing fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';

          changingTeamMemberRaises = [];

          removeTeamMemberResult.error(error);
        });

        it('should set as not updating team member', () => {
          expect(component.updatingTeamMember).to.be.false;
        });

        it('should not remove the user from team members list', () => {
          var teamMemberIds: number[] = _.map(component.teamMembers, _ => _.id);

          expect(teamMemberIds).to.contain(userToRemove.id);
        });

        it('should set updatingTeamMemberError correctly', () => {
          expect(component.updatingTeamMemberError).to.be.equal(error);
        });

        it('should raise changing team member event correctly', () => {
          expect(changingTeamMemberRaises).to.deep.equal([false]);
        });

        describe('remove another team member', () => {

          var otherUserToRemove: ITeamMemberDetails;

          beforeEach(() => {
            otherUserToRemove = teamMembers[0];

            changingTeamMemberRaises = [];
            removeTeamMemberSpy.reset();

            component.removeTeamMember(otherUserToRemove);
          });

          it('should set updating team member', () => {
            expect(component.updatingTeamMember).to.be.true;
          });

          it('should call teamService.removeTeamMember', () => {
            expect(removeTeamMemberSpy.callCount).to.be.equal(1);
            expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, otherUserToRemove.id]);
          });

          it('updatingTeamMemberError should be null', () => {
            expect(component.updatingTeamMemberError).to.be.null;
          });

          it('should raise changing team member event correctly', () => {
            expect(changingTeamMemberRaises).to.deep.equal([true]);
          });

        });

      });

      describe('removing succeeds', () => {
        beforeEach(fakeAsync(() => {
          jquerySpy.reset();
          jqueryResultCollapsibleSpy.reset();

          changingTeamMemberRaises = [];
          teamMembersChangedRaises = [];

          removeTeamMemberResult.next(null);
          removeTeamMemberResult.complete();

          tick();
        }));

        it('should set as not updating team member', () => {
          expect(component.updatingTeamMember).to.be.false;
        });

        it('should remove the user from team members list', () => {
          var teamMemberIds: number[] = _.map(component.teamMembers, _ => _.id);

          expect(teamMemberIds).to.not.contain(userToRemove.id);
        });

        it('should raise changing team member event correctly', () => {
          expect(changingTeamMemberRaises).to.deep.equal([false]);
        });

        it('should raise team members changed correctly', () => {
          expect(teamMembersChangedRaises).to.deep.equal([component.teamMembers]);
        });

        it('should initialize the collapisble element', () => {
          expect(jquerySpy.callCount).to.be.equal(1);
          expect(jquerySpy.args[0]).to.deep.equal([teamMembersListElement.nativeElement]);
          expect(jqueryResultCollapsibleSpy.callCount).to.be.equal(1);
          expect(jqueryResultCollapsibleSpy.args[0]).to.deep.equal([{ accordion: true }]);
        });

      });

    });

    describe('changeTeamAdminRights', () => {

      var originalIsAdmin: boolean;
      var userToChange: ITeamMemberDetails;
      var changeTeamAdminRightsSpy: SinonSpy;
      var changeTeamAdminRightsResult: Subject<void>;
      var newAdminRights: boolean;

      beforeEach(() => {
        userToChange = teamMembers[1];

        changeTeamAdminRightsSpy = stub(teamServiceMock, 'changeTeamAdminRights', () => {
          changeTeamAdminRightsResult = new Subject<void>();

          return changeTeamAdminRightsResult;
        });

        originalIsAdmin = false;
        userToChange.isAdmin = originalIsAdmin;
        newAdminRights = !originalIsAdmin;

        component.changeTeamAdminRights(userToChange, newAdminRights);
      });

      it('should set team member admin rights', () => {
        expect(userToChange.isAdmin).to.be.equal(newAdminRights);
      });

      it('should set updating team member', () => {
        expect(component.updatingTeamMember).to.be.true;
      });

      it('should call teamService.removeTeamMember', () => {
        expect(changeTeamAdminRightsSpy.callCount).to.be.equal(1);
        expect(changeTeamAdminRightsSpy.args[0]).to.deep.equal([teamDetails.id, userToChange.id, newAdminRights]);
      });

      it('updatingTeamMemberError should be null', () => {
        expect(component.updatingTeamMemberError).to.be.null;
      });

      it('should raise changing team member event correctly', () => {
        expect(changingTeamMemberRaises).to.deep.equal([true]);
      });

      describe('changing fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';

          changingTeamMemberRaises = [];

          changeTeamAdminRightsResult.error(error);
        });

        it('should restore team member admin rights', () => {
          expect(userToChange.isAdmin).to.be.equal(originalIsAdmin);
        });

        it('should set as not updating team member', () => {
          expect(component.updatingTeamMember).to.be.false;
        });

        it('should not update admin rights', () => {
          expect(userToChange.isAdmin).to.be.equal(originalIsAdmin);
        });

        it('should set updatingTeamMemberError correctly', () => {
          expect(component.updatingTeamMemberError).to.be.equal(error);
        });

        it('should raise changing team member event correctly', () => {
          expect(changingTeamMemberRaises).to.deep.equal([false]);
        });

        describe('change admin rights to another team member', () => {

          var otherUserToRemove: ITeamMemberDetails;

          beforeEach(() => {
            otherUserToRemove = teamMembers[0];

            changingTeamMemberRaises = [];
            changeTeamAdminRightsSpy.reset();

            otherUserToRemove.isAdmin = true;
            newAdminRights = false;
            component.changeTeamAdminRights(otherUserToRemove, newAdminRights);
          });

          it('should set team member admin rights', () => {
            expect(otherUserToRemove.isAdmin).to.be.equal(newAdminRights);
          });

          it('should set updating team member', () => {
            expect(component.updatingTeamMember).to.be.true;
          });

          it('should call teamService.changeTeamAdminRights', () => {
            expect(changeTeamAdminRightsSpy.callCount).to.be.equal(1);
            expect(changeTeamAdminRightsSpy.args[0]).to.deep.equal([teamDetails.id, otherUserToRemove.id, newAdminRights]);
          });

          it('updatingTeamMemberError should be null', () => {
            expect(component.updatingTeamMemberError).to.be.null;
          });

          it('should raise changing team member event correctly', () => {
            expect(changingTeamMemberRaises).to.deep.equal([true]);
          });

        });

      });

      describe('changing succeeds', () => {
        beforeEach(() => {
          changingTeamMemberRaises = [];

          changeTeamAdminRightsResult.next(null);
          changeTeamAdminRightsResult.complete();
        });

        it('should set as not updating team member', () => {
          expect(component.updatingTeamMember).to.be.false;
        });

        it('should update the user admin rights', () => {
          expect(userToChange.isAdmin).to.be.equal(newAdminRights);
        });

        it('should raise changing team member event correctly', () => {
          expect(changingTeamMemberRaises).to.deep.equal([false]);
        });

      });

    });

    describe('changeTeamAdminRights to same value', () => {

      var originalIsAdmin: boolean;
      var userToChange: ITeamMemberDetails;
      var changeTeamAdminRightsSpy: SinonSpy;
      var changeTeamAdminRightsResult: Subject<void>;
      var newAdminRights: boolean;

      beforeEach(() => {
        userToChange = teamMembers[1];

        changeTeamAdminRightsSpy = stub(teamServiceMock, 'changeTeamAdminRights', () => {
          changeTeamAdminRightsResult = new Subject<void>();

          return changeTeamAdminRightsResult;
        });

        originalIsAdmin = false;
        userToChange.isAdmin = originalIsAdmin;
        newAdminRights = originalIsAdmin;

        component.changeTeamAdminRights(userToChange, newAdminRights);
      });

      it('should not set updating team member', () => {
        expect(component.updatingTeamMember).to.be.false;
      });

      it('should not call teamService.removeTeamMember', () => {
        expect(changeTeamAdminRightsSpy.callCount).to.be.equal(0);
      });

      it('updatingTeamMemberError should be null', () => {
        expect(component.updatingTeamMemberError).to.be.null;
      });

      it('should not raise changing team member event', () => {
        expect(changingTeamMemberRaises).to.be.empty;
      });
    });

  });

});
