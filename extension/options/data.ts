/* eslint-disable max-len */

import { type OptionsNames } from '../options';

type DataType = {
    name: OptionsNames;
    title: string;
    description?: string;
};

const data: DataType[] = [
    {
        name: 'showShortsToVideoButton',
        title: 'Enable Shorts to Video Button',
        description: 'Display a button on Shorts pages that allows users to view the same video on the standard watch page.'
    },
    {
        name: 'loopShortsToVideo',
        title: 'Loop Shorts Video on Watch Page',
        description: 'Automatically loop the video on the watch page if the original Shorts video is looped (after clicking the shorts to video button).'
    },
    {
        name: 'updateShortsUI',
        title: 'Optimize Shorts User Interface',
        description: 'Enhance the user interface for Shorts, particularly for vertical screens.'
    },
    {
        name: 'hideSponsoredShorts',
        title: 'Hide Sponsored Shorts',
        description: 'Hide sponsored Shorts on the Shorts page.'
    },
    {
        name: 'hideMastheadAds',
        title: 'Hide Masthead Ads',
        description: 'Hide masthead ads on the YouTube homepage.'
    },
    {
        name: 'hideInFeedAds',
        title: 'Hide In-Feed Ads',
        description: 'Hide in-feed ads, except those that might disrupt the layout or leave blank spaces.'
    },
    {
        name: 'hidePlayerAds',
        title: 'Hide Player Ads',
        description: 'Hide ads that appear on the video player page.'
    },
    {
        name: 'smartTv',
        title: 'Smart TV',
        description: ''
    }
];

export default data;
