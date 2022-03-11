var deferredPrompt;

document.addEventListener('DOMContentLoaded', function(event){
	


});

// https://developers.google.com/web/ilt/pwa/lab-offline-quickstart#52_activating_the_install_prompt
window.addEventListener('beforeinstallprompt', (event) => {

	// Prevent Chrome 67 and earlier from automatically showing the prompt
	event.preventDefault();

	// Stash the event so it can be triggered later.
	deferredPrompt = event;

	// Attach the install prompt to a user gesture
	document.getElementById('install').addEventListener('click', (event) => {

		// Show the prompt
		deferredPrompt.prompt();

		// Wait for the user to respond to the prompt
		deferredPrompt.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === 'accepted') {
				console.log('User accepted the A2HS prompt');
			}
			else {
				console.log('User dismissed the A2HS prompt');
			}
			deferredPrompt = null;
		});
	});

	document.getElementById('install').setAttribute('aria-hidden', false);
});

// When the app is installed it should remove the install snackbar
window.addEventListener('appinstalled', (event) => {
	console.log('a2hs installed');
	document.getElementById('install').setAttribute('aria-hidden', true);
});