export const ADD_TOAST = 'ADD_TOAST';

export const addToast = (title: string, text: string, type: string = 'success') => ({
    type: ADD_TOAST,
    title,
    text,
    toastType: type,
})