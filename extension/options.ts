export const initialOptions = {
    showShortsToVideoButton: true,
    loopShortsToVideo: true,
    updateShortsUI: true,
    smartTv: true
};

export type Options = typeof initialOptions;

export type OptionsNames = keyof Options;
