'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/lib/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user') // Default role is 'user'
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Sending role along with email and password
      await registerUser({ email, password, role })
      router.push('/login') // Redirect after successful registration
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">Register</h2>
        
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
          <input 
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Role Select */}
        <div>
          <label htmlFor="role" className="block text-lg font-medium text-gray-700">Select Role</label>
          <select 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="w-full p-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </form>
    </div>
  )
}
