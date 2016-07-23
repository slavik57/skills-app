import {IUserPermission} from "../interfaces/iUserPermission";
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'globalPermissionsName' })
export class GlobalPermissionsNamePipe implements PipeTransform {
  public transform(value: IUserPermission): string {
    return value.name + ' - ' + value.description;
  }
}
