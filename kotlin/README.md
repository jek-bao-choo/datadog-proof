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
WIP
