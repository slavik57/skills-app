"use strict";
var enumUtils_1 = require("./enumUtils");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
var TestEnum;
(function (TestEnum) {
    TestEnum[TestEnum["A"] = 0] = "A";
    TestEnum[TestEnum["B"] = 1] = "B";
    TestEnum[TestEnum["C"] = 2] = "C";
})(TestEnum || (TestEnum = {}));
testing_1.describe('EnumUtils', function () {
    testing_1.it('getNames should return correct values', function () {
        chai_1.expect(enumUtils_1.EnumUtils.getNames(TestEnum)).to.deep.equal(['A', 'B', 'C']);
    });
    testing_1.it('getValues should return correct values', function () {
        chai_1.expect(enumUtils_1.EnumUtils.getValues(TestEnum)).to.deep.equal([0, 1, 2]);
    });
    testing_1.it('getNamesAndValues should return correct values', function () {
        var expectedResult = [
            { name: 'A', value: 0 },
            { name: 'B', value: 1 },
            { name: 'C', value: 2 }
        ];
        chai_1.expect(enumUtils_1.EnumUtils.getNamesAndValues(TestEnum)).to.deep.equal(expectedResult);
    });
});
//# sourceMappingURL=enumUtils.test.js.map