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
var circularLoading_component_1 = require("../../../common/components/circularLoading/circularLoading.component");
var loadingComponentBase_1 = require("../../../common/components/loadingComponentBase/loadingComponentBase");
var teamService_1 = require("../../../common/services/teamService");
var core_1 = require('@angular/core');
var TeamUsersListComponent = (function (_super) {
    __extends(TeamUsersListComponent, _super);
    function TeamUsersListComponent(teamService) {
        _super.call(this);
        this.teamService = teamService;
        this.teamMembersChanged = new core_1.EventEmitter();
    }
    TeamUsersListComponent.prototype.setIsLoading = function (value) {
        this.isLoadingTeamMembers = value;
    };
    TeamUsersListComponent.prototype.setLoadingError = function (error) {
        this.loadingTeamMembersError = error;
    };
    TeamUsersListComponent.prototype.setLoadingResult = function (result) {
        this.teamMembers = result;
        if (result) {
            this.teamMembersChanged.emit(result);
        }
    };
    TeamUsersListComponent.prototype.get = function () {
        return this.teamService.getTeamMembers(this.teamDetails.id);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TeamUsersListComponent.prototype, "teamDetails", void 0);
    __decorate([
        core_1.Output('teamMembers'), 
        __metadata('design:type', core_1.EventEmitter)
    ], TeamUsersListComponent.prototype, "teamMembersChanged", void 0);
    TeamUsersListComponent = __decorate([
        core_1.Component({
            selector: 'team-users-list',
            template: require('./teamUsersList.component.html'),
            styles: [require('./_teamUsersList.component.scss')],
            directives: [circularLoading_component_1.CircularLoadingComponent]
        }), 
        __metadata('design:paramtypes', [teamService_1.TeamService])
    ], TeamUsersListComponent);
    return TeamUsersListComponent;
}(loadingComponentBase_1.LoadingComponentBase));
exports.TeamUsersListComponent = TeamUsersListComponent;
//# sourceMappingURL=teamUsersList.component.js.map