import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let landmarkerInstance: FaceLandmarker | null = null;
let isLoading = false;

const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export async function getFaceLandmarker(): Promise<FaceLandmarker> {
  if (landmarkerInstance) {
    return landmarkerInstance;
  }

  if (isLoading) {
    // Wait until existing loader completes
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (landmarkerInstance) return landmarkerInstance;
  }

  isLoading = true;

  try {
    const vision = await FilesetResolver.forVisionTasks(WASM_URL);

    landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: MODEL_URL,
        delegate: 'GPU',
      },
      outputFaceBlendshapes: true,
      outputFacialTransformationMatrixes: false,
      runningMode: 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: 0.5,
      minFacePresenceConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    return landmarkerInstance;
  } catch (error) {
    console.error('[MediaPipe Loader Error]:', error);
    // Fallback to CPU delegate if GPU is not supported
    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_URL);
      landmarkerInstance = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: 'CPU',
        },
        outputFaceBlendshapes: true,
        outputFacialTransformationMatrixes: false,
        runningMode: 'VIDEO',
        numFaces: 1,
      });
      return landmarkerInstance;
    } catch (fallbackError) {
      throw new Error(`Failed to load MediaPipe Face Landmarker: ${(fallbackError as any).message}`);
    }
  } finally {
    isLoading = false;
  }
}
