# Super App - Android Application

A modern Android Super App that provides access to multiple services across different categories (Finance, Telco, Utility, and Travel) through a unified interface.

## Overview

Super App is a Kotlin-based Android application built with Material Design 3 components, featuring a bottom navigation interface and WebView integration for service delivery. The app demonstrates a clean architecture pattern using Android's Navigation Component and ViewBinding.

## Features

### Service Categories

#### Finance
- **Send money** - Money transfer service
- **Trade Stock** - Stock trading platform

#### Telco
- **View Data Usage** - Mobile data usage monitoring

#### Utility
- **Pay Bill** - Bill payment service
- **Submit Self Meter Reading** - Utility meter submission

#### Travel
- **Plan Holiday** - Holiday planning service

### App Features
- Material Design 3 UI with custom color scheme
- Bottom navigation with 3 tabs (Home, Dashboard, Settings)
- WebView integration with back/forward navigation controls
- Progress indication during page loading
- Error handling for network issues
- Profile menu in app bar (placeholder)
- Responsive layout supporting different screen sizes

## Architecture

- **Pattern**: Single Activity with Navigation Component
- **UI Framework**: XML layouts with ViewBinding
- **Navigation**: Jetpack Navigation Component with arguments
- **WebView**: Custom WebView fragment with toolbar controls
- **Target API**: Android 8 (API 26) and above

## Prerequisites

### Required Software
- **IntelliJ IDEA Community Edition**: 2021.2 or later (recommended for Kotlin development)
- **Android Studio**: Arctic Fox or later (alternative)
- **SDKMAN**: For managing Gradle and Java versions
- **Java**: Version 11 or later (required)
- **Gradle**: Version managed by wrapper (included)
- **Android SDK**: API 26 or higher

### Installation

1. **Install SDKMAN** (if not already installed):
   ```bash
   curl -s "https://get.sdkman.io" | bash
   source "$HOME/.sdkman/bin/sdkman-init.sh"
   ```

2. **Install Java 11** using SDKMAN:
   ```bash
   sdk install java 11.0.12-open
   sdk use java 11.0.12-open
   ```

3. **Verify Installation**:
   ```bash
   java -version
   ./gradlew --version
   ```

## Setup Instructions

### Step 1: Clone/Open Project

1. Navigate to the project directory:
   ```bash
   cd /path/to/kotlin/android8__api26__superapp
   ```

2. **Option A: Open in IntelliJ IDEA Community Edition (Recommended)**:
   - Launch IntelliJ IDEA
   - Select "Open" from welcome screen
   - Navigate to the `android8__api26__superapp` folder
   - Click "Open"
   - When prompted, select "Trust Project"

   **Option B: Open in Android Studio**:
   - Launch Android Studio
   - Select "Open an Existing Project"
   - Navigate to the `android8__api26__superapp` folder
   - Click "OK"

### Step 2: Configure Gradle JDK (IntelliJ IDEA Only)

**Important**: IntelliJ IDEA's bundled JDK may cause build errors. Configure the Gradle JDK:

1. Open Settings/Preferences:
   - macOS: `IntelliJ IDEA` → `Settings`
   - Windows/Linux: `File` → `Settings`

2. Navigate to:
   ```
   Build, Execution, Deployment → Build Tools → Gradle
   ```

3. Set **Gradle JDK**:
   - Select `JAVA_HOME` (if configured via SDKMAN)

4. Click "Apply" → "OK"

### Step 3: Gradle Sync

1. Wait for IDE to automatically sync Gradle
2. If sync doesn't start automatically:
   - **IntelliJ**: Click the Gradle elephant icon in the toolbar
3. Resolve any dependency issues if prompted

### Step 4: Build Project

#### Using IntelliJ IDEA
1. Click "Build" → "Build Project" (or press Cmd+F9 / Ctrl+F9)
2. Wait for build to complete
3. Check "Build" output panel at the bottom for any errors

#### Using Android Studio
1. Click "Build" → "Make Project"
2. Wait for build to complete
3. Check "Build" tab for any errors

#### Using Command Line
```bash
cd android8__api26__superapp
./gradlew clean build
```

Expected output: `BUILD SUCCESSFUL`

## Deployment

### Option 1: Deploy via IntelliJ IDEA

1. **Connect Device/Start Emulator**:
   - **Physical device**: Enable USB debugging in Developer Options
   - **Emulator**: You need Android SDK with emulator installed
     - IntelliJ IDEA CE doesn't include Android Emulator by default
     - Option 1: Use command line: `emulator -avd <avd_name>`
     - Option 2: Use Android Studio's Device Manager
     - Option 3: Use a physical device

2. **Configure Run Configuration** (First time only):
   - Click "Add Configuration" dropdown in toolbar
   - Click "+" → "Android App"
   - Set:
     - Name: "app"
     - Module: "android8__api26__superapp.app.main"
     - Installation: "Default APK"
   - Click "Apply" → "OK"

3. **Select Device**:
   - Verify device is connected: Run `adb devices` in terminal
   - Click device dropdown in toolbar
   - Select your device

4. **Run Application**:
   - Click green "Run" button (or press Shift+F10)
   - Wait for app to install and launch

### Option 2: Deploy via Android Studio

1. **Connect Device/Start Emulator**:
   - Physical device: Enable USB debugging in Developer Options
   - Emulator: Launch Android 8 (API 26) or higher emulator via Device Manager

2. **Select Device**:
   - Click device dropdown in toolbar
   - Select your device/emulator

3. **Run Application**:
   - Click green "Run" button (or press Shift+F10)
   - Wait for app to install and launch

### Option 3: Deploy via Command Line

1. **Connect Device**:
   ```bash
   adb devices
   ```
   Verify your device is listed

2. **Install APK**:
   ```bash
   ./gradlew installDebug
   ```

3. **Launch App**:
   ```bash
   adb shell am start -n com.example.android8__api26__superapp/.MainActivity
   ```

### Option 4: Install APK Manually

1. **Build APK**:
   ```bash
   ./gradlew assembleDebug
   ```

2. **Locate APK**:
   ```
   app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Install**:
   - Transfer APK to device
   - Enable "Install from Unknown Sources"
   - Tap APK to install

## Verification

### Test Checklist

1. **App Launch**:
   - [ ] App launches without crashes
   - [ ] App bar displays "My Super App"
   - [ ] Profile icon visible in top-right corner

2. **Home Screen**:
   - [ ] All 4 category headers visible (Finance, Telco, Utility, Travel)
   - [ ] All 6 service buttons displayed with correct icons
   - [ ] Service labels are readable

3. **Service Navigation**:
   - [ ] Click "Send money" � WebView opens with URL
   - [ ] Click "Trade Stock" � WebView opens
   - [ ] Click "View Data Usage" � WebView opens
   - [ ] Click "Pay Bill" � WebView opens
   - [ ] Click "Submit Self Meter Reading" � WebView opens
   - [ ] Click "Plan Holiday" � WebView opens

4. **WebView Controls**:
   - [ ] Back button navigates to previous page (in WebView)
   - [ ] Forward button navigates to next page (if available)
   - [ ] Refresh button reloads current page
   - [ ] Progress bar shows during page load
   - [ ] System back button returns to Home screen

5. **Bottom Navigation**:
   - [ ] Home tab displays service grid
   - [ ] Dashboard tab shows "Dashboard - Coming Soon"
   - [ ] Settings tab shows "Settings - Coming Soon"
   - [ ] Navigation transitions are smooth

6. **Profile Menu**:
   - [ ] Click profile icon � Toast "Profile - Coming Soon" appears

### Expected Behavior

#### Service URLs
All services currently point to placeholder URLs:
- Finance services: `https://example.com/finance/*`
- Telco services: `https://example.com/telco/*`
- Utility services: `https://example.com/utility/*`
- Travel services: `https://example.com/travel/*`

**Note**: example.com will display a simple page. Replace with actual service URLs for production.

#### WebView Behavior
- JavaScript enabled for modern web app support
- Zoom controls available (pinch to zoom)
- DOM storage enabled for web app data
- Error message displays if page fails to load

### Testing Tips

1. **Test with Internet Connection**:
   - Ensure device has internet connectivity
   - Test with WiFi and mobile data

2. **Test Without Internet**:
   - Disable internet connection
   - Click a service button
   - Verify error message appears

3. **Test Rotation**:
   - Rotate device while on Home screen
   - Verify layout adapts correctly
   - Rotate while in WebView
   - Verify page state is preserved

4. **Test Back Navigation**:
   - Open a service � Navigate within WebView � Press back
   - Verify WebView goes back in history
   - Press back again when at first page
   - Verify returns to Home screen

## Project Structure

```
android8__api26__superapp/
   app/
      src/
         main/
            java/com/example/android8__api26__superapp/
               MainActivity.kt              # Main activity
               ui/
                   home/                    # Home screen
                      HomeFragment.kt
                      ServiceItem.kt       # Service data model
                      Services.kt          # Service constants
                   dashboard/               # Dashboard tab
                      DashboardFragment.kt
                   notifications/           # Settings tab
                      NotificationsFragment.kt
                   webview/                 # WebView
                       WebViewFragment.kt
            res/
               drawable/                    # Icon resources
               layout/                      # UI layouts
               menu/                        # Menu resources
               navigation/                  # Navigation graph
               values/                      # Strings, colors, themes
            AndroidManifest.xml
         test/                                # Unit tests
      build.gradle.kts                         # App-level Gradle
      proguard-rules.pro                       # ProGuard config
   gradle/                                      # Gradle wrapper
   build.gradle.kts                             # Project-level Gradle
   settings.gradle.kts                          # Gradle settings
   README.md                                    # This file
```

## Configuration

### Modifying Service URLs

Edit `Services.kt` to change service URLs:

```kotlin
// app/src/main/java/.../ui/home/Services.kt

val SEND_MONEY = ServiceItem(
    id = "send_money",
    title = "Send money",
    iconResId = R.drawable.ic_send_money,
    url = "https://your-service-url.com",  // <-- Change this
    category = CATEGORY_FINANCE
)
```

### Adding New Services

1. Add icon drawable in `res/drawable/`
2. Add service constant in `Services.kt`
3. Update `fragment_home.xml` layout
4. Add click listener in `HomeFragment.kt`
5. Add string resource in `strings.xml`

### Customizing Theme

Edit `res/values/themes.xml` to customize colors:

```xml
<item name="colorPrimary">@color/your_primary_color</item>
<item name="colorSecondary">@color/your_secondary_color</item>
```

## Troubleshooting

### Common Issues

#### Build Errors (IntelliJ IDEA)

**Issue**: "jlink executable does not exist" or "Could not resolve all files for configuration"
```
Execution failed for task ':app:compileDebugJavaWithJavac'
> jlink executable /Applications/IntelliJ IDEA CE.app/Contents/jbr/Contents/Home/bin/jlink does not exist
```

**Solution**: Configure Gradle JDK to use system Java instead of IntelliJ's bundled JDK

1. Go to `IntelliJ IDEA` → `Settings` → `Build, Execution, Deployment` → `Build Tools` → `Gradle`
2. Change "Gradle JDK" to:
   - `JAVA_HOME` (recommended if using SDKMAN)
   - OR `Java 11` / `Java 17` from system
   - OR Add JDK from `~/.sdkman/candidates/java/[version]`
3. Click "Apply" → "OK"
4. Sync Gradle (click elephant icon)
5. Rebuild project

**Issue**: "SDK location not found"
```bash
# Solution: Create local.properties with Android SDK path
echo "sdk.dir=/Users/[username]/Library/Android/sdk" > local.properties
```
On Linux: `echo "sdk.dir=/home/[username]/Android/Sdk" > local.properties`

**Issue**: "Gradle sync failed"
```bash
# Solution: Clean and rebuild
./gradlew clean
./gradlew build --refresh-dependencies
```

#### Runtime Errors

**Issue**: WebView not loading pages
- Check internet permission in `AndroidManifest.xml`
- Verify device has internet connection
- Check LogCat for errors

**Issue**: App crashes on launch
- Verify minimum SDK version (API 26)
- Check LogCat for stack trace
- Clean and rebuild project

#### Device Connection

**Issue**: Device not detected by adb
```bash
# Kill and restart adb server
adb kill-server
adb start-server
adb devices
```

## Cleanup

### Uninstall Application

#### Using adb
```bash
adb uninstall com.example.android8__api26__superapp
```

#### Using Device
1. Go to Settings � Apps
2. Find "android8__api26__superapp"
3. Tap "Uninstall"

### Clean Build Files

```bash
./gradlew clean
rm -rf app/build
rm -rf build
```

### Clear IDE Cache

#### IntelliJ IDEA
```bash
# In IntelliJ IDEA
File → Invalidate Caches → Invalidate and Restart
```

#### Android Studio
```bash
# In Android Studio
File → Invalidate Caches / Restart → Invalidate and Restart
```

## Development

### Adding Features

1. Create feature branch
2. Implement feature following existing patterns
3. Test thoroughly
4. Update documentation
5. Create pull request

### Code Style

- Follow Kotlin coding conventions
- Use meaningful variable/function names
- Add comments for complex logic
- Keep functions small and focused
- Use ViewBinding for UI access

### Dependencies

Current dependencies (managed in `build.gradle.kts`):
- AndroidX Core KTX
- AppCompat
- Material Components
- ConstraintLayout
- Navigation Component
- Lifecycle ViewModel/LiveData

## License

This project is for demonstration purposes.

## Support

For issues or questions:
1. Check this README
2. Review Android documentation
3. Check Stack Overflow
4. Create an issue in the project repository

## Version History

### Version 1.0 (Current)
- Initial release
- 6 service integrations across 4 categories
- WebView with navigation controls
- Bottom navigation with 3 tabs
- Material Design 3 UI
- Android 8+ support

## Future Enhancements

Planned features:
- Search functionality for services
- Service favorites/recent section
- User authentication
- Offline support with caching
- Deep linking support
- Service categorization with expand/collapse
- Custom WebView with share functionality
- Analytics integration
- Push notifications
- Dark mode support
