// Exit-Popup Handler

export function initExitHandler() {
    const exitBtn = document.getElementById("exitGame") as HTMLButtonElement
    const popup = document.getElementById("exitPopup") as HTMLDivElement
    const backBtn = document.getElementById("backToGame") as HTMLButtonElement
    const confirmBtn = document.getElementById("confirmExit") as HTMLButtonElement

    if (!exitBtn || !popup || !backBtn || !confirmBtn) return

    exitBtn.addEventListener("click", () => popup.style.display = "flex")
    backBtn.addEventListener("click", () => popup.style.display = "none")
    confirmBtn.addEventListener("click", () => window.location.href = "index.html")
}
