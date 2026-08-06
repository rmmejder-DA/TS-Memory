interface Theme {
    label: string;
    src: string;
}

const globalThemeMap: Record<string, Theme> = {
    light: { label: 'Code vibes theme', src: 'images/da-style.png' },
    dark: { label: 'Foods theme', src: 'images/vibe-style.png' }
};

/**
 * Updates image preview attributes and stores the selected key.
 */
function updateThemePreview(preview: HTMLImageElement, key: string, view: HTMLElement | null, src: string, alt: string): void {
    if (!src) return;
    preview.src = src;
    preview.alt = alt;
    if (view) view.textContent = alt;
    localStorage.setItem('selectedTheme', key);
}

/**
 * Helper to fetch the currently active theme from the DOM.
 */
function getActiveTheme(): Theme | null {
    const checked = document.querySelector<HTMLInputElement>('input[name="theme"]:checked');
    return checked?.value ? globalThemeMap[checked.value] : null;
}

/**
 * Resets the preview elements back to the active theme or default fallbacks.
 */
function restorePreview(preview: HTMLImageElement, defaultSrc: string, defaultAlt: string): void {
    const theme = getActiveTheme();
    preview.src = theme?.src || defaultSrc;
    preview.alt = theme?.label || defaultAlt;
}

/**
 * Binds mouse hover interactions to a target element for theme previews.
 */
function bindHover(element: HTMLElement | null, radio: HTMLInputElement, preview: HTMLImageElement, restore: () => void): void {
    element?.addEventListener("mouseenter", () => {
        const theme = globalThemeMap[radio.value];
        if (theme?.src) preview.src = theme.src;
    });
    element?.addEventListener("mouseleave", restore);
}

/**
 * Registers change and mouse event listeners for a specific radio element.
 */
function setupThemeRadio(radio: HTMLInputElement, preview: HTMLImageElement, view: HTMLElement | null, defaultSrc: string, defaultAlt: string): void {
    const restore = () => restorePreview(preview, defaultSrc, defaultAlt);
    
    radio.addEventListener("change", () => {
        if (radio.checked) {
            const theme = globalThemeMap[radio.value];
            updateThemePreview(preview, radio.value, view, theme?.src || defaultSrc, theme?.label || 'Custom');
        }
    });

    bindHover(radio, radio, preview, restore);
    bindHover(document.querySelector<HTMLLabelElement>(`label[for="${radio.id}"]`), radio, preview, restore);
}

/**
 * Restores the theme state from local storage configuration.
 */
function loadStoredTheme(preview: HTMLImageElement | null, defaultSrc: string, defaultAlt: string, view: HTMLElement | null): void {
    const stored = localStorage.getItem('selectedTheme') || 'light';
    let radio = document.querySelector<HTMLInputElement>(`input[name="theme"][value="${stored}"]`);
    
    if (!radio) {
        localStorage.setItem('selectedTheme', 'light');
        radio = document.querySelector<HTMLInputElement>(`input[name="theme"][value="light"]`);
    }

    if (radio) {
        radio.checked = true;
        const current = globalThemeMap[radio.value];
        if (preview) {
            preview.src = current?.src || defaultSrc;
            preview.alt = current?.label || defaultAlt;
        }
    }
    if (view) view.textContent = 'Game theme';
}

/**
 * Initializes listeners and state for the core theme selector.
 */
export function initThemeSelector(): void {
    const preview = document.getElementById("theme-preview") as HTMLImageElement | null;
    const view = document.getElementById("themeview");
    if (!preview) return;

    const defaultSrc = preview.src;
    const defaultAlt = preview.alt;

    loadStoredTheme(preview, defaultSrc, defaultAlt, view);

    const radios = document.querySelectorAll<HTMLInputElement>('input[name="theme"]');
    radios.forEach(radio => setupThemeRadio(radio, preview, view, defaultSrc, defaultAlt));
}
