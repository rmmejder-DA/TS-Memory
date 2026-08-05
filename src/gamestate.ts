// Gameplay State Management

import { getStoredTheme, getStoredPlayers} from './utils'

export class GameState {
    currentPlayerIndex = 0
    openedCards: HTMLButtonElement[] = []
    lockBoard = false
    gameOver = false
    scores: number[] = []
    title: string[] = []
    matchedPairs = 0
    totalPairs = 0
    theme = ''
    players: string[] = []

    constructor(totalPairs: number) {
        this.theme = getStoredTheme()
        this.players = getStoredPlayers()
        this.totalPairs = totalPairs
        this.scores = this.players.map(() => 0)
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    }

    addScore() {
        this.scores[this.currentPlayerIndex]++
    }

    resetCards() {
        this.openedCards = []
    }

    isWin() {
        return this.matchedPairs >= this.totalPairs
    }
}

export function getWinner(state: GameState) {
    const maxScore = Math.max(...state.scores)
    const isDraw = state.players.length > 1 && state.scores.every(s => s === maxScore)
    const winIdx = state.scores.indexOf(maxScore)
    return { winner: state.players[winIdx], isDraw, maxScore }
}
