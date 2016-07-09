import { FormControl, FormGroup } from '@angular/forms';

export class FormFiller {
  public static fillFormControl(formGroup: FormGroup, control: FormControl, value: any): void {
    control.updateValue(value);
    control.updateValueAndValidity();
    formGroup.updateValueAndValidity();
  }
}
