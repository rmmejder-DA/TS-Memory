// Form-Validierung

import { RadioWithPreviousChecked } from './utils'

export function initRadioToggle() {
    document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])').forEach(radio => {
        radio.addEventListener('click', function (this: HTMLInputElement & { previousChecked?: boolean }) {
            if (this.previousChecked) this.checked = false
            this.previousChecked = this.checked
            validateForm()
        })
    })
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

    radios.forEach(r => r.removeEventListener('change', validateForm))
    radios.forEach(r => r.addEventListener('change', validateForm))
    document.querySelectorAll<HTMLInputElement>('input[name="player"]').forEach(c => {
        c.removeEventListener('change', validateForm)
        c.addEventListener('change', validateForm)
    })
}
