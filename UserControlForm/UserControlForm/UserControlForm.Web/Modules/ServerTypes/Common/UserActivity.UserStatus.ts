import { Decorators } from "@serenity-is/corelib";

export enum UserStatus {
    Online = 0,
    Away = 1,
    Busy = 2,
    Offline = 3
}
Decorators.registerEnumType(UserStatus, 'UserControlForm.Common.UserActivity.UserStatus', 'UserControlForm.Common.UserActivity.UserActivityTracker/UserStatus');