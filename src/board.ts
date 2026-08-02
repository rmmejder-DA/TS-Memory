// Board-Management

import { renderField } from './render'

export function initBoardSelector() {
    const boardView = document.getElementById("boardview")
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="board"]')
    if (!boardView || !radios.length) return

    const update = () => {
        const count = radios[0].checked ? 16 : radios[1].checked ? 24 : radios[2].checked ? 36 : 0
        boardView.textContent = count ? `${count} cards` : "Board size"
        if (count) {
            renderField(count)
            localStorage.setItem('boardCount', String(count))
        } else {
            localStorage.removeItem('boardCount')
        }
    }

    radios.forEach(radio => radio.addEventListener("change", update))
    update()
}

export function initBoardStateOnPlay() {
    if (document.getElementById('field')) {
        const stored = localStorage.getItem('boardCount')
        if (stored) renderField(Number(stored))
    }
}
