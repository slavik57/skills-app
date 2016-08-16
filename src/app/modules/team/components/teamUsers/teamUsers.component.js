"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var addTeamUser_component_1 = require("../addTeamUser/addTeamUser.component");
var teamUsersList_component_1 = require("../teamUsersList/teamUsersList.component");
var core_1 = require('@angular/core');
(function (TeamUsersState) {
    TeamUsersState[TeamUsersState["LIST_USERS"] = 0] = "LIST_USERS";
    TeamUsersState[TeamUsersState["ADD_TEAM_MEMBER"] = 1] = "ADD_TEAM_MEMBER";
})(exports.TeamUsersState || (exports.TeamUsersState = {}));
var TeamUsersState = exports.TeamUsersState;
var TeamUsersComponent = (function () {
    function TeamUsersComponent() {
    }
    TeamUsersComponent.prototype.ngOnInit = function () {
        this.TeamUsersState = TeamUsersState;
        this.state = TeamUsersState.LIST_USERS;
    };
    TeamUsersComponent.prototype.addTeamMember = function () {
        this.state = TeamUsersState.ADD_TEAM_MEMBER;
    };
    TeamUsersComponent.prototype.cancelAddingTeamMember = function () {
        this.state = TeamUsersState.LIST_USERS;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TeamUsersComponent.prototype, "teamDetails", void 0);
    TeamUsersComponent = __decorate([
        core_1.Component({
            selector: 'team-users',
            template: require('./teamUsers.component.html'),
            styles: [require('./_teamUsers.component.scss')],
            directives: [teamUsersList_component_1.TeamUsersListComponent, addTeamUser_component_1.AddTeamUserComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], TeamUsersComponent);
    return TeamUsersComponent;
}());
exports.TeamUsersComponent = TeamUsersComponent;
//# sourceMappingURL=teamUsers.component.js.map