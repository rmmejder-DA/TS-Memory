/**
 * Initializes the exit game handler with popup and confirmation.
 * Saves current game settings to localStorage before exiting.
 */
export function initExitHandler() {
    const exitBtn = document.getElementById("exitGame") as HTMLButtonElement
    const popup = document.getElementById("exitPopup") as HTMLDivElement
    const backBtn = document.getElementById("backToGame") as HTMLButtonElement
    const confirmBtn = document.getElementById("confirmExit") as HTMLButtonElement

    if (!exitBtn || !popup || !backBtn || !confirmBtn) return

    exitBtn.addEventListener("click", () => popup.style.display = "flex")
    backBtn.addEventListener("click", () => popup.style.display = "none")
    confirmBtn.addEventListener("click", () => {
        saveCurrentSettings();
        sessionStorage.setItem("restoreSettings", "true");
        window.location.href = "setting.html";
    });
}

/**
 * Saves the current theme and board settings to localStorage.
 */
function saveCurrentSettings() {
    const theme = document.body.classList.contains("theme-food")
        ? "dark"
        : "light";
    localStorage.setItem("selectedTheme", theme);
    const field = document.getElementById("field");
    if (field) {
        const cardCount = field.querySelectorAll(".card").length;
        if (cardCount > 0) {
            localStorage.setItem("boardCount", cardCount.toString());
        }
    }
}
