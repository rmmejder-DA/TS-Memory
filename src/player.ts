// Player-Management

export function initPlayerSelector() {
    const preview = document.getElementById("player-preview")
    const playerView = document.getElementById("playerview")
    const boxes = document.querySelectorAll<HTMLInputElement>('input[name="player"]')
    if (!preview || !boxes.length) return

    const update = () => {
        const selected = Array.from(boxes).filter(r => r.checked)
        const html = selected.map(r => {
            const src = r.value === 'player1' ? '/icon/chess_pawn-blue.png' : '/icon/chess_pawn-orange.png'
            return `<img src="${src}" alt="${r.value}">`
        }).join("")
        preview.innerHTML = html
        preview.style.display = selected.length ? "block" : "none"
        if (playerView) playerView.style.display = selected.length ? "none" : "inline"
        const json = selected.length ? JSON.stringify(selected.map(r => r.value)) : null
        if (json) localStorage.setItem("selectedPlayers", json)
        else localStorage.removeItem("selectedPlayers")
    }

    boxes.forEach(box => box.addEventListener("change", update))
    update()
}
