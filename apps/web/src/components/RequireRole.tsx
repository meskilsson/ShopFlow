import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { ReactNode } from 'react'

type Props = {
  roles: string[]
  children: ReactNode
}

const RequireRole = ({ roles, children }: Props) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (!roles.includes(user!.role)) return <Navigate to="/home" replace />

  return <>{children}</>
}

export default RequireRole
