"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var circularLoading_component_1 = require("../circularLoading/circularLoading.component");
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var Observable_1 = require('rxjs/Observable');
var SourcedAutocompleteComponent = (function () {
    function SourcedAutocompleteComponent() {
        this._initializeId();
    }
    SourcedAutocompleteComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._validateInputs();
        var debounceTime = this._getDebounceTime();
        this.isLoadingResults = false;
        this.results = null;
        this.formControl.valueChanges
            .debounceTime(debounceTime)
            .distinctUntilChanged()
            .switchMap(function (_searchText) {
            _this.isLoadingResults = true;
            return _this._getItemsSafe(_searchText);
        })
            .subscribe(function (_results) {
            _this.isLoadingResults = false;
            _this.results = _results;
        });
    };
    SourcedAutocompleteComponent.prototype._validateInputs = function () {
        if (!this.itemsSource) {
            throw 'items source is not supplied. Use itemsSource attribute.';
        }
        if (!this.formControl) {
            throw 'form control is not supplied. Use formControl attribute.';
        }
    };
    SourcedAutocompleteComponent.prototype._initializeId = function () {
        this.id =
            SourcedAutocompleteComponent.ID_PREFIX + SourcedAutocompleteComponent.INSTANCE_NUMBER;
        SourcedAutocompleteComponent.INSTANCE_NUMBER++;
    };
    SourcedAutocompleteComponent.prototype._getDebounceTime = function () {
        var debounceTime = Number(this.debounceTime);
        if (isNaN(debounceTime)) {
            debounceTime = 0;
        }
        return debounceTime;
    };
    SourcedAutocompleteComponent.prototype._getItemsSafe = function (searchText) {
        var _this = this;
        return new Observable_1.Observable(function (_subscriber) {
            if (!searchText) {
                _this._resolveItems(_subscriber, null);
                return;
            }
            _this.itemsSource.getItems(searchText)
                .subscribe(function (_items) {
                _this._resolveItems(_subscriber, _items);
            }, function (_error) {
                _this._resolveItems(_subscriber, null);
            });
        });
    };
    SourcedAutocompleteComponent.prototype._resolveItems = function (subscriber, items) {
        subscriber.next(items);
        subscriber.complete();
    };
    SourcedAutocompleteComponent.INSTANCE_NUMBER = 0;
    SourcedAutocompleteComponent.ID_PREFIX = 'sourced-autocomplete';
    __decorate([
        core_1.Input('autocompleteFormControl'), 
        __metadata('design:type', forms_1.FormControl)
    ], SourcedAutocompleteComponent.prototype, "formControl", void 0);
    __decorate([
        core_1.Input('labelText'), 
        __metadata('design:type', String)
    ], SourcedAutocompleteComponent.prototype, "labelText", void 0);
    __decorate([
        core_1.Input('debounceTime'), 
        __metadata('design:type', String)
    ], SourcedAutocompleteComponent.prototype, "debounceTime", void 0);
    __decorate([
        core_1.Input('itemsSource'), 
        __metadata('design:type', Object)
    ], SourcedAutocompleteComponent.prototype, "itemsSource", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef), 
        __metadata('design:type', core_1.TemplateRef)
    ], SourcedAutocompleteComponent.prototype, "template", void 0);
    SourcedAutocompleteComponent = __decorate([
        core_1.Component({
            selector: 'sourced-autocomplete',
            template: require('./sourcedAutocomplete.component.html'),
            styles: [require('./sourcedAutocomplete.component.scss')],
            directives: [forms_1.REACTIVE_FORM_DIRECTIVES, circularLoading_component_1.CircularLoadingComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], SourcedAutocompleteComponent);
    return SourcedAutocompleteComponent;
}());
exports.SourcedAutocompleteComponent = SourcedAutocompleteComponent;
//# sourceMappingURL=sourcedAutocomplete.component.js.map