import { configureStore } from '@reduxjs/toolkit'
import socketReducer from "@/features/socket/model/socketSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      socket: socketReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']