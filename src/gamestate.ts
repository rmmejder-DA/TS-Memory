import { getStoredTheme, getStoredPlayers } from './utils'

/**
 * Represents the current game state and player scores.
 */
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

    /**
     * Initializes the game state with theme and player information.
     * @param totalPairs - The total number of card pairs in the game
     */
    constructor(totalPairs: number) {
        this.theme = getStoredTheme()
        this.players = getStoredPlayers()
        this.totalPairs = totalPairs
        this.scores = this.players.map(() => 0)
    }

    /**
     * Moves to the next player's turn.
     */
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length
    }

    /**
     * Increments the score for the current player.
     */
    addScore() {
        this.scores[this.currentPlayerIndex]++
    }

    /**
     * Clears the opened cards array.
     */
    resetCards() {
        this.openedCards = []
    }

    /**
     * Checks if the game is won.
     * @returns True if all pairs have been matched
     */
    isWin() {
        return this.matchedPairs >= this.totalPairs
    }
}

/**
 * Determines the winner(s) of the game.
 * @param state - The final game state
 * @returns An object containing the winner name, draw status, and max score
 */
export function getWinner(state: GameState) {
    const maxScore = Math.max(...state.scores)
    const isDraw = state.players.length > 1 && state.scores.every(s => s === maxScore)
    const winIdx = state.scores.indexOf(maxScore)
    return { winner: state.players[winIdx], isDraw, maxScore }
}
