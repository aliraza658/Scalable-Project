// lib/auth.js
'use client'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export async function loginUser(credentials) {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, credentials, {
    withCredentials: true // send cookies if needed
  })
  return res.data
}

export async function registerUser(userInfo) {
  const res = await axios.post(`${BASE_URL}/api/auth/register`, userInfo, {
    withCredentials: true
  })
  return res.data
}
