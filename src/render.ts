// Rendering-Funktionen

import { getStoredTheme } from './utils'

export function renderField(count: number) {
    const field = document.getElementById('field')
    if (!field) return

    const theme = getStoredTheme()
    const daImages = ['angular.png', 'cmd.png', 'django.png', 'node.png', 'react.png', 'sass.png', 'vscode.png', 'visual.png', 'BB.png', 'blue-yellow.png', 'card1.png', 'Cards 5.png', 'Cards1.png', 'Cards2.png', 'card_front.png', 'Javascript Logo 1.png', 'Vector.png', 'Vector1.png']
    const foodImages = ['pizza.png', 'burger.png', 'sushi.png', 'hotdog.png', 'fries.png', 'cake.png', 'ice.png', 'taco.png', 'sandwich.png', 'pudding.png', 'macaron.png', 'choclate.png', 'dessert.png', 'wrap.png', 'salad.png', 'brezel.png', 'wrap.png', 'brezel.png']
    const images = theme === 'light' ? daImages : foodImages
    const imagePath = theme === 'light' ? '/card-img-da/' : '/card-img-food/'

    let cols = count === 24 ? 6 : count === 36 ? 6 : 4
    field.style.gridTemplateColumns = `repeat(${cols}, minmax(124px, 1fr))`

    const pairs = count / 2
    const backs = images.slice(0, pairs)
    const deck = [...backs, ...backs].sort(() => Math.random() - 0.5)
    
    field.innerHTML = deck.map(src => `<button class="card" data-image="${src}"><div class="card__inner"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="${imagePath}${src}" alt="card"></div></div></button>`).join('')
}
