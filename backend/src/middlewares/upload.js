import multer from 'multer';

// Use memory storage to pass buffer directly to Gemini API
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/webm',
    'audio/mp3',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/aac',
    'audio/ogg',
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.originalname.match(/\.(webm|mp3|wav|m4a|mp4|aac|ogg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only audio files (webm, mp3, wav, m4a, mp4, aac, ogg) are allowed.'), false);
  }
};

export const uploadAudio = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB file size limit
  },
});
