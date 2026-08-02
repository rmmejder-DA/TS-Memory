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

function init() {
    initThemeSelector()
    initPlayerSelector()
    initBoardSelector()
    initBoardStateOnPlay()

    const fieldRef = document.getElementById("field")
    if (fieldRef) {
        setBodyTheme(getStoredTheme())
        initGameplay()
        initExitHandler()
    }

    initRadioToggle()
}

