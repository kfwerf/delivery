export const TOAST_ADD = 'TOAST_ADD';
export const TOAST_ADDED = 'TOAST_ADDED';

export type ToastPayload = {
  type: string;
  title: string;
  text: string;
  toastType: string;
};

export const addToast = (title: string, text: string, type = 'success'): ToastPayload => ({
  type: TOAST_ADD,
  title,
  text,
  toastType: type,
});

export const addedToast = (title: string, text: string, type = 'success'): ToastPayload => ({
  type: TOAST_ADDED,
  title,
  text,
  toastType: type,
});
