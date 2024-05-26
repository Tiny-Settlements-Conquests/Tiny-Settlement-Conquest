import { createAction, props } from '@ngneat/effects';
import { HistoryAction } from '../models/action.model';

export class ActionHistoryActions {
    public static addAction = createAction('[actionHistory Store] add action', props<HistoryAction>());
}