// Player-Management

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
    // Ensure only one player is checked at a time
    let checkedCount = 0
    let selectedPlayer: string | null = null
    boxes.forEach(box => {
        if (box.checked) {
            checkedCount++
            if (checkedCount > 1) {
                box.checked = false
            } else {
                selectedPlayer = box.value
            }
        }
    })
    
    // Get the selected player
    const selected = selectedPlayer ? [selectedPlayer] : []
    
    // Ensure exactly 2 players: selected first, then the other
    let playersToStore: string[] = []
    if (selected.length > 0) {
        playersToStore = [selected[0]]
        const other = selected[0] === 'player1' ? 'player2' : 'player1'
        playersToStore.push(other)
    } else {
        playersToStore = ['player1', 'player2']
    }
    
    // Update preview display
    const html = selected.map(r => `<img src="${getPlayerIconSrc(r)}" alt="${r}">`).join("")
    preview.innerHTML = html
    preview.style.display = selected.length ? "flex" : "none"
    preview.style.justifyContent = "center"
    preview.style.alignItems = "center"
    if (playerView) playerView.style.display = selected.length ? "none" : "inline"
    
    // Always store 2 players
    localStorage.setItem("selectedPlayers", JSON.stringify(playersToStore))
}

/**
 * Initializes the player selector with checkboxes and preview.
 */
export function initPlayerSelector() {
    const preview = document.getElementById("player-preview")
    const playerView = document.getElementById("playerview")
    const boxes = document.querySelectorAll<HTMLInputElement>('input[name="player"]')
    if (!preview || !boxes.length) return
    boxes.forEach(box => {
        box.addEventListener("change", () => {
            // Uncheck the other player if this one is checked
            if (box.checked) {
                boxes.forEach(b => {
                    if (b !== box) b.checked = false
                })
            }
            updatePlayerPreview(preview, playerView, boxes)
        })
    })
    updatePlayerPreview(preview, playerView, boxes)
}
