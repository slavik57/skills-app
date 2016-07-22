import {EnumUtils} from "./enumUtils";
import {
  it,
  describe,
} from '@angular/core/testing';
import {expect} from 'chai';

enum TestEnum {
  A,
  B,
  C
}

describe('EnumUtils', () => {

  it('getNames should return correct values', () => {
    expect(EnumUtils.getNames(TestEnum)).to.deep.equal(['A', 'B', 'C']);
  });

  it('getValues should return correct values', () => {
    expect(EnumUtils.getValues(TestEnum)).to.deep.equal([0, 1, 2]);
  });

  it('getNamesAndValues should return correct values', () => {
    var expectedResult = [
      { name: 'A', value: 0 },
      { name: 'B', value: 1 },
      { name: 'C', value: 2 }
    ];

    expect(EnumUtils.getNamesAndValues(TestEnum)).to.deep.equal(expectedResult);
  });

});
