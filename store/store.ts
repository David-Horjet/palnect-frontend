import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import resourcesReducer from "./slices/resourcesSlice"
import mentorsReducer from "./slices/mentorsSlice"
import subscriptionsReducer from "./slices/subscriptionsSlice"
import pointsReducer from "./slices/pointsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourcesReducer,
    mentors: mentorsReducer,
    subscriptions: subscriptionsReducer,
    points: pointsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
