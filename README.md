# YouTube Extension

Chrome extension for YouTube that adds new features and improvmements to the website.


## Features

- **Shorts To Video Button** - adds a button to the shorts page that allows you to watch the short as a standard video
- **Auto Loop Video** - sets the loop property of the video after clicking the `shorts to video` button
- **Shorts UI Tweaks** - some UI improvements for the shorts page, especially for vertical screens
- **Auto Skip Advertisements** - automatically skips ads when they appear on a video
- **Remove Sponsored Shorts** - removes sponsored shorts from the shorts page


## How to install?

For now, it works only in Google Chrome (it's still in development, so not every feature is working properly).

1. Clone the repository to your local machine.

2. Build the project using the `npm run build` command.

3. Open the Chrome browser and go to the `chrome://extensions/` page.

4. Turn on the developer mode in the top right corner.

5. Click the `Load unpacked` button and select the `dist` directory.


## How to add a new feature?

1. Create a new file in the `features` directory with a class that extends the `Feature` base class and implement methods.

2. Add new actions to the `actions.ts` file.

3. Register the new actions in a constructor of the new feature class (using the constructor of the `Feature` base class).

4. Add the new feature to exports in the `features/index.ts` file.

5. Import the new feature in the `youtube-extension.ts` and add it to the action handler.

6. Add sending messages from the background script to the content script in the `background.ts` file (in the `updateApp` method).

7. Update the `README.md` file with the new feature.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
