/**
 * Get page's elements
 */
const restartAuthenticationButton: HTMLButtonElement = document.querySelector('#restart-authentication');

/**
 * Add event listener on window.load to put all process in place
 */
window.addEventListener('load', () => {
  restartAuthenticationButton.addEventListener('click', () => {
    // disable button
    restartAuthenticationButton.disabled = true;

    // redirect user
    window.location.href = '/';
  });
});
