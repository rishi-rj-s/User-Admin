import { createAction, props } from "@ngrx/store";

export const loginSuccess = createAction('[Profile Component] Login Success',
     props<{ user: { id: string; email: string; name: string } }>()
);

export const logout = createAction('[User Component] Logout');