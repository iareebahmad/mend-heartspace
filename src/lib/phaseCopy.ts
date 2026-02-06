import { UserPhase } from "@/hooks/useUserPhase";

/**
 * Phase-aware copy utilities
 * All copy is intentionally gentle, tentative, and non-clinical
 * Phases are never named or explained to the user
 */

type CopyVariant = {
  settling: string;
  circling: string;
  carrying: string;
  easing: string;
};

function getPhraseCopy(phase: UserPhase, variants: CopyVariant): string {
  return variants[phase];
}

/**
 * AI Companion opening line (first assistant message for new conversations)
 */
export function getCompanionOpeningLine(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "How are you feeling right now?",
    circling: "I notice you've been sitting with something. What feels present today?",
    carrying: "You've been holding a lot lately. What's here with you right now?",
    easing: "How are things feeling today?",
  });
}

/**
 * AI Companion welcome subtext (shown in empty state)
 */
export function getCompanionWelcomeText(phase: UserPhase, isAuthenticated: boolean): string {
  if (!isAuthenticated) {
    return "This is a safe, private space. Take your time.";
  }
  
  return getPhraseCopy(phase, {
    settling: "This is your space to check in. How are you feeling?",
    circling: "You keep showing up here. That matters.",
    carrying: "This is your space. There's no rush.",
    easing: "Good to see you. Take your time.",
  });
}

/**
 * Patterns & Insights empty state heading
 */
export function getPatternsEmptyHeading(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "Your patterns are still forming",
    circling: "Patterns take shape slowly",
    carrying: "Understanding grows with time",
    easing: "You've been building something here",
  });
}

/**
 * Patterns & Insights empty state body text
 */
export function getPatternsEmptyBody(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "MEND is still listening. Patterns show up after a few honest conversations.",
    circling: "Each check-in adds a thread. The picture becomes clearer over time.",
    carrying: "Even when things feel heavy, small moments of reflection matter.",
    easing: "Patterns emerge when you least expect them. Keep going.",
  });
}

/**
 * Primary CTA text for starting a conversation
 */
export function getStartConversationCTA(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "Start a conversation",
    circling: "Continue",
    carrying: "Take a moment",
    easing: "Check in",
  });
}

/**
 * CTA text for adding a check-in (used in patterns page, cards, etc.)
 */
export function getAddCheckInCTA(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "Add a check-in",
    circling: "Continue",
    carrying: "Pause here",
    easing: "Add a check-in",
  });
}

/**
 * Short CTA for inline use
 */
export function getShortCTA(phase: UserPhase): string {
  return getPhraseCopy(phase, {
    settling: "Check in",
    circling: "Continue",
    carrying: "Pause",
    easing: "Check in",
  });
}
