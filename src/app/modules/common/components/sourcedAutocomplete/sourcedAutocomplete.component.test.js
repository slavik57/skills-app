"use strict";
var sourcedAutocomplete_component_1 = require("./sourcedAutocomplete.component");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
testing_1.describe('SourcedAutocompleteComponent', function () {
    var instanceNumber;
    var component;
    var itemsSource;
    var getItemsSpy;
    var getItemsResult;
    var formControl;
    testing_1.beforeEachProviders(function () {
        instanceNumber = 123;
        sourcedAutocomplete_component_1.SourcedAutocompleteComponent.INSTANCE_NUMBER = instanceNumber;
        itemsSource = {
            getItems: function () {
                getItemsResult = new Subject_1.Subject();
                return getItemsResult;
            }
        };
        getItemsSpy = sinon_1.spy(itemsSource, 'getItems');
        formControl = new forms_1.FormControl();
        return [
            sourcedAutocomplete_component_1.SourcedAutocompleteComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([sourcedAutocomplete_component_1.SourcedAutocompleteComponent], function (_component) {
        component = _component;
    }));
    testing_1.describe('ctor', function () {
        testing_1.it('should update the instane number', function () {
            chai_1.expect(sourcedAutocomplete_component_1.SourcedAutocompleteComponent.INSTANCE_NUMBER).to.be.equal(instanceNumber + 1);
        });
        testing_1.it('should set the id correctly', function () {
            chai_1.expect(component.id).to.be.equal(sourcedAutocomplete_component_1.SourcedAutocompleteComponent.ID_PREFIX + instanceNumber);
        });
    });
    testing_1.it('initialize without itemsSource should throw error', function () {
        component.formControl = formControl;
        chai_1.expect(function () { return component.ngOnInit(); }).to.throw();
    });
    testing_1.it('initialize without formControl should throw error', function () {
        component.itemsSource = itemsSource;
        chai_1.expect(function () { return component.ngOnInit(); }).to.throw();
    });
    testing_1.describe('initialize', function () {
        var debounceTime;
        testing_1.beforeEach(function () {
            debounceTime = 20;
            component.debounceTime = debounceTime.toString();
            component.itemsSource = itemsSource;
            component.formControl = formControl;
            component.ngOnInit();
        });
        testing_1.it('results should be null', function () {
            chai_1.expect(component.results).to.be.null;
        });
        testing_1.it('isLoadingResults to be false', function () {
            chai_1.expect(component.isLoadingResults).to.be.false;
        });
        testing_1.describe('form control value changes', function () {
            var newValue;
            testing_1.beforeEach(function () {
                newValue = 'some new value';
                formControl.updateValue(newValue, { emitEvent: true });
            });
            testing_1.it('should not call getItems', function () {
                chai_1.expect(getItemsSpy.callCount).to.be.equal(0);
            });
            testing_1.it('results should be null', function () {
                chai_1.expect(component.results).to.be.null;
            });
            testing_1.it('isLoadingResults to be false', function () {
                chai_1.expect(component.isLoadingResults).to.be.false;
            });
            testing_1.describe('debounce time passes', function () {
                testing_1.beforeEach(testing_1.fakeAsync(function () {
                    formControl.updateValue(newValue, { emitEvent: true });
                    testing_1.tick(debounceTime);
                }));
                testing_1.it('should call getItems correctly', function () {
                    chai_1.expect(getItemsSpy.callCount).to.be.equal(1);
                    chai_1.expect(getItemsSpy.args[0]).to.deep.equal([newValue]);
                });
                testing_1.it('results should be null', function () {
                    chai_1.expect(component.results).to.be.null;
                });
                testing_1.it('isLoadingResults to be true', function () {
                    chai_1.expect(component.isLoadingResults).to.be.true;
                });
                testing_1.describe('getting items fails', function () {
                    testing_1.beforeEach(function () {
                        getItemsResult.error('some error');
                    });
                    testing_1.it('results should be null', function () {
                        chai_1.expect(component.results).to.be.null;
                    });
                    testing_1.it('isLoadingResults to be false', function () {
                        chai_1.expect(component.isLoadingResults).to.be.false;
                    });
                    testing_1.describe('value changes again', function () {
                        testing_1.describe('to different value', function () {
                            var otherNewValue;
                            testing_1.beforeEach(testing_1.fakeAsync(function () {
                                otherNewValue = 'other new value';
                                getItemsSpy.reset();
                                formControl.updateValue(otherNewValue, { emitEvent: true });
                                testing_1.tick(debounceTime);
                            }));
                            testing_1.it('should call getItems correctly', function () {
                                chai_1.expect(getItemsSpy.callCount).to.be.equal(1);
                                chai_1.expect(getItemsSpy.args[0]).to.deep.equal([otherNewValue]);
                            });
                            testing_1.it('results should be null', function () {
                                chai_1.expect(component.results).to.be.null;
                            });
                            testing_1.it('isLoadingResults to be true', function () {
                                chai_1.expect(component.isLoadingResults).to.be.true;
                            });
                        });
                        testing_1.describe('to same value', function () {
                            testing_1.beforeEach(testing_1.fakeAsync(function () {
                                getItemsSpy.reset();
                                formControl.updateValue(newValue, { emitEvent: true });
                                testing_1.tick(debounceTime);
                            }));
                            testing_1.it('should not call getItems', function () {
                                chai_1.expect(getItemsSpy.callCount).to.be.equal(0);
                            });
                            testing_1.it('results should be null', function () {
                                chai_1.expect(component.results).to.be.null;
                            });
                            testing_1.it('isLoadingResults to be false', function () {
                                chai_1.expect(component.isLoadingResults).to.be.false;
                            });
                        });
                    });
                });
                testing_1.describe('getting items succeeds', function () {
                    var items;
                    testing_1.beforeEach(function () {
                        items = [1, 2, 3, 4];
                        getItemsResult.next(items);
                        getItemsResult.complete();
                    });
                    testing_1.it('results should be correct', function () {
                        chai_1.expect(component.results).to.be.equal(items);
                    });
                    testing_1.it('isLoadingResults to be false', function () {
                        chai_1.expect(component.isLoadingResults).to.be.false;
                    });
                    testing_1.describe('value changes again', function () {
                        testing_1.describe('to different value', function () {
                            var otherNewValue;
                            testing_1.beforeEach(testing_1.fakeAsync(function () {
                                otherNewValue = 'other new value';
                                getItemsSpy.reset();
                                formControl.updateValue(otherNewValue, { emitEvent: true });
                                testing_1.tick(debounceTime);
                            }));
                            testing_1.it('should call getItems correctly', function () {
                                chai_1.expect(getItemsSpy.callCount).to.be.equal(1);
                                chai_1.expect(getItemsSpy.args[0]).to.deep.equal([otherNewValue]);
                            });
                            testing_1.it('results should be correct', function () {
                                chai_1.expect(component.results).to.be.equal(items);
                            });
                            testing_1.it('isLoadingResults to be true', function () {
                                chai_1.expect(component.isLoadingResults).to.be.true;
                            });
                        });
                        testing_1.describe('to same value', function () {
                            testing_1.beforeEach(testing_1.fakeAsync(function () {
                                getItemsSpy.reset();
                                formControl.updateValue(newValue, { emitEvent: true });
                                testing_1.tick(debounceTime);
                            }));
                            testing_1.it('should not call getItems', function () {
                                chai_1.expect(getItemsSpy.callCount).to.be.equal(0);
                            });
                            testing_1.it('results should be correct', function () {
                                chai_1.expect(component.results).to.be.equal(items);
                            });
                            testing_1.it('isLoadingResults to be false', function () {
                                chai_1.expect(component.isLoadingResults).to.be.false;
                            });
                        });
                        testing_1.describe('to empty', function () {
                            testing_1.beforeEach(testing_1.fakeAsync(function () {
                                getItemsSpy.reset();
                                formControl.updateValue('', { emitEvent: true });
                                testing_1.tick(debounceTime);
                            }));
                            testing_1.it('should not call getItems', function () {
                                chai_1.expect(getItemsSpy.callCount).to.be.equal(0);
                            });
                            testing_1.it('results should be null', function () {
                                chai_1.expect(component.results).to.be.null;
                            });
                            testing_1.it('isLoadingResults to be false', function () {
                                chai_1.expect(component.isLoadingResults).to.be.false;
                            });
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=sourcedAutocomplete.component.test.js.map