
import React, { useState } from 'react';
import type { GeneratedImage } from '../types';
import Button from '../components/Button';
import Toggle from '../components/Toggle';
import { Download, Image as ImageIcon, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/generate-image';

const Whisk: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [characterConsistency, setCharacterConsistency] = useState(true);
  const [unlimitedMode, setUnlimitedMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, characterConsistency, unlimitedMode }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate image. Please try again.');
      }
      const data = await response.json();
      setGeneratedImages(prev => [...data.images, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, prompt: string) => {
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        a.download = `whisk-ai-${fileName || 'image'}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Controls Panel */}
      <div className="lg:col-span-1 bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col space-y-6 self-start">
        <h2 className="text-2xl font-bold text-light-text flex items-center">
          <Sparkles className="text-brand-purple mr-2" /> Whisk AI Controls
        </h2>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cinematic shot of a robot skateboarding in a futuristic city"
          className="w-full h-32 p-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
          disabled={isLoading}
        />

        <div className="space-y-4">
          <Toggle label="Character Consistency" enabled={characterConsistency} setEnabled={setCharacterConsistency} />
          <Toggle label="Unlimited Mode" enabled={unlimitedMode} setEnabled={setUnlimitedMode} />
        </div>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button onClick={handleGenerate} isLoading={isLoading} disabled={isLoading || !prompt.trim()}>
          Generate Image
        </Button>
      </div>

      {/* Gallery */}
      <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Generated Images</h3>
        {isLoading && generatedImages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-medium-text">
            <ImageIcon size={48} className="mb-4 animate-pulse" />
            <p>Generating your masterpiece...</p>
          </div>
        )}
        {!isLoading && generatedImages.length === 0 && (
           <div className="flex flex-col items-center justify-center h-96 text-medium-text">
            <ImageIcon size={48} className="mb-4" />
            <p>Your generated images will appear here.</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
          {generatedImages.map((image) => (
            <div key={image.id} className="group relative rounded-lg overflow-hidden">
              <img src={image.url} alt={image.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">{image.prompt}</p>
                <button
                  onClick={() => handleDownload(image.url, image.prompt)}
                  className="absolute top-2 right-2 p-2 bg-white/20 rounded-full text-white opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:bg-white/40 transition-all"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Whisk;
