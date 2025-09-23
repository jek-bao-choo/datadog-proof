# Android Shell App - Send Money & Book Car

A simple Android application demonstrating WebView integration with native navigation. The app features two main functionalities accessible from the home screen: Send Money and Book Car.

## Features

- **Home Screen**: Two buttons for primary functions
- **Send Money**: WebView-based form for phone number and amount input
- **Book Car**: WebView-based form for location inputs
- **Native Navigation**: Fragment-based navigation using Navigation Component

## Project Structure

```
app/
├── src/main/
│   ├── java/com/example/jek20250918/
│   │   ├── ui/
│   │   │   ├── home/
│   │   │   │   └── HomeFragment.kt          # Main screen with buttons
│   │   │   ├── sendmoney/
│   │   │   │   └── SendMoneyFragment.kt     # Send Money WebView
│   │   │   └── bookcar/
│   │   │       └── BookCarFragment.kt       # Book Car WebView
│   │   └── MainActivity.kt                  # Main activity
│   ├── res/
│   │   ├── layout/
│   │   │   ├── fragment_home.xml           # Home screen layout
│   │   │   ├── fragment_sendmoney.xml      # Send Money WebView layout
│   │   │   └── fragment_bookcar.xml        # Book Car WebView layout
│   │   ├── navigation/
│   │   │   └── mobile_navigation.xml       # Navigation graph
│   │   └── values/
│   │       └── strings.xml                 # String resources
│   └── assets/
│       ├── send_money.html                 # Send Money form
│       └── book_car.html                   # Book Car form
```

## Setup Instructions

### Prerequisites
- Android Studio (latest version)
- Android SDK (API 26 or higher)
- Java 8 or higher
- SDKMAN! CLI (recommended for Java/Gradle management)

### Installation

1. **Clone and Navigate**
   ```bash
   cd /path/to/android8__api26__webview__springboot
   ```

2. **Verify Java/Gradle Setup** (if using SDKMAN!)
   ```bash
   sdk current java
   sdk current gradle
   ```

3. **Build the Project**
   ```bash
   ./gradlew build
   ```

## Deployment

### Option 1: Android Studio
1. Open the project in Android Studio
2. Connect an Android device or start an emulator
3. Click "Run" or use Shift+F10

### Option 2: Command Line
1. **Build APK**
   ```bash
   ./gradlew assembleDebug
   ```

2. **Install on Device**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

## Verification

### Testing the App

1. **Home Screen Test**
   - Launch the app
   - Verify two buttons are visible: "Send Money" and "Book Car"
   - Buttons should be centered and properly styled

2. **Send Money Feature**
   - Click "Send Money" button
   - Verify WebView loads with form containing:
     - Phone number input field
     - Amount input field
     - "Send Money" button
   - Fill in fields and click "Send Money"
   - Should show alert with entered values

3. **Book Car Feature**
   - Click "Book Car" button
   - Verify WebView loads with form containing:
     - Current location input field
     - Destination input field
     - "Book Car" button
   - Fill in fields and click "Book Car"
   - Should show alert with entered values

4. **Navigation Test**
   - Verify back navigation works from WebView screens to home
   - Test bottom navigation bar (Home, Dashboard, Notifications)

### Build Verification
```bash
# Clean build
./gradlew clean build

# Run tests
./gradlew test

# Generate APK
./gradlew assembleDebug
```

## Architecture

- **Framework**: Android with Kotlin
- **Navigation**: Navigation Component with Fragment-based architecture
- **WebView**: Local HTML assets with JavaScript enabled
- **UI Pattern**: Material Design with ConstraintLayout

## HTML Features

### Send Money Form
- Mobile-responsive design
- Phone number input (tel type)
- Amount input (number type)
- JavaScript validation and alerts

### Book Car Form
- Mobile-responsive design
- Text inputs for locations
- JavaScript validation and alerts

## Cleanup

### Development Cleanup
```bash
# Clean build artifacts
./gradlew clean

# Remove generated files
rm -rf .gradle build
```

### Device Cleanup
```bash
# Uninstall app
adb uninstall com.example.jek20250918
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Ensure Android SDK is properly installed
   - Check Java version compatibility
   - Run `./gradlew clean build`

2. **WebView Not Loading**
   - Verify HTML files are in `app/src/main/assets/`
   - Check JavaScript is enabled in WebView settings
   - Ensure Internet permission is in manifest

3. **Navigation Issues**
   - Verify Navigation Component dependencies
   - Check navigation graph XML is valid
   - Ensure fragment destinations are properly defined

### Logs
```bash
# View app logs
adb logcat | grep "jek20250918"

# View WebView logs
adb logcat | grep "WebView"
```

## Development Notes

- **No Backend**: All functionality is client-side with mock alerts
- **No Validation**: Forms accept any input as specified in requirements
- **Local Assets**: HTML forms are stored locally for offline functionality
- **Simple Design**: Focus on functionality over complex UI

## Future Enhancements

- Add backend integration for actual money transfer
- Implement real car booking API
- Add form validation
- Enhanced UI/UX with Material Design 3
- Add loading states and error handling