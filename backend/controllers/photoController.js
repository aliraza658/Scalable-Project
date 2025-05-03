const { client, databaseName } = require('../config/cosmosClient');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob')
const streamifier = require('streamifier')
const path = require('path');

const mediaContainer = client.database(databaseName).container('Media');
const account = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
const blobContainer = process.env.AZURE_STORAGE_CONTAINER

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey)
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
)
const containerClient = blobServiceClient.getContainerClient(blobContainer)
const sanitize = (name) =>
  (name || 'default').replace(/[^a-zA-Z0-9.-]/g, '_');

exports.uploadPhoto = async (req, res) => {
  try {

  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  const { title, caption, location, people } = req.body;

  // const originalName = req.file.originalname;
  // const blobName = sanitize(`${Date.now()}_${originalName}`);
  // const blockBlobClient = containerClient.getBlockBlobClient(blobName);


  const extension = path.extname(req.file.originalname) || '.jpg';
  const blobName = `photo_${Date.now()}${extension}`;
  console.log('Blob name:', blobName); // Sanity check

 
  
    // Upload to Azure Blob
    // const stream = streamifier.createReadStream(req.file.buffer)
    // await blockBlobClient.uploadStream(stream, req.file.size)

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const stream = streamifier.createReadStream(req.file.buffer);
    await blockBlobClient.uploadStream(stream, req.file.size);

    const newPhoto = {
      id: Date.now().toString(),
      title: title || '',
      caption: caption || '',
      location: location || '',
      people: people || '',
      url: blockBlobClient.url,
      comments: []
    }

    // Save metadata in Cosmos DB
    await mediaContainer.items.create(newPhoto)

    res.status(201).json(newPhoto)
  } catch (err) {
    console.error('Upload Error:', err)
    res.status(500).json({ message: 'Error uploading photo', error: err.message })
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
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.id = @id',
      parameters: [
        { name: '@id', value: id }
      ]
    };

    const { resources: photos } = await mediaContainer.items.query(querySpec).fetchAll();

    if (photos.length === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photos[0]);
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
