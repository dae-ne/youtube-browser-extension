<div align="center">

  <img src="assets/logo.png" alt="logo" width="300px">

  ![Release](https://img.shields.io/github/v/release/dae-ne/youtube-browser-extension)
  ![Last commit](https://img.shields.io/github/last-commit/dae-ne/youtube-browser-extension)
  ![License](https://img.shields.io/github/license/dae-ne/youtube-browser-extension.svg)

  ![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

</div>


## Features

- ***Shorts To Video* Button** - adds a button to the shorts page that allows you to watch the short as a standard video.
- **Auto Loop Video** - sets the loop property of the video after clicking the *shorts to video* button.
- **Shorts UI Tweaks** - some UI improvements for the shorts page, especially for vertical screens.
- **Auto Skip Ads** - automatically skips ads when they appear on a video.
- **Hide Sponsored Shorts** - hides sponsored shorts from the shorts page.
- **Hide Masthead Ads** - hides the *masthead ads* on the homepage.
- **Hide In-Feed Ads** - hides *in-feed ads* (except for homepage, because it would break the layout).
- **Hide Player Ads** - hides *player ads* on the watch page.


## Options

You can toggle the features on and off on the options page. To access the options page, right-click the extension icon in the browser toolbar and select `Options` Alternatively, you can left-click the icon to opened the options page, but this method only works if YouTube is currently open in the active tab. Otherwise, the icon will simply open the YouTube homepage.

For now only dark mode is available.

<div align="center">
  <img src="assets/options.png" alt="options">
</div>


## How to install?

For now it's Chrome only.

1. Open the latest release (e.g.: 0.1.0) and download the `youtube_extension_<VERSION>.zip`, where `<VERSION>` is the version number (e.g.: *youtube_extension_0.1.0.zip*).
2. Unzip the downloaded file to a new directory.
3. In Chrome, go to the `chrome://extensions/` page.
4. Turn on the developer mode in the top right corner.
5. Click the `Load unpacked` button and select the unzipped directory with the extension.
6. You can add the extension to the browser toolbar by clicking the `puzzle` icon in the top right corner and then clicking the `pin` icon next to the extension name.
7. Right-click the extension icon in the toolbar and select `Options` to open the options page. Enable or disable the features as you wish.


## Local development

1. Clone the repository to your local machine.
2. Set git hooks by running the `npm run prepare` command.
3. Install the dependencies using the `npm install` command.
4. Build the project using the `npm run build` command.
5. Open the Chrome browser and go to the `chrome://extensions/` page.
6. Turn on the developer mode in the top right corner.
7. Click the `Load unpacked` button and select the `dist` directory from the cloned repository.


## How to add a new feature?

1. Create a new file in the `features` directory with a class that extends the `Feature` base class and implement methods.
2. Add new actions to the `actions.ts` file.
3. Register the new actions in a constructor of the new feature class (using the constructor of the `Feature` base class).
4. Add the new feature to exports in the `features/index.ts` file.
5. Import the new feature in the `youtube-extension.ts` and add it to the action handler.
6. Add sending messages from the background script to the content script in the `background.ts` file (`handleTabUpdate` and `disableFeatures` methods).
7. If the feature requires some settings, append the `Options` type (currently in the `types.ts`), add data to the `options/data.json`, and handle the new options in the background script. Also update the `default-settings.ts`.
8. If the feature uses custom CSS, add it to the `youtube-extension.css` file.
7. Update the `README.md` file with the new feature.


## License

See the [LICENSE](LICENSE) file for details.
