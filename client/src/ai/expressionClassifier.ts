import { ExpressionCategory } from '../types';

export interface BlendshapeCategory {
  categoryName: string;
  score: number;
}

export class ExpressionClassifier {
  private smoothedScores: Record<ExpressionCategory, number> = {
    Neutral: 40.0,
    Happy: 10.0,
    Surprised: 10.0,
    Sad: 10.0,
    Angry: 10.0,
    Fearful: 10.0,
    Disgusted: 10.0,
  };

  private smoothingFactor: number; // Alpha for exponential moving average

  constructor(smoothingFactor = 0.35) {
    this.smoothingFactor = Math.max(0.05, Math.min(1.0, smoothingFactor));
  }

  setSmoothingFactor(factor: number) {
    this.smoothingFactor = Math.max(0.05, Math.min(1.0, factor));
  }

  /**
   * Classifies raw MediaPipe face blendshapes into 7 standardized expression probabilities
   */
  classify(blendshapes: BlendshapeCategory[]): {
    dominantExpression: ExpressionCategory;
    dominantConfidence: number;
    scores: Record<ExpressionCategory, number>;
  } {
    const map = new Map<string, number>();
    for (const b of blendshapes) {
      map.set(b.categoryName, b.score);
    }

    const get = (name: string) => map.get(name) || 0;

    // 1. Calculate raw activations based on Facial Action Units (FACS)
    // Happy: AU12 (Lip Corner Puller) + AU6 (Cheek Raiser)
    const smile = (get('mouthSmileLeft') + get('mouthSmileRight')) / 2;
    const cheekSquint = (get('cheekSquintLeft') + get('cheekSquintRight')) / 2;
    const rawHappy = smile * 0.7 + cheekSquint * 0.3;

    // Surprised: AU26 (Jaw Drop) + AU1+2 (Brow Raiser) + AU5 (Upper Lid Raiser)
    const jawOpen = get('jawOpen');
    const browUp = (get('browInnerUp') + get('browOuterUpLeft') + get('browOuterUpRight')) / 3;
    const eyeWide = (get('eyeWideLeft') + get('eyeWideRight')) / 2;
    const rawSurprised = jawOpen * 0.45 + browUp * 0.35 + eyeWide * 0.2;

    // Sad: AU15 (Lip Corner Depressor) + AU1 (Inner Brow Raiser) + AU4 (Brow Lowerer)
    const mouthFrown = (get('mouthFrownLeft') + get('mouthFrownRight')) / 2;
    const mouthShrugLower = get('mouthShrugLower');
    const innerBrowUp = get('browInnerUp');
    const rawSad = mouthFrown * 0.5 + mouthShrugLower * 0.25 + innerBrowUp * 0.25;

    // Angry: AU4 (Brow Lowerer) + AU23/24 (Lip Tightener) + AU9 (Nose Wrinkler)
    const browDown = (get('browDownLeft') + get('browDownRight')) / 2;
    const mouthPucker = get('mouthPucker');
    const noseSneer = (get('noseSneerLeft') + get('noseSneerRight')) / 2;
    const rawAngry = browDown * 0.55 + mouthPucker * 0.25 + noseSneer * 0.2;

    // Fearful: AU1+2 (Brow Raiser) + AU5 (Eyes Wide) + AU20 (Lip Stretcher)
    const mouthStretch = (get('mouthStretchLeft') + get('mouthStretchRight')) / 2;
    const rawFearful = innerBrowUp * 0.4 + eyeWide * 0.4 + mouthStretch * 0.2;

    // Disgusted: AU9 (Nose Wrinkler) + AU10 (Upper Lip Raiser)
    const mouthShrugUpper = get('mouthShrugUpper');
    const rawDisgusted = noseSneer * 0.6 + mouthShrugUpper * 0.4;

    // Neutral: Lower baseline (0.30 instead of 1.0) so it does not dominate
    // and decays swiftly when facial muscle action units activate
    const totalActivity =
      rawHappy * 2.2 +
      rawSurprised * 2.0 +
      rawSad * 2.0 +
      rawAngry * 2.1 +
      rawFearful * 1.9 +
      rawDisgusted * 2.0;

    const rawNeutral = Math.max(0.02, 0.30 - totalActivity * 0.9);

    const rawCandidates: Record<ExpressionCategory, number> = {
      Happy: Math.min(1.0, rawHappy * 2.2),
      Surprised: Math.min(1.0, rawSurprised * 2.0),
      Sad: Math.min(1.0, rawSad * 2.0),
      Angry: Math.min(1.0, rawAngry * 2.1),
      Fearful: Math.min(1.0, rawFearful * 1.9),
      Disgusted: Math.min(1.0, rawDisgusted * 2.0),
      Neutral: rawNeutral,
    };

    // 2. Normalize distribution so values sum to 100%
    let sum = 0;
    (Object.keys(rawCandidates) as ExpressionCategory[]).forEach(k => {
      sum += rawCandidates[k];
    });

    const normalized: Record<ExpressionCategory, number> = {} as any;
    (Object.keys(rawCandidates) as ExpressionCategory[]).forEach(k => {
      normalized[k] = sum > 0 ? (rawCandidates[k] / sum) * 100 : 0;
    });

    // 3. Apply Temporal Exponential Moving Average (EMA)
    const alpha = this.smoothingFactor;
    let dominant: ExpressionCategory = 'Neutral';
    let maxConf = -1;

    (Object.keys(this.smoothedScores) as ExpressionCategory[]).forEach(k => {
      this.smoothedScores[k] =
        alpha * normalized[k] + (1 - alpha) * this.smoothedScores[k];

      const rounded = Math.round(this.smoothedScores[k] * 10) / 10;
      this.smoothedScores[k] = rounded;

      if (rounded > maxConf) {
        maxConf = rounded;
        dominant = k;
      }
    });

    return {
      dominantExpression: dominant,
      dominantConfidence: maxConf,
      scores: { ...this.smoothedScores },
    };
  }

  reset() {
    this.smoothedScores = {
      Neutral: 35.0,
      Happy: 11.0,
      Surprised: 11.0,
      Sad: 11.0,
      Angry: 11.0,
      Fearful: 10.0,
      Disgusted: 11.0,
    };
  }
}
