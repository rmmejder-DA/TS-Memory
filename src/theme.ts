// Theme-Management

const themeMap: Record<string, { src: string; label: string }> = {
    light: { src: "/images/da-style.png", label: "Code vibes theme" },
    dark: { src: "/images/vibe-style.png", label: "Foods theme" }
}

export function initThemeSelector() {
    const themePreview = document.getElementById("theme-preview") as HTMLImageElement | null
    const themeView = document.getElementById("themeview")
    if (!themePreview) return

    const applyTheme = (key: string) => {
        const theme = themeMap[key] ?? themeMap.light
        themePreview.src = theme.src
        themePreview.alt = theme.label
        if (themeView) themeView.textContent = theme.label
        localStorage.setItem('selectedTheme', key)
    }

    const hoverTheme = (key: string) => {
        themePreview.src = themeMap[key]?.src ?? themeMap.light.src
    }

    const restore = () => {
        const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')
        applyTheme(checked?.value ?? "light")
    }

    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => {
        radio.addEventListener("change", () => radio.checked && applyTheme(radio.value))
        radio.addEventListener("mouseenter", () => hoverTheme(radio.value))
        radio.addEventListener("mouseleave", restore)
        const label = document.querySelector<HTMLLabelElement>(`label[for="${radio.id}"]`)
        label?.addEventListener("mouseenter", () => hoverTheme(radio.value))
        label?.addEventListener("mouseleave", restore)
    })
    restore()
}
