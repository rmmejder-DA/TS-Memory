// Form-Validierung

export function initRadioToggle() {
    const radios = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])')
    const players = document.querySelectorAll<HTMLInputElement>('input[name="player"]')

    radios.forEach(radio => radio.addEventListener('change', validateForm))
    players.forEach(player => player.addEventListener('change', validateForm))

    validateForm()
}

export function validateForm() {
    const readyBtn = document.getElementById('readyplay') as HTMLButtonElement
    if (!readyBtn) return

    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])'))
    const groups = Array.from(new Set(radios.map(r => r.name)))
    const radioOk = groups.every(n => document.querySelector<HTMLInputElement>(`input[type="radio"][name="${n}"]:checked`))
    const playerOk = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="player"]')).some(c => c.checked)
    const allOk = radioOk && playerOk

    readyBtn.disabled = !allOk
    Array.from(document.getElementsByClassName('startplay__button-icon')).forEach((img: any) => {
        img.src = allOk ? '/icon/smart_display.png' : '/icon/smart_display-disabled.png'
    })
}
