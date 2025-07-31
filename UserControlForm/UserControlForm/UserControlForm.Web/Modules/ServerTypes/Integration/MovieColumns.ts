import { ColumnsBase, fieldsProxy } from "@serenity-is/corelib";
import { Column } from "@serenity-is/sleekgrid";
import { MovieRow } from "./MovieRow";

export interface MovieColumns {
    Id: Column<MovieRow>;
    Name: Column<MovieRow>;
    Type: Column<MovieRow>;
    Description: Column<MovieRow>;
}

export class MovieColumns extends ColumnsBase<MovieRow> {
    static readonly columnsKey = 'Integration.Movie';
    static readonly Fields = fieldsProxy<MovieColumns>();
}