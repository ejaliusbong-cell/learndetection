export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

// Key contour landmark indices in MediaPipe Face Mesh (468/478 landmarks)
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
];

const LIPS_OUTER_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 61
];

const LEFT_EYE_INDICES = [
  33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33
];

const RIGHT_EYE_INDICES = [
  263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466, 263
];

export function drawFaceLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
  options = { showMesh: true, color: '#14b8a6', landmarkRadius: 1.5 }
) {
  if (!landmarks || landmarks.length === 0) return;

  ctx.save();
  ctx.strokeStyle = options.color;
  ctx.fillStyle = options.color;
  ctx.lineWidth = 1.2;

  // 1. Draw key contours
  const drawPath = (indices: number[], close = false) => {
    ctx.beginPath();
    indices.forEach((idx, i) => {
      const pt = landmarks[idx];
      if (!pt) return;
      const x = pt.x * width;
      const y = pt.y * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    if (close) ctx.closePath();
    ctx.stroke();
  };

  drawPath(FACE_OVAL_INDICES);
  drawPath(LIPS_OUTER_INDICES, true);
  drawPath(LEFT_EYE_INDICES, true);
  drawPath(RIGHT_EYE_INDICES, true);

  // 2. Draw point dots if mesh requested
  if (options.showMesh) {
    ctx.fillStyle = 'rgba(20, 184, 166, 0.6)';
    landmarks.forEach((pt, i) => {
      // Sample subset to keep rendering high-fps
      if (i % 3 === 0) {
        const x = pt.x * width;
        const y = pt.y * height;
        ctx.beginPath();
        ctx.arc(x, y, options.landmarkRadius, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  }

  ctx.restore();
}
