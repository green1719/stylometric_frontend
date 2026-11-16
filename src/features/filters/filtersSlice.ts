import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
  query: string
  maxLength: number
  topic: string
}

const initialState: FiltersState = {
  query: '',
  maxLength: 30,
  topic: '',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
    },
    setMaxLength(state, action: PayloadAction<number>) {
      state.maxLength = action.payload
    },
    setTopic(state, action: PayloadAction<string>) {
      state.topic = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const { setQuery, setMaxLength, setTopic, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
