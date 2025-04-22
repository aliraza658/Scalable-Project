import Link from 'next/link';

export default function PhotoCard({ photo }) {
  return (
    <Link href={`/consumer/${photo.id}`} className="border rounded shadow hover:shadow-lg block">
      <img src={`http://localhost:4000/${photo.url}`} alt={photo.title} className="w-full h-48 object-cover" />
      <div className="p-2">
        <h3 className="font-semibold">{photo.title}</h3>
        <p className="text-sm text-gray-600">{photo.caption}</p>
      </div>
    </Link>
  );
}
