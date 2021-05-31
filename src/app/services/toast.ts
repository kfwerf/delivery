// @ts-ignore
import VanillaToasts from 'vanillatoasts/vanillatoasts.js';

const className = 'toast-container';
const toastContainer = document.createElement('section');
toastContainer.classList.add(className);
const container = document.body.appendChild(toastContainer);

const toastManager = {
    notify: (title: string, text: string, type: string) => {
        VanillaToasts.create({
            title,
            text,
            type,
            timeout: 10000 // hide after 5000ms, // optional parameter
        });
    }
}

export default toastManager;