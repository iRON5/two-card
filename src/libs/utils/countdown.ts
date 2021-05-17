let timeout = 0;

export const countdown = function* (secs: number) {
  clearTimeout(timeout);

  for (let i = secs; i >= 0; i--) {
    yield new Promise((resolve) => {
      timeout = window.setTimeout(() => resolve(i), 1000);
    });
  }
};
