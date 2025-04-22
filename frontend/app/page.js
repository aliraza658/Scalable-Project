import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to PhotoShare</h1>
      <div className="space-x-4">
        <Link href="/creator" className="bg-blue-500 text-white px-4 py-2 rounded">Creator View</Link>
        <Link href="/consumer" className="bg-green-500 text-white px-4 py-2 rounded">Consumer View</Link>
      </div>
    </main>
  );
}
