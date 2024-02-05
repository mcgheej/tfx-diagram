import { createAction } from '@ngrx/store';

export const closeStart = createAction('[Save/Close Machine] Close Start');

export const saveStart = createAction('[Save/Close] Start Save');

export const saveClick = createAction('[Save/Close] Save Click');

export const discardClick = createAction('[Save/Close] Discard Click');

export const cancelClick = createAction('[Save/Close] Cancel Click');
