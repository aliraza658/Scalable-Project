const { client, databaseName } = require('../config/cosmosClient');

const mediaContainer = client.database(databaseName).container('Media');


exports.getCommentsForPhoto = async (req, res) => {
  const { id } = req.params;

  try {
    const query = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }]
    };
    
    const { resources } = await mediaContainer.items.query(query).fetchAll();
    
    if (resources.length === 0) {
      return res.status(404).json({ message: 'Photo not found (via query)' });
    }
    
    const photo = resources[0];

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    console.log(photo)
    res.json(photo.comments || []);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ message: 'Error fetching comments', error: err.message });
  }
};


// 1. Create a new comment for a photo
exports.createComment = async (req, res) => {
  const { id } = req.params;  // Photo ID from the route
  const { comment, rating } = req.body;  // Comment text and rating from the request body
    console.log(id);
   // return;
  // Validate the inputs
  if (!comment || !rating) {
    return res.status(400).json({ message: 'Comment and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const query = {
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }]
      };
      
      const { resources } = await mediaContainer.items.query(query).fetchAll();
      
      if (resources.length === 0) {
        return res.status(404).json({ message: 'Photo not found (via query)' });
      }
      
      const photo = resources[0];

    const newComment = {
      comment,
      rating,
      date: new Date().toISOString(),
    };
    
    photo.comments = photo.comments || [];
    photo.comments.push(newComment);

    await mediaContainer.items.upsert(photo);

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ message: 'Error creating comment', error: err.message });
  }
};

// 2. Delete a comment from a photo
exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;  // Photo ID and Comment ID from the route

  try {
    // Get the photo by ID from Cosmos DB
    const { resource: photo } = await mediaContainer.item(id, id).read();
    
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Find and remove the comment
    const commentIndex = photo.comments.findIndex((c) => c.id === commentId);
    
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment from the photo
    photo.comments.splice(commentIndex, 1);

    // Replace the updated photo object in Cosmos DB
    await mediaContainer.item(id, id).replace(photo);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Error deleting comment', error: err.message });
  }
};
