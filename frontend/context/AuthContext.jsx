'use client'
import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router';

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, credentials)
    setToken(res.data.token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/memessage`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => setUser(res.data))
        .catch(() => logout())
    }
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
