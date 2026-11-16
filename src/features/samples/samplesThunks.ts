import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { TEXT_SAMPLES_MOCK } from '../../data/samples.mock'
import { setInteractionBlocked } from '../ui/uiSlice'
import { mapStylometrySample, stylometryApi } from '../../shared/api/stylometryApi'
import type { RootState } from '../../app/store'
import type { TextSample } from '../../types/sample'

export interface LoadStylometrySamplesResult {
  items: TextSample[]
  source: 'api' | 'mock'
}

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(error)) return error.response?.data?.error || fallback
  return error instanceof Error ? error.message : fallback
}

/**
 * Domain action for the generated Swagger Axios client. A guest can continue
 * working with the local collection when the API is unavailable; a signed-in
 * user receives the API failure instead of an unrelated mock response.
 */
export const loadStylometrySamples = createAsyncThunk<
  LoadStylometrySamplesResult,
  void,
  { state: RootState; rejectValue: string }
>(
  'stylometrySamples/loadList',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { auth, filters } = getState()
    const isAuthenticated = auth.status === 'authenticated'

    stylometryApi.setSecurityData(auth.accessToken)

    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesList(
        { stylometry_avg_len: filters.maxLength },
        { secure: isAuthenticated },
      )

      return {
        items: (response.data.items ?? []).map(mapStylometrySample),
        source: 'api',
      }
    } catch {
      if (!isAuthenticated) {
        return { items: TEXT_SAMPLES_MOCK, source: 'mock' }
      }

      return rejectWithValue('Не удалось получить образцы из веб-сервиса. Повторите запрос.')
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)

/**
 * The add page must restore the one server-side draft belonging to the
 * authenticated user. A missing draft is a valid API response, not an error.
 */
export const loadStylometryDraft = createAsyncThunk<
  TextSample | null,
  void,
  { state: RootState; rejectValue: string }
>(
  'stylometrySamples/loadDraft',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState()
    if (!auth.accessToken) return rejectWithValue('Для получения черновика требуется вход.')

    stylometryApi.setSecurityData(auth.accessToken)
    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesDraftList({ secure: true })
      return response.data.draft ? mapStylometrySample(response.data.draft) : null
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Не удалось получить черновик.'))
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)

export interface CreateStylometryDraftArgs {
  author: string
  description: string
  image: File
  video: File
}

export const createStylometryDraft = createAsyncThunk<TextSample, CreateStylometryDraftArgs, { state: RootState; rejectValue: string }>(
  'stylometrySamples/createDraft',
  async ({ author, description, image, video }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState()
    if (!auth.accessToken) return rejectWithValue('Для добавления образца требуется вход.')

    stylometryApi.setSecurityData(auth.accessToken)
    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesCreate(
        { text: `${author.trim()}\n${description.trim()}`, image, video },
        { secure: true },
      )
      if (!response.data.draft) return rejectWithValue('Сервер не вернул созданный черновик.')
      return mapStylometrySample(response.data.draft)
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Не удалось сохранить черновик.'))
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)

export const publishStylometryDraft = createAsyncThunk<TextSample, void, { state: RootState; rejectValue: string }>(
  'stylometrySamples/publishDraft',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState()
    if (!auth.accessToken) return rejectWithValue('Для публикации требуется вход.')

    stylometryApi.setSecurityData(auth.accessToken)
    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesDraftPublishUpdate({ secure: true })
      if (!response.data.sample) return rejectWithValue('Сервер не вернул опубликованный образец.')
      return mapStylometrySample(response.data.sample)
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Не удалось опубликовать черновик.'))
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)

export const toggleStylometryLike = createAsyncThunk<TextSample, { id: number; like: boolean }, { state: RootState; rejectValue: string }>(
  'stylometrySamples/toggleLike',
  async ({ id, like }, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState()
    if (!auth.accessToken) return rejectWithValue('Чтобы поставить лайк, выполните вход.')

    stylometryApi.setSecurityData(auth.accessToken)
    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesLikeCreate(id, { stylometry_like: like ? 1 : 0 }, { secure: true })
      if (!response.data.sample) return rejectWithValue('Сервер не вернул обновлённый образец.')
      return mapStylometrySample(response.data.sample)
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Не удалось изменить отметку.'))
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)

export const deleteStylometrySample = createAsyncThunk<number, number, { state: RootState; rejectValue: string }>(
  'stylometrySamples/delete',
  async (id, { dispatch, getState, rejectWithValue }) => {
    const { auth } = getState()
    if (!auth.accessToken) return rejectWithValue('Для удаления образца требуется вход.')

    stylometryApi.setSecurityData(auth.accessToken)
    dispatch(setInteractionBlocked(true))
    try {
      const response = await stylometryApi.api.samplesDelete(id, { secure: true })
      if (!response.data.deleted) return rejectWithValue('Сервер не подтвердил удаление образца.')
      return id
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Не удалось удалить образец.'))
    } finally {
      dispatch(setInteractionBlocked(false))
    }
  },
)
