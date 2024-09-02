import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.reducer';

export const selectProfileState = createFeatureSelector<ProfileState>('profile');

export const selectProfileId = createSelector(
  selectProfileState,
  (state: ProfileState) => state.id
);

export const selectProfileName = createSelector(
  selectProfileState,
  (state: ProfileState) => state.name
);

export const selectProfileEmail = createSelector(
  selectProfileState,
  (state: ProfileState) => state.email
);
