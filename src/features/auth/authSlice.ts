import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthStatus = 'guest' | 'authenticated'

export interface AuthState {
  status: AuthStatus
  accessToken: string | null
  userName: string | null
}

const initialState: AuthState = {
  status: 'guest',
  accessToken: null,
  userName: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded(state, action: PayloadAction<{ accessToken: string; userName: string }>) {
      state.status = 'authenticated'
      state.accessToken = action.payload.accessToken
      state.userName = action.payload.userName
    },
    logoutSucceeded() {
      return initialState
    },
  },
})

export const { loginSucceeded, logoutSucceeded } = authSlice.actions
export default authSlice.reducer
