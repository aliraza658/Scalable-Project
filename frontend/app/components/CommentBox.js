export default function CommentBox() {
    return (
      <div className="mt-4">
        <textarea className="w-full p-2 border rounded mb-2" placeholder="Leave a comment..."></textarea>
        <input
          type="number"
          min="1"
          max="5"
          className="w-full p-2 border rounded mb-2"
          placeholder="Rate 1-5"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit (mock)</button>
      </div>
    );
  }
  