import {FormComponentBase} from "./formComponentBase";
import {
  it,
  describe,
  beforeEach
} from '@angular/core/testing';
import {expect} from 'chai';
import {SinonSpy, spy} from 'sinon';

describe('FormComponentBase', () => {

  var field: any;
  var component: FormComponentBase;

  beforeEach(() => {
    field = {};

    component = new FormComponentBase();
  });

  describe('isFieldInvalid', () => {

    it('check touched should call wasFieldEdited with correct parameters', () => {
      var wasFieldEditedSpy: SinonSpy =
        spy(component, 'wasFieldEdited');

      var field = {};
      var checkTouched = true;

      component.isFieldInvalid(field, checkTouched);

      expect(wasFieldEditedSpy.callCount).to.be.equal(1);
      expect(wasFieldEditedSpy.args[0][0]).to.be.equal(field);
      expect(wasFieldEditedSpy.args[0][1]).to.be.equal(checkTouched);
    });

    it('do not check touched should call wasFieldEdited with correct parameters', () => {
      var wasFieldEditedSpy: SinonSpy =
        spy(component, 'wasFieldEdited');

      var field = {};
      var checkTouched = false;

      component.isFieldInvalid(field, checkTouched);

      expect(wasFieldEditedSpy.callCount).to.be.equal(1);
      expect(wasFieldEditedSpy.args[0][0]).to.be.equal(field);
      expect(wasFieldEditedSpy.args[0][1]).to.be.equal(checkTouched);
    });

    describe('field was edited', () => {

      beforeEach(() => {
        component.wasFieldEdited = () => true;
      });

      it('valid field should be valid', () => {
        field.valid = true;

        expect(component.isFieldInvalid(field)).to.be.false;
      });

      it('invalid field should be invalid', () => {
        field.valid = false;

        expect(component.isFieldInvalid(field)).to.be.true;
      });

    });

    describe('field was not edited', () => {

      beforeEach(() => {
        component.wasFieldEdited = () => false;
      });

      it('valid field should be valid', () => {
        field.valid = true;

        expect(component.isFieldInvalid(field)).to.be.false;
      });

      it('invalid field should be valid', () => {
        field.valid = false;

        expect(component.isFieldInvalid(field)).to.be.false;
      });

    });

  });

  describe('wasFieldEdited', () => {

    describe('pristine', () => {

      beforeEach(() => {
        field.pristine = true;
      });

      it('check for touched should be false', () => {
        expect(component.wasFieldEdited(field, true)).to.be.false;
      });

      it('do not check for touched should be false', () => {
        expect(component.wasFieldEdited(field, true)).to.be.false;
      });

    });

    describe('not pristine', () => {

      beforeEach(() => {
        field.pristine = false;
      });

      describe('touched', () => {

        beforeEach(() => {
          field.touched = true;
        });

        it('checking touched should be edited', () => {
          expect(component.wasFieldEdited(field, true)).to.be.true;
        });

        it('not checking touched should be edited', () => {
          expect(component.wasFieldEdited(field, false)).to.be.true;
        });

      });

      describe('not touched', () => {

        beforeEach(() => {
          field.touched = false;
        });

        it('checking touched should not be edited', () => {
          expect(component.wasFieldEdited(field, true)).to.be.false;
        });

        it('not checking touched should be edited', () => {
          expect(component.wasFieldEdited(field, false)).to.be.true;
        });
      });

    });

  });

  describe('isFieldHasError', () => {

    it('check touched should call isFieldInvalid with correct parameters', () => {
      var isFieldInvalidSpy: SinonSpy =
        spy(component, 'isFieldInvalid');

      var field = {};
      var errorName = 'errorName';
      var checkTouched = true;

      component.isFieldHasError(field, errorName, checkTouched);

      expect(isFieldInvalidSpy.callCount).to.be.equal(1);
      expect(isFieldInvalidSpy.args[0][0]).to.be.equal(field);
      expect(isFieldInvalidSpy.args[0][1]).to.be.equal(checkTouched);
    });

    it('do not check touched should call isFieldInvalid with correct parameters', () => {
      var isFieldInvalidSpy: SinonSpy =
        spy(component, 'wasFieldEdited');

      var field = {};
      var errorName = 'errorName';
      var checkTouched = false;

      component.isFieldHasError(field, errorName, checkTouched);

      expect(isFieldInvalidSpy.callCount).to.be.equal(1);
      expect(isFieldInvalidSpy.args[0][0]).to.be.equal(field);
      expect(isFieldInvalidSpy.args[0][1]).to.be.equal(checkTouched);
    });

    describe('valid field', () => {

      beforeEach(() => {
        component.isFieldInvalid = () => false;
      });

      it('should return false', () => {
        expect(component.isFieldHasError(field, '')).to.be.false;
      });

    });

    describe('invalid field', () => {

      beforeEach(() => {
        component.isFieldInvalid = () => true;
      });

      it('no errors should return false', () => {
        field.errors = null;

        expect(component.isFieldHasError(field, '')).to.be.false;
      });

      it('has errors but not the specified error should return false', () => {
        field.errors = {
          errorName: true
        };

        expect(component.isFieldHasError(field, 'otherErrorName')).to.be.false;
      });

      it('has specified error should return true', () => {
        field.errors = {
          errorName: true
        };

        expect(component.isFieldHasError(field, 'errorName')).to.be.true;
      });

    });

  });

});
