/**
 * Conversational time dividers for the Companion chat.
 * These create gentle temporal markers that help users orient
 * within longer conversations without clinical labeling.
 */

import { formatDistanceToNow, isToday, isYesterday, differenceInMinutes } from "date-fns";

const QUIET_LABELS = [
  "A quiet moment",
  "A pause",
  "Some time passed",
  "A breath between",
];

/**
 * Returns a soft divider label if enough time has passed between two messages.
 * Returns null if no divider is needed.
 */
export function getTimeDivider(
  prevTimestamp: string | null,
  currentTimestamp: string | null
): string | null {
  if (!prevTimestamp || !currentTimestamp) return null;

  const prev = new Date(prevTimestamp);
  const current = new Date(currentTimestamp);
  const gap = differenceInMinutes(current, prev);

  // Less than 30 minutes — no divider
  if (gap < 30) return null;

  // 30 min – 2 hours: a quiet moment
  if (gap < 120) {
    return QUIET_LABELS[Math.floor(Math.random() * QUIET_LABELS.length)];
  }

  // Same day, >2 hours
  if (isToday(current) && isToday(prev)) {
    const hour = current.getHours();
    if (hour < 12) return "Earlier this morning";
    if (hour < 17) return "Earlier this afternoon";
    return "Earlier this evening";
  }

  // Yesterday
  if (isYesterday(prev)) {
    return "Yesterday";
  }

  // Older
  const distance = formatDistanceToNow(prev, { addSuffix: false });
  return `${distance} ago`;
}
