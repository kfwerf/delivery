import VanillaToasts from 'vanillatoasts/vanillatoasts.js';

const className = 'toast-container';
const toastContainer = document.createElement('section');
toastContainer.classList.add(className);
document.body.appendChild(toastContainer);

const toastManager = {
  notify: (title: string, text: string, type: string): void => {
    new Notification(title, {
      body: text,
      icon: `${__dirname}/AppIcon.icns`,
    });

    VanillaToasts.create({
      title,
      text,
      type,
      timeout: 3000, // hide after 5000ms, // optional parameter
    });
  },
};

export default toastManager;
