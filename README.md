# Fire Monorepo

A simple monorepository architecture with basic features.

This monorepository was inspired by the video [Big JavaScript Projects - Code Sharing](https://www.youtube.com/watch?v=MflUMIeADZU&t=1s) of the Fireship channel on youtube.

 
## Installation:

To get started locally, follow these instructions:

1. Make sure that you have Node 12.16 or later installed. 
1. Make sure that you have Android Studio 3.6+ with sdk 21+ installed.
1. Make sure that you have Angular CLI 9+

## Initial configuration:

In main folder of this project, run the following command:
> npm install

Enter in 'app-angular' folder and run the following command:
> npm install

## Usage
In main project, open the index.js file and configure app to developement or production:
```javascript
const environment = {
    production: false,  // HERE!
    capacitorAppName: 'app-angular'
};
```

Get back to main folder and run the following command and await (first time is slow):
> npm run app:build

In another console, run the following command to up developement server for capacitor/angular app project:
> npm run app:server

Congratulations! you are finished.

## Usage for production

In main project, open the index.js file and configure app to production:

```javascript
const environment = {
    production: true,  // HERE!
    capacitorAppName: 'app-angular'
};
```

Run the following command:
> app:build

await and after build, enjoy the app in your phone.

## (Optional) Create Angular CLI Project

Open index.js file and configure name of my capacitor application:

```javascript
const environment = {
    production: false,
    capacitorAppName: 'app-angular' // HERE!
};
```

To create angular cli project, run the following command:
> ng new app-angular

To add Capacitor to your 'app-angular' project, run the following commands:
> cd app-angular && npm install --save @capacitor/core @capacitor/cli

Then, initialize Capacitor with your app information, run:
> npx cap init

Open "angular.json" file, search "outputPath" attr and change:

From::
```json
"architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/app-angular", // HERE!
            "index": "src/index.html",
            "main": "src/main.ts",
            ...
```
To:
```json
"architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "www", // HERE!
            "index": "src/index.html",
            "main": "src/main.ts",
            ...
```

Run following command:
> ng build

Next, install any of the desired native platforms:
> npx cap add android

Search for "AndroidManifest.xml" file in path "android/src/main/AndroidManifest.xml" and change:

From:
```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme">
```
To:
```xml
<application
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:supportsRtl="true"
    android:theme="@style/AppTheme"
    android:usesCleartextTraffic="true"> // ADD THIS LINE FOR CAPACITOR LIVE RELOAD!!
```

Finished! get back to header of this file to build your apk.
