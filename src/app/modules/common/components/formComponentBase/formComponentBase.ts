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

  public isFieldHasError(field: any, errorName: string, checkTouched: boolean = true): boolean {
    return this.isFieldInvalid(field, checkTouched) &&
      !!field.errors &&
      errorName in field.errors;
  }
}
