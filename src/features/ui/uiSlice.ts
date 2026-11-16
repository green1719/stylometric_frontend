import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface UiState {
  isInteractionBlocked: boolean
}

const initialState: UiState = {
  isInteractionBlocked: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInteractionBlocked(state, action: PayloadAction<boolean>) {
      state.isInteractionBlocked = action.payload
    },
  },
})

export const { setInteractionBlocked } = uiSlice.actions
export default uiSlice.reducer
