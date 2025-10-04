
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config(); // Load .env file
const { GoogleGenAI } = require('@google/genai');

const app = express();
const port = 3001;

// Explicitly configure CORS
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Gemini AI if API_KEY is available
const apiKey = process.env.API_KEY;
let ai;
if (apiKey) {
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log('Gemini API integration is enabled.');
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI, check your API key. Running in mock mode.", e);
    ai = null;
  }
} else {
  console.log('API_KEY not found in .env file. Running in mock mode.');
}

// In-memory store for jobs (both mock and real)
const jobs = new Map();

/**
 * Endpoint /api/generate-image
 * Generates an image using Gemini API or mock data.
 */
app.post('/api/generate-image', async (req, res) => {
  console.log('Received image generation request:', req.body);
  const { prompt } = req.body;

  if (!ai) {
    // MOCK MODE
    console.log('Using mock image generation.');
    setTimeout(() => {
      const imageId = Math.floor(Math.random() * 500);
      const imageUrl = `https://picsum.photos/id/${imageId}/1024/1024`;
      res.json({
        success: true,
        images: [
          { id: crypto.randomBytes(8).toString('hex'), url: imageUrl, prompt: req.body.prompt },
        ],
      });
    }, 2000); // 2-second delay
    return;
  }

  // REAL API MODE
  try {
    console.log('Using Gemini API for image generation.');
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
        },
    });

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

    res.json({
      success: true,
      images: [
        { id: crypto.randomBytes(8).toString('hex'), url: imageUrl, prompt: prompt },
      ],
    });
  } catch (error) {
    console.error('Gemini API error (image generation):', error);
    res.status(500).json({ success: false, message: 'Failed to generate image via Gemini API.' });
  }
});

/**
 * Endpoint /api/generate-video
 * Initiates a video generation job using Gemini API or mock data.
 */
app.post('/api/generate-video', async (req, res) => {
  console.log('Received video generation request:', req.body);
  const { prompt } = req.body;
  const jobId = crypto.randomBytes(16).toString('hex'); // Our internal job ID

  if (!ai) {
    // MOCK MODE
    console.log('Using mock video generation.');
    const job = {
      id: jobId,
      isMock: true,
      status: 'processing',
      createdAt: Date.now(),
      progress: 0,
    };
    jobs.set(jobId, job);
    console.log(`Created mock video job: ${jobId}`);
    res.status(202).json({ success: true, jobId });
    return;
  }

  // REAL API MODE
  try {
    console.log('Using Gemini API for video generation.');
    const operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: { numberOfVideos: 1 }
    });
    
    const job = {
        id: jobId,
        isMock: false,
        operation: operation, // Store the operation object from the SDK
    };
    jobs.set(jobId, job);
    console.log(`Created Gemini video job: ${jobId} (Operation Name: ${operation.name})`);
    res.status(202).json({ success: true, jobId });
  } catch (error) {
    console.error('Gemini API error (video generation):', error);
    res.status(500).json({ success: false, message: 'Failed to submit video job to Gemini API.' });
  }
});

/**
 * Endpoint /api/job-status/:id
 * Polls for the status of a video generation job.
 */
app.get('/api/job-status/:id', async (req, res) => {
  const { id } = req.params;
  const job = jobs.get(id);

  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  // MOCK MODE
  if (job.isMock) {
    const timeElapsed = Date.now() - job.createdAt;
    const totalDuration = 15000; // 15 seconds for mock processing

    if (timeElapsed < totalDuration) {
      job.progress = Math.min(100, Math.floor((timeElapsed / totalDuration) * 100));
      res.json({
        success: true,
        jobId: id,
        status: 'processing',
        progress: job.progress,
      });
    } else {
      // A sample public domain video
      const resultUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
      res.json({
        success: true,
        jobId: id,
        status: 'completed',
        progress: 100,
        video: { url: resultUrl },
      });
    }
    return;
  }

  // REAL API MODE
  if (!ai) { // Should not happen if job is not mock, but as a safeguard
    return res.status(500).json({ success: false, message: 'API not initialized but job is not mock.' });
  }
  
  try {
    let operation = await ai.operations.getVideosOperation({ operation: job.operation });
    job.operation = operation; // Persist the updated operation state
    jobs.set(id, job);

    if (operation.done) {
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            console.error('Operation complete but no video URI found:', operation);
            return res.status(500).json({ success: false, message: 'Video generation completed, but the result URL was missing.' });
        }
        
        // As per Gemini docs, the API key must be appended to the download URI
        const finalUrl = `${downloadLink}&key=${apiKey}`;

        res.json({
            success: true,
            jobId: id,
            status: 'completed',
            progress: 100,
            video: { url: finalUrl },
        });
    } else {
        res.json({
            success: true,
            jobId: id,
            status: 'processing',
            // Real API operation status does not provide fine-grained progress.
            // We can send a static value to indicate it's working.
            progress: 50, 
        });
    }
  } catch (error) {
    console.error(`Gemini API error (job status for ${id}):`, error);
    res.status(500).json({ success: false, message: 'Failed to retrieve job status from Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
