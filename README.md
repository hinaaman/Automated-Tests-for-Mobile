# Testing Websites and Web Apps on Virtual and Real devices with Appium + NodeJS

## Dependencies
* Install or Update [Java](https://www.java.com/en/download/manual_java7.jsp)
* Install [NodeJS](https://nodejs.org/)
* Update npm:
```
$   sudo npm install npm -g
```
* Install [XCode](https://developer.apple.com/xcode/downloads/)
* Download [Android SDK Tools](https://developer.android.com/sdk/index.html#Other)
* Add the following to the ~/.bashrc file (make sure the path to android-sdk-macosx is correct):

```
export ANDROID_HOME=$HOME/Downloads/android-sdk-macosx
export ANDROID_SDK=$ANDROID_HOME
PATH=$PATH:/Applications/apache-ant-1.8.4/bin
PATH=$PATH:/usr/local/share/npm/bin/
PATH=$PATH:$ANDROID_HOME/build-tools
PATH=$PATH:$ANDROID_HOME/platform-tools
PATH=$PATH:$ANDROID_HOME/tools
export JAVA_HOME="`/System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java_home`"
export PATH

```

## Install and run Appium

```
$   npm install -g appium
$   appium &
```

## Running tests on iOS

Make sure appium is running. Launch XCode. Make sure the capabilities in nodejs_sample/config/caps.js are configured for your device/emulator. 

```
$   cd node
$   npm install
$   env cap="ios81" mocha homepage.js
```

To test on a real apple device, you would need an [Apple Developer ID](https://developer.apple.com/programs/ios/). Edit nodejs_sample/config/caps.js with a new capability (or modify the existing one for iOS). The new/modified capability should look something like this:

```
exports.ios81 = {
browserName: '',
'appium-version': '1.3',
platformName: 'iOS',
platformVersion: '8.1',
deviceName: 'iPhone Simulator',
app: <path to .ipa file>
udid: <unique-device-id>
};
```

To obtain an iPhone/iPad's udid, connect it to your laptop and open iTunes. Select the device from the left pane. Click device serial number to reveal udid. 

```
$   env cap="ios81" mocha homepage.js
```

## Running tests on Android

### Setting up an AVD (Android Virtual Device) / emulator:
Launch Android SDK Manager:

```
$  $ANDROID_HOME/tools/android
```

Download any android image from the list E.g; Android 4.4.2 - If you have an android device, you might want to get a matching android version for POC. 

Once the download completes, list image targets and note down the id for an image you will be creating the emulator with:

```
$  $ANDROID_HOME/tools/android list targets
```

Create an emulator using the id (see above) for <targetID>:

```
$  $ANDROID_HOME/tools/android create avd -n <name> -t <targetID>
```

List available emulators:

```
$  $ANDROID_HOME/tools/emulator -list-avds
```

Run an emulator:

```
$   $ANDROID_HOME/tools/emulator @<name_of_emulator>
```

In newer versions of Android, Chrome is the default browser. You'd need to have Chrome on your emulator to run tests on it. You can either download a [Chrome apk online](https://github.com/imurchie/chromes) or get it directly from your android device:

Stop all running emulators. Connect the android device to your laptop and start Android Bridge / adp server:

```
$   adb start-server
$   adb shell pm list packages
```

Look for chrome package (something similar to: com.android.chrome-2.apk), get its path and pull package to your laptop using the path:

```
$   adb shell pm path <name-of-chrome-package>
$   adb pull <path-of-chrome-package>
```

Disconnect the device. Launch an emulator:

```
$   $ANDROID_HOME/tools/emulator @<name_of_emulator>
```

Install chrome package:

```
$   adb install path/to/pulled/chrome/package
```

### Running the tests

Make sure appium is up running. If not, fire it up:

```
$   appium &
```

Make sure an emulator with chrome is running. If not, fire one up:

```
$   $ANDROID_HOME/tools/emulator @<name_of_emulator>
```

If you are testing on a real device, you need to close all the running emulators and connect an android device to your laptop. Make sure the capabilities in nodejs_sample/config/caps.js are configured for your device/emulator.

Run the tests with:

```
$   env cap="android17" mocha homepage.js
```

## Running tests in parallel

You can't run tests in parallel on iOS with Appium.

For Android devices, run multiple instances of Appium servers passing a different port (-p), appium bootstrap port (-bp) and device id (-U) for each. For example:

```
$   appium -p 4492 -bp 2251 -U 32456
$   appium -p 4491 -bp 2252 -U 43364
```