import { createReducer, on } from "@ngrx/store";
import { loginSuccess, logout } from "./profile.actions";

export interface ProfileState{
     id:string,
     name:string,
     email:string,
}

export const initialProfileState : ProfileState ={
     id:'',
     name:'',
     email:'',
}

export const profileReducer = createReducer(
     initialProfileState,
     on(loginSuccess, (state, { user }) => ({
       ...state,
       id: user.id,
       email: user.email,
       name: user.name,
     })),
     on(logout, () => initialProfileState)
   );