# Shimmer

Shimmer - a Notepad Reimagined for Design Enthusiasts.

##### Built using Electron JavaScript Framework. Available for both Windows & macOS.

###### Shimmer also has a built in Screensaver Clock that embraces the same visually stunning aesthetics of the application. The Screensaver additionally includes a secret feature that's only available for macOS. Find it by yourself.

## Binaries Available

Refer this repository's packages page to download the below listed packages.

- macOS ARM x64 (Apple Silicon)
- macOS x86 x64 (Intel)
- Windows

## Installation

Use Node Package Manager to install electron and electron-builder.

```bash
npm install
```

## Development Mode

To run the code without completely Packaging the app for development purposes, use this command.

```
npm start
```

## Packaging the Application

To package the app as a DMG or EXE, use the following command. This command will place the DMG or EXE file in the dist folder within the project's main directory, depending on the platform on which it is executed.

```
npm run dist
```
To explicitly Package the app as a DMG (Both Apple Silicon & Intel) regardless of the Operating System being used, use this command.

```
npm run dist:mac
```

To explicitly Package the app as an EXE regardless of the Operating System being used, use this command.

```
npm run dist:win
```

## Contribution Note

Pull requests are welcome! For major changes, please open an issue first to discuss your proposed modifications. Especially when changing the app icons.

###### Please note that both platforms have specific parameters for adding an app icon. This ensures consistency and prevents any discrepancies in the app logo.
