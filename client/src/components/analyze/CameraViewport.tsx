import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CameraOff, RefreshCw, Eye, EyeOff, AlertTriangle, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { getFaceLandmarker } from '../../ai/faceLandmarker';
import { ExpressionClassifier } from '../../ai/expressionClassifier';
import { drawFaceLandmarks } from '../../ai/drawingUtils';
import { AnalysisFrameResult } from '../../types';

interface CameraViewportProps {
  onFrameResult: (result: AnalysisFrameResult) => void;
  isRecording: boolean;
  onFrameRecord: (result: AnalysisFrameResult) => void;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  onFrameResult,
  isRecording,
  onFrameRecord,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [facesCount, setFacesCount] = useState<number>(0);
  const [fps, setFps] = useState<number>(0);

  const animFrameIdRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const classifierRef = useRef<ExpressionClassifier>(new ExpressionClassifier(0.35));
  const fpsTrackerRef = useRef<{ count: number; lastTime: number }>({ count: 0, lastTime: performance.now() });

  // List available video input devices
  const enumerateCameras = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter(d => d.kind === 'videoinput');
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (e: any) {
      console.warn('Could not list cameras:', e.message);
    }
  }, [selectedDeviceId]);

  // Start webcam
  const startCamera = async (deviceId?: string) => {
    setCameraError(null);
    try {
      if (videoRef.current?.srcObject) {
        const prevStream = videoRef.current.srcObject as MediaStream;
        prevStream.getTracks().forEach(t => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
        };
      }

      await enumerateCameras();
    } catch (err: any) {
      console.error('Camera stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access permission was denied. Please allow camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your hardware.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.');
      } else {
        setCameraError(err.message || 'Unable to open camera stream.');
      }
      setIsStreaming(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
    setFacesCount(0);
    classifierRef.current.reset();
  };

  // Initial load: Model & Camera
  useEffect(() => {
    let isMounted = true;

    async function init() {
      setIsModelLoading(true);
      try {
        await getFaceLandmarker();
        if (isMounted) {
          setIsModelLoading(false);
          await startCamera();
        }
      } catch (err: any) {
        if (isMounted) {
          setCameraError(`AI Model initialization failed: ${err.message}`);
          setIsModelLoading(false);
        }
      }
    }

    init();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Real-Time Inference Loop
  useEffect(() => {
    if (!isStreaming || isModelLoading) return;

    let isRunning = true;

    const runInference = async () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        // Match canvas dimensions to video
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            const landmarker = await getFaceLandmarker();
            const now = performance.now();

            if (video.currentTime !== lastVideoTimeRef.current) {
              lastVideoTimeRef.current = video.currentTime;
              const results = landmarker.detectForVideo(video, now);

              const numFaces = results.faceLandmarks?.length || 0;
              setFacesCount(numFaces);

              if (numFaces > 0 && results.faceLandmarks[0]) {
                const landmarks = results.faceLandmarks[0];

                // 1. Draw Mesh Overlay
                if (showMesh) {
                  drawFaceLandmarks(ctx, landmarks as any, canvas.width, canvas.height, {
                    showMesh: true,
                    color: '#14b8a6',
                    landmarkRadius: 1.2,
                  });
                }

                // 2. Classify Blendshapes
                if (results.faceBlendshapes && results.faceBlendshapes[0]) {
                  const rawBlendshapes = results.faceBlendshapes[0].categories;
                  const classification = classifierRef.current.classify(rawBlendshapes);

                  const frameResult: AnalysisFrameResult = {
                    dominantExpression: classification.dominantExpression,
                    dominantConfidence: classification.dominantConfidence,
                    scores: classification.scores,
                    landmarksCount: landmarks.length,
                    faceDetected: true,
                    facesCount: numFaces,
                    fps: fpsTrackerRef.current.count,
                    timestamp: Date.now(),
                  };

                  onFrameResult(frameResult);

                  if (isRecording) {
                    onFrameRecord(frameResult);
                  }
                }
              } else {
                onFrameResult({
                  dominantExpression: 'Neutral',
                  dominantConfidence: 0,
                  scores: {
                    Neutral: 0,
                    Happy: 0,
                    Surprised: 0,
                    Sad: 0,
                    Angry: 0,
                    Fearful: 0,
                    Disgusted: 0,
                  },
                  landmarksCount: 0,
                  faceDetected: false,
                  facesCount: 0,
                  fps: fpsTrackerRef.current.count,
                  timestamp: Date.now(),
                });
              }

              // Track FPS
              fpsTrackerRef.current.count++;
              if (now - fpsTrackerRef.current.lastTime >= 1000) {
                setFps(fpsTrackerRef.current.count);
                fpsTrackerRef.current.count = 0;
                fpsTrackerRef.current.lastTime = now;
              }
            }
          } catch (e) {
            console.warn('Frame detection skipped:', e);
          }
        }
      }

      if (isRunning) {
        animFrameIdRef.current = requestAnimationFrame(runInference);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(runInference);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isStreaming, isModelLoading, showMesh, isRecording, onFrameResult, onFrameRecord]);

  return (
    <div className="bg-white border border-slate-200/80 rounded-[28px] p-5 shadow-clean flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#114232]" />
              Live Camera Feed
            </h2>
            {isStreaming && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#eaf4f0] text-[#114232] border border-[#114232]/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#114232] animate-pulse" />
                Live ({fps} FPS)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            478 facial landmarks extracted locally in real-time
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Mesh */}
          <button
            onClick={() => setShowMesh(!showMesh)}
            title={showMesh ? 'Hide Mesh Overlay' : 'Show Mesh Overlay'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition ${
              showMesh
                ? 'bg-[#eaf4f0] text-[#114232] border-[#114232]/20'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {showMesh ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Mesh</span>
          </button>

          {/* Toggle Start/Stop */}
          {isStreaming ? (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-full text-xs font-bold transition"
            >
              <CameraOff className="w-3.5 h-3.5" />
              Stop Camera
            </button>
          ) : (
            <button
              onClick={() => startCamera(selectedDeviceId)}
              disabled={isModelLoading}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-[#114232] hover:bg-[#0d3528] text-white rounded-full text-xs font-bold transition shadow-pine"
            >
              <Camera className="w-3.5 h-3.5" />
              Start Camera
            </button>
          )}
        </div>
      </div>

      {/* Video Viewport */}
      <div className="relative aspect-video bg-slate-950 rounded-[20px] overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
        {/* Loading overlay */}
        {isModelLoading && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
            <h4 className="text-sm font-bold text-white">Loading MediaPipe Face Landmarker AI...</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Initializing WebAssembly and downloading neural network weights into browser cache.
            </p>
          </div>
        )}

        {/* Camera Video Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />

        {/* Canvas Mesh Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transform scale-x-[-1]"
        />

        {/* Detection Status Pills (Overlay) */}
        {isStreaming && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            {facesCount === 1 ? (
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                1 Face Tracked
              </span>
            ) : facesCount === 0 ? (
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                No Face in Frame
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-rose-300 border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Multiple Faces Detected ({facesCount})
              </span>
            )}
          </div>
        )}

        {/* Camera Error / Off message */}
        {!isStreaming && !isModelLoading && (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
            <CameraOff className="w-12 h-12 mb-3 text-slate-600" />
            <h4 className="text-sm font-semibold text-slate-300">Camera Inactive</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {cameraError || 'Press Start Camera to begin real-time facial expression analysis.'}
            </p>
            <button
              onClick={() => startCamera(selectedDeviceId)}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-full text-xs font-semibold border border-slate-700 transition"
            >
              Retry Camera Access
            </button>
          </div>
        )}
      </div>

      {/* Bottom Device Selector */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-medium">Camera Device:</span>
          <select
            value={selectedDeviceId}
            onChange={e => {
              setSelectedDeviceId(e.target.value);
              startCamera(e.target.value);
            }}
            disabled={!isStreaming || devices.length === 0}
            className="bg-[#f4f5f7] border border-slate-200 text-xs text-slate-700 rounded-full px-3 py-1.5 outline-none font-medium focus:border-[#114232]"
          >
            {devices.map((d, i) => (
              <option key={d.deviceId || i} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <Shield className="w-3.5 h-3.5 text-[#114232]" />
          <span>Local Browser Execution • Zero Video Uploads</span>
        </div>
      </div>
    </div>
  );
};
