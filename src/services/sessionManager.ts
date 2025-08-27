import { createReviewSession, getReviewSessionStatus } from './supabase/sessions';

import type { ReviewSessionStatus } from './supabase/types';

const SESSION_ID_KEY_FRONT = 'reviewSessionId';
const SESSION_ID_KEY_BACK = 'reviewSessionIdBack';

export async function initializeSession(userId?: string): Promise<{
  sessionId: string;
  sessionStatus: ReviewSessionStatus | null;
}> {
  // Always have a stable sessionId per user
  let sessionId = localStorage.getItem(SESSION_ID_KEY_FRONT);

  console.log(sessionId);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY_FRONT, sessionId);

    // Create the session in the DB with user_id if available
    await createReviewSession({ 
      session_id: sessionId,
      user_id: userId || null 
    });
  }

  // Retrieve the current status
  const sessionStatus = await getReviewSessionStatus(sessionId);

  if (sessionStatus?.id) {
    localStorage.setItem(SESSION_ID_KEY_BACK, sessionStatus.id);
  }

  return {
    sessionId,
    sessionStatus,
  };
}

export async function getSessionId(): Promise<string | null> {
  return localStorage.getItem(SESSION_ID_KEY_FRONT);
}

export async function getSessionIdBack(): Promise<string | null> {
  return localStorage.getItem(SESSION_ID_KEY_BACK);
}
