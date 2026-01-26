// Run immediately to avoid flash of wrong text
(function () {
    function updatePWAStatus() {
        const installBtn = document.getElementById('pwaInstallBtn');
        const statusMsg = document.getElementById('pwaStatusMsg');
        let deferredPrompt;

        if (!installBtn || !statusMsg) return;

        // 1. Check if running as PWA (Standalone)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true ||
            document.referrer.includes('android-app://');

        if (isStandalone) {
            installBtn.style.display = 'none';
            statusMsg.textContent = "✅ App is Installed";
            statusMsg.style.color = "#4ade80"; // Bright Green
            statusMsg.style.fontWeight = "bold";
            return;
        }

        // 2. Listen for Install Prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // Show Install Button
            installBtn.style.display = 'inline-flex';
            statusMsg.textContent = "App is ready to install";
            statusMsg.style.color = "var(--cyan-accent)";
        });

        // 3. Handle Install Click
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;

            if (outcome === 'accepted') {
                installBtn.style.display = 'none';
                statusMsg.textContent = "Installing...";
            }
        });

        // 4. Listen for Successful Install
        window.addEventListener('appinstalled', () => {
            installBtn.style.display = 'none';
            statusMsg.textContent = "✅ App is Installed";
            statusMsg.style.color = "#4ade80";
        });

        // 5. Timeout to clear "Checking..." if nothing happens
        setTimeout(() => {
            if (statusMsg.textContent.includes('Checking') && !deferredPrompt && !isStandalone) {
                // Try to detect if installed via detailed API (Chrome 80+)
                if ('getInstalledRelatedApps' in navigator) {
                    navigator.getInstalledRelatedApps().then(apps => {
                        if (apps.length > 0) {
                            statusMsg.textContent = "✅ App is Installed";
                            statusMsg.style.color = "#4ade80";
                        } else {
                            statusMsg.textContent = ""; // Clear text if just viewing website
                        }
                    }).catch(() => {
                        statusMsg.textContent = "";
                    });
                } else {
                    statusMsg.textContent = ""; // Clear text
                }
            }
        }, 2000);
    }

    // Call on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updatePWAStatus);
    } else {
        updatePWAStatus();
    }
})();
