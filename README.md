# React Native Firebase Auth Starter<a href="https://rnfirebase.io"><img align="left" src="http://i.imgur.com/01XQL0x.png"></a>

[![Backers on Open Collective](https://opencollective.com/react-native-firebase/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/react-native-firebase/sponsors/badge.svg)](#sponsors)
[![npm version](https://img.shields.io/npm/v/react-native-firebase.svg?style=flat-square)](https://www.npmjs.com/package/react-native-firebase)
[![NPM downloads](https://img.shields.io/npm/dm/react-native-firebase.svg?style=flat-square)](https://www.npmjs.com/package/react-native-firebase)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?style=flat-square)](https://discord.gg/t6bdqMs)
[![Twitter Follow](https://img.shields.io/twitter/follow/rnfirebase.svg?style=social&label=Follow)](https://twitter.com/rnfirebase)

---

A basic react native app with [`react-native-firebase`](https://github.com/invertase/react-native-firebase) pre-integrated  to get you started quickly.

---


## Getting Started

If you're only developing for one platform you can ignore the steps below that are tagged with the platform you don't require.

### 1) Clone & Install Dependencies

- 1.1) `git clone https://gitlab.com/invertase/react-native-firebase-starter-auth.git`
- 1.2) `cd react-native-firebase-starter-auth` - cd into your newly created project directory.
- 1.3) Install NPM packages with your package manager of choice - i.e run `yarn` or `npm install`
- 1.4) **[iOS]** `cd ios` and run `pod install` - if you don't have CocoaPods you can follow [these instructions](https://guides.cocoapods.org/using/getting-started.html#getting-started) to install it.
- 1.5) **[Android]** No additional steps for android here.

### 2) Rename Project

**You will need to be running Node verison 7.6 or greater for the rename functionality to work**

- 2.0) **[iOS]** `cd ..` to return to the root directory of the project
- 2.1) `npm run rename` - you'll be prompted to enter a project name and company name
- 2.2) Note down the package name value - you'll need this when setting up your Firebase project

### 3) Add `Google Services` files (plist & JSON)

- 3.1) **[iOS]** Follow the `add firebase to your app` instructions [here](https://firebase.google.com/docs/ios/setup#add_firebase_to_your_app) to generate your `GoogleService-Info.plist` file if you haven't done so already - use the package name generated previously as your `iOS bundle ID`.
- 3.2) **[iOS]** Place this file in the `ios/` directory of your project.
- 3.3) **[Android]** Follow the `manually add firebase` to your app instructions [here](https://firebase.google.com/docs/android/setup#manually_add_firebase) to generate your `google-services.json` file if you haven't done so already - use the package name generated previously as your `Android package name`.
- 3.4) Place this file in the `android/app/` directory of your project.

## Setting up Authentication

- 1) Open the [Firebase Console](https://console.firebase.google.com) for your project
- 2) Select `Authentication` to open the authentication settings
- 3) Select the `Sign-in Method` tab

### 1) Email / password authentication

- 1.1) Select `Email/Password`
- 1.2) Make sure it is enabled
- 1.3) Click `SAVE`

### 2) Phone

- 2.1) Select `Phone`
- 2.2) Make sure it is enabled
- 2.3) Click `SAVE`
- 2.3) **[iOS]** By default, Phone Auth is setup to use reCAPTCHA verification. To enable silent notifications instead, follow the instructions [here](https://firebase.google.com/docs/auth/ios/phone-auth#start-receiving-silent-notifications)
- 2.4) **[Android]** No additional steps for android here.

### 3) Google

#### 3.1) iOS

- 3.1.1) Open the `ios/GoogleService-Info.plist` file
- 3.1.2) Copy the `CLIENT ID` value to the `src/config/index.js` file's `GOOGLE_SIGN_IN_IOS_CLIENT_ID` value
- 3.1.3) Copy the `REVERSED_CLIENT_ID` value from the `ios/GoogleService-Info.plist` file, you'll need it for the next few steps
- 3.1.4) Open your project in Xcode **(remember to use the .xcworkspace file)**
- 3.1.5) Select your project in the left hand window
- 3.1.6) Click `Build Settings` at the top of the page
- 3.1.7) Scroll to the bottom until you see a `GOOGLE_SIGN_IN_URL_SCHEME` property in the `user-defined` section
- 3.1.8) Set the value to the `REVERSED_CLIENT_ID` you copied above

#### 3.2) Android

- 3.2.1) Load the [API Credentials](https://console.developers.google.com/apis/credentials) for your project
- 3.2.2) If you do not have a Web Application OAuth 2.0 client ID, then create a new one
- 3.2.3) Open the Web Application OAuth 2.0 client ID
- 3.2.4) Copy the `Client ID` to the `src/config/index.js` file's `GOOGLE_SIGN_IN_ANDROID_CLIENT_ID` value
- 3.2.5) Take note of the `Client ID` and `Client Secret`, you'll need it below

#### 3.3) Firebase Console

- 3.3.1) Select `Google`
- 3.3.2) Make sure it is enabled
- 3.3.3) Make sure that your `SHA-1` fingerprint is set in your project settings as explained on screen
- 3.3.4) Go back to the Google setup and open the `Web SDK configuration` section
- 3.3.5) Copy the Client ID and Client Secret you noted in the `Android` instructions above (if they aren't already set)
- 3.3.6) Click `SAVE`

### 4) Facebook

#### 4.1) Create the Facebook App

- 4.1.1) Open the [Facebook Developers Console](https://developers.facebook.com/apps/)
- 4.1.2) Click `Add a New App`
- 4.1.3) Fill out the name and email address, and confirm creation
- 4.1.4) Take note of the Facebook App ID at the top of the screen, you'll need it later

#### 4.2) iOS

- 4.2.1) On the Facebook Developer Console, add Facebook Login to your apps
- 4.2.2) Select the iOS option
- 4.2.3) You should see a sequence of steps, fortunately most have been configured already
- 4.2.4) Skip to `Add your Bundle Identifier`
- 4.2.4) Enter the `package name` value you were given in the `Rename Project` section above, e.g. `com.invertase.rnfirebasestarter`
- 4.2.5) Enable Single Sign On
- 4.2.6) You can skip through the rest of the steps
- 4.2.7) Re-open Xcode if it's not already open, select your project and click `Build Settings`
- 4.2.8) Scroll to the bottom until you see a `FACEBOOK_APP_ID` property in the `user-defined` section
- 4.2.9) Set the value to the `Facebook App ID` of the Facebook app you have just created

#### 4.3) Android

- 4.2.1) On the Facebook Developer Console, add Facebook Login to your apps
- 4.2.2) Select the Android option
- 4.2.3) You should see a sequence of steps, fortunately most have been configured already
- 4.2.4) Skip to `Tell Us about Your Android Project`
- 4.2.5) For the Package Name field, enter the `package name` value you were given in the `Rename Project` section above, e.g. `com.invertase.rnfirebasestarter`
- 4.2.6) For the Default Activity Class Name field, enter the `package name` value, followed by `MainApplication`, e.g. `com.invertase.rnfirebasestarter.MainApplication`
- 4.2.7) Click `Save` - You'll get a warning that the app isn't listed on Google Play yet. Ignore by clicking `Use this package name`
- 4.2.8) Follow the instructions to generate your Development and Release Key Hashes.
- 4.2.9) Enable Single Sign On
- 4.2.10) You can skip through the rest of the steps
- 4.2.11) Open the `android/app/src/main/res/values/strings.xml` file
- 4.2.12) Replace both the <--FACEBOOK_APP_ID--> parts with the `Facebook App ID` of the Facebook app you have just created. **NOTE** The second value should still start with fb.

#### 4.4) Firebase Console

- 4.4.1) Select `Facebook`
- 4.4.2) Make sure it is enabled
- 4.4.3) Set the `App ID` field as the `Facebook APP ID` of the Facebook app you just created.
- 4.4.4) Set the `App Secret` field as the `App Secret` field from the Facebook app dashboard
- 4.4.5) Click `SAVE`

## Start your app

- 5.1) Start the react native packager, run `yarn run start` or `npm run start` from the root of your project.
- 5.2) **[iOS]** Build and run the iOS app, run `react-native run-ios` from the root of your project. The first build will take some time. This will automatically start up a simulator also for you on a successful build if one wasn't already started.
- 5.3) **[Android]** If you haven't already got an android device attached/emulator running then you'll need to get one running (make sure the emulator is with Google Play / APIs). When ready run `react-native run-android` from the root of your project.
