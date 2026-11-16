import { createSlice } from '@reduxjs/toolkit'
import { TEXT_SAMPLES_MOCK } from '../../data/samples.mock'
import type { TextSample } from '../../types/sample'
import { createStylometryDraft, deleteStylometrySample, loadStylometryDraft, loadStylometrySamples, publishStylometryDraft, toggleStylometryLike } from './samplesThunks'

export type SamplesSource = 'mock' | 'api'
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface SamplesState {
  items: TextSample[]
  draft: TextSample | null
  source: SamplesSource
  status: RequestStatus
  error: string | null
}

const initialState: SamplesState = {
  items: TEXT_SAMPLES_MOCK,
  draft: null,
  source: 'mock',
  status: 'idle',
  error: null,
}

const samplesSlice = createSlice({
  name: 'samples',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStylometrySamples.pending, (state) => {
      state.status = 'loading'
      state.error = null
      })
      .addCase(loadStylometrySamples.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.source = action.payload.source
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(loadStylometrySamples.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось загрузить образцы.'
      })
      .addCase(loadStylometryDraft.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadStylometryDraft.fulfilled, (state, action) => {
        state.draft = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(loadStylometryDraft.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось получить черновик.'
      })
      .addCase(createStylometryDraft.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createStylometryDraft.fulfilled, (state, action) => {
        state.draft = action.payload
        state.status = 'succeeded'
      })
      .addCase(createStylometryDraft.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось сохранить черновик.'
      })
      .addCase(publishStylometryDraft.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(publishStylometryDraft.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)]
        state.draft = null
        state.source = 'api'
        state.status = 'succeeded'
      })
      .addCase(publishStylometryDraft.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Не удалось опубликовать черновик.'
      })
      .addCase(toggleStylometryLike.fulfilled, (state, action) => {
        state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item)
        state.status = 'succeeded'
      })
      .addCase(toggleStylometryLike.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось изменить отметку.'
      })
      .addCase(deleteStylometrySample.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload)
        state.status = 'succeeded'
      })
      .addCase(deleteStylometrySample.rejected, (state, action) => {
        state.error = action.payload ?? 'Не удалось удалить образец.'
      })
  },
})

export default samplesSlice.reducer
