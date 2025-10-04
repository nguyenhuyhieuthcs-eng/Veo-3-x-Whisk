
import { useState, useEffect, useRef, useCallback } from 'react';
import type { VideoJob } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export const useJobPolling = (jobId: string | null) => {
  const [job, setJob] = useState<VideoJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback((id: string) => {
    stopPolling();

    const poll = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/job-status/${id}`);
        if (!response.ok) {
          throw new Error('Job not found or an error occurred.');
        }
        const data: VideoJob = await response.json();
        setJob(data);

        if (data.status === 'completed' || data.status === 'failed') {
          stopPolling();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get job status.');
        stopPolling();
      }
    };
    
    poll();
    intervalRef.current = window.setInterval(poll, 3000);
  }, [stopPolling]);

  useEffect(() => {
    if (jobId) {
      startPolling(jobId);
    } else {
      stopPolling();
      setJob(null);
    }

    return () => {
      stopPolling();
    };
  }, [jobId, startPolling, stopPolling]);

  const reset = useCallback(() => {
      stopPolling();
      setJob(null);
      setError(null);
  }, [stopPolling]);


  return { job, error, isLoading: !!jobId && job?.status === 'processing', reset };
};
