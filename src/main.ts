import "./styles/style.scss"

interface RadioWithPreviousChecked extends HTMLInputElement {
    previousChecked?: boolean
}

init()
function init() {
    initThemeSelector()
    initPlayerSelector()
    initBoardSelector()

    const fieldRef = document.getElementById("field")
    if (fieldRef) {
        fieldRef.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement
            if (card) {
                card.classList.toggle("is-flipped")
            }
        })
    }
}

function initThemeSelector() {
    const themePreview = document.getElementById("theme-preview") as HTMLImageElement | null
    const themeView = document.getElementById("themeview")
    const themeMap: Record<string, { src:string; label:string }> = { light:{src:"/images/vibe-style.png",label:"Code vibes theme"}, dark:{src:"/images/da-style.png",label:"Foods theme"} }
    const applyTheme = (key:string) => { const theme = themeMap[key] ?? themeMap.light; if(themePreview){themePreview.src=theme.src;themePreview.alt=theme.label;} if(themeView) themeView.textContent = theme.label }
    const hoverTheme = (key:string) => { if(themePreview) themePreview.src = themeMap[key]?.src ?? themeMap.light.src }
    if(!themePreview) return
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]')
    const restore = () => applyTheme(document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value ?? "light")
    radios.forEach(radio => {
        radio.addEventListener("change", ()=> radio.checked && applyTheme(radio.value)); radio.addEventListener("mouseenter", ()=> hoverTheme(radio.value)); radio.addEventListener("mouseleave", restore)
        const label = document.querySelector<HTMLLabelElement>(`label[for="${radio.id}"]`)
        label?.addEventListener("mouseenter", ()=> hoverTheme(radio.value)); label?.addEventListener("mouseleave", restore)
    })
    restore()
}

function initPlayerSelector() {
    const preview = document.getElementById("player-preview")
    const playerView = document.getElementById("playerview")
    const boxes = document.querySelectorAll<HTMLInputElement>('input[name="player"]')
    if(!preview || !boxes.length) return
    const update = () => {
        const selected = Array.from(boxes).filter(r => r.checked)
        preview.innerHTML = selected.map(r => `<img src="/icon/currentBlue.png" class="${r.value==='player1'?'blue':'orange'}" alt="${r.value}">`).join("")
        if(playerView) playerView.style.display = selected.length ? "none" : "inline"
    }
    boxes.forEach(box => box.addEventListener("change", update))
    update()
}

function initBoardSelector() {
    const boardView = document.getElementById("boardview")
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="board"]')
    if(!boardView || !radios.length) return
    const update = () => {
        boardView.textContent = radios[0].checked ? "16 cards" : radios[1].checked ? "24 cards" : radios[2].checked ? "36 cards" : "Board size"
    }
    radios.forEach(radio => radio.addEventListener("change", update))
    update()
}

// disable click-to-uncheck only for normal radio groups, not player checkboxes
document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])').forEach(radio => {
    radio.addEventListener('click', function(this: HTMLInputElement & { previousChecked?: boolean }) {
        if (this.previousChecked) {
            this.checked = false
        }
        this.previousChecked = this.checked
    })
})