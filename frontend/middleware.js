import { NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const PUBLIC_PATHS = ['/', '/login', '/register']

export function middleware(req) {
  const token = req.cookies.get('token')?.value
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    verify(token, process.env.JWT_SECRET)
    return NextResponse.next()
  } catch (err) {
    return NextResponse.redirect(new URL('/', req.url))
  }
}

export const config = {
  matcher: ['/dashboard', '/profile', '/media/upload'], // protected routes
}
