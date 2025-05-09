const localStorage = {
  getItem: (key: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Use Chrome Storage API
      chrome.storage.local.get([key], function (result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[key] || null); // Return null if the key doesn't exist, mimicking AsyncStorage's behavior
        }
      });
    });
  },
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Use Chrome Storage API
      chrome.storage.local.set({ [key]: value }, function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Use Chrome Storage API
      chrome.storage.local.remove([key], function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
};

export default localStorage;
