// 'use client';  // This ensures the component is client-side only
// import { useAuth } from '../../context/AuthContext';  // Import auth context
// import Link from 'next/link';
// import { useRouter } from 'next/router';  // Import useRouter from Next.js
// import { useState, useEffect } from 'react';  // Import useState and useEffect

// export default function HomePage() {
//   const { user, logout } = useAuth();  // Access the user and logout method from the context
//   console.log(user)
//   // State to track if the component is mounted
//   const [mounted, setMounted] = useState(false);  

//   // useEffect to ensure we set mounted to true after the component has mounted
//   useEffect(() => {
//     setMounted(true);  // Set mounted to true when component is mounted on the client
//   }, []);

//   // Render the component only after it's mounted to avoid SSR-related issues
//   if (!mounted) {
//     return null;  // Prevent rendering anything until mounted (client-side only)
//   }

//   //const router = useRouter();  // Initialize the useRouter function from Next.js

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white flex flex-col justify-center items-center p-6">
//       {/* Navbar with logout button */}
//       <header className="w-full flex justify-between items-center mb-10">
//         <h1 className="text-5xl font-extrabold">PhotoShare</h1>
//         {user && (
//           <button
//             onClick={handleLogout}
//             className="bg-red-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-red-700 transition duration-300"
//           >
//             Logout
//           </button>
//         )}
//       </header>

//       {/* Main Content */}
//       <section className="text-center max-w-4xl mx-auto">
//         <h2 className="text-4xl font-bold mb-8">Welcome to PhotoShare!</h2>
//         <div className="flex justify-center space-x-8">
//           <Link
//             href="/creator"  // Next.js's Link for navigation
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300"
//           >
//             Creator View
//           </Link>
//           <Link
//             href="/consumer"  // Next.js's Link for navigation
//             className="bg-green-600 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-700 transition duration-300"
//           >
//             Consumer View
//           </Link>
//         </div>
//       </section>
//     </main>
//   );
// }
