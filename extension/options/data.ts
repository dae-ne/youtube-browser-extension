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
        name: 'smartTv',
        title: 'Smart TV',
        description: ''
    }
];

export default data;
