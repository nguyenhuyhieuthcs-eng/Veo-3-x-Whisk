
import React, { useState } from 'react';
import Button from '../components/Button';
import { useJobPolling } from '../hooks/useJobPolling';
import { Film, Clapperboard, Download, XCircle } from 'lucide-react';

const API_URL = 'http://localhost:3001/api/generate-video';

const Veo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState('1080p');
  const [aspectRatio, setAspectRatio] =useState('16:9');
  const [style, setStyle] = useState('cinematic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  
  const { job, error: pollingError, isLoading, reset } = useJobPolling(currentJobId);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setSubmissionError('Prompt cannot be empty.');
      return;
    }
    setIsSubmitting(true);
    setSubmissionError(null);
    reset();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, resolution, aspectRatio, style }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit video job.');
      }
      const data = await response.json();
      setCurrentJobId(data.jobId);
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCurrentJobId(null);
  }

  const renderSelect = (id: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[]) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-medium-text mb-1">{label}</label>
        <select 
          id={id} 
          value={value} 
          onChange={onChange}
          disabled={isLoading || isSubmitting || !!job}
          className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
        >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
  );
  
  const renderJobStatus = () => {
      if (!job) return null;

      if (job.status === 'completed' && job.video) {
          return (
              <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-400">Video Ready!</h3>
                  <video controls src={job.video.url} className="w-full rounded-lg border border-dark-border"></video>
                  <div className="flex gap-4">
                    <a href={job.video.url} download target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button variant="primary" className="w-full" icon={<Download size={18}/>}>Download MP4</Button>
                    </a>
                    <Button variant="secondary" onClick={handleReset}>Create Another</Button>
                  </div>
              </div>
          );
      }

      if (job.status === 'failed' || pollingError) {
        return (
          <div className="text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
            <XCircle className="mx-auto text-red-500" size={40}/>
            <h3 className="mt-2 text-lg font-bold text-red-400">Generation Failed</h3>
            <p className="text-sm text-red-400/80">{pollingError || 'An unexpected error occurred.'}</p>
            <Button variant="secondary" onClick={handleReset} className="mt-4">Try Again</Button>
          </div>
        );
      }

      return (
        <div className="space-y-4 text-center">
            <h3 className="text-lg font-bold text-light-text animate-pulse">Processing Your Video...</h3>
            <div className="w-full bg-dark-border rounded-full h-4">
                <div 
                    className="bg-brand-blue h-4 rounded-full transition-all duration-500" 
                    style={{width: `${job.progress || 0}%`}}
                ></div>
            </div>
            <p className="text-sm text-medium-text">Progress: {job.progress || 0}%</p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Controls Panel */}
      <div className="lg:col-span-1 bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col space-y-6 self-start">
        <h2 className="text-2xl font-bold text-light-text flex items-center">
          <Clapperboard className="text-brand-blue mr-2" /> Veo3 AI Controls
        </h2>
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., An epic drone shot of a volcano erupting at sunset"
          className="w-full h-32 p-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all"
          disabled={isLoading || isSubmitting || !!job}
        />
        
        <div className="space-y-4">
            {renderSelect('resolution', 'Resolution', resolution, (e) => setResolution(e.target.value), ['720p', '1080p', '1440p', '4K'])}
            {renderSelect('aspect-ratio', 'Aspect Ratio', aspectRatio, (e) => setAspectRatio(e.target.value), ['16:9', '9:16', '1:1', '4:3'])}
            {renderSelect('style', 'Style', style, (e) => setStyle(e.target.value), ['Cinematic', 'Realistic', 'Animated', 'Abstract'])}
        </div>
        
        {submissionError && <p className="text-red-500 text-sm">{submissionError}</p>}
        
        <Button onClick={handleSubmit} isLoading={isSubmitting} disabled={isLoading || isSubmitting || !!job || !prompt.trim()}>
          Generate Video
        </Button>
      </div>

      {/* Result Display */}
      <div className="lg:col-span-2 bg-dark-card border border-dark-border rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        {currentJobId ? (
            <div className="w-full max-w-lg">
                {renderJobStatus()}
            </div>
        ) : (
          <div className="text-center text-medium-text">
            <Film size={48} className="mx-auto mb-4" />
            <p>Your generated video will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Veo;
