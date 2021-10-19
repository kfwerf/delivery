export const PROGRESS_START = 'PROGRESS_START';
export const PROGRESS_STARTED = 'PROGRESS_STARTED';
export const PROGRESS_STOP = 'STOP_PROGRESS';
export const PROGRESS_STOPPED = 'PROGRESS_STOPPED';
export const PROGRESS_UPDATE = 'PROGRESS_UPDATE';

export type ProgressPayload = {
  type?: string;
  id?: string;
  durationMs?: number;
  timeout: NodeJS.Timeout;
};

export type ProgressUpdatePayload = {
  type?: string;
  value?: number;
};

const genericProgressAction = (payload: ProgressPayload) => {
  const { type, durationMs = 2000, timeout, id = `progress-${Math.random().toString(36).substr(2, 9)}` } = payload;
  return {
    type,
    id,
    durationMs,
    timeout,
  };
};

export const startProgress = (payload: ProgressPayload): ProgressPayload =>
  genericProgressAction({ ...payload, ...{ type: PROGRESS_START } });

export const startedProgress = (payload: ProgressPayload): ProgressPayload =>
  genericProgressAction({ ...payload, ...{ type: PROGRESS_STARTED } });

export const stopProgress = (payload: ProgressPayload): ProgressPayload =>
  genericProgressAction({ ...payload, ...{ type: PROGRESS_STOP } });

export const stoppedProgress = (payload: ProgressPayload): ProgressPayload =>
  genericProgressAction({ ...payload, ...{ type: PROGRESS_STOPPED } });

export const updateProgress = (amount: number): ProgressUpdatePayload => ({
  type: PROGRESS_UPDATE,
  value: Math.max(0, Math.min(100, amount)),
});
