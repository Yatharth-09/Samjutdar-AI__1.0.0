'use client';

import { useState, useEffect } from 'react';
import { getAnalytics, saveAnalytics } from '@/lib/storage';
import {
  getWeeklyAnalytics,
  getRecoveryMetrics,
  getDateString,
} from '@/lib/analytics';
import type { TasksByDate } from '@/types/task';
import type { AnalyticsState } from '@/types/analytics';
import type { BodyTransformationMode } from '@/types/mode';
import { APP_CONFIG } from '@/lib/constants';

/**
 * Custom hook for analytics computation and caching
 * Caches results for performance, invalidates on interval
 */

export function useAnalytics(
  allTasks: TasksByDate,
  currentMode: BodyTransformationMode
): AnalyticsState | null {
  const [analytics, setAnalytics] = useState<AnalyticsState | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Calculate and cache analytics
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const cached = getAnalytics();
    const now = Date.now();

    // Use cache if still valid
    if (
      cached &&
      cached.lastUpdated &&
      now - cached.lastUpdated < APP_CONFIG.ANALYTICS_CACHE_DURATION
    ) {
      setAnalytics(cached);
      return;
    }

    // Calculate new analytics
    const weekly = getWeeklyAnalytics(allTasks, undefined, currentMode);
    const recovery = getRecoveryMetrics(allTasks, currentMode);

    const newAnalytics: AnalyticsState = {
      weekly,
      recovery,
      lastUpdated: now,
    };

    setAnalytics(newAnalytics);
    saveAnalytics(newAnalytics);
  }, [allTasks, currentMode, isClient]);

  return analytics;
}
