import { fieldsProxy } from "@serenity-is/corelib";

export interface MovieRow {
    Id?: number;
    Name?: string;
    Type?: number;
    Description?: string;
}

export abstract class MovieRow {
    static readonly idProperty = 'Id';
    static readonly nameProperty = 'Name';
    static readonly localTextPrefix = 'Integration.Movie';
    static readonly deletePermission = 'Administration:General';
    static readonly insertPermission = 'Administration:General';
    static readonly readPermission = 'Administration:General';
    static readonly updatePermission = 'Administration:General';

    static readonly Fields = fieldsProxy<MovieRow>();
}