// Hilfsfunktionen

export interface RadioWithPreviousChecked extends HTMLInputElement {
    previousChecked?: boolean
}

export const getStoredTheme = () => localStorage.getItem('selectedTheme') ?? 'light'
export const getStoredPlayers = () => {
    const stored = localStorage.getItem("selectedPlayers")
    if (!stored) return ["player1", "player2"]
    try {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) && parsed.length ? parsed.slice(0, 2) : ["player1", "player2"]
    } catch {
        return ["player1", "player2"]
    }
}

export const getPlayerLabel = (value: string) => 
    value === "player1" ? "Blue" : value === "player2" ? "Orange" : value

export const getPlayerIcon = (player: string, theme: string) => {
    const isCodeTheme = theme === 'light'
    const blue = isCodeTheme ? '/icon/label-blue.svg' : '/icon/chess_pawn-blue.svg'
    const orange = isCodeTheme ? '/icon/label-orange.svg' : '/icon/chess_pawn-orange.svg'
    return player === 'player1' ? blue : orange
}

export const setBodyTheme = (theme: string) => {
    document.body.className = theme === 'light' ? 'theme-code' : 'theme-food'
}
