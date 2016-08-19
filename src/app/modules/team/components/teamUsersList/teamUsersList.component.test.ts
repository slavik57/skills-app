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
} from '@angular/core/testing';
import {provide} from '@angular/core';
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
  var removingTeamMemberStateChangedRaises: boolean[];

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
    removingTeamMemberStateChangedRaises = [];
    component.removingTeamMemberStateChangedEvent.subscribe((_isRemoving: boolean) => {
      removingTeamMemberStateChangedRaises.push(_isRemoving);
    });

    component.ngOnInit();
  }));

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

  it('should set as not removing team member', () => {
    expect(component.removingTeamMember).to.be.false;
  });

  it('removingTeamMemberError should be null', () => {
    expect(component.removingTeamMemberError).to.be.null;
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

    beforeEach(() => {
      teamMembers = [
        { id: 0, username: 'a', isAdmin: true },
        { id: 1, username: 'b', isAdmin: false },
        { id: 2, username: 'c', isAdmin: true },
      ];

      getTeamMembersResult.next(teamMembers);
      getTeamMembersResult.complete();
    });

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

      it('should set removing team member', () => {
        expect(component.removingTeamMember).to.be.true;
      });

      it('should call teamService.removeTeamMember', () => {
        expect(removeTeamMemberSpy.callCount).to.be.equal(1);
        expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, userToRemove.id]);
      });

      it('removingTeamMemberError should be null', () => {
        expect(component.removingTeamMemberError).to.be.null;
      });

      it('should raise removing team member event correctly', () => {
        expect(removingTeamMemberStateChangedRaises).to.deep.equal([true]);
      });

      describe('removing fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';

          removingTeamMemberStateChangedRaises = [];

          removeTeamMemberResult.error(error);
        });

        it('should set as not removing team member', () => {
          expect(component.removingTeamMember).to.be.false;
        });

        it('should not remove the user from team members list', () => {
          var teamMemberIds: number[] = _.map(component.teamMembers, _ => _.id);

          expect(teamMemberIds).to.contain(userToRemove.id);
        });

        it('should set removingTeamMemberError correctly', () => {
          expect(component.removingTeamMemberError).to.be.equal(error);
        });

        it('should raise removing team member event correctly', () => {
          expect(removingTeamMemberStateChangedRaises).to.deep.equal([false]);
        });

        describe('remove another team member', () => {

          var otherUserToRemove: ITeamMemberDetails;

          beforeEach(() => {
            otherUserToRemove = teamMembers[0];

            removingTeamMemberStateChangedRaises = [];
            removeTeamMemberSpy.reset();

            component.removeTeamMember(otherUserToRemove);
          });

          it('should set removing team member', () => {
            expect(component.removingTeamMember).to.be.true;
          });

          it('should call teamService.removeTeamMember', () => {
            expect(removeTeamMemberSpy.callCount).to.be.equal(1);
            expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, otherUserToRemove.id]);
          });

          it('removingTeamMemberError should be null', () => {
            expect(component.removingTeamMemberError).to.be.null;
          });

          it('should raise removing team member event correctly', () => {
            expect(removingTeamMemberStateChangedRaises).to.deep.equal([true]);
          });

        });

      });

      describe('removing succeeds', () => {
        beforeEach(() => {
          removingTeamMemberStateChangedRaises = [];
          teamMembersChangedRaises = [];

          removeTeamMemberResult.next(null);
          removeTeamMemberResult.complete();
        });

        it('should set as not removing team member', () => {
          expect(component.removingTeamMember).to.be.false;
        });

        it('should remove the user from team members list', () => {
          var teamMemberIds: number[] = _.map(component.teamMembers, _ => _.id);

          expect(teamMemberIds).to.not.contain(userToRemove.id);
        });

        it('should raise removing team member event correctly', () => {
          expect(removingTeamMemberStateChangedRaises).to.deep.equal([false]);
        });

        it('should raise team members changed correctly', () => {
          expect(teamMembersChangedRaises).to.deep.equal([component.teamMembers]);
        });

      });

    });

  });

});
