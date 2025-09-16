# Native iOS Development in Xcode Guide

This guide covers the standard workflow for creating and running a native iOS application using Xcode.

-----

### Step 1: Create or Open Your Xcode Project

First, ensure you have the project ready. If you haven't created it yet, follow these steps.

1.  Open **Xcode**.
2.  Select **Create a new Xcode project**.
3.  From the **iOS** tab, choose the **App** template and click **Next**.
4.  Enter the project details:
      * **Product Name**: `swift6dot2__xcode26__helloworld`
      * **Interface**: `SwiftUI`
      * **Language**: `Swift`
5.  Click **Next**, choose a location to save your project, and click **Create**.

If you've already created the project, simply find the `swift6dot2__xcode26__helloworld.xcodeproj` file on your computer and double-click it to open it in Xcode.

-----

### Step 2: Edit Your Code

Xcode provides a powerful editor with deep integration for Swift and SwiftUI.

1.  **Find Your File**: In the **Project Navigator** on the left-hand sidebar, find and click on the `ContentView.swift` file.

2.  **Write Your Code**: The file's content will appear in the central editor pane. Modify the `Text` element inside the `body` property.

    ```swift
    import SwiftUI

    struct ContentView: View {
        var body: some View {
            VStack {
                Image(systemName: "globe")
                    .imageScale(.large)
                    .foregroundStyle(.tint)

                Text("Hello, Xcode!") // Edit this line
                    .font(.title)
                    .padding()
            }
            .padding()
        }
    }
    ```

-----

### Step 3: Use the Live Preview (Canvas)

One of Xcode's best features for SwiftUI is the live preview, called the Canvas. It lets you see your UI changes instantly without building the app.

1.  If the preview pane isn't visible on the right, click the **Adjust Editor Options** icon in the top-right corner and select **Canvas**.
2.  The preview of your `ContentView` will appear. If it's paused, click the **Resume** button at the top of the canvas.
3.  As you make changes to your code in the editor, you will see them reflected in the Canvas in real-time.

[Image showing the Xcode interface with the editor and the live preview Canvas]

-----

### Step 4: Build and Run the App on a Simulator

To run your app in a fully interactive environment, you'll use the iOS Simulator.

1.  **Select a Simulator**: At the top of the Xcode window, look for the dropdown menu next to your project name. Click it and choose a simulator, such as **iPhone 17 Pro** (or any other available model).
2.  **Run the App**: Click the **Run** button (it looks like a play icon ▶) in the top-left corner of the Xcode toolbar, or press the shortcut `Cmd + R`.
3.  **Launch**: Xcode will now build your project and launch the selected simulator. After a few moments, your `swift6dot2__xcode26__helloworld` app will open automatically, displaying your "Hello, Xcode\!" message.