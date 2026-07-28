import "./styles/style.scss"
init()
function init() {
    initThemeSelector()

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
    const themeMap = { light:{src:"/images/vibe-style.png",label:"Code vibes theme"}, dark:{src:"/images/da-style.png",label:"Da Projects theme"} }
    const applyTheme = (key:string) => { const theme = themeMap[key] ?? themeMap.light; if(themePreview){themePreview.src=theme.src;themePreview.alt=theme.label;} if(themeView) themeView.textContent=theme.label }
    if(!themePreview) return
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(i=>i.addEventListener("change",()=>i.checked && applyTheme(i.value)))
    applyTheme(document.querySelector<HTMLInputElement>('input[name="theme"]:checked')?.value ?? "light")
}
