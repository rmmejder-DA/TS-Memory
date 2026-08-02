import "./styles/style.scss"

interface RadioWithPreviousChecked extends HTMLInputElement {
    previousChecked?: boolean
}

document.addEventListener('DOMContentLoaded', () => {
    init()
})

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
        initGameplay()
    }
}

function initGameplay() {
    const field = document.getElementById("field")
    const currentPlayerImage = document.getElementById("player") as HTMLImageElement | null
    const currentPlayerLabel = document.querySelector<HTMLElement>("#currentPlayer p")
    const currentPlayerContainer = document.getElementById("currentPlayer")
    const scoreSpans = Array.from(document.querySelectorAll<HTMLElement>("#playerview span"))
    if (!field) return

    // Apply theme class to body
    const selectedTheme = localStorage.getItem('selectedTheme') ?? 'light'
    document.body.className = selectedTheme === 'light' ? 'theme-code' : 'theme-food'

    const storedPlayers = localStorage.getItem("selectedPlayers")
    let players = ["player1", "player2"]

    if (storedPlayers) {
        try {
            const parsed = JSON.parse(storedPlayers)
            if (Array.isArray(parsed) && parsed.length) {
                players = parsed
                // Maximal 2 Spieler
                players = players.slice(0, 2)
            }
        } catch {
            players = ["player1", "player2"]
        }
    }

    let currentPlayerIndex = 0
    let openedCards: HTMLButtonElement[] = []
    let lockBoard = false
    let gameOver = false
    const scores = players.map(() => 0)
    const openedCardsByPlayer = players.map(() => 0)
    const totalPairs = field.querySelectorAll('.card').length / 2
    let matchedPairs = 0

    const getPlayerLabel = (value: string) => value === "player1" ? "Blue" : value === "player2" ? "Orange" : value

    const getPlayerIcon = (player: string) => {
        if (selectedTheme === 'light') {
            // Code vibes theme: code-blue.png und orange-player.png
            return player === "player1" ? "/icon/chess_pawn-big-blue.png" : "/icon/chess_pawn-big-orange.png"
        } else {
            // Foods theme: chess pawns
            return player === "player1" ? "/icon/chess_pawn-big-blue.png" : "/icon/chess_pawn-big-orange.png"
        }
    }

    const updateScoresUI = () => {
        // Re-query scoreSpans jedes Mal, da sich die DOM-Struktur ändern kann
        const currentScoreSpans = Array.from(document.querySelectorAll<HTMLElement>("#playerview span"))
        currentScoreSpans.forEach((span, index) => {
            span.textContent = String(scores[index] ?? 0)
        })
    }

    const updatePlayerViewUI = () => {
        const playerView = document.getElementById("playerview")
        if (!playerView) return

        // Erstelle dynamisch die Spieler-Übersicht basierend auf der Anzahl der Spieler
        playerView.innerHTML = players.map((player, index) => `
            <img src="${getPlayerIcon(player)}" alt="player${index}">
            <span id="counter">${scores[index] ?? 0}</span>
        `).join("")
    }

    const updateCurrentPlayerUI = () => {
        const activePlayer = players[currentPlayerIndex] ?? "player1"
        if (currentPlayerImage) {
            currentPlayerImage.src = getPlayerIcon(activePlayer)
            currentPlayerImage.style.filter = ""
        }
        if (currentPlayerLabel) {
            currentPlayerLabel.textContent = "Current player:"
        }
        if (currentPlayerContainer) {
            currentPlayerContainer.className = "play__header__currentPlayer"
        }
    }

    const nextTurn = () => {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length
        updateCurrentPlayerUI()
    }

    const showGameOver = () => {
        if (document.querySelector('.game-over')) return

        // Bestimme den Gewinner
        const maxScore = Math.max(...scores)
        const isDraw = players.length > 1 && scores.every(score => score === maxScore)
        const winnerIndex = scores.indexOf(maxScore)
        const winner = players[winnerIndex] ?? "player1"
        const winnerLabel = getPlayerLabel(winner)

        // Wenn Draw: Zeige direkt Draw Modal ohne Game Over Overlay
        if (isDraw) {
            const drawIcon = selectedTheme === 'light'
                ? '/icon/icon_white-draw-vibe.png'
                : '/icon/icon_white-draw.png'

            const drawOverlay = document.createElement('div')
            drawOverlay.className = 'draw-modal'
            drawOverlay.innerHTML = `
                <div class="draw-modal__content">
                <p class="draw-modal__label orange">It's a</p>
                    <p class="draw-modal__text">DRAW</p>
                    <img src="${drawIcon}" alt="draw" class="draw-modal__image">
                    <button id="backToStart" class="draw-modal__button">
                        HOME
                    </button>
                </div>
            `
            document.body.appendChild(drawOverlay)

            // Back to Start Button Handler
            const backBtn = document.getElementById('backToStart')
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    window.location.href = '/setting.html'
                })
            }
            return
        }

        // Game Over Score Overlay (nur wenn kein Draw)
        const overlay = document.createElement('div')
        overlay.className = 'game-over'
        overlay.innerHTML = `
            <div class="game-over__content">
                <h2>Game Over</h2>
                <p class="game-over__title">Final score</p>
                <ul class="game-over__list">
                    ${players.map((player, index) => `
                        <li class="game-over__item game-over__item--${player}">
                            <img src="${getPlayerIcon(player)}" alt="${player}" class="game-over__item__icon">

                            <span>${scores[index] ?? 0}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `
        document.body.appendChild(overlay)

        // Winner Modal (nach 1500ms)
        setTimeout(() => {
            const winnerOverlay = document.createElement('div')
            winnerOverlay.className = 'winner-modal'
            winnerOverlay.innerHTML = `
                <div class="winner-modal__content">
                    ${selectedTheme === 'light' ? '<img src="/public/images/Confetti.png" alt="confetti" class="winner-modal__image">' : ''}
                    <p class="winner-modal__label">The winner is</p>
                    <p class="winner-modal__text winner-modal__text--${winner}">
                        ${winnerLabel} Player
                    </p>
                    <img src="${getPlayerIcon(winner)}" alt="player icon" class="winner-modal__pawn winner-modal__pawn--${winner}">
                    <button id="backToStart" class="winner-modal__button">
                        Back to start
                    </button>
                </div>`

            document.body.appendChild(winnerOverlay)

            // Back to Start Button Handler
            const backBtn = document.getElementById('backToStart')
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    window.location.href = '/setting.html'
                })
            }
        }, 1500)
    }

    field.addEventListener("click", e => {
        const target = e.target as HTMLElement | null
        const card = target?.closest(".card") as HTMLButtonElement | null

        if (!card || lockBoard || gameOver || card.classList.contains("is-flipped") || card.dataset.matched === "true") {
            return
        }

        if (openedCards.length >= 2) {
            return
        }

        card.classList.add("is-flipped")
        openedCardsByPlayer[currentPlayerIndex] += 1
        openedCards.push(card)

        if (openedCards.length < 2) {
            return
        }

        const [firstCard, secondCard] = openedCards
        const firstImage = firstCard.dataset.image
        const secondImage = secondCard.dataset.image

        if (firstImage && secondImage && firstImage === secondImage) {
            firstCard.dataset.matched = "true"
            secondCard.dataset.matched = "true"
            scores[currentPlayerIndex] += 1
            matchedPairs += 1
            updateScoresUI()
            openedCards = []

            if (matchedPairs >= totalPairs) {
                gameOver = true
                showGameOver()
            }
            return
        }

        lockBoard = true
        setTimeout(() => {
            firstCard.classList.remove("is-flipped")
            secondCard.classList.remove("is-flipped")
            openedCards = []
            nextTurn()
            lockBoard = false
        }, 900)
    })

    updatePlayerViewUI()
    updateScoresUI()
    updateCurrentPlayerUI()

    // Aktualisiere Exit Button Icon basierend auf Theme
    const exitBtn = document.querySelector<HTMLButtonElement>(".exitGameBtn")
    const exitBtnImg = exitBtn?.querySelector<HTMLImageElement>("img")
    if (exitBtnImg) {
        exitBtnImg.src = selectedTheme === 'light'
            ? '/icon/move_item.png'
            : '/icon/move_item-orange.png'
    }

    // Für Testing: Game Over manuell aufrufen über window.forceGameOver()
    ; (window as any).forceGameOver = showGameOver

        // Für Testing: Gewinner simulieren (unterschiedliche Scores)
        ; (window as any).forceWinner = () => {
            scores[0] = 5
            scores[1] = 2
            matchedPairs = 7
            gameOver = true
            showGameOver()
        }

        // Für Testing: Draw simulieren (direkt Draw-Modal anzeigen)
        ; (window as any).forceDraw = () => {
            const selectedTheme = localStorage.getItem('selectedTheme') ?? 'light'
            const drawIcon = selectedTheme === 'light'
                ? '/icon/icon_white-draw-vibe.png'
                : '/icon/icon_white-draw.png'

            const drawOverlay = document.createElement('div')
            drawOverlay.className = 'draw-modal'
            drawOverlay.innerHTML = `
        <div class="draw-modal__content">
            <p class="draw-modal__label orange">It's a</p>
            <p class="draw-modal__text">DRAW</p>
            <img src="${drawIcon}" alt="draw" class="draw-modal__image">
            <button id="backToStart" class="draw-modal__button">
                HOME
            </button>
        </div>`
            document.body.appendChild(drawOverlay)

            const backBtn = document.getElementById('backToStart')
            if (backBtn) {
                backBtn.addEventListener('click', () => {
                    window.location.href = '/setting.html'
                })
            }
        }
}

function initThemeSelector() {
    const themePreview = document.getElementById("theme-preview") as HTMLImageElement | null
    const themeView = document.getElementById("themeview")
    const themeMap: Record<string, { src: string; label: string }> = { light: { src: "/images/da-style.png", label: "Code vibes theme" }, dark: { src: "/images/vibe-style.png", label: "Foods theme" } }
    const applyTheme = (key: string) => {
        const theme = themeMap[key] ?? themeMap.light
        if (themePreview) {
            themePreview.src = theme.src
            themePreview.alt = theme.label
        }
        if (themeView) themeView.textContent = theme.label
        // Speichere das Theme in localStorage
        localStorage.setItem('selectedTheme', key)
    }
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
        preview.innerHTML = selected.map(r => `<img src="${r.value === 'player1' ? '/icon/chess_pawn-blue.png' : '/icon/chess_pawn-orange.png'}" alt="${r.value}">`).join("")
        preview.style.display = selected.length ? "block" : "none"
        if (playerView) playerView.style.display = selected.length ? "none" : "inline"

        if (selected.length) {
            localStorage.setItem("selectedPlayers", JSON.stringify(selected.map(r => r.value)))
        } else {
            localStorage.removeItem("selectedPlayers")
        }
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

    // Hole das gespeicherte Theme, standardmäßig 'light' (Code vibes)
    const selectedTheme = localStorage.getItem('selectedTheme') ?? 'light'

    // Code vibes theme Bilder (tatsächliche Dateien aus /public/card-img-da/)
    const daImages = ['angular.png', 'cmd.png', 'django.png', 'node.png', 'react.png', 'sass.png', 'vscode.png', 'visual.png', 'BB.png', 'blue-yellow.png', 'card1.png', 'Cards 5.png', 'Cards1.png', 'Cards2.png', 'card_front.png', 'Javascript Logo 1.png', 'Vector.png', 'Vector1.png']

    // Foods theme Bilder
    const foodImages = ['pizza.png', 'burger.png', 'sushi.png', 'hotdog.png', 'fries.png', 'cake.png', 'ice.png', 'taco.png', 'sandwich.png', 'pudding.png', 'macaron.png', 'choclate.png', 'dessert.png', 'wrap.png', 'salad.png', 'brezel.png', 'wrap.png', 'brezel.png']

    // Wähle die richtigen Bilder basierend auf dem Theme
    const images = selectedTheme === 'light' ? daImages : foodImages
    const imagePath = selectedTheme === 'light' ? '/card-img-da/' : '/card-img-food/'

    // Setze Grid-Spalten je nach Kartenzahl
    // 16 cards: 4x4, 24 cards: 6x4, 36 cards: 6x6
    let cols = 4
    if (count === 24) cols = 6
    if (count === 36) cols = 6

    field.style.gridTemplateColumns = `repeat(${cols}, minmax(124px, 1fr))`

    const pairs = count / 2
    const backs = images.slice(0, pairs)
    const deck = [...backs, ...backs].sort(() => Math.random() - 0.5)
    let html = ''
    for (let i = 0; i < deck.length; i++) {
        const src = deck[i]
        html += `<button class="card" data-image="${src}"><div class="card__inner"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="${imagePath}${src}" alt="card"></div></div></button>`
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
        // Triggere Validierung nach Abwählen
        allradioCheked()
    })
})
allradioCheked()

function allradioCheked() {
    const readyBtn = document.getElementById('readyplay') as HTMLButtonElement | null;
    const imgs = Array.from(document.getElementsByClassName('startplay__button-icon')) as HTMLImageElement[];

    if (!readyBtn) return;

    // Prüfe Radio-Buttons (Theme und Board)
    const radios = Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]:not([name="player"])'));
    const groups = Array.from(new Set(radios.map(r => r.name)));
    const radioSelected = groups.length > 0 && groups.every(n => !!document.querySelector<HTMLInputElement>(`input[type="radio"][name="${n}"]:checked`));

    // Prüfe Player-Checkboxes (mindestens eine muss gewählt sein)
    const playerCheckboxes = Array.from(document.querySelectorAll<HTMLInputElement>('input[name="player"]'));
    const playerSelected = playerCheckboxes.some(c => c.checked);

    // Aktiviere Start-Button nur wenn alles ausgewählt ist
    const allSelected = radioSelected && playerSelected;
    readyBtn.disabled = !allSelected;

    if (allSelected) {
        imgs.forEach(i => i.src = '/icon/smart_display.png');
    } else {
        imgs.forEach(i => i.src = '/icon/smart_display-disabled.png');
    }

    // Event Listener hinzufügen
    radios.forEach(r => {
        r.removeEventListener('change', allradioCheked);
        r.addEventListener('change', allradioCheked);
    });
    playerCheckboxes.forEach(c => {
        c.removeEventListener('change', allradioCheked);
        c.addEventListener('change', allradioCheked);
    });
}
    // Exit Game Popup Handler
    const exitButton = document.getElementById("exitGame") as HTMLButtonElement
    const popup = document.getElementById("exitPopup") as HTMLDivElement
    const backButton = document.getElementById("backToGame") as HTMLButtonElement
    const confirmButton = document.getElementById("confirmExit") as HTMLButtonElement

    if (exitButton && popup && backButton && confirmButton) {
        exitButton.addEventListener("click", () => {
            popup.style.display = "flex"
        })

        backButton.addEventListener("click", () => {
            popup.style.display = "none"
        })

        confirmButton.addEventListener("click", () => {
            window.location.href = "index.html"
        })
    }
