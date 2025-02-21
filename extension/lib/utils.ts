/**
 * Checks if the current page is a shorts page.
 *
 * @returns Whether the current page is a shorts page.
 */
export function isShortsPage(): boolean {
    return window.location.href.includes('youtube.com/shorts');
}

/**
 * Removes a CSS class from all elements on the page.
 *
 * @param className - The name of the CSS class to remove.
 */
export function removeCssClass(className: string): void {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach(element => element.classList.remove(className));
}

/**
 * Adds a CSS class to the body element.
 *
 * @param className - The name of the CSS class to add.
 * @returns Whether the class was successfully added.
 */
export function addCssClassToBody(className: string): boolean {
    const body = document.querySelector('body');

    if (!body) {
        return false;
    }

    body.classList.add(className);
    return true;
}
