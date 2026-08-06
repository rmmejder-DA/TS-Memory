import { getStoredTheme } from './utils'

/**
 * Array of developer/tech-themed card images for the 'Code vibes' theme.
 * Contains 18 unique card images.
 */
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

/**
 * Array of food-themed card images for the 'Foods theme'.
 * Contains 18 unique card images.
 */
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

/**
 * Creates a card HTML element.
 * @param src - The card image filename
 * @param imagePath - The base path to the image directory
 * @returns The HTML string for a card button
 */
function renderCard(src: string, imagePath: string) {
    return `<button class="card" data-image="${src}"><div class="card__inner"><div class="card__face card__face--front"></div><div class="card__face card__face--back"><img src="${imagePath}${src}" alt="card"></div></div></button>`
}

/**
 * Calculates the number of grid columns based on card count.
 * @param count - The total number of cards
 * @returns The number of columns (4 or 6)
 */
function getGridCols(count: number): number {
    return count === 24 || count === 36 ? 6 : 4
}

/**
 * Generates a shuffled deck of card image names.
 * @param count - The total number of cards
 * @param images - Array of available image filenames
 * @returns Shuffled array of card image names
 */
function generateDeck(count: number, images: string[]): string[] {
    const pairs = count / 2
    const backs = images.slice(0, pairs)
    return [...backs, ...backs].sort(() => Math.random() - 0.5)
}

/**
 * Renders the game field with cards based on selected board size and theme.
 * @param count - The number of cards to display
 */
export function renderField(count: number) {
    const field = document.getElementById('field')
    if (!field) return

    const theme = getStoredTheme()
    const images = theme === 'light' ? daImages : foodImages
    const imagePath = theme === 'light' ? '/card-img-da/' : '/card-img-food/'
    
    field.style.gridTemplateColumns = `repeat(${getGridCols(count)}, minmax(124px, 1fr))`
    field.innerHTML = generateDeck(count, images).map(src => renderCard(src, imagePath)).join('')
}
