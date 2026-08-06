// Gameplay-Logik

import { getPlayerIcon } from './utils'
import { GameState, getWinner } from './gamestate'

export function initGameplay() {
    const field = document.getElementById("field")
    if (!field) return

    const state = new GameState(field.querySelectorAll('.card').length / 2)
    setupUIUpdates(state)
    setupCardClickListener(field, state)
    setupTestingFunctions(state)
}

function setupUIUpdates(state: GameState) {
    updateScoresUI(state)
    updatePlayerViewUI(state)
    updateCurrentPlayerUI(state)
    updateExitButtonIcon(state)
}

function updateScoresUI(state: GameState) {
    Array.from(document.querySelectorAll<HTMLElement>("#playerview #counter"))
        .forEach((span, i) => span.textContent = String(state.scores[i] ?? 0))
}

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

function updateExitButtonIcon(state: GameState) {
    const img = document.querySelector<HTMLImageElement>(".exitGameBtn img")
    if (img) img.src = state.theme === 'light' ? '/icon/move_item.svg' : '/icon/move_item-orange.svg'
}

function setupCardClickListener(field: HTMLElement, state: GameState) {
    field.addEventListener("click", e => handleCardClick(e, field, state))
}

function handleCardClick(e: Event, field: HTMLElement, state: GameState) {
    const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
    if (!card || state.lockBoard || state.gameOver || card.classList.contains("is-flipped") || card.dataset.matched) return
    if (state.openedCards.length >= 2) return

    card.classList.add("is-flipped")
    state.openedCards.push(card)
    if (state.openedCards.length < 2) return

    const [first, second] = state.openedCards
    checkMatch(first, second, state)
}

function checkMatch(first: HTMLButtonElement, second: HTMLButtonElement, state: GameState) {
    if (first.dataset.image === second.dataset.image) {
        handleMatch(first, second, state)
        return
    }
    handleMismatch(first, second, state)
}

function handleMatch(first: HTMLButtonElement, second: HTMLButtonElement, state: GameState) {
    first.dataset.matched = "true"
    second.dataset.matched = "true"
    state.addScore()
    state.matchedPairs++
    updateScoresUI(state)
    state.resetCards()
    if (state.isWin()) {
        state.gameOver = true
        window.setTimeout(() => {
            showGameOver(state)
        }, 3000)
    }
}

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

function showGameOver(state: GameState) {
    if (document.querySelector('.game-over')) return
    const { isDraw, winner } = getWinner(state)
    isDraw ? showDrawModal(state) : showGameOverModal(state, winner)
}

function showDrawModal(state: GameState) {
    const icon = state.theme === 'light' ? '/icon/icon_white-draw.svg' : '/icon/icon_white-draw-vibe.svg'
    const div = document.createElement('div')
    div.className = 'draw-modal'
    div.innerHTML = `<div class="draw-modal__content"><p class="draw-modal__label">It's a</p><p class="draw-modal__text">DRAW</p><img src="${icon}" alt="draw"><button id="backToStart" class="draw-modal__button">HOME</button></div>`
    document.body.appendChild(div)
    document.getElementById('backToStart')?.addEventListener('click', () => window.location.href = '/setting.html')
}

function showGameOverModal(state: GameState, winner: string) {
    const overlay = document.createElement('div')
    overlay.className = 'game-over'
    const items = state.players.map((p, i) => renderGameOverItem(p, state.scores[i] ?? 0, state.theme)).join('')
    overlay.innerHTML = `<div class="game-over__content"><h2>Game Over</h2><p class="game-over__title">Final score</p><ul class="game-over__list">${items}</ul></div>`
    document.body.appendChild(overlay)
    setTimeout(() => showWinnerModal(state, winner), 1500)
}

function renderGameOverItem(player: string, score: number, theme: string) {
    const label = player === 'player1' ? 'Blue' : 'Orange'
    const labelMarkup = theme === 'light' ? `<span class="${player}">${label}</span>` : ''
    return `<li class="game-over__item game-over__item--${player}"><img src="${getPlayerIcon(player, theme)}" alt="${player}" class="game-over__item__icon">${labelMarkup}<span>${score}</span></li>`
}

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

function setupTestingFunctions(state: GameState) {
    (window as any).forceGameOver = () => showGameOver(state);
    (window as any).forceWinner = () => {
        state.scores[0] = 2
        state.scores[1] = 5
        showGameOver(state)
    }
}

