/**
 * Initializes form validation by attaching listeners to all radio and player inputs.
 */
export function initRadioToggle() {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])')
    const players = document.querySelectorAll<HTMLInputElement>('input[name="player"]')

    radios.forEach(radio => radio.addEventListener('change', validateForm))
    players.forEach(player => player.addEventListener('change', validateForm))

    validateForm()
    
    // Set flag when Start button is clicked to enable loading stored settings on next visit
    const readyBtn = document.getElementById('readyplay') as HTMLButtonElement
    if (readyBtn) {
        readyBtn.addEventListener('click', () => {
            localStorage.setItem('gameStarted', 'true')
        })
    }
}

/**
 * Validates the form and enables/disables the ready button.
 * Checks if all required radio groups are selected and at least one player is chosen.
 */
export function validateForm() {
    const readyBtn = document.getElementById('readyplay') as HTMLButtonElement
    if (!readyBtn) return
    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])'));
    const groups = Array.from(new Set(radios.map(r => r.name)))
    const radioOk = groups.every(n => document.querySelector<HTMLInputElement>(`input[type="radio"][name="${n}"]:checked`))
    const playerCheckboxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="player"]'))
    const playerOk = playerCheckboxes.some(c => c.checked) // At least one player must be selected
    const allOk = radioOk && playerOk
    readyBtn.disabled = !allOk
    const icon = allOk ? '/icon/smart_display.svg' : '/icon/smart_display-disabled.svg'
    document.querySelectorAll('.startplay__button-icon').forEach((img: any) => img.src = icon)
}
