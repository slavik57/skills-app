import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {ISkillPrerequisiteDetails} from "../../../common/interfaces/iSkillPrerequisiteDetails";
import {SkillPrerequisitesListComponent} from "./skillPrerequisitesList.component";
import {SkillServiceMockFactory} from "../../../../testUtils/mockFactories/skillServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders
} from '@angular/core/testing';
import {provide, ElementRef} from '@angular/core';
import {expect} from 'chai';
import {ISkillService, SkillService} from "../../../common/services/skillService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('SkillPrerequisitesListComponent', () => {

  var skillServiceMock: ISkillService;
  var getSkillPrerequisitesSpy: SinonSpy;
  var getSkillPrerequisitesResult: Subject<ISkillPrerequisiteDetails[]>;
  var skillDetails: ISkillNameDetails;
  var skillPrerequisitesChangedRaises: ISkillPrerequisiteDetails[][];
  var changingSkillPrerequisiteRaises: boolean[];

  var component: SkillPrerequisitesListComponent;

  beforeEachProviders(() => {

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    getSkillPrerequisitesSpy =
      stub(skillServiceMock, 'getSkillPrerequisites', () => {
        getSkillPrerequisitesResult = new Subject<ISkillPrerequisiteDetails[]>();
        return getSkillPrerequisitesResult;
      });

    return [
      provide(SkillService, { useValue: skillServiceMock }),
      SkillPrerequisitesListComponent
    ];
  });

  beforeEach(inject([SkillPrerequisitesListComponent], (_component: SkillPrerequisitesListComponent) => {
    component = _component;

    skillDetails = {
      id: 12321,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;
    skillPrerequisitesChangedRaises = [];
    component.skillPrerequisitesChangedEvent.subscribe((_skillPrerequisites: ISkillPrerequisiteDetails[]) => {
      skillPrerequisitesChangedRaises.push(_skillPrerequisites);
    });
    changingSkillPrerequisiteRaises = [];
    component.changingSkillPrerequisitesEvent.subscribe((_isRemoving: boolean) => {
      changingSkillPrerequisiteRaises.push(_isRemoving);
    });

    component.ngOnInit();
  }));

  it('isLoadingSkillPrerequisites should be true', () => {
    expect(component.isLoadingSkillPrerequisites).to.be.true;
  });

  it('loadingSkillPrerequisitesError should be null', () => {
    expect(component.loadingSkillPrerequisitesError).to.be.null;
  });

  it('should call skillService.getSkillPrerequisites()', () => {
    expect(getSkillPrerequisitesSpy.callCount).to.be.equal(1);
    expect(getSkillPrerequisitesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
  });

  it('skillPrerequisites should be null', () => {
    expect(component.skillPrerequisites).to.be.null;
  });

  it('skillPrerequisitesChangedEvent should exist', () => {
    expect(component.skillPrerequisitesChangedEvent).to.exist;
  });

  it('skillPrerequisitesChanged should not be raised', () => {
    expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
  });

  it('should set as not updating skill prerequisite', () => {
    expect(component.updatingSkillPrerequisite).to.be.false;
  });

  it('updatingSkillPrerequisiteError should be null', () => {
    expect(component.updatingSkillPrerequisiteError).to.be.null;
  });

  describe('getting skill prerequisites fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getSkillPrerequisitesResult.error(error);
    });

    it('isLoadingSkillPrerequisites should be false', () => {
      expect(component.isLoadingSkillPrerequisites).to.be.false;
    });

    it('loadingSkillPrerequisitesError should be correct', () => {
      expect(component.loadingSkillPrerequisitesError).to.be.equal(error);
    });

    it('skillPrerequisites should be null', () => {
      expect(component.skillPrerequisites).to.be.null;
    });

    it('skillPrerequisitesChanged should not be raised', () => {
      expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
    });

    describe('reload', () => {

      beforeEach(() => {
        getSkillPrerequisitesSpy.reset();

        component.reload();
      });

      it('isLoadingSkillPrerequisites should be true', () => {
        expect(component.isLoadingSkillPrerequisites).to.be.true;
      });

      it('loadingSkilPrerequisitesError should be null', () => {
        expect(component.loadingSkillPrerequisitesError).to.be.null;
      });

      it('should call skillService.getSkillPrerequisites()', () => {
        expect(getSkillPrerequisitesSpy.callCount).to.be.equal(1);
        expect(getSkillPrerequisitesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
      });

      it('skillPrerequisites should be null', () => {
        expect(component.skillPrerequisites).to.be.null;
      });

      it('skillPrerequisitesChanged should not be raised', () => {
        expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
      });

    })

  });

  describe('getting skill prerequisites succeeds', () => {

    var skillPrerequisites: ISkillPrerequisiteDetails[];

    beforeEach(() => {
      skillPrerequisites = [
        { id: 0, skillName: 'a' },
        { id: 1, skillName: 'b' },
        { id: 2, skillName: 'c' },
      ];

      getSkillPrerequisitesResult.next(skillPrerequisites);
      getSkillPrerequisitesResult.complete();
    });

    it('isLoadingSkillPrerequisites should be false', () => {
      expect(component.isLoadingSkillPrerequisites).to.be.false;
    });

    it('loadingSkillPrerequisitesError should be null', () => {
      expect(component.loadingSkillPrerequisitesError).to.be.null;
    });

    it('skillPrerequisites should be correct', () => {
      expect(component.skillPrerequisites).to.deep.equal(skillPrerequisites);
    });

    it('skillPrerequisitesChanged should be raised correctly', () => {
      expect(skillPrerequisitesChangedRaises).to.deep.equal([skillPrerequisites]);
    });

    describe('removeSkillPrerequisite', () => {

      var skillPrerequisiteToRemove: ISkillPrerequisiteDetails;
      var removeSkillPrerequisiteSpy: SinonSpy;
      var removeSkillPrerequisiteResult: Subject<void>;

      beforeEach(() => {
        skillPrerequisiteToRemove = skillPrerequisites[1];

        removeSkillPrerequisiteSpy = stub(skillServiceMock, 'removeSkillPrerequisite', () => {
          removeSkillPrerequisiteResult = new Subject<void>();

          return removeSkillPrerequisiteResult;
        })

        component.removeSkillPrerequisite(skillPrerequisiteToRemove);
      });

      it('should set updating skill prerequisite', () => {
        expect(component.updatingSkillPrerequisite).to.be.true;
      });

      it('should call skillService.removeSkillPrerequisite', () => {
        expect(removeSkillPrerequisiteSpy.callCount).to.be.equal(1);
        expect(removeSkillPrerequisiteSpy.args[0]).to.deep.equal([skillDetails.id, skillPrerequisiteToRemove.id]);
      });

      it('updatingSkillPrerequisiteError should be null', () => {
        expect(component.updatingSkillPrerequisiteError).to.be.null;
      });

      it('should raise changing skill prerequisite event correctly', () => {
        expect(changingSkillPrerequisiteRaises).to.deep.equal([true]);
      });

      describe('removing fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';

          changingSkillPrerequisiteRaises = [];

          removeSkillPrerequisiteResult.error(error);
        });

        it('should set as not updating skill prerequisite', () => {
          expect(component.updatingSkillPrerequisite).to.be.false;
        });

        it('should not remove the prerequisite from skill prerequisites list', () => {
          var skillPrerequisitesIds: number[] = _.map(component.skillPrerequisites, _ => _.id);

          expect(skillPrerequisitesIds).to.contain(skillPrerequisiteToRemove.id);
        });

        it('should set updatingSkillPrerequisiteError correctly', () => {
          expect(component.updatingSkillPrerequisiteError).to.be.equal(error);
        });

        it('should raise changing skill prerequisite event correctly', () => {
          expect(changingSkillPrerequisiteRaises).to.deep.equal([false]);
        });

        describe('remove another skill prerequisite', () => {

          var otherSkillPrerequisiteToRemove: ISkillPrerequisiteDetails;

          beforeEach(() => {
            otherSkillPrerequisiteToRemove = skillPrerequisites[0];

            changingSkillPrerequisiteRaises = [];
            removeSkillPrerequisiteSpy.reset();

            component.removeSkillPrerequisite(otherSkillPrerequisiteToRemove);
          });

          it('should set updating skill prerequisites', () => {
            expect(component.updatingSkillPrerequisite).to.be.true;
          });

          it('should call skillService.removeSkillPrerequisite', () => {
            expect(removeSkillPrerequisiteSpy.callCount).to.be.equal(1);
            expect(removeSkillPrerequisiteSpy.args[0]).to.deep.equal([skillDetails.id, otherSkillPrerequisiteToRemove.id]);
          });

          it('updatingSkillPrerequisiteError should be null', () => {
            expect(component.updatingSkillPrerequisiteError).to.be.null;
          });

          it('should raise changing skill prerequisite event correctly', () => {
            expect(changingSkillPrerequisiteRaises).to.deep.equal([true]);
          });

        });

      });

      describe('removing succeeds', () => {
        beforeEach(() => {
          changingSkillPrerequisiteRaises = [];
          skillPrerequisitesChangedRaises = [];

          removeSkillPrerequisiteResult.next(null);
          removeSkillPrerequisiteResult.complete();
        });

        it('should set as not updating skill prerequisite', () => {
          expect(component.updatingSkillPrerequisite).to.be.false;
        });

        it('should remove the skill prerequisite from skill prerequisites list', () => {
          var skilPrerequisitesIds: number[] = _.map(component.skillPrerequisites, _ => _.id);

          expect(skilPrerequisitesIds).to.not.contain(skillPrerequisiteToRemove.id);
        });

        it('should raise changing skill prerequisite event correctly', () => {
          expect(changingSkillPrerequisiteRaises).to.deep.equal([false]);
        });

        it('should raise skill prerequisites changed correctly', () => {
          expect(skillPrerequisitesChangedRaises).to.deep.equal([component.skillPrerequisites]);
        });

      });

    });

  });

});
