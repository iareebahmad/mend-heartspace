import { useMemo } from "react";
import { Signal } from "./usePatternSignals";

/**
 * Internal phases for emotional continuity (never exposed to users)
 * - settling: new user, sparse/varied signals, no clear patterns
 * - circling: recurring emotions or contexts, returning to the same themes
 * - carrying: heavy/intense emotions consistently present
 * - easing: intensity decreasing, lighter emotions emerging
 */
export type UserPhase = "settling" | "circling" | "carrying" | "easing";

// Emotions that suggest carrying weight
const heavyEmotions = new Set([
  "anxious", "anxious_like", "anxiety",
  "overwhelmed", "heavy", "sad", "sadness",
  "angry", "anger", "frustrated",
  "exhausted", "drained", "numb",
  "stressed", "worried", "fearful",
  "guilt", "shame", "resentful",
]);

// Emotions that suggest easing
const lightEmotions = new Set([
  "calm", "relieved", "hopeful",
  "grateful", "happy", "joy",
  "content", "lighter", "at ease",
]);

// Intensity scoring
const intensityScore: Record<string, number> = {
  low: 1,
  moderate: 2,
  high: 3,
};

function countOccurrences(items: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return counts;
}

function getMaxCount(counts: Map<string, number>): number {
  let max = 0;
  for (const count of counts.values()) {
    if (count > max) max = count;
  }
  return max;
}

/**
 * Calculate simple intensity trend from recent signals
 * Returns negative for decreasing, positive for increasing, ~0 for stable
 */
function calculateIntensityTrend(signals: Signal[]): number {
  if (signals.length < 3) return 0;

  const scores = signals.map((s) => intensityScore[s.intensity] || 2);
  
  // Compare first half to second half (more recent = lower indices)
  const midpoint = Math.floor(scores.length / 2);
  const recentHalf = scores.slice(0, midpoint);
  const olderHalf = scores.slice(midpoint);

  const recentAvg = recentHalf.reduce((a, b) => a + b, 0) / recentHalf.length;
  const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;

  return recentAvg - olderAvg; // positive = intensifying, negative = easing
}

/**
 * Derive the current phase from recent signals
 * Uses only the last 10 signals for recency
 */
export function derivePhase(signals: Signal[]): UserPhase {
  // Not enough data to determine phase
  if (signals.length < 3) {
    return "settling";
  }

  // Take most recent 10 signals
  const recent = signals.slice(0, 10);

  // Count emotion and context frequencies
  const emotionCounts = countOccurrences(
    recent.map((s) => s.primary_emotion.toLowerCase())
  );
  const contextCounts = countOccurrences(
    recent.map((s) => s.context.toLowerCase())
  );

  const maxEmotionCount = getMaxCount(emotionCounts);
  const maxContextCount = getMaxCount(contextCounts);

  // Calculate emotional weight balance
  let heavyCount = 0;
  let lightCount = 0;
  for (const s of recent) {
    const emotion = s.primary_emotion.toLowerCase();
    if (heavyEmotions.has(emotion)) heavyCount++;
    if (lightEmotions.has(emotion)) lightCount++;
  }

  // Calculate intensity trend
  const trend = calculateIntensityTrend(recent);

  // Phase determination (order matters for priority)

  // Easing: intensity decreasing AND more light than heavy emotions
  if (trend < -0.3 && lightCount > heavyCount) {
    return "easing";
  }

  // Carrying: predominantly heavy emotions with stable or rising intensity
  if (heavyCount >= recent.length * 0.5 && trend >= -0.2) {
    return "carrying";
  }

  // Circling: clear recurrence in emotions or contexts
  if (maxEmotionCount >= 3 || maxContextCount >= 3) {
    return "circling";
  }

  // Default: settling (patterns not yet formed)
  return "settling";
}

/**
 * Hook to get the current user phase from their signals
 * Returns 'settling' when no signals or insufficient data
 */
export function useUserPhase(signals: Signal[] | undefined): UserPhase {
  return useMemo(() => {
    if (!signals || signals.length === 0) {
      return "settling";
    }
    return derivePhase(signals);
  }, [signals]);
}
