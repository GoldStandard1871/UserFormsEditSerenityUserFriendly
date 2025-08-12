import { PageVisit } from "./UserActivity.PageVisit";
import { UserStatus } from "./UserActivity.UserStatus";

export interface UserActivityInfo {
    UserId?: number;
    Username?: string;
    DisplayName?: string;
    IsOnline?: boolean;
    LastActivityTime?: string;
    LoginTime?: string;
    IpAddress?: string;
    Location?: string;
    UserAgent?: string;
    ConnectionId?: string;
    CurrentPage?: string;
    CurrentAction?: string;
    Status?: UserStatus;
    PageHistory?: PageVisit[];
}