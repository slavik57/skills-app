import { AbstractControl } from '@angular/forms';

export class FormComponentBase {
  public isFieldInvalid(field: any, checkTouched: boolean = true): boolean {
    return this.wasFieldEdited(field, checkTouched) && !field.valid;
  }

  public wasFieldEdited(field: any, checkTouched: boolean = true): boolean {
    if (field.pristine) {
      return false;
    }

    if (checkTouched) {
      return field.touched;
    } else {
      return true;
    }
  }

  public isFieldHasError(field: any, errorName: string = null, checkTouched: boolean = true): boolean {
    if (!this.isFieldInvalid(field, checkTouched) || !field.errors) {
      return false;
    }

    if (errorName === null) {
      return true;
    }

    return errorName in field.errors;
  }

  protected resetControlAsUntouchedAndNotDirty(control: AbstractControl): void {
    // NOTE: Workaround untill angular team resolves: https://github.com/angular/angular/issues/4933
    control['_touched'] = false;
    control['_pristine'] = true;
  }
}
