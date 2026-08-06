import "./styles/style.scss"
import { initThemeSelector } from './theme'
import { initPlayerSelector } from './player'
import { initBoardSelector, initBoardStateOnPlay } from './board'
import { initGameplay } from './gameplay'
import { initRadioToggle } from './validation'
import { initExitHandler } from './exit'
import { setBodyTheme, getStoredTheme } from './utils'

document.addEventListener('DOMContentLoaded', () => {
    init()
})

/**
 * Initializes all game components and sets up the UI.
 * Loads theme, players, board settings, and gameplay logic.
 */
function init() {
    initThemeSelector()
    initPlayerSelector()
    initBoardSelector()
    initBoardStateOnPlay()
    initRadioToggle()
    const fieldRef = document.getElementById("field")
    if (fieldRef) setBodyTheme(getStoredTheme()), initGameplay(), initExitHandler()
}

