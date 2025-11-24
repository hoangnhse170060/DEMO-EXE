const progressPrefix = 'history_progress:';
const quizPrefix = 'quiz_attempt:';
const pendingDigitalPurchaseKey = 'digital_purchase_pending';

const memoryStore = new Map<string, string>();

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readKey(key: string): string | null {
  const storage = getStorage();
  if (storage) {
    return storage.getItem(key);
  }
  return memoryStore.get(key) ?? null;
}

function writeKey(key: string, value: string | null) {
  const storage = getStorage();
  if (storage) {
    if (value === null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, value);
    }
    return;
  }

  if (value === null) {
    memoryStore.delete(key);
  } else {
    memoryStore.set(key, value);
  }
}

export type QuizAttemptSummary = {
  attemptNumber: number;
  score: number;
  stars: number;
  correct: number;
  total: number;
  attemptedAt: string;
  questionIds: string[];
};

export type HistoryProgress = {
  eventId: string;
  readRatio: number;
  completedAt?: string;
  attempts: QuizAttemptSummary[];
  bestScore?: number;
  bestStars?: number;
  lastAttemptAt?: string;
  // demo-only attempt control
  failedAttempts?: number;
  extraAttempts?: number;
  lockedUntil?: string | null;
};

export type PendingDigitalPurchase = {
  planId: string;
  eventId?: string;
  eventTitle?: string;
  quantity?: number;
  createdAt: string;
};

function createDefaultProgress(eventId: string): HistoryProgress {
  return {
    eventId,
    readRatio: 0,
    attempts: [],
    failedAttempts: 0,
    extraAttempts: 0,
    lockedUntil: null,
  };
}

export function getHistoryProgress(userId: string, eventId: string): HistoryProgress {
  const key = `${progressPrefix}${userId}:${eventId}`;
  const raw = readKey(key);
  if (!raw) {
    return createDefaultProgress(eventId);
  }

  try {
    const parsed = JSON.parse(raw) as HistoryProgress;
    return {
      ...createDefaultProgress(eventId),
      ...parsed,
      eventId,
    };
  } catch (error) {
    console.warn('Không thể parse history progress', error);
    return createDefaultProgress(eventId);
  }
}

export function saveHistoryProgress(userId: string, progress: HistoryProgress) {
  const key = `${progressPrefix}${userId}:${progress.eventId}`;
  writeKey(key, JSON.stringify(progress));
}

export function updateHistoryProgress(
  userId: string,
  eventId: string,
  updates: Partial<HistoryProgress>,
): HistoryProgress {
  const current = getHistoryProgress(userId, eventId);
  const next: HistoryProgress = {
    ...current,
    ...updates,
    eventId,
    readRatio: Math.max(current.readRatio, updates.readRatio ?? current.readRatio),
  };
  if (next.readRatio >= 0.8 && !next.completedAt) {
    next.completedAt = updates.completedAt ?? new Date().toISOString();
  }
  saveHistoryProgress(userId, next);
  return next;
}

export function recordQuizAttempt(userId: string, eventId: string, summary: QuizAttemptSummary): HistoryProgress {
  const current = getHistoryProgress(userId, eventId);
  const attempts = [...current.attempts, summary];
  const bestScore = Math.max(current.bestScore ?? 0, summary.score);
  const bestStars = Math.max(current.bestStars ?? 0, summary.stars);
  const next: HistoryProgress = {
    ...current,
    attempts,
    bestScore,
    bestStars,
    lastAttemptAt: summary.attemptedAt,
  };
  saveHistoryProgress(userId, next);
  return next;
}

/**
 * Add extra attempts (e.g., after purchase) and clear lock.
 */
export function addExtraAttempts(userId: string, eventId: string, count: number): HistoryProgress {
  const current = getHistoryProgress(userId, eventId);
  const next: HistoryProgress = {
    ...current,
    extraAttempts: (current.extraAttempts || 0) + count,
    lockedUntil: null,
  };
  saveHistoryProgress(userId, next);
  return next;
}

/**
 * Set a lock until a future timestamp (ISO string) and reset extraAttempts/failedAttempts as needed.
 */
export function setLockForEvent(userId: string, eventId: string, untilIso: string | null): HistoryProgress {
  const current = getHistoryProgress(userId, eventId);
  const next: HistoryProgress = {
    ...current,
    lockedUntil: untilIso,
    // if locking, reset extraAttempts and failedAttempts
    extraAttempts: untilIso ? 0 : current.extraAttempts,
    failedAttempts: untilIso ? 0 : current.failedAttempts,
  };
  saveHistoryProgress(userId, next);
  return next;
}

export type PersistedQuizState = {
  eventId: string;
  startedAt: string;
  questionIds: string[];
  answers: (number | null)[];
  expiresAt?: string;
};

export function getQuizState(userId: string, eventId: string): PersistedQuizState | null {
  const key = `${quizPrefix}${userId}:${eventId}`;
  const raw = readKey(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersistedQuizState;
  } catch (error) {
    console.warn('Không thể đọc quiz state', error);
    writeKey(key, null);
    return null;
  }
}

export function saveQuizState(userId: string, state: PersistedQuizState | null, eventId?: string) {
  const targetEventId = state?.eventId ?? eventId;
  if (!targetEventId) {
    throw new Error('eventId is required when clearing quiz state.');
  }
  const key = `${quizPrefix}${userId}:${targetEventId}`;
  if (!state) {
    writeKey(key, null);
    return;
  }
  writeKey(key, JSON.stringify(state));
}

export function setPendingDigitalPurchase(purchase: PendingDigitalPurchase | null) {
  if (purchase === null) {
    writeKey(pendingDigitalPurchaseKey, null);
    return;
  }
  writeKey(pendingDigitalPurchaseKey, JSON.stringify(purchase));
}

export function getPendingDigitalPurchase(): PendingDigitalPurchase | null {
  const raw = readKey(pendingDigitalPurchaseKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingDigitalPurchase;
  } catch (error) {
    console.warn('Không thể đọc pending digital purchase', error);
    writeKey(pendingDigitalPurchaseKey, null);
    return null;
  }
}

export function popPendingDigitalPurchase(planId?: string): PendingDigitalPurchase | null {
  const pending = getPendingDigitalPurchase();
  if (!pending) return null;
  if (planId && pending.planId !== planId) {
    return null;
  }
  writeKey(pendingDigitalPurchaseKey, null);
  return pending;
}
