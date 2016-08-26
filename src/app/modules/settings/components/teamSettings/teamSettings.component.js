"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var userService_1 = require("../../../common/services/userService");
var teamUsers_component_1 = require("../../../team/components/teamUsers/teamUsers.component");
var editTeamDetails_component_1 = require("../editTeamDetails/editTeamDetails.component");
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var core_1 = require('@angular/core');
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var TeamSettingsComponent = (function (_super) {
    __extends(TeamSettingsComponent, _super);
    function TeamSettingsComponent(userService) {
        _super.call(this);
        this.userService = userService;
    }
    TeamSettingsComponent.prototype.setIsLoading = function (value) {
        this.isLoadingPermissions = value;
    };
    TeamSettingsComponent.prototype.setLoadingError = function (error) {
        this.loadingPermissionsError = error;
    };
    TeamSettingsComponent.prototype.setLoadingResult = function (result) {
        var _this = this;
        this.permissions = result;
        if (result) {
            setTimeout(function () {
                $(_this.availableTeamSettings.nativeElement).tabs();
            }, 0);
        }
    };
    TeamSettingsComponent.prototype.get = function () {
        return this.userService.getTeamModificationPermissions(this.teamDetails.id);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TeamSettingsComponent.prototype, "teamDetails", void 0);
    __decorate([
        core_1.ViewChild('availableTeamSettings'), 
        __metadata('design:type', core_1.ElementRef)
    ], TeamSettingsComponent.prototype, "availableTeamSettings", void 0);
    TeamSettingsComponent = __decorate([
        core_1.Component({
            selector: 'team-settings',
            template: require('./teamSettings.component.html'),
            styles: [require('./_teamSettings.component.scss')],
            directives: [
                editTeamDetails_component_1.EditTeamDetailsComponent,
                teamUsers_component_1.TeamUsersComponent,
                circularLoading_component_1.CircularLoadingComponent
            ],
        }), 
        __metadata('design:paramtypes', [userService_1.UserService])
    ], TeamSettingsComponent);
    return TeamSettingsComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.TeamSettingsComponent = TeamSettingsComponent;
//# sourceMappingURL=teamSettings.component.js.map