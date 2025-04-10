# 🎲 Ludo Game - React Native Project

Welcome to the **Ludo Game**! 🎉 This is a fun, production-ready mobile app built with [**React Native**](https://reactnative.dev). Designed for a seamless gaming experience, this project is rigorously tested with **Jest** and **Istanbul** to ensure top-notch quality. 🚀

## 📸 Screenshots and GIFs

Here are some visuals of the **Ludo Game** in action:

### Gameplay Screenshots

<p align="center">
    <img src="https://github.com/user-attachments/assets/e8a6c0de-c191-4a62-b9c6-eca0c1cd3ccb" alt="Image 1" width="150">
    <img src="https://github.com/user-attachments/assets/6bb1224a-488c-4a1f-acea-d1de7b65b85d" alt="Image 2" width="150">
    <img src="https://github.com/user-attachments/assets/09dfa5b8-b980-44af-a2a7-f3b2a7e2c218" alt="Image 3" width="150">
    <img src="https://github.com/user-attachments/assets/6be6852b-3b64-4701-8afa-1f8331f8fd23" alt="Image 4" width="150">
    <img src="https://github.com/user-attachments/assets/24e5e70c-6cad-431f-9f30-7035d584ccce" alt="Image 5" width="150">
</p>

### Gameplay GIF

- **Enemy Kill**:

  ![Enemy Kill Animation](https://github.com/user-attachments/assets/fc52c0ea-f566-4906-804c-3bcb9d3aa823)

### Test Results

- **Unit Test Coverage**:

  ![Test Coverage](https://github.com/user-attachments/assets/22b055be-45af-470b-b3cd-37459882be3d)

---

## 🚀 Getting Started

> **Before You Begin**: Make sure you've completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide. This ensures your system is ready for React Native development.

### 🔧 Native Changes

Search for **Native-Changes-LKG** in the codebase to locate all native modifications. Update app icons in the `res` (Android) or `Xcode` (iOS) directories as needed.

For **iOS**, add this script to your `package.json` to install CocoaPods dependencies:

```json
"scripts": {
    "pod install": "cd ios && RCT_NEW_ARCH_ENABLED=1 bundle exec pod install"
}
```

This will generate a `Podfile.lock` and install iOS-specific dependencies in the `ios/Pods/` directory.

---

## 🛠️ Major Packages and Technologies

This project leverages the following major packages and technologies:

| **Category**          | **Packages/Technologies**                                                                                    | **Description**                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| **Core Frameworks**   | [React Native](https://reactnative.dev), [React](https://reactjs.org)                                        | Mobile app framework and UI library.         |
| **Navigation**        | [React Navigation](https://reactnavigation.org)                                                              | Navigation library.                          |
|                       | `@react-navigation/native`, `@react-navigation/native-stack`                                                 | Core and stack navigation.                   |
| **State Management**  | [Redux](https://redux.js.org), [Redux Toolkit](https://redux-toolkit.js.org)                                 | State management and simplified Redux setup. |
|                       | [Redux Persist](https://github.com/rt2zz/redux-persist)                                                      | Persist and rehydrate Redux state.           |
| **Animations**        | [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)                            | Lottie animations.                           |
|                       | [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)                               | Declarative animations.                      |
|                       | [React Native SVG](https://github.com/react-native-svg/react-native-svg)                                     | SVG rendering.                               |
|                       | [React Native Linear Gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient) | Linear gradient backgrounds.                 |
| **UI Components**     | [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)                            | Customizable icons.                          |
|                       | [React Native Modal](https://github.com/react-native-modal/react-native-modal)                               | Modal components.                            |
|                       | [React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)                | Safe area handling.                          |
| **Utilities**         | [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)                                           | High-performance key-value storage.          |
|                       | [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)                     | Gesture handling.                            |
|                       | [React Native Sound Player](https://github.com/johnsonsu/react-native-sound-player)                          | Audio playback.                              |
| **Testing**           | [Jest](https://jestjs.io)                                                                                    | JavaScript testing framework.                |
|                       | [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)                      | React Native testing utilities.              |
| **Development Tools** | [ESLint](https://eslint.org), [Prettier](https://prettier.io), [TypeScript](https://www.typescriptlang.org)  | Linting, formatting, and typed JavaScript.   |

---

## 🛠️ Step 1: Start Metro

Metro is the JavaScript bundler for React Native. Start the Metro dev server by running:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

---

## 📱 Step 2: Build and Run Your App

With Metro running, open a new terminal and use one of these commands to build and run your app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, ensure CocoaPods dependencies are installed. If this is your first time setting up the project, run:

```sh
bundle install
```

Then, install the dependencies:

```sh
bundle exec pod install
```

Finally, build and run the app:

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

🎉 If everything is set up correctly, you'll see the **Ludo Game** running on your Android Emulator, iOS Simulator, or connected device. You can also use Android Studio or Xcode for direct builds.

---

## 🧪 Testing

This project is fully tested to ensure reliability and quality:

- **Unit Tests**: All components and files are tested with [Jest](https://jestjs.io).
- **Code Coverage**: Detailed coverage reports are generated using [Istanbul](https://istanbul.js.org).

Run the tests with:

```sh
# Using npm
npm run test

# OR using Yarn
yarn run test
```

---

## 🎉 Congratulations!

You've successfully set up, run, and tested the **Ludo Game**! 🥳

## 🌟 What's Next?

- Integrate this React Native code into an existing app using the [Integration Guide](https://reactnative.dev/docs/integration-with-existing-apps).
- Dive deeper into the [React Native Documentation](https://reactnative.dev/docs/getting-started) to explore more features.

## 🛠️ Troubleshooting

Encountering issues? Check out the [Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting) for solutions.

## 📚 Learn More

Here are some additional resources to help you master React Native:

- [React Native Website](https://reactnative.dev) - Official documentation and resources.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - Step-by-step setup guide.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - Beginner-friendly tutorials.
- [Blog](https://reactnative.dev/blog) - Stay updated with the latest news.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - Explore the open-source GitHub repository.

---

Enjoy building and playing the **Ludo Game**! 🎲✨
