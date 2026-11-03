export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'healthy',
    service: 'FaceScan AI Platform API',
    runtime: 'Vercel Serverless Function',
    timestamp: new Date().toISOString(),
    vision: {
      engine: 'MediaPipe Face Landmarker V2',
      landmarks: 478,
      blendshapes: 52,
      inferenceLocation: 'Client WebAssembly'
    }
  });
}
