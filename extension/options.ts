export const initialOptions = {
    showShortsToVideoButton: true,
    loopShortsToVideo: true,
    updateShortsUI: true,
    hideSponsoredShorts: true,
    hideMastheadAds: true,
    hideInFeedAds: true,
    hidePlayerAds: true,
    smartTv: true
};

export type Options = typeof initialOptions;

export type OptionsNames = keyof Options;
