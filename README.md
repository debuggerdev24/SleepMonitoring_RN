# �� React Native Project Setup Guide

## �� Prerequisites

### System Requirements
- **Node.js** v18.x.x (`node -v`)
- **npm** or **yarn** (latest version)
- **Java JDK** 17.x.x (`java -version`)
- **Watchman** (Mac only, `brew install watchman`)

### Platform-Specific Requirements

#### Android
- Android Studio (latest version)
- Android SDK (API 35)
- Android NDK (if using native code)
- Environment variables set:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
iOS (Mac Only)
Xcode 14+

CocoaPods (sudo gem install cocoapods)

Command Line Tools:

bash
xcode-select --install
🚀 Installation
1. Clone the Repository
bash
https://github.com/debuggerdev24/SleepMonitoring_RN.git
cd your-repo
2. Install Dependencies
bash
npm install
# OR
yarn install
🤖 Android Setup
1. Configure Android Studio
Install Android Studio

Open SDK Manager → Install:

Android SDK 35

Android Emulator

Platform Tools

Create virtual device in AVD Manager

2. Run Android App
bash
# Start Metro bundler (in separate terminal)
npx react-native start

# Build and run
npx react-native run-android
Troubleshooting Android
If you get "SDK not found":

bash
sudo ln -s $ANDROID_HOME /usr/local/android-sdk
For "Could not connect to development server":

bash
adb reverse tcp:8081 tcp:8081
🍏 iOS Setup
1. Install CocoaPods
bash
cd ios && pod install
2. Run iOS App
Option 1: Command Line
bash
npx react-native run-ios
Option 2: Xcode
Open ios/YourProject.xcworkspace

Select target device/simulator

Click ▶️ Run button

Troubleshooting iOS
For "No such module" errors:

bash
rm -rf ~/Library/Developer/Xcode/DerivedData/
cd ios && pod deintegrate && pod install
For signing issues:

Select development team in Xcode → Signing & Capabilities

🔄 Common Commands
Task	Command
Start Metro	npx react-native start
Run Android	npx react-native run-android
Run iOS	npx react-native run-ios
Clean build	cd android && ./gradlew clean
Reset cache	npx react-native start --reset-cache
🛠 Debugging Tips
Android
adb logcat - View device logs

⌘M - Open developer menu on emulator

iOS
⌘D - Open developer menu on simulator

⌘K - Clear console in Xcode

📱 Running on Physical Device
Android
Enable USB debugging on device

Connect via USB

Run adb devices to verify connection

npx react-native run-android

iOS
Connect device via USB

Select device in Xcode

Configure code signing

Click ▶️ Run

🎉 You're Ready to Develop!
text

Key improvements:
1. **Detailed platform-specific setup** with exact requirements
2. **Troubleshooting sections** for common issues
3. **Physical device instructions** for both platforms
4. **Quick reference table** for common commands
5. **Debugging tips** for both platforms
6. **Clear separation** between Android and iOS workflows
7. **Environment variable setup** included
8. **Visual hierarchy** with emojis and markdown formatting

This version provides everything a developer needs to get started with React Native development on either platform, while also serving as a handy reference for common tasks and troubleshooting.