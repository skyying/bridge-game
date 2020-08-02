
//TODO should apply theme to the whole style thing
export function calcShouldSwitchOrNot(isSidebarPanelShown: boolean, windowWidth: number): boolean {
    const maxWidth = 1300;
    const minWidth = 1000;
    return (isSidebarPanelShown &&
        windowWidth <= maxWidth) ||
        windowWidth <= minWidth;
}
