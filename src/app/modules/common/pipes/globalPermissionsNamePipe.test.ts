import {EnumUtils} from "../enums/enumUtils";
import {GlobalPermission} from "../enums/globalPermissions";
import {GlobalPermissionsNamePipe} from "./globalPermissionsNamePipe";
import {
  it,
  describe,
  beforeEach,
  afterEach,
} from '@angular/core/testing';
import {expect} from 'chai';

describe('GlobalPermissionsNamePipe', () => {

  var pipe: GlobalPermissionsNamePipe;

  beforeEach(() => {
    pipe = new GlobalPermissionsNamePipe();
  });

  describe('transform', () => {

    it('transforming all permissions should have a known value', () => {
      var permissionStrings: string[] = EnumUtils.getNames(GlobalPermission);

      permissionStrings.forEach((_permissionString) => {
        var message = 'The permission ' + _permissionString + ' has no transformation';
        expect(pipe.transform(_permissionString), message).to.not.contain('Unknown permission');
      });
    });

  });

});
