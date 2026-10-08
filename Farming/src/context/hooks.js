import { useContext } from 'react'
import { AppContext } from './AppContextValue.js'

export function useCart() {
  return useContext(AppContext).cart
}

export function useAuth() {
  return useContext(AppContext).auth
}

export function useCommunity() {
  return useContext(AppContext).community
}

export function useAdmin() {
  return useContext(AppContext).admin
}
