/**
 * The initial options for the extension.
 */
export const initialOptions = {
    showShortsToVideoButton: true,
    loopShortsToVideo: true,
    updateShortsUI: true,
    autoSkipAds: false,
    hideSponsoredShorts: true,
    hideMastheadAds: true,
    hideInFeedAds: true,
    hidePlayerAds: true,
    removeAdblockErrorMessage: false
};

/**
 * The options stored in the extension's local storage.
 *
 * @remarks
 * The options are used to configure the extension's features.
 */
export type Options = typeof initialOptions;

/**
 * String union type of the options' names.
 */
export type OptionsNames = keyof Options;
