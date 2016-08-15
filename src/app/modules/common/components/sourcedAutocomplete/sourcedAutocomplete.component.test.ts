import {IItemsSource} from "./iItemsSource";
import {SourcedAutocompleteComponent} from "./sourcedAutocomplete.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import {FormControl} from '@angular/forms';

describe('SourcedAutocompleteComponent', () => {

  var instanceNumber: number;
  var component: SourcedAutocompleteComponent;
  var itemsSource: IItemsSource;
  var getItemsSpy: SinonSpy;
  var getItemsResult: Subject<any[]>;
  var formControl: FormControl;

  beforeEachProviders(() => {
    instanceNumber = 123;
    SourcedAutocompleteComponent.INSTANCE_NUMBER = instanceNumber;

    itemsSource = {
      getItems: () => {
        getItemsResult = new Subject<any[]>();
        return getItemsResult;
      },
      converItemToString: (_item) => _item.toString()
    }

    getItemsSpy = spy(itemsSource, 'getItems');

    formControl = new FormControl();

    return [
      SourcedAutocompleteComponent
    ];
  });

  beforeEach(inject([SourcedAutocompleteComponent], (_component: SourcedAutocompleteComponent) => {
    component = _component;
  }));

  describe('ctor', () => {

    it('should update the instane number', () => {
      expect(SourcedAutocompleteComponent.INSTANCE_NUMBER).to.be.equal(instanceNumber + 1);
    });

    it('should set the id correctly', () => {
      expect(component.id).to.be.equal(SourcedAutocompleteComponent.ID_PREFIX + instanceNumber);
    });

  });

  it('initialize without itemsSource should throw error', () => {
    component.formControl = formControl;

    expect(() => component.ngOnInit()).to.throw();
  });

  it('initialize without formControl should throw error', () => {
    component.itemsSource = itemsSource;

    expect(() => component.ngOnInit()).to.throw();
  });

  describe('initialize', () => {

    var debounceTime: number;

    beforeEach(() => {
      debounceTime = 20;

      component.debounceTime = debounceTime.toString();
      component.itemsSource = itemsSource;
      component.formControl = formControl;

      component.ngOnInit();
    });

    it('results should be null', () => {
      expect(component.results).to.be.null;
    });

    it('isLoadingResults to be false', () => {
      expect(component.isLoadingResults).to.be.false;
    });

    describe('form control value changes', () => {

      var newValue: string;

      beforeEach(() => {
        newValue = 'some new value';

        formControl.updateValue(newValue, { emitEvent: true });
      });

      it('should not call getItems', () => {
        expect(getItemsSpy.callCount).to.be.equal(0);
      });

      it('results should be null', () => {
        expect(component.results).to.be.null;
      });

      it('isLoadingResults to be false', () => {
        expect(component.isLoadingResults).to.be.false;
      });

      describe('debounce time passes', () => {

        var valueChangesTests = (getValueFunction: () => string, getExpectedResultsFunction: () => any[]) => {
          var value: string;
          var expectedResults: any[];

          beforeEach(fakeAsync(() => {
            value = getValueFunction();
            expectedResults = getExpectedResultsFunction();

            getItemsSpy.reset();

            formControl.updateValue(value, { emitEvent: true });

            tick(debounceTime);
          }));

          it('should call getItems correctly', () => {
            expect(getItemsSpy.callCount).to.be.equal(1);
            expect(getItemsSpy.args[0]).to.deep.equal([value]);
          });

          it('results should be correct', () => {
            expect(component.results).to.deep.equal(expectedResults);
          });

          it('isLoadingResults to be true', () => {
            expect(component.isLoadingResults).to.be.true;
          });
        };

        valueChangesTests(() => newValue, () => null);

        it('should call getItems correctly', () => {
          expect(getItemsSpy.callCount).to.be.equal(1);
          expect(getItemsSpy.args[0]).to.deep.equal([newValue]);
        });

        it('results should be null', () => {
          expect(component.results).to.be.null;
        });

        it('isLoadingResults to be true', () => {
          expect(component.isLoadingResults).to.be.true;
        });

        describe('getting items fails', () => {
          beforeEach(() => {
            getItemsResult.error('some error');
          });

          it('results should be null', () => {
            expect(component.results).to.be.null;
          });

          it('isLoadingResults to be false', () => {
            expect(component.isLoadingResults).to.be.false;
          });

          describe('value changes again', () => {

            describe('to same value', () => {
              valueChangesTests(() => newValue, () => null);
            });

            describe('to different value', () => {
              valueChangesTests(() => 'other new value', () => null);
            });

          });
        });

        describe('getting items succeeds', () => {

          var items: any[];

          beforeEach(() => {
            items = [1, 2, 3, 4];

            getItemsResult.next(items);
            getItemsResult.complete();
          });

          it('results should be correct', () => {
            expect(component.results).to.be.equal(items);
          });

          it('isLoadingResults to be false', () => {
            expect(component.isLoadingResults).to.be.false;
          });

          describe('value changes again', () => {

            describe('to same value', () => {
              valueChangesTests(() => newValue, () => items);
            });

            describe('to different value', () => {
              valueChangesTests(() => 'other new value', () => items);
            });

            describe('to empty', () => {

              beforeEach(fakeAsync(() => {
                getItemsSpy.reset();

                formControl.updateValue('', { emitEvent: true });

                tick(debounceTime);
              }));

              it('should not call getItems', () => {
                expect(getItemsSpy.callCount).to.be.equal(0);
              });

              it('results should be null', () => {
                expect(component.results).to.be.null;
              });

              it('isLoadingResults to be false', () => {
                expect(component.isLoadingResults).to.be.false;
              });

            })

          });

          describe('select', () => {

            var selectSomeValueTests = (formControlText, searchText) => {

              beforeEach(() => {
                getItemsSpy.reset();

                component.formControl.updateValue(formControlText, { emitEvent: false });

                component.select(searchText);
              });

              it('should clear the results', () => {
                expect(component.results).to.be.null;
              });

              it('should update the formControl value', () => {
                expect(component.formControl.value).to.be.equal(searchText);
              });

              it('should not set as loading results', () => {
                expect(component.isLoadingResults).to.be.false;
              });

              it('should not call get items', () => {
                expect(getItemsSpy.callCount).to.be.equal(0);
              });

              describe('value changes again', () => {
                valueChangesTests(() => 'other new value', () => null);
              })

            };

            describe('selecting different item from the formControl value', () => {

              selectSomeValueTests('text', 'some search text');

            });

            describe('selecting same item from the formControl value', () => {

              selectSomeValueTests('some search text', 'some search text');

            });

          });

          it('clearResultsAsync should clear the results', fakeAsync(() => {
            component.clearResultsAsync();

            expect(component.results).to.exist;

            tick(100);

            expect(component.results).to.be.null;
          }));

        });

      });

    });

  });

});
