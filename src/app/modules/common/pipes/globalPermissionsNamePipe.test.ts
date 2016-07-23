import {IUserPermission} from "../interfaces/iUserPermission";
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

    it('should return correct string', () => {
      var userPermission: IUserPermission = {
        value: 0,
        name: 'name',
        description: 'description'
      };

      expect(pipe.transform(userPermission)).to.be.equal('name - description');
    });

  });

});
