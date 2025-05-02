'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser({ email, password })
      router.push('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl mb-4">Register</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="mb-2" />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="mb-2" />
      <button type="submit">Register</button>
    </form>
  )
}
