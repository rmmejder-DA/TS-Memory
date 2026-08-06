/**
 * Gets the player icon source path.
 * @param value - Player identifier ('player1' or 'player2')
 * @returns The icon SVG path
 */
function getPlayerIconSrc(value: string): string {
    return value === 'player1' ? '/icon/chess_pawn-blue.svg' : '/icon/chess_pawn-orange.svg'
}

/**
 * Updates the player preview display and localStorage.
 * Ensures only one player is selected, with exactly 2 players stored.
 * @param preview - The preview container element
 * @param playerView - The player view label element
 * @param boxes - NodeList of player checkbox elements
 */
function updatePlayerPreview(preview: HTMLElement, playerView: HTMLElement | null, boxes: NodeListOf<HTMLInputElement>) {
    const selected = Array.from(boxes).find(box => box.checked)?.value ?? null
    const playersToStore = selected ? [selected, selected === 'player1' ? 'player2' : 'player1'] : ['player1', 'player2']
    const html = selected ? `<img src="${getPlayerIconSrc(selected)}" alt="${selected}">` : ''
    preview.innerHTML = html
    preview.style.cssText = `display: ${selected ? 'flex' : 'none'}; justify-content: center; align-items: center`
    if (playerView) playerView.style.display = selected ? 'none' : 'inline'
    localStorage.setItem("selectedPlayers", JSON.stringify(playersToStore))
}

/**
 * Loads and selects the stored player from localStorage.
 */
function loadStoredPlayer(boxes: NodeListOf<HTMLInputElement>) {
    const storedPlayers = localStorage.getItem('selectedPlayers')
    if (storedPlayers) {
        try {
            const players = JSON.parse(storedPlayers) as string[]
            Array.from(boxes).find(box => box.value === players[0])?.click()
        } catch (e) {
            console.error('Error parsing stored players:', e)
        }
    }
}

/**
 * Initializes the player selector with checkboxes and preview.
 */
export function initPlayerSelector() {
    const preview = document.getElementById("player-preview")
    const playerView = document.getElementById("playerview")
    const boxes = document.querySelectorAll<HTMLInputElement>('input[name="player"]')
    if (!preview || !boxes.length) return
    loadStoredPlayer(boxes)
    Array.from(boxes).forEach(box => box.addEventListener("change", () => {
        Array.from(boxes).forEach(b => b !== box && (b.checked = false))
        updatePlayerPreview(preview, playerView, boxes)
    }))
    updatePlayerPreview(preview, playerView, boxes)
}
