"use client"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, token, loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth)

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    dispatch,
  }
}
