// Theme-Management

const themeMap: Record<string, { src: string; label: string }> = {
    light: { src: "/images/da-style.png", label: "Code vibes theme" },
    dark: { src: "/images/vibe-style.png", label: "Foods theme" }
}

/**
 * Updates the theme preview and localStorage.
 * @param preview - The preview image element
 * @param key - The theme key
 * @param view - The display label element
 * @param src - The image source path
 * @param alt - The alternative text
 */
function updateThemePreview(preview: HTMLImageElement, key: string, view: HTMLElement | null, src: string, alt: string) {
    preview.src = src
    preview.alt = alt
    if (view) view.textContent = alt
    localStorage.setItem('selectedTheme', key)
}

/**
 * Sets up event listeners for a theme radio button.
 * @param radio - The radio input element
 * @param preview - The preview image element
 * @param view - The display label element
 * @param defaultSrc - Default image source
 * @param defaultAlt - Default alternative text
 */
function setupThemeRadio(radio: HTMLInputElement, preview: HTMLImageElement, view: HTMLElement | null, defaultSrc: string, defaultAlt: string) {
    const restore = () => {
        const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')
        if (checked?.value) {
            const theme = themeMap[checked.value] ?? themeMap.light
            updateThemePreview(preview, checked.value, view, theme.src, theme.label)
        } else {
            preview.src = defaultSrc
            preview.alt = defaultAlt
            if (view) view.textContent = "Game theme"
            localStorage.removeItem('selectedTheme')
        }
    }
    radio.addEventListener("change", () => radio.checked && updateThemePreview(preview, radio.value, view, themeMap[radio.value]?.src ?? themeMap.light.src, themeMap[radio.value]?.label ?? themeMap.light.label))
    radio.addEventListener("mouseenter", () => preview.src = themeMap[radio.value]?.src ?? themeMap.light.src)
    radio.addEventListener("mouseleave", restore)
    const label = document.querySelector<HTMLLabelElement>(`label[for="${radio.id}"]`)
    label?.addEventListener("mouseenter", () => preview.src = themeMap[radio.value]?.src ?? themeMap.light.src)
    label?.addEventListener("mouseleave", restore)
}

/**
 * Initializes the theme selector with preview and event listeners.
 */
export function initThemeSelector() {
    const themePreview = document.getElementById("theme-preview") as HTMLImageElement | null
    const themeView = document.getElementById("themeview")
    if (!themePreview) return
    const defaultSrc = themePreview.src
    const defaultAlt = themePreview.alt
    document.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach(radio => setupThemeRadio(radio, themePreview, themeView, defaultSrc, defaultAlt))
    const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked')
    if (checked?.value) {
        const theme = themeMap[checked.value]
        updateThemePreview(themePreview, checked.value, themeView, theme.src, theme.label)
    }
}
