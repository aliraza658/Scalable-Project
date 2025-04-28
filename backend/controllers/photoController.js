const { client, databaseName } = require('../config/cosmosClient');

const mediaContainer = client.database(databaseName).container('Media');

exports.uploadPhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const { title, caption, location, people } = req.body;

  const newPhoto = {
    id: Date.now().toString(),
    title: title || '',
    caption: caption || '',
    location: location || '',
    people: people || '',
    url: '/' + req.file.filename,
    comments: []
  };

  try {
    await mediaContainer.items.create(newPhoto);
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(500).json({ message: 'Error uploading photo', error: err.message });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const { resources: photos } = await mediaContainer.items.query('SELECT * FROM c').fetchAll();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching photos', error: err.message });
  }
};

exports.getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const { resource: photo } = await mediaContainer.item(id, id).read();
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching photo', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { comment, rating } = req.body;

  try {
    const { resource: photo } = await mediaContainer.item(id, id).read();
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    photo.comments = photo.comments || [];
    photo.comments.push({ comment, rating, date: new Date().toISOString() });

    await mediaContainer.item(id, id).replace(photo);

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding comment', error: err.message });
  }
};
