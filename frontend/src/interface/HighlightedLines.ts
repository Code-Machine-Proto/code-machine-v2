/**
 * Interface représentant une ligne avec de la mise en évidence de syntaxe
 */
export type HighlightedLine = Array<HighlightedText>;

/**
 * Interface représentant une partie de texte devant être mis en couleur
 */
export interface HighlightedText {
    text: string,
    color: string,
}
