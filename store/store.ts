import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import resourcesReducer from "./slices/resourcesSlice"
import mentorsReducer from "./slices/mentorsSlice"
import subscriptionsReducer from "./slices/subscriptionsSlice"
import pointsReducer from "./slices/pointsSlice"
import adminReducer from "./slices/adminSlice"
import chatReducer from "./slices/chatSlice"
import payoutReducer from "./slices/payoutSlice"
import generationReducer from "./slices/generationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resources: resourcesReducer,
    mentors: mentorsReducer,
    subscriptions: subscriptionsReducer,
    points: pointsReducer,
    admin: adminReducer,
    chat: chatReducer,
    payout: payoutReducer,
    generation: generationReducer, 
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
