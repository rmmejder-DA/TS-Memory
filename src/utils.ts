/**
 * Utility functions for game state management and DOM helpers.
 */

export interface RadioWithPreviousChecked extends HTMLInputElement {
    previousChecked?: boolean
}

/**
 * Retrieves the stored theme preference from localStorage.
 * @returns The stored theme key or 'light' as default
 */
export const getStoredTheme = () => localStorage.getItem('selectedTheme') ?? 'light'
/**
 * Parses and validates the stored players JSON string.
 * Ensures exactly 2 players are returned.
 * @param stored - The JSON string from localStorage
 * @returns Array of exactly 2 validated players or default ['player1', 'player2']
 */
function parseSavedPlayers(stored: string): string[] {
    try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length >= 2) {
            return parsed.slice(0, 2)
        }
        // If less than 2 players, add the missing one
        if (Array.isArray(parsed) && parsed.length === 1) {
            const other = parsed[0] === 'player1' ? 'player2' : 'player1'
            return [parsed[0], other]
        }
    } catch {}
    return ["player1", "player2"]
}

/**
 * Retrieves the stored player selection from localStorage.
 * @returns Array of selected players or default ['player1', 'player2']
 */
export const getStoredPlayers = () => {
    const stored = localStorage.getItem("selectedPlayers")
    return !stored ? ["player1", "player2"] : parseSavedPlayers(stored)
}

/**
 * Gets the display label for a player.
 * @param value - Player identifier
 * @returns The player label ('Blue', 'Orange', or the value itself)
 */
export const getPlayerLabel = (value: string) => 
    value === "player1" ? "Blue" : value === "player2" ? "Orange" : value

/**
 * Gets the icon path for a player based on theme.
 * @param player - Player identifier
 * @param theme - Current theme ('light' or 'dark')
 * @returns The icon SVG path
 */
export const getPlayerIcon = (player: string, theme: string) => {
    const isCodeTheme = theme === 'light'
    const blue = isCodeTheme ? '/icon/label-blue.svg' : '/icon/chess_pawn-blue.svg'
    const orange = isCodeTheme ? '/icon/label-orange.svg' : '/icon/chess_pawn-orange.svg'
    return player === 'player1' ? blue : orange
}

/**
 * Sets the body theme class.
 * @param theme - The theme to apply ('light' or 'dark')
 */
export const setBodyTheme = (theme: string) => {
    document.body.className = theme === "light"
        ? "theme-code"
        : "theme-food";
}
