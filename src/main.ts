import "./styles/style.scss"

interface RadioWithPreviousChecked extends HTMLInputElement {
    previousChecked?: boolean
}

init()
function init() {
    initThemeSelector()
    initPlayerSelector()
    initBoardSelector()

    // Wenn auf play.html (Element #field vorhanden), rendere gespeicherte Auswahl
    if (document.getElementById('field')) {
        const stored = localStorage.getItem('boardCount')
        if (stored) renderField(Number(stored))
    }

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
    const themeMap: Record<string, { src: string; label: string }> = { light: { src: "/images/da-style.png", label: "Code vibes theme" }, dark: { src: "/images/vibe-style.png", label: "Foods theme" } }
    const applyTheme = (key: string) => { const theme = themeMap[key] ?? themeMap.light; if (themePreview) { themePreview.src = theme.src; themePreview.alt = theme.label; } if (themeView) themeView.textContent = theme.label }
    const hoverTheme = (key: string) => { if (themePreview) themePreview.src = themeMap[key]?.src ?? themeMap.light.src }
    if (!themePreview) return
    const radios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]')
    const restore = () => applyTheme(document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value ?? "light")
    radios.forEach(radio => {
        radio.addEventListener("change", () => radio.checked && applyTheme(radio.value)); radio.addEventListener("mouseenter", () => hoverTheme(radio.value)); radio.addEventListener("mouseleave", restore)
        const label = document.querySelector<HTMLLabelElement>(`label[for="${radio.id}"]`)
        label?.addEventListener("mouseenter", () => hoverTheme(radio.value)); label?.addEventListener("mouseleave", restore)
    })
    restore()
}

function initPlayerSelector() {
    const preview = document.getElementById("player-preview")
    const playerView = document.getElementById("playerview")
    const boxes = document.querySelectorAll<HTMLInputElement>('input[name="player"]')
    if (!preview || !boxes.length) return
    const update = () => {
        const selected = Array.from(boxes).filter(r => r.checked)
        preview.innerHTML = selected.map(r => `<img src="/icon/currentBlue.png" class="${r.value === 'player1' ? 'blue' : 'orange'}" alt="${r.value}">`).join("")
        if (playerView) playerView.style.display = selected.length ? "none" : "inline"
    }
    boxes.forEach(box => box.addEventListener("change", update))
    update()
}

function initBoardSelector() {
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

function renderField(count: number) {
    const field = document.getElementById('field')
    if (!field) return
    const cols = count === 16 ? 4 : count === 24 ? 6 : 6
    field.style.gridTemplateColumns = `repeat(${cols}, minmax(90px, 1fr))`
    field.style.gridAutoRows = 'minmax(90px, 1fr)'
    const images = ['pizza.png','burger.png','sushi.png','hotdog.png','fries.png','cake.png','ice.png','taco.png','sandwich.png','pudding.png','macaron.png','choclate.png','dessert.png','wrap.png','salad.png','brezel.png','wrap.png','brezel.png']
    const pairs = count / 2
    const backs = images.slice(0, pairs)
    const deck = [...backs, ...backs].sort(() => Math.random() - 0.5)
    let html = ''
    for (let i = 0; i < deck.length; i++) {
        const src = deck[i]
        html += `<button class="card"><div class="card__inner"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="/card-img-food/${src}" alt="card"></div></div></button>`
    }
    field.innerHTML = html
}

// disable click-to-uncheck only for normal radio groups, not player checkboxes
document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])').forEach(radio => {
    radio.addEventListener('click', function (this: HTMLInputElement & { previousChecked?: boolean }) {
        if (this.previousChecked) {
            this.checked = false
        }
        this.previousChecked = this.checked
    })
})
allradioCheked()

function allradioCheked() {
    const readyBtn = document.getElementById('readyplay') as HTMLButtonElement | null;
    const imgs = Array.from(document.getElementsByClassName('startplay__button-icon')) as HTMLImageElement[];
    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])'));
    if (!readyBtn) return;
    const groups = Array.from(new Set(radios.map(r => r.name)));
    const allSelected = groups.length > 0 && groups.every(n => !!document.querySelector<HTMLInputElement>(`input[type="radio"][name="${n}"]:checked`));
    readyBtn.disabled = !allSelected;
    if (allSelected) imgs.forEach(i => i.src = '/icon/smart_display.png');
    radios.forEach(r => { r.removeEventListener('change', allradioCheked); r.addEventListener('change', allradioCheked); });

}