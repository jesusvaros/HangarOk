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

  console.log('Current sessionId from localStorage:', sessionId);

  // Check if existing session is completed
  if (sessionId) {
    const existingStatus = await getReviewSessionStatus(sessionId);
    
    // If session is completed (all 5 steps done), create a new session
    const isCompleted = existingStatus?.step1_completed && 
                       existingStatus?.step2_completed && 
                       existingStatus?.step3_completed && 
                       existingStatus?.step4_completed && 
                       existingStatus?.step5_completed;
    
    if (isCompleted) {
      console.log('Previous session completed, creating new session');
      // Clear old session IDs
      localStorage.removeItem(SESSION_ID_KEY_FRONT);
      localStorage.removeItem(SESSION_ID_KEY_BACK);
      sessionId = null;
    }
  }

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY_FRONT, sessionId);

    // Create the session in the DB with user_id if available
    try {
      await createReviewSession({ 
        session_id: sessionId,
        user_id: userId || null 
      });
      console.log('✅ Session created successfully:', sessionId);
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      // Continue anyway - session will be created on first save
    }
  }

  // Retrieve the current status
  const sessionStatus = await getReviewSessionStatus(sessionId);

  if (sessionStatus?.id) {
    // Store the database row ID for foreign key references in step submissions
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
