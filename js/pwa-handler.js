document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const installBtn = document.getElementById('pwaInstallBtn');
    const statusMsg = document.getElementById('pwaStatusMsg');

    if (!installBtn) return;

    // 1. Listen for the 'beforeinstallprompt' event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;

        // Update UI notify the user they can install the PWA
        installBtn.style.display = 'inline-flex';
        statusMsg.textContent = "App is ready to install!";
        statusMsg.style.color = "var(--cyan-accent)";

        console.log('PWA: beforeinstallprompt fired');
    });

    // 2. Handle the install button click
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA: User response to install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null;

        // Hide button again if installed (or dismissed, though usually we keep it if dismissed)
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
            statusMsg.textContent = "Thank you for installing!";
            statusMsg.style.color = "var(--secondary-color)";
        }
    });

    // 3. Check if app is already installed
    window.addEventListener('appinstalled', (evt) => {
        console.log('PWA: App was successfully installed');
        installBtn.style.display = 'none';
        statusMsg.textContent = "App is currently installed.";
        statusMsg.style.color = "#4ade80"; // Green
    });
});
