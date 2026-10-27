import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getConfigurations, putConfiguration } from '../api/configurations'
import type { ApiConfiguration } from '../api/configurations'
import { getErrorMessage } from '../api/client'
import type { IntersectionType, SavedTimes } from '../constants/intersections'

interface ConfigurationsState {
  times: SavedTimes
  loading: boolean
  saving: boolean
  error: string | null
}

const initialState: ConfigurationsState = {
  times: {},
  loading: false,
  saving: false,
  error: null,
}

export const fetchConfigurations = createAsyncThunk<
  ApiConfiguration[],
  void,
  { rejectValue: string }
>('configurations/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await getConfigurations()
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

// Saves the new times, then fetches the latest data from the API so the
// store always holds what the database has.
export const saveConfiguration = createAsyncThunk<
  ApiConfiguration[],
  { type: IntersectionType; signalTimes: number[] },
  { rejectValue: string }
>('configurations/save', async ({ type, signalTimes }, { rejectWithValue }) => {
  try {
    await putConfiguration(type, signalTimes)
    return await getConfigurations()
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

const configurationsSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigurations.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConfigurations.fulfilled, (state, action) => {
        state.loading = false
        for (const config of action.payload) {
          state.times[config.intersectionType] = config.signalTimes
        }
      })
      .addCase(fetchConfigurations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? 'Failed to load configurations'
      })
      .addCase(saveConfiguration.pending, (state) => {
        state.saving = true
        state.error = null
      })
      .addCase(saveConfiguration.fulfilled, (state, action) => {
        state.saving = false
        for (const config of action.payload) {
          state.times[config.intersectionType] = config.signalTimes
        }
      })
      .addCase(saveConfiguration.rejected, (state, action) => {
        state.saving = false
        state.error = action.payload ?? 'Failed to save configuration'
      })
  },
})

export const { clearError } = configurationsSlice.actions
export default configurationsSlice.reducer
