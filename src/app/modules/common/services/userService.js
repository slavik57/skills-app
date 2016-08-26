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
var httpServiceBase_1 = require("./base/httpServiceBase");
var statusCode_1 = require("../../../../common/statusCode");
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var _ = require('lodash');
var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(http) {
        _super.call(this, http);
        this._loginUrl = '/api/login';
        this._registerUrl = '/api/register';
        this._usersControllerUrl = '/api/users/';
        this._userControllerUrl = '/api/user/';
        this._userExistsUrlSuffix = '/exists';
        this._changePasswordUrlSuffix = '/password';
        this._userPermissionsUrlSuffix = '/permissions';
        this._userPermissionsModificationRulesUrlSuffix = 'permissions-modification-rules';
        this._canUserUpdatePasswordSuffix = '/can-update-password';
        this._canUserModifyTeamsListSuffix = 'can-modify-teams-list';
        this._filteredUsersPrefix = 'filtered/';
        this._teamModificationRulesSuffix = 'team-modification-permissions/';
    }
    UserService.prototype.signinUser = function (username, password) {
        var _this = this;
        var body = JSON.stringify({
            username: username,
            password: password
        });
        return this._post(this._loginUrl, body)
            .map(function (response) { return _this._getRedirectionLocation(response); })
            .catch(function (error) { return _this._failSignin(error); });
    };
    UserService.prototype.isUsernameExists = function (username) {
        var _this = this;
        var url = this._usersControllerUrl + username + this._userExistsUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractPropertyFromBody(response, 'userExists'); })
            .catch(function (error) { return _this._failWithGenericError(error); });
    };
    UserService.prototype.canUserUpdatePassword = function (userIdToUpdatePasswordOf) {
        var _this = this;
        var url = this._userControllerUrl + userIdToUpdatePasswordOf + this._canUserUpdatePasswordSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractPropertyFromBody(response, 'canUpdatePassword'); })
            .catch(function (error) { return _this._failWithGenericError(error); });
    };
    UserService.prototype.canUserModifyTeams = function () {
        var _this = this;
        var url = this._userControllerUrl + this._canUserModifyTeamsListSuffix;
        return this._get(url)
            .map(function (response) { return _this._extractPropertyFromBody(response, 'canModifyTeamsList'); })
            .catch(function (error) { return _this._failWithGenericError(error); });
    };
    UserService.prototype.registerUser = function (username, password, email, firstName, lastName) {
        var _this = this;
        var body = JSON.stringify({
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        return this._post(this._registerUrl, body)
            .map(function (response) { return _this._getRedirectionLocation(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.getUserDetails = function () {
        var _this = this;
        return this._get(this._userControllerUrl)
            .map(function (response) { return _this._extractUserDetails(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    UserService.prototype.getUsersDetails = function () {
        var _this = this;
        return this._get(this._usersControllerUrl)
            .map(function (response) { return _this._extractUsersDetails(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    UserService.prototype.getUsersDetailsByPartialUsername = function (username, maxNumberOfUsers) {
        var _this = this;
        if (maxNumberOfUsers === void 0) { maxNumberOfUsers = null; }
        var url = this._usersControllerUrl + this._filteredUsersPrefix + username;
        if (maxNumberOfUsers != null) {
            url += this._limitedQueryParameter + maxNumberOfUsers;
        }
        return this._get(url)
            .map(function (response) { return _this._extractUsersDetails(response); })
            .catch(function (error) { return _this._throwOnUnauthorizedOrGenericError(error); });
    };
    UserService.prototype.updateUserDetails = function (userId, username, email, firstName, lastName) {
        var _this = this;
        var url = this._userControllerUrl + userId;
        var body = JSON.stringify({
            username: username,
            email: email,
            firstName: firstName,
            lastName: lastName
        });
        return this._put(url, body)
            .map(function (response) { return _this._throwErrorIfStatusIsNotOk(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.updateUserPassword = function (userId, currentPassword, newPassword) {
        var _this = this;
        var url = this._userControllerUrl + userId + this._changePasswordUrlSuffix;
        var body = JSON.stringify({
            password: currentPassword,
            newPassword: newPassword
        });
        return this._put(url, body)
            .map(function (response) { return _this._throwErrorIfStatusIsNotOk(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.updateUserPermissions = function (userId, userPermissionsToAdd, userPermissionsToRemove) {
        var _this = this;
        var url = this._usersControllerUrl + userId + this._userPermissionsUrlSuffix;
        var body = JSON.stringify({
            permissionsToAdd: _.map(userPermissionsToAdd, function (_) { return _.value; }),
            permissionsToRemove: _.map(userPermissionsToRemove, function (_) { return _.value; })
        });
        return this._put(url, body)
            .map(function (response) { return _this._throwErrorIfStatusIsNotOk(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.getUserPermissions = function (userId) {
        var _this = this;
        var url = this._usersControllerUrl + userId + this._userPermissionsUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._parseBodyAsArray(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.getUserPermissionsModificationRules = function () {
        var _this = this;
        var url = this._userControllerUrl + this._userPermissionsModificationRulesUrlSuffix;
        return this._get(url)
            .map(function (response) { return _this._parseBodyAsArray(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype.getTeamModificationPermissions = function (teamId) {
        var _this = this;
        var url = "" + this._userControllerUrl + this._teamModificationRulesSuffix + teamId;
        return this._get(url)
            .map(function (response) { return _this._extractTeamModificationPermissions(response); })
            .catch(function (error) { return _this._handleServerError(error); });
    };
    UserService.prototype._getRedirectionLocation = function (response) {
        this._throwErrorIfStatusIsNotOk(response);
        var redirectPath = response.headers.get('redirect-path');
        if (!redirectPath) {
            throw 'Unexpected result';
        }
        return redirectPath;
    };
    UserService.prototype._failSignin = function (error) {
        console.log(error);
        if (error.status === statusCode_1.StatusCode.UNAUTHORIZED) {
            return Observable_1.Observable.throw('Invalid credentials');
        }
        else {
            return Observable_1.Observable.throw(UserService.GENERIC_ERROR);
        }
    };
    UserService.prototype._extractUserDetails = function (response) {
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !this._isResponseHasAllUserDetails(result)) {
            throw 'Unexpected result';
        }
        return result;
    };
    UserService.prototype._extractUsersDetails = function (response) {
        var _this = this;
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !(result instanceof Array)) {
            throw 'Unexpected result';
        }
        var usernameDetails = _.map(result, function (_serverUsernameDetails) {
            _this._validateServerUsernameDetails(_serverUsernameDetails);
            return {
                id: _serverUsernameDetails.id,
                username: _serverUsernameDetails.username
            };
        });
        return usernameDetails;
    };
    UserService.prototype._isResponseHasAllUserDetails = function (response) {
        return ('id' in response) &&
            ('username' in response) &&
            ('firstName' in response) &&
            ('lastName' in response);
    };
    UserService.prototype._validateServerUsernameDetails = function (serverUsernameDetails) {
        if (serverUsernameDetails.id === null || serverUsernameDetails.id === undefined) {
            throw 'User id is missing';
        }
        if (!serverUsernameDetails.username) {
            throw 'Username is missing';
        }
    };
    UserService.prototype._extractTeamModificationPermissions = function (response) {
        this._throwErrorIfStatusIsNotOk(response);
        var result = response.json();
        if (!result || !this._isResponseHasAllTeamModificationPermissions(result)) {
            throw 'Unexpected result';
        }
        return result;
    };
    UserService.prototype._isResponseHasAllTeamModificationPermissions = function (response) {
        return ('canModifyTeamName' in response) &&
            ('canModifyTeamAdmins' in response) &&
            ('canModifyTeamUsers' in response);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}(httpServiceBase_1.HttpServiceBase));
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map