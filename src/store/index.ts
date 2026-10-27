import { configureStore } from '@reduxjs/toolkit'
import configurationsReducer from './configurationsSlice'

// configureStore adds redux-thunk middleware by default, which runs the async thunks.
export const store = configureStore({
  reducer: {
    configurations: configurationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
