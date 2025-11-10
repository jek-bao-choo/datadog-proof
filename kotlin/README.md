# NOTE
* Create a scaffold Android app using IntelliJ IDEA Community Edition. After which use Claude to develop it further.
* The super app is in this folder called android8__api26__superapp


# Android App Setup
I chose to keep this step here because setting an Android native app project would require me to repeat this process. 

## 1. Java version control setup

Use SDKMAN! CLI for Gradle, Maven, and Java version control and installation

### jdk version 17 at least req for Android SDK dev
```
java --version

sdk list java

# at least java 17

sdk install java 17.0.10-tem

sdk default java 17.0.10-tem

java --version

```

## 2. Android SDK development setup 

Skip this step is I already have `~/Android/sdk` and its relevant folder in place

```
# Where the SDK will live (adjust if you prefer):
export ANDROID_SDK_ROOT="$HOME/Android/sdk"
mkdir -p "$ANDROID_SDK_ROOT"

# Download "Command line tools (latest)" from Android Developers
# Unzip so they end up at: $ANDROID_SDK_ROOT/cmdline-tools/latest
mkdir -p "$ANDROID_SDK_ROOT/cmdline-tools"
unzip ~/Downloads/Chrome/commandlinetools-mac-*.zip -d "$ANDROID_SDK_ROOT/cmdline-tools"
mv "$ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools" "$ANDROID_SDK_ROOT/cmdline-tools/latest"
```

```bash
~/Android/sdk/cmdline-tools/
└── latest/
    ├── bin/
    ├── lib/
    └── ...
```

Set Environment Variables: Add the Android SDK tools to your PATH. Add the following lines to your ~/.zshrc or equivalent shell configuration file.
```bash
# Add Android SDK Development on 17 Sep 2025
export ANDROID_SDK_HOME="$HOME/Android/sdk"

# Add Android tools to PATH on 17 Sep 2025
export PATH="$PATH:$ANDROID_SDK_HOME/cmdline-tools/latest/bin"
export PATH="$PATH:$ANDROID_SDK_HOME/platform-tools"
export PATH="$PATH:$ANDROID_SDK_HOME/emulator"
```

```bash
source ~/.zshrc


# Install essentials: platform tools, build-tools, API 35 (Android 15), emulator, and an ARM64 system image
# Install the revelant version that I want to test or validate for PoC.

sdkmanager "platform-tools" \
           "platforms;android-35" \
           "build-tools;35.0.0" \
           "emulator" \
           "system-images;android-35;google_apis;arm64-v8a"

# Use arm64 because my Mac’s CPU is ARM64. The Android Emulator runs ARM system images natively on Apple Silicon and is much faster/stabler that way. x86_64 images are meant for Intel hosts. On Apple Silicon they rely on translation and are slower / flaky.

# (Optional) List packages
sdkmanager --list
```

## 3. Pre-req
Follow the JDK 17 and Android SDK setup steps in /kotlin README.md if not done. 

## 4. Create an Android Virtual Device (AVD)

```bash
avdmanager create avd -n pixel8a-api35 \
  -k "system-images;android-35;google_apis;arm64-v8a" -d "pixel_8a"
```

Launch the Emulator: Run the emulator in a separate terminal window. It can take a minute to boot up.

```bash
emulator -avd pixel8a-api35
```
~~

## 5. Create and Run the Project in IntelliJ IDEA CE

Now you're ready to create and run the app from IntelliJ IDEA.

1.  Open **IntelliJ IDEA CE**, install Android plugins, and select **New Project**.
2.  From the left-hand menu, select **Android**.
3.  Choose the **Empty Views Activity** template and click **Next**.
4.  **Configure the Project**:
    * **Name**: `android7__api24__helloworld`
    * **Package name**: `com.example.helloworldapp`
    * **Language**: Kotlin
    * **Minimum SDK**: API 24: Android 7.0 (Nougat) is a good default.
5.  Click **Finish**.
6.  **Configure the Android SDK**: If prompted, IntelliJ will ask for the location of your Android SDK. Point it to the directory you created earlier (`~/Android/sdk`).
7.  **Gradle Sync**: Wait for IntelliJ to download dependencies and sync the project. This can take a few minutes. ☕
8.  **Run the App**:
    * The emulator you launched (`Google sdk_gphone64_arm64`) should appear in the device dropdown menu at the top of the IDE.
    * Click the green **Run** icon (▶️) next to the device dropdown.
    * IntelliJ will build the project, install the APK on the emulator, and launch the app. You should see "Hello World!" on the screen.

---

## ✨ 6. Verify toolchain for matching version in PoC

``` bash
java -version            # should be 17+ (ideally 21)
./gradlew -v             # shows Gradle + JVM used
sdkmanager --version     # confirms CLI installed
adb --version            # platform-tools present

# Also verify agp version, gradle version, kotlin version, android api version
```

---

## ✨ 7. Use Claude Code with IntelliJ IDEA CE to make more changes to code
Cheers.

---

## 8. Add Datadog Android SDK
In Datadog UI > Digital Experience > Manage Application > New Application > Android

Approach 1: Add the following line to my build.gradle.kts file.
```json
// In build.gradle.kts
plugins {
    // Add the Datadog SDK Android Gradle Plugin dependency here
    id("com.datadoghq.dd-sdk-android-gradle-plugin") version "1.20.0"
}

// In app/build.gradle.kts
dependencies {
    // Add the Datadog SDK Android RUM dependency here
    implementation("com.datadoghq:dd-sdk-android-rum:3.0.0") // Check for the latest version
}
```

Approach 2: Add the following line to my app/build.gradle.kts file and also use lib version
```json
// In build.gradle.kts
plugins {
    // Add the Datadog SDK Android Gradle Plugin dependency here
    id("com.datadoghq.dd-sdk-android-gradle-plugin") version "1.20.0"
}

// In app/build.gradle.kts
dependencies {
    // Add the Datadog SDK Android RUM dependency here via libs.versions.toml
    implementation(libs.dd.sdk.android.rum)
}
```

```java
// In gradle/libs.versions.toml

[versions]
ddSdkAndroidRum = "3.0.0"

[libraries]
dd-sdk-android-rum = { module = "com.datadoghq:dd-sdk-android-rum", version.ref = "ddSdkAndroidRum" }
```

The key difference is scope: the root build.gradle.kts configures settings for the entire project, while the app module's app/build.gradle.kts configures settings only for that specific app module.

You almost always add dependencies to the app module's app/build.gradle.kts. The root file is for project-wide configurations that affect all modules. The Datadog plugin’s job is to upload your ProGuard/R8 mapping files so crashes are deobfuscated; it needs access to the module’s Android variants to do that.

https://github.com/DataDog/dd-sdk-android-gradle-plugin is used to upload your Proguard/Dexguard/R8 mapping files and NDK symbol files to Datadog to get a complete RUM Error Tracking experience.

After adding the code, IntelliJ or Android Studio will prompt you to sync your project. Click Sync Now. This action downloads the library and integrates it into your app.

If the prompt doesn't appear, you can manually sync by going to View > Tool Windows > Gradle and clicking the refresh icon 🔄.

Create an Application Class if it doesn't exist.
**Objective**: Create a custom Application class for Datadog initialization if it doesn't exist because this will initialise Datadog SDK Android earlier than just putting it in MainActivity.kt

**Actions**:
1. Navigate to `android7__api24__helloworld/app/src/main/java/com/example/helloworld/`
2. Create new file: `MyApplication.kt`
3. Add the following code:

```kotlin
package com.example.helloworld

import android.app.Application
import com.datadog.android.Datadog
import com.datadog.android.DatadogSite
import com.datadog.android.core.configuration.Configuration
import com.datadog.android.privacy.TrackingConsent
import com.datadog.android.rum.Rum
import com.datadog.android.rum.RumConfiguration
import com.datadog.android.rum.tracking.ActivityViewTrackingStrategy

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // Hard-coding for initial setup - will move to BuildConfig later
        val clientToken = "YOUR_CLIENT_TOKEN_HERE"
        val applicationId = "YOUR_APPLICATION_ID_HERE"
        val environmentName = "test"
        val appVariantName = "jek-android7-api24-helloworld"

        // Initialize Datadog Core SDK
        val configuration = Configuration.Builder(
            clientToken = clientToken,
            env = environmentName,
            variant = appVariantName
        )
            .useSite(DatadogSite.US1)
            .setUseDeveloperModeWhenDebuggable(true)
            .build()

        Datadog.initialize(this, configuration, TrackingConsent.GRANTED)

        // Configure RUM
        val rumConfiguration = RumConfiguration.Builder(applicationId)
            .trackUserInteractions()
            .trackLongTasks()
            .useViewTrackingStrategy(ActivityViewTrackingStrategy(true))
            .setSessionSampleRate(100.0f)
            .trackBackgroundEvents(true)
            .build()

        Rum.enable(rumConfiguration)
    }
}
```

**Verification**:
- File `MyApplication.kt` created successfully
- No compilation errors in Android Studio
- Code follows Kotlin conventions

### Step 1.2: Update AndroidManifest.xml
**Objective**: Configure the custom Application class in the manifest

**Actions**:
1. Open `android7__api24__helloworld/app/src/main/AndroidManifest.xml`
2. Add `android:name=".MyApplication"` to the `<application>` tag
3. Updated manifest should look like:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
            android:name=".MyApplication"
            android:allowBackup="true"
            android:dataExtractionRules="@xml/data_extraction_rules"
            android:fullBackupContent="@xml/backup_rules"
            android:icon="@mipmap/ic_launcher"
            android:label="@string/app_name"
            android:roundIcon="@mipmap/ic_launcher_round"
            android:supportsRtl="true"
            android:theme="@style/Theme.Android7__api24__helloworld">
        <activity
                android:name=".MainActivity"
                android:exported="true"
                android:label="@string/app_name"
                android:theme="@style/Theme.Android7__api24__helloworld">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>

                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
    </application>

</manifest>
```

**Verification**:
- Manifest updated successfully
- No manifest merge errors
- Application class reference is correct

### Step 1.3: Add Internet Permission
**Objective**: Ensure the app can send data to Datadog servers

**Actions**:
1. In the same `AndroidManifest.xml` file
2. Add internet permission before the `<application>` tag:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

**Verification**:
- Internet permission added
- Manifest validates without errors

### Step 1.4: Initial Build Test
**Objective**: Verify the app builds successfully with basic Datadog integration

**Actions**:
1. Use IntelliJ IDEA CE

**Expected Result**: Build succeeds
**Verification**:
- Build completes successfully
- No compilation errors


Add Custom RUM Actions
**Objective**: Implement custom tracking for user interactions

**Actions**:
1. Open `MainActivity.kt`
2. Add imports at top:

```kotlin
package com.example.helloworld

import android.app.Application
import com.datadog.android.Datadog
import com.datadog.android.DatadogSite
import com.datadog.android.core.configuration.Configuration
import com.datadog.android.privacy.TrackingConsent
import com.datadog.android.rum.Rum
import com.datadog.android.rum.RumConfiguration
import com.datadog.android.rum.tracking.ActivityViewTrackingStrategy

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // Hard-coding for initial setup - will move to BuildConfig later
        val clientToken = "pubd47aaf2e7d73372a4151770349a33889"
        val applicationId = "c31dcf2f-7f03-4da2-bea1-1b3d94d9d43f"
        val environmentName = "test"
        val appVariantName = "jek-android7-api24-helloworld"

        // Initialize Datadog Core SDK
        val configuration = Configuration.Builder(
            clientToken = clientToken,
            env = environmentName,
            variant = appVariantName
        )
            .useSite(DatadogSite.US1)
            .setUseDeveloperModeWhenDebuggable(true)
            .build()

        Datadog.initialize(this, configuration, TrackingConsent.GRANTED)

        // Configure RUM
        val rumConfiguration = RumConfiguration.Builder(applicationId)
            .trackUserInteractions()
            .trackLongTasks()
            .useViewTrackingStrategy(ActivityViewTrackingStrategy(true))
            .setSessionSampleRate(100.0f)
            .trackBackgroundEvents(true)
            .build()

        Rum.enable(rumConfiguration)
    }
}
```

**Verification**:
- Custom RUM actions added
- Click tracking implemented
- No compilation errors


GRADLE PLUGIN CONFIGURATION

### Step 4.1: Configure Datadog Gradle Plugin
**Objective**: Set up the Gradle plugin for mapping file uploads

**Actions**:
1. Open `android7__api24__helloworld/app/build.gradle.kts`
2. Add after the dependencies block:

```kotlin
datadog {
    site = "US1"
    serviceName = "android-helloworld"
    versionName = "1.0"
    mappingFilePath = "build/outputs/mapping/release/mapping.txt"
}
```

**Verification**:
- Datadog block added correctly
- Configuration matches project settings
- No syntax errors

### Step 4.2: Configure Mapping File Upload
**Objective**: Enable ProGuard/R8 mapping file uploads for crash deobfuscation

**Actions**:
1. In the same `build.gradle.kts`, update the `release` build type:

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true  // Changed from false
        isShrinkResources = true  // Add this
        proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
    }
}
```

2. Create/update `app/proguard-rules.pro`:

```proguard
# Datadog SDK rules
-keep class com.datadog.** { *; }
-keep class datadog.** { *; }

# Keep application class
-keep class com.example.helloworld.MyApplication { *; }

# Standard Android rules
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes LineNumberTable,SourceFile
```

**Verification**:
- Release build type configured for obfuscation
- ProGuard rules include Datadog exceptions
- Build configuration updated

### Step 4.3: Test Release Build and Upload
**Objective**: Build release APK and test mapping file generation

**Actions**:
1. Build release APK:

```bash
./gradlew assembleRelease
```

2. Check for mapping file:

```bash
ls -la app/build/outputs/mapping/release/
```

3. Test upload task (will fail without upload token, which is expected):

```bash
DATADOG_API_KEY=<REDACTED> ./gradlew uploadMappingRelease --dry-run
```

**Expected Results**:
- Release APK built successfully
- Mapping file generated
- Upload task recognizes configuration

**Verification**:
- Release build completes
- mapping.txt file exists
- No build configuration errors

### Step 4.3: Monitor WebView
Here is about the Datadog SDK Android Webview https://github.com/DataDog/dd-sdk-android/tree/develop/features/dd-sdk-android-webview and here is the doc


Add the following to android8__api26__webview__springboot/app/build.gradle.kts
```
dependencies {
    implementation(libs.dd.sdk.android.webview)
}
```

Add the following to android8__api26__webview__springboot/gradle/libs.versions.toml
```
[libraries]
dd-sdk-android-webview = { module = "com.datadoghq:dd-sdk-android-webview", version.ref = "ddSdkAndroidRum" }
```

Add to the WebView code like e.g. SendMoneyFragment.kt or BookCarFragment.kt 
```java
// Datadog WebView tracking
import com.datadog.android.webview.WebViewTracking

        // By default, JavaScript is disabled for security - we enable it here
        // In order for instrumentation to work on the WebView component, it is very important that the JavaScript is enabled on the WebView. To enable it, you can use the following code snippet:
        webView.settings.javaScriptEnabled = true

        // Step 3.5: Enable Datadog WebView tracking
        // This allows Datadog to track user interactions within the WebView
        // For local HTML files, we allow all hosts (empty list)
        val allowedHosts = listOf<String>() // Empty list allows all hosts for local content
        WebViewTracking.enable(webView, allowedHosts)

```

