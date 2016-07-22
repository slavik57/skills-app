import {GlobalPermission} from "../enums/globalPermissions";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'globalPermissionsName' })
export class GlobalPermissionsNamePipe implements PipeTransform {
  public transform(value: string): string {
    var permission: GlobalPermission = GlobalPermission[value];

    switch (permission) {
      case GlobalPermission.ADMIN:
        return 'Admin - Can do anything';
      case GlobalPermission.TEAMS_LIST_ADMIN:
        return 'Teams list admin - Can create/destroy teams';
      case GlobalPermission.SKILLS_LIST_ADMIN:
        return 'Skills list admin - Can create/destroy skills';
      case GlobalPermission.READER:
        return 'Reader - Registered user';
      case GlobalPermission.GUEST:
        return 'Guest - Unregistered user';
      default:
        return value + ' - Unknown permission';
    }
  }
}
