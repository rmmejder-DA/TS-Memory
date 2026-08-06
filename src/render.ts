// Rendering-Funktionen

import { getStoredTheme } from './utils'

// Konstanten außerhalb der Funktion - 18 unterschiedliche Karten pro Theme
const daImages = [
    'angular.png', 
    'BB.png',
    'blue-yellow.png',  
    'card1.png', 
    'Cards 5 (1).png', 
    'Cards 5.png',  
    'Cards1.png',  
    'Cards2.png',  
    'cmd.png',  
    'django.png',  
    'Javascript Logo 1.png',  
    'node.png',  
    'react.png',  
    'sass.png',  
    'Vector.png',  
    'Vector1.png',  
    'visual.png',  
    'vscode.png'
]

const foodImages = [
    'brezel.png',
    'burger.png',
    'cake.png',
    'cakesw.png',
    'chicken.png', 
    'choclate.png', 
    'dessert.png', 
    'fries.png', 
    'hotdog.png', 
    'ice.png', 
    'macaron.png',
     'pizza.png', 
     'pudding.png', 
     'salad.png', 
     'sandwich.png', 
     'sushi.png', 
     'taco.png', 
     'wrap.png'
]

function renderCard(src: string, imagePath: string) {
    return `<button class="card" data-image="${src}"><div class="card__inner"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="${imagePath}${src}" alt="card"></div></div></button>`
}

function getGridCols(count: number): number {
    return count === 24 || count === 36 ? 6 : 4
}

function generateDeck(count: number, images: string[]): string[] {
    if (count === 16) {
        return images.slice(0, 16).sort(() => Math.random() - 0.5)
    }
    const pairs = count / 2
    const backs = images.slice(0, pairs)
    return [...backs, ...backs].sort(() => Math.random() - 0.5)
}

export function renderField(count: number) {
    const field = document.getElementById('field')
    if (!field) return

    const theme = getStoredTheme()
    const images = theme === 'light' ? daImages : foodImages
    const imagePath = theme === 'light' ? '/card-img-da/' : '/card-img-food/'
    
    field.style.gridTemplateColumns = `repeat(${getGridCols(count)}, minmax(124px, 1fr))`
    field.innerHTML = generateDeck(count, images).map(src => renderCard(src, imagePath)).join('')
}
