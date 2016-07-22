"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var loadingComponentBase_1 = require("./loadingComponentBase");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var ConcreteComponent = (function (_super) {
    __extends(ConcreteComponent, _super);
    function ConcreteComponent() {
        _super.apply(this, arguments);
    }
    ConcreteComponent.prototype.setIsLoading = function (value) {
    };
    ConcreteComponent.prototype.setLoadingError = function (error) {
    };
    ConcreteComponent.prototype.setLoadingResult = function (result) {
    };
    ConcreteComponent.prototype.get = function () {
        return null;
    };
    return ConcreteComponent;
}(loadingComponentBase_1.LoadingComponentBase));
testing_1.describe('UsersSettingsComponent', function () {
    var component;
    var setIsLoadingSpy;
    var setLoadingErrorSpy;
    var setLoadingResultSpy;
    var getSpy;
    var getResult;
    testing_1.beforeEach(function () {
        component = new ConcreteComponent();
        setIsLoadingSpy = sinon_1.spy(component, 'setIsLoading');
        setLoadingErrorSpy = sinon_1.spy(component, 'setLoadingError');
        setLoadingResultSpy = sinon_1.spy(component, 'setLoadingResult');
        getSpy = sinon_1.stub(component, 'get', function () {
            getResult = new Subject_1.Subject();
            return getResult;
        });
        component.ngOnInit();
    });
    testing_1.it('setIsLoading should be set called with true', function () {
        chai_1.expect(setIsLoadingSpy.callCount).to.be.equal(1);
        chai_1.expect(setIsLoadingSpy.args[0]).to.be.deep.equal([true]);
    });
    testing_1.it('setLoadingError should be called with null', function () {
        chai_1.expect(setLoadingErrorSpy.callCount).to.be.equal(1);
        chai_1.expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([null]);
    });
    testing_1.it('should call get()', function () {
        chai_1.expect(getSpy.callCount).to.be.equal(1);
    });
    testing_1.it('setLoadingResult should be called with null', function () {
        chai_1.expect(setLoadingResultSpy.callCount).to.be.equal(1);
        chai_1.expect(setLoadingResultSpy.args[0]).to.be.deep.equal([null]);
    });
    testing_1.describe('getting fails', function () {
        var error;
        testing_1.beforeEach(function () {
            setIsLoadingSpy.reset();
            setLoadingErrorSpy.reset();
            setLoadingResultSpy.reset();
            getSpy.reset();
            error = 'some error';
            getResult.error(error);
        });
        testing_1.it('setIsLoading should be called with false', function () {
            chai_1.expect(setIsLoadingSpy.callCount).to.be.equal(1);
            chai_1.expect(setIsLoadingSpy.args[0]).to.be.deep.equal([false]);
        });
        testing_1.it('setLoadingError should be called with the error', function () {
            chai_1.expect(setLoadingErrorSpy.callCount).to.be.equal(1);
            chai_1.expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([error]);
        });
        testing_1.it('setLoadingResult should not be called', function () {
            chai_1.expect(setLoadingResultSpy.callCount).to.be.equal(0);
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                setIsLoadingSpy.reset();
                setLoadingErrorSpy.reset();
                setLoadingResultSpy.reset();
                getSpy.reset();
                component.reload();
            });
            testing_1.it('setIsLoading should be set called with true', function () {
                chai_1.expect(setIsLoadingSpy.callCount).to.be.equal(1);
                chai_1.expect(setIsLoadingSpy.args[0]).to.be.deep.equal([true]);
            });
            testing_1.it('setLoadingError should be called with null', function () {
                chai_1.expect(setLoadingErrorSpy.callCount).to.be.equal(1);
                chai_1.expect(setLoadingErrorSpy.args[0]).to.be.deep.equal([null]);
            });
            testing_1.it('should call get()', function () {
                chai_1.expect(getSpy.callCount).to.be.equal(1);
            });
            testing_1.it('setLoadingResult should be called with null', function () {
                chai_1.expect(setLoadingResultSpy.callCount).to.be.equal(1);
                chai_1.expect(setLoadingResultSpy.args[0]).to.be.deep.equal([null]);
            });
        });
    });
    testing_1.describe('getting user permissions succeeds', function () {
        var result;
        testing_1.beforeEach(function () {
            setIsLoadingSpy.reset();
            setLoadingErrorSpy.reset();
            setLoadingResultSpy.reset();
            getSpy.reset();
            result = 'some result';
            getResult.next(result);
            getResult.complete();
        });
        testing_1.it('setIsLoading should be set called with false', function () {
            chai_1.expect(setIsLoadingSpy.callCount).to.be.equal(1);
            chai_1.expect(setIsLoadingSpy.args[0]).to.be.deep.equal([false]);
        });
        testing_1.it('setLoadingError should not be called', function () {
            chai_1.expect(setLoadingErrorSpy.callCount).to.be.equal(0);
        });
        testing_1.it('setLoadingResult should be called with the result', function () {
            chai_1.expect(setLoadingResultSpy.callCount).to.be.equal(1);
            chai_1.expect(setLoadingResultSpy.args[0]).to.be.deep.equal([result]);
        });
    });
});
//# sourceMappingURL=loadingComponentBase.test.js.map