import { useEffect, useState } from 'react'
export type Role = 'admin' | 'collab'
export function useRole() {
  const [role, setRole] = useState<Role>((localStorage.getItem('role') as Role) || 'admin')
  useEffect(() => { localStorage.setItem('role', role) }, [role])
  return { role, setRole }
}
