# 🧠 Computer Vision & Facial Expression Classification Pipeline

## 1. On-Device WebAssembly Architecture

Traditional facial analysis architectures transmit raw camera frames or compressed video feeds over HTTP/WebSockets to server-side GPU instances. This introduces latency (150–500ms), substantial bandwidth overhead, and severe privacy vulnerabilities.

**FaceScan AI executes 100% of the neural inference locally inside the user's browser:**
- **Runtime**: MediaPipe Tasks Vision WebAssembly (WASM) with WebGL/GPU delegate fallback.
- **Model**: `face_landmarker.task` (float16 quantized, ~4.5 MB).
- **Latency**: 15–33ms per frame (30 to 60 FPS real-time rendering on standard consumer hardware).
- **Network Traffic**: 0 bytes of video or image data are ever transferred across the internet.

```
[ Webcam MediaStream (1280x720) ]
               │
               ▼
   [ HTML5 Video Element ]
               │
               ▼
[ MediaPipe Tasks Vision WASM ] (GPU Delegate)
       │                       │
       ▼                       ▼
[ 478 Landmark Nodes ]   [ 52 Blendshape Coefficients ]
       │                               │
       │                               ▼
       │                 [ FACS Expression Classifier ]
       │                               │
       │                               ▼
       │                 [ Temporal Smoothing (EMA) ]
       │                               │
       ▼                               ▼
[ Canvas Mesh Overlay ]    [ Expression Probabilities ]
 (Contour Tesselation)      (Happy, Sad, Angry, Surprised,
                             Neutral, Fearful, Disgusted)
```

---

## 2. Facial Action Coding System (FACS) Blendshape Mapping

MediaPipe generates 52 blendshape coefficients representing geometric displacements of specific facial muscles. We map these Action Units (AUs) into 7 standardized Ekman categories:

| Expression Category | Primary Facial Action Units (FACS) | Blendshape Coefficients Used |
| :--- | :--- | :--- |
| **Happy** | AU12 (Lip Corner Puller) + AU6 (Cheek Raiser) | `mouthSmileLeft`, `mouthSmileRight`, `cheekSquintLeft`, `cheekSquintRight` |
| **Surprised** | AU26 (Jaw Drop) + AU1+2 (Brow Raiser) + AU5 (Upper Lid Raiser) | `jawOpen`, `browInnerUp`, `browOuterUpLeft`, `browOuterUpRight`, `eyeWideLeft`, `eyeWideRight` |
| **Sad** | AU15 (Lip Corner Depressor) + AU1 (Inner Brow Raiser) + AU17 (Chin Raiser) | `mouthFrownLeft`, `mouthFrownRight`, `browInnerUp`, `mouthShrugLower` |
| **Angry** | AU4 (Brow Lowerer) + AU23/24 (Lip Tightener) + AU9 (Nose Wrinkler) | `browDownLeft`, `browDownRight`, `mouthPucker`, `noseSneerLeft`, `noseSneerRight` |
| **Fearful** | AU1+2 (Brow Raiser) + AU5 (Eyes Wide) + AU20 (Lip Stretcher) | `browInnerUp`, `eyeWideLeft`, `eyeWideRight`, `mouthStretchLeft`, `mouthStretchRight` |
| **Disgusted** | AU9 (Nose Wrinkler) + AU10 (Upper Lip Raiser) | `noseSneerLeft`, `noseSneerRight`, `mouthShrugUpper` |
| **Neutral** | Absence of active facial contractions | Inverse aggregate activation: $\max(0.05, 1.0 - \sum \text{AUs} \times 1.4)$ |

---

## 3. Temporal Smoothing (Exponential Moving Average)

Raw frame-by-frame inference produces micro-jitters due to sensor noise and micro-movements. We apply an Exponential Moving Average (EMA) to smooth the probability curves:

$$S_t = \alpha \cdot X_t + (1 - \alpha) \cdot S_{t-1}$$

Where:
- $S_t$ is the smoothed score at frame $t$.
- $X_t$ is the normalized raw activation of the current frame.
- $\alpha$ is the smoothing factor (default: `0.35`, customizable in User Preferences from `0.05` to `0.9`).

This yields fluid visual transitions while maintaining rapid responsiveness to authentic expression changes.
