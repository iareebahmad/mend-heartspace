/**
 * Emotional weight classification for timeline visualization.
 * These mappings support gentle narrative insights without clinical language.
 */

// Emotional weight categories
export type EmotionalWeight = "light" | "medium" | "heavy";

// Map primary emotions to their emotional weight
const emotionWeightMap: Record<string, EmotionalWeight> = {
  // Light emotions - more buoyant, open
  calm: "light",
  content: "light",
  hopeful: "light",
  grateful: "light",
  joyful: "light",
  excited: "light",
  relieved: "light",
  motivated: "light",
  
  // Medium emotions - mixed, transitional
  tired: "medium",
  confused: "medium",
  insecure: "medium",
  uncertain: "medium",
  numb: "medium",
  
  // Heavy emotions - more weighty, grounded
  overwhelmed: "heavy",
  stressed: "heavy",
  uneasy: "heavy",
  anxious_like: "heavy",
  sad: "heavy",
  heavy: "heavy",
  lonely: "heavy",
  frustrated: "heavy",
  angry: "heavy",
  guilty: "heavy",
  ashamed: "heavy",
  hurt: "heavy",
  distressed: "heavy",
};

// Soft, non-clinical emotion labels for display
const softEmotionLabels: Record<string, string> = {
  // Light
  calm: "calm",
  content: "at ease",
  hopeful: "hopeful",
  grateful: "grateful",
  joyful: "lighter",
  excited: "energized",
  relieved: "relieved",
  motivated: "focused",
  
  // Medium
  tired: "drained",
  confused: "uncertain",
  insecure: "unsure",
  uncertain: "unsettled",
  numb: "distant",
  
  // Heavy
  overwhelmed: "overwhelmed",
  stressed: "tense",
  uneasy: "uneasy",
  anxious_like: "uneasy",
  sad: "heavy",
  heavy: "heavy",
  lonely: "lonely",
  frustrated: "frustrated",
  angry: "frustrated",
  guilty: "weighed down",
  ashamed: "weighed down",
  hurt: "tender",
  distressed: "stirred up",
};

export function getEmotionalWeight(emotion: string): EmotionalWeight {
  const normalized = emotion.toLowerCase().trim();
  return emotionWeightMap[normalized] || "medium";
}

export function getSoftEmotionLabel(emotion: string): string {
  const normalized = emotion.toLowerCase().trim();
  return softEmotionLabels[normalized] || normalized;
}

// Get a gentle time bucket label
export function getTimeBucketLabel(bucket: string): string {
  const labels: Record<string, string> = {
    morning: "morning",
    afternoon: "afternoon", 
    evening: "evening",
    night: "night",
    late_night: "late night",
  };
  return labels[bucket.toLowerCase()] || bucket;
}
