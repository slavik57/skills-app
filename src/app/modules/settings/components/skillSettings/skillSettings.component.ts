import {SkillDependenciesComponent} from "../../../skill/components/skillDependencies/skillDependencies.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {SkillPrerequisitesComponent} from "../../../skill/components/skillPrerequisites/skillPrerequisites.component";
import {ISkillModificatioPermissions} from "../../../common/interfaces/iSkillModificationPermissions";
import {UserService} from "../../../common/services/userService";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'skill-settings',
  template: require('./skillSettings.component.html'),
  styles: [require('./_skillSettings.component.scss')],
  directives: [
    SkillPrerequisitesComponent,
    SkillDependenciesComponent,
    CircularLoadingComponent
  ]
})
export class SkillSettingsComponent extends LoadingComponentBase<ISkillModificatioPermissions> {
  @Input() public skillDetails: ISkillNameDetails;
  @ViewChild('availableSkillSettings') availableSkillSettings: ElementRef;
  public isLoadingPermissions: boolean;
  public permissions: ISkillModificatioPermissions;
  public loadingPermissionsError: any;

  constructor(private userService: UserService) {
    super();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingPermissions = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingPermissionsError = error;
  }

  protected setLoadingResult(result: ISkillModificatioPermissions): void {
    this.permissions = result;

    if (result) {
      setTimeout(() => {
        $(this.availableSkillSettings.nativeElement).tabs();
      }, 0);
    }
  }

  protected get(): Observable<ISkillModificatioPermissions> {
    return this.userService.getSkillModificationPermissions(this.skillDetails.id);
  }
}
