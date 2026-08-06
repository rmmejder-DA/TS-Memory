import { renderField } from './render'

/**
 * Gets the selected board count from radio buttons.
 * @param radios - NodeList of radio input elements
 * @returns The number of cards (16, 24, 36, or 0)
 */
function getBoardCount(radios: NodeListOf<HTMLInputElement>): number {
    return radios[0].checked ? 16 : radios[1].checked ? 24 : radios[2].checked ? 36 : 0
}

/**
 * Updates localStorage with the board count.
 * @param count - The number of cards to store
 */
function updateLocalStorage(count: number): void {
    if (count > 0) {
        localStorage.setItem("boardCount", count.toString());
    } else {
        localStorage.removeItem("boardCount");
    }
}

/**
 * Updates the board display with the selected count.
 * @param boardView - The display element
 * @param count - The number of cards
 */
function updateBoardDisplay(boardView: HTMLElement, count: number): void {
    boardView.textContent = count ? `${count} cards` : "Board size"
    if (count) renderField(count)
    updateLocalStorage(count)
}

/**
 * Loads and selects the stored board count from localStorage.
 */
function loadStoredBoardCount(radios: NodeListOf<HTMLInputElement>) {
    // Only load stored board count if game was previously started
    const gameStarted = localStorage.getItem('gameStarted')
    if (!gameStarted) return
    
    const storedBoardCount = localStorage.getItem('boardCount')
    if (storedBoardCount) {
        const count = Number(storedBoardCount)
        const boardValue = count === 16 ? '4x4' : count === 24 ? '4x6' : '6x6'
        Array.from(radios).find(radio => radio.value === boardValue)?.click()
    }
}

/**
 * Initializes the board size selector with radio button listeners.
 */
export function initBoardSelector() {
    const boardView = document.getElementById("boardview")
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="board"]')
    if (!boardView || !radios.length) return
    loadStoredBoardCount(radios)
    const update = () => updateBoardDisplay(boardView, getBoardCount(radios))
    radios.forEach(radio => radio.addEventListener("change", update))
}

/**
 * Restores the board state from localStorage on play page.
 */
export function initBoardStateOnPlay() {
    if (document.getElementById('field')) {
        const stored = localStorage.getItem('boardCount')
        if (stored) renderField(Number(stored))
    }
}

const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;

if (navigation?.type === "reload") {
    localStorage.clear();
}
