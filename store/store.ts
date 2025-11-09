import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import resourcesReducer from "./slices/resourcesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourcesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
