import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {ISkillDependencyDetails} from "../../../common/interfaces/iSkillDependencyDetails";
import {SkillDependenciesListComponent} from "./skillDependenciesList.component";
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

describe('SkillDependenciesListComponent', () => {

  var skillServiceMock: ISkillService;
  var getSkillDependenciesSpy: SinonSpy;
  var getSkillDependenciesResult: Subject<ISkillDependencyDetails[]>;
  var skillDetails: ISkillNameDetails;
  var skillDependenciesChangedRaises: ISkillDependencyDetails[][];
  var changingSkillDependencyRaises: boolean[];

  var component: SkillDependenciesListComponent;

  beforeEachProviders(() => {

    skillServiceMock = SkillServiceMockFactory.createSkillServiceMock();

    getSkillDependenciesSpy =
      stub(skillServiceMock, 'getSkillDependencies', () => {
        getSkillDependenciesResult = new Subject<ISkillDependencyDetails[]>();
        return getSkillDependenciesResult;
      });

    return [
      provide(SkillService, { useValue: skillServiceMock }),
      SkillDependenciesListComponent
    ];
  });

  beforeEach(inject([SkillDependenciesListComponent], (_component: SkillDependenciesListComponent) => {
    component = _component;

    skillDetails = {
      id: 12321,
      skillName: 'some skill name'
    };

    component.skillDetails = skillDetails;
    skillDependenciesChangedRaises = [];
    component.skillDependenciesChangedEvent.subscribe((_skillDependencies: ISkillDependencyDetails[]) => {
      skillDependenciesChangedRaises.push(_skillDependencies);
    });
    changingSkillDependencyRaises = [];
    component.changingSkillDependenciesEvent.subscribe((_isRemoving: boolean) => {
      changingSkillDependencyRaises.push(_isRemoving);
    });

    component.ngOnInit();
  }));

  it('isLoadingSkillDependencies should be true', () => {
    expect(component.isLoadingSkillDependencies).to.be.true;
  });

  it('loadingSkillDependenciesError should be null', () => {
    expect(component.loadingSkillDependenciesError).to.be.null;
  });

  it('should call skillService.getSkillDependencies()', () => {
    expect(getSkillDependenciesSpy.callCount).to.be.equal(1);
    expect(getSkillDependenciesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
  });

  it('skillDependencies should be null', () => {
    expect(component.skillDependencies).to.be.null;
  });

  it('skillDependenciesChangedEvent should exist', () => {
    expect(component.skillDependenciesChangedEvent).to.exist;
  });

  it('skillDependenciesChanged should not be raised', () => {
    expect(skillDependenciesChangedRaises).to.deep.equal([]);
  });

  it('should set as not updating skill dependency', () => {
    expect(component.updatingSkillDependency).to.be.false;
  });

  it('updatingSkillDependencyError should be null', () => {
    expect(component.updatingSkillDependencyError).to.be.null;
  });

  describe('getting skill dependencies fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getSkillDependenciesResult.error(error);
    });

    it('isLoadingSkillDependencies should be false', () => {
      expect(component.isLoadingSkillDependencies).to.be.false;
    });

    it('loadingSkillDependenciesError should be correct', () => {
      expect(component.loadingSkillDependenciesError).to.be.equal(error);
    });

    it('skillDependencies should be null', () => {
      expect(component.skillDependencies).to.be.null;
    });

    it('skillDependenciesChanged should not be raised', () => {
      expect(skillDependenciesChangedRaises).to.deep.equal([]);
    });

    describe('reload', () => {

      beforeEach(() => {
        getSkillDependenciesSpy.reset();

        component.reload();
      });

      it('isLoadingSkillDependencies should be true', () => {
        expect(component.isLoadingSkillDependencies).to.be.true;
      });

      it('loadingSkillDependenciesError should be null', () => {
        expect(component.loadingSkillDependenciesError).to.be.null;
      });

      it('should call skillService.getSkillDependencies()', () => {
        expect(getSkillDependenciesSpy.callCount).to.be.equal(1);
        expect(getSkillDependenciesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
      });

      it('skillDependencies should be null', () => {
        expect(component.skillDependencies).to.be.null;
      });

      it('skillDependenciesChanged should not be raised', () => {
        expect(skillDependenciesChangedRaises).to.deep.equal([]);
      });

    })

  });

  describe('getting skill dependencies succeeds', () => {

    var skillDependencies: ISkillDependencyDetails[];

    beforeEach(() => {
      skillDependencies = [
        { id: 0, skillName: 'a' },
        { id: 1, skillName: 'b' },
        { id: 2, skillName: 'c' },
      ];

      getSkillDependenciesResult.next(skillDependencies);
      getSkillDependenciesResult.complete();
    });

    it('isLoadingSkillDependencies should be false', () => {
      expect(component.isLoadingSkillDependencies).to.be.false;
    });

    it('loadingSkillDependenciesError should be null', () => {
      expect(component.loadingSkillDependenciesError).to.be.null;
    });

    it('skillDependencies should be correct', () => {
      expect(component.skillDependencies).to.deep.equal(skillDependencies);
    });

    it('skillDependenciesChanged should be raised correctly', () => {
      expect(skillDependenciesChangedRaises).to.deep.equal([skillDependencies]);
    });

    describe('removeSkillDependency', () => {

      var skillDependencyToRemove: ISkillDependencyDetails;
      var removeSkillDependencySpy: SinonSpy;
      var removeSkillDependencyResult: Subject<void>;

      beforeEach(() => {
        skillDependencyToRemove = skillDependencies[1];

        removeSkillDependencySpy = stub(skillServiceMock, 'removeSkillDependency', () => {
          removeSkillDependencyResult = new Subject<void>();

          return removeSkillDependencyResult;
        })

        component.removeSkillDependency(skillDependencyToRemove);
      });

      it('should set updating skill dependency', () => {
        expect(component.updatingSkillDependency).to.be.true;
      });

      it('should call skillService.removeSkillDependency', () => {
        expect(removeSkillDependencySpy.callCount).to.be.equal(1);
        expect(removeSkillDependencySpy.args[0]).to.deep.equal([skillDetails.id, skillDependencyToRemove.id]);
      });

      it('updatingSkillDependencyError should be null', () => {
        expect(component.updatingSkillDependencyError).to.be.null;
      });

      it('should raise changing skill dependency event correctly', () => {
        expect(changingSkillDependencyRaises).to.deep.equal([true]);
      });

      describe('removing fails', () => {

        var error: any;

        beforeEach(() => {
          error = 'some error';

          changingSkillDependencyRaises = [];

          removeSkillDependencyResult.error(error);
        });

        it('should set as not updating skill dependency', () => {
          expect(component.updatingSkillDependency).to.be.false;
        });

        it('should not remove the dependency from skill dependencies list', () => {
          var skillDependenciesIds: number[] = _.map(component.skillDependencies, _ => _.id);

          expect(skillDependenciesIds).to.contain(skillDependencyToRemove.id);
        });

        it('should set updatingSkillDependencyError correctly', () => {
          expect(component.updatingSkillDependencyError).to.be.equal(error);
        });

        it('should raise changing skill dependency event correctly', () => {
          expect(changingSkillDependencyRaises).to.deep.equal([false]);
        });

        describe('remove another skill dependency', () => {

          var otherSkillDependencyToRemove: ISkillDependencyDetails;

          beforeEach(() => {
            otherSkillDependencyToRemove = skillDependencies[0];

            changingSkillDependencyRaises = [];
            removeSkillDependencySpy.reset();

            component.removeSkillDependency(otherSkillDependencyToRemove);
          });

          it('should set updating skill dependencies', () => {
            expect(component.updatingSkillDependency).to.be.true;
          });

          it('should call skillService.removeSkillDependency', () => {
            expect(removeSkillDependencySpy.callCount).to.be.equal(1);
            expect(removeSkillDependencySpy.args[0]).to.deep.equal([skillDetails.id, otherSkillDependencyToRemove.id]);
          });

          it('updatingSkillDependencyError should be null', () => {
            expect(component.updatingSkillDependencyError).to.be.null;
          });

          it('should raise changing skill dependency event correctly', () => {
            expect(changingSkillDependencyRaises).to.deep.equal([true]);
          });

        });

      });

      describe('removing succeeds', () => {
        beforeEach(() => {
          changingSkillDependencyRaises = [];
          skillDependenciesChangedRaises = [];

          removeSkillDependencyResult.next(null);
          removeSkillDependencyResult.complete();
        });

        it('should set as not updating skill dependency', () => {
          expect(component.updatingSkillDependency).to.be.false;
        });

        it('should remove the skill dependency from skill dependencies list', () => {
          var skilDependenciesIds: number[] = _.map(component.skillDependencies, _ => _.id);

          expect(skilDependenciesIds).to.not.contain(skillDependencyToRemove.id);
        });

        it('should raise changing skill dependency event correctly', () => {
          expect(changingSkillDependencyRaises).to.deep.equal([false]);
        });

        it('should raise skill dependencies changed correctly', () => {
          expect(skillDependenciesChangedRaises).to.deep.equal([component.skillDependencies]);
        });

      });

    });

  });

});
