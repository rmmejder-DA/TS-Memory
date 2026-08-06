import { getPlayerIcon } from './utils'
import { GameState, getWinner } from './gamestate'

/**
 * Initializes the gameplay with board setup and event listeners.
 */
export function initGameplay() {
    const field = document.getElementById("field")
    if (!field) return

    const state = new GameState(field.querySelectorAll('.card').length / 2)
    setupUIUpdates(state)
    setupCardClickListener(field, state)
    setupTestingFunctions(state)
}

/**
 * Sets up all UI update handlers for the game state.
 * @param state - The current game state
 */
function setupUIUpdates(state: GameState) {
    updateScoresUI(state)
    updatePlayerViewUI(state)
    updateCurrentPlayerUI(state)
    updateExitButtonIcon(state)
}

/**
 * Updates the score display for all players.
 * @param state - The current game state
 */
function updateScoresUI(state: GameState) {
    Array.from(document.querySelectorAll<HTMLElement>("#playerview #counter"))
        .forEach((span, i) => span.textContent = String(state.scores[i] ?? 0))
}

/**
 * Updates the player view UI with current scores and icons.
 * @param state - The current game state
 */
function updatePlayerViewUI(state: GameState) {
    const playerView = document.getElementById("playerview")
    if (!playerView) return
    const isCodeTheme = state.theme === 'light'
    playerView.innerHTML = state.players
        .map((p, i) => {
            const label = p === 'player1' ? 'Blue' : 'Orange'
            const counterClass = p === 'player1' ? 'player1' : 'player2'
            const labelMarkup = isCodeTheme ? `<span class="${counterClass}">${label}</span>` : ''
            return `<img src="${getPlayerIcon(p, state.theme)}" alt="player${i}">${labelMarkup}<span id="counter" class="${counterClass}">${state.scores[i] ?? 0}</span>`
        })
        .join("")
}

/**
 * Updates the current player indicator icon.
 * @param state - The current game state
 */
function updateCurrentPlayerUI(state: GameState) {
    const img = document.getElementById("player") as HTMLImageElement | null
    if (img) {
        if (state.theme === 'dark') {
            img.src = '/icon/chess_pawn-transparent.svg'
            img.classList.remove('player-current--blue', 'player-current--orange')
            const currentPlayer = state.players[state.currentPlayerIndex]
            img.classList.add(currentPlayer === 'player1' ? 'player-current--blue' : 'player-current--orange')
        } else {
            img.src = getPlayerIcon(state.players[state.currentPlayerIndex], state.theme)
            img.classList.remove('player-current--blue', 'player-current--orange')
        }
    }
}

/**
 * Updates the exit button icon based on theme.
 * @param state - The current game state
 */
function updateExitButtonIcon(state: GameState) {
    const img = document.querySelector<HTMLImageElement>(".exitGameBtn img")
    if (img) img.src = state.theme === 'light' ? '/icon/move_item.svg' : '/icon/move_item-orange.svg'
}

/**
 * Attaches click listener to the game field.
 * @param field - The game field element
 * @param state - The current game state
 */
function setupCardClickListener(field: HTMLElement, state: GameState) {
    field.addEventListener("click", e => handleCardClick(e, field, state))
}

/**
 * Handles card click events during gameplay.
 * @param e - The click event
 * @param field - The game field element
 * @param state - The current game state
 */
function handleCardClick(e: Event, field: HTMLElement, state: GameState) {
    const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
    if (!card || state.lockBoard || state.gameOver || card.classList.contains("is-flipped") || card.dataset.matched) return
    card.classList.add("is-flipped")
    state.openedCards.push(card)
    if (state.openedCards.length < 2) return
    state.lockBoard = true
    const [first, second] = state.openedCards
    checkMatch(first, second, state)
}

/**
 * Checks if two cards match and updates game state accordingly.
 * @param first - First card element
 * @param second - Second card element
 * @param state - The current game state
 */
function checkMatch(first: HTMLButtonElement, second: HTMLButtonElement, state: GameState) {
    if (first.dataset.image === second.dataset.image) {
        handleMatch(first, second, state)
        return
    }
    handleMismatch(first, second, state)
}

/**
 * Handles a successful card match.
 * @param first - First matched card
 * @param second - Second matched card
 * @param state - The current game state
 */
function handleMatch(first: HTMLButtonElement, second: HTMLButtonElement, state: GameState) {
    first.dataset.matched = "true"
    second.dataset.matched = "true"
    state.addScore()
    state.matchedPairs++
    updateScoresUI(state)
    state.resetCards()
    state.lockBoard = false
    if (state.isWin()) {
        state.gameOver = true
        window.setTimeout(() => showGameOver(state), 1500)
    }
}

/**
 * Handles a card mismatch by flipping them back.
 * @param first - First card
 * @param second - Second card
 * @param state - The current game state
 */
function handleMismatch(first: HTMLButtonElement, second: HTMLButtonElement, state: GameState) {
    state.lockBoard = true
    setTimeout(() => {
        first.classList.remove("is-flipped")
        second.classList.remove("is-flipped")
        state.resetCards()
        state.nextTurn()
        updateCurrentPlayerUI(state)
        state.lockBoard = false
    }, 900)
}

/**
 * Displays the game over screen with winner or draw information.
 * @param state - The final game state
 */
function showGameOver(state: GameState) {
    if (document.querySelector('.game-over')) return
    const { isDraw, winner } = getWinner(state)
    isDraw ? showDrawModal(state) : showGameOverModal(state, winner)
}

/**
 * Shows the draw result modal.
 * @param state - The game state
 */
function showDrawModal(state: GameState) {
    const icon = state.theme === 'light' ? '/icon/icon_white-draw.svg' : '/icon/icon_white-draw-vibe.svg'
    const div = document.createElement('div')
    div.className = 'draw-modal'
    div.innerHTML = `<div class="draw-modal__content"><p class="draw-modal__label">It's a</p><p class="draw-modal__text">DRAW</p><img src="${icon}" alt="draw"><button id="backToStart" class="draw-modal__button">HOME</button></div>`
    document.body.appendChild(div)
    document.getElementById('backToStart')?.addEventListener('click', () => window.location.href = '/setting.html')
}

/**
 * Shows the final scores modal.
 * @param state - The game state
 * @param winner - The winning player identifier
 */
function showGameOverModal(state: GameState, winner: string) {
    const overlay = document.createElement('div')
    overlay.className = 'game-over'
    const items = state.players.map((p, i) => renderGameOverItem(p, state.scores[i] ?? 0, state.theme)).join('')
    overlay.innerHTML = `<div class="game-over__content"><h2>Game Over</h2><p class="game-over__title">Final score</p><ul class="game-over__list">${items}</ul></div>`
    document.body.appendChild(overlay)
    setTimeout(() => showWinnerModal(state, winner), 1500)
}

/**
 * Renders a single game over score item.
 * @param player - Player identifier
 * @param score - Player's final score
 * @param theme - Current theme
 * @returns HTML string for the score item
 */
function renderGameOverItem(player: string, score: number, theme: string) {
    const label = player === 'player1' ? 'Blue' : 'Orange'
    const labelMarkup = theme === 'light' ? `<span class="${player}">${label}</span>` : ''
    return `<li class="game-over__item game-over__item--${player}"><img src="${getPlayerIcon(player, theme)}" alt="${player}" class="game-over__item__icon">${labelMarkup}<span>${score}</span></li>`
}

/**
 * Shows the winner modal with celebration.
 * @param state - The game state
 * @param winner - The winning player identifier
 */
function showWinnerModal(state: GameState, winner: string) {
    const safeWinner = winner === 'player1' || winner === 'player2' ? winner : 'player1'
    const label = safeWinner === 'player1' ? 'Blue' : 'Orange'
    const div = document.createElement('div')
    div.className = 'winner-modal'
    const conf = '<img src="/images/Confetti.png" class="confetti" alt="confetti">'
    const winnerIcon = state.theme === 'light'
        ? (safeWinner === 'player1' ? '/icon/chess_pawn-big-blue.svg' : '/icon/chess_pawn-big-orange.svg')
        : getPlayerIcon(safeWinner, state.theme)
    div.innerHTML = `<div class="winner-modal__content">${conf}<p class="winner-modal__label">The winner is</p><p class="winner-modal__text winner-modal__text--${safeWinner}">${label} Player</p><img src="${winnerIcon}" alt="player icon" class="winner-modal__pawn winner-modal__pawn--${safeWinner}"><button id="backToStart" class="winner-modal__button">Home</button></div>`
    document.body.appendChild(div)
    document.getElementById('backToStart')?.addEventListener('click', () => window.location.href = '/setting.html')
}

/**
 * Sets up testing/debugging functions on the window object.
 * @param state - The game state
 */
function setupTestingFunctions(state: GameState) {
    (window as any).forceGameOver = () => showGameOver(state);
    (window as any).forceWinner = () => {
        state.scores[0] = 2
        state.scores[1] = 5
        showGameOver(state)
    }
}

