import { Decorators, EntityGrid, SettingStorage } from '@serenity-is/corelib';
import { UserPreferenceStorage } from '@serenity-is/extensions';
import { MovieColumns, MovieRow, MovieService } from '../../ServerTypes/Integration';
import { MovieDialog } from './MovieDialog';

@Decorators.registerClass('UserControlForm.Integration.MovieGrid')
export class MovieGrid extends EntityGrid<MovieRow> {
    protected getColumnsKey() { return MovieColumns.columnsKey; }
    protected getDialogType() { return MovieDialog; }
    protected getRowDefinition() { return MovieRow; }
    protected getService() { return MovieService.baseUrl; }
    protected getPersistanceStorage(): SettingStorage {
        return new UserPreferenceStorage();
    }
}