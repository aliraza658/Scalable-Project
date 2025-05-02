'use client'
import dynamic from 'next/dynamic';

// Dynamically import the HomePage component, disabling SSR
const HomePage = dynamic(() => import('./components/HomePage'), { ssr: false });

export default function Page() {
  return <HomePage />;
}
