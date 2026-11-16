import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import filtersReducer from '../features/filters/filtersSlice'
import samplesReducer from '../features/samples/samplesSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    filters: filtersReducer,
    samples: samplesReducer,
    ui: uiReducer,
  },
  // Redux Toolkit adds redux-thunk here by default; it runs the thematic
  // createAsyncThunk actions in features/samples/samplesThunks.ts.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
