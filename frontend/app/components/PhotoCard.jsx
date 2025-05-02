import Link from 'next/link';

export default function PhotoCard({ photo }) {
  return (
    <Link
      href={`/consumer/${photo.id}`}
      className="group block rounded-lg overflow-hidden border border-gray-300 shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative w-full h-64">
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {photo.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{photo.caption}</p>
      </div>
    </Link>
  );
}
