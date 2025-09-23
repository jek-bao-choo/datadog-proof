package com.example.jek20250918.ui.sendmoney

// Import statements - bringing in necessary Android classes
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView  // WebView class for displaying web content
import androidx.fragment.app.Fragment
// ViewBinding magic happens here - let me explain this generated class:
import com.example.jek20250918.databinding.FragmentSendmoneyBinding
/*
 * FragmentSendmoneyBinding Deep Dive:
 *
 * ORIGIN STORY:
 * - This class is auto-generated from: app/src/main/res/layout/fragment_sendmoney.xml
 * - Android scans your XML layout and creates this Kotlin class automatically
 * - You never see the actual .kt file - it's generated during build time
 * - Generated classes are stored in build/generated/ folder (usually hidden)
 *
 * WHAT'S IN YOUR fragment_sendmoney.xml?
 * Your XML file contains:
 * <androidx.constraintlayout.widget.ConstraintLayout ...>
 *     <WebView
 *         android:id="@+id/webView"  ← This becomes binding.webView
 *         ... />
 * </androidx.constraintlayout.widget.ConstraintLayout>
 *
 * WHAT ANDROID GENERATES FOR YOU:
 * The FragmentSendmoneyBinding class roughly looks like this (simplified):
 *
 * class FragmentSendmoneyBinding {
 *     val root: ConstraintLayout        // The root container
 *     val webView: WebView              // Your WebView with ID "webView"
 *
 *     companion object {
 *         fun inflate(inflater: LayoutInflater, ...): FragmentSendmoneyBinding {
 *             // Code to create views from XML and return binding object
 *         }
 *     }
 * }
 *
 * WHY "FragmentSendmoneyBinding" SPECIFICALLY?
 * Naming pattern: [XmlFileName]Binding
 * - fragment_sendmoney.xml → FragmentSendmoneyBinding
 * - Note: underscores become camelCase, "sendmoney" stays as one word
 *
 * THE MAGIC CONNECTION:
 * When you call: FragmentSendmoneyBinding.inflate(...)
 * Android:
 * 1. Reads your fragment_sendmoney.xml file
 * 2. Creates all the View objects (WebView, ConstraintLayout, etc.)
 * 3. Assigns the correct IDs and properties
 * 4. Returns a binding object with direct references to all your views
 *
 * COMPARE TO OLD findViewById METHOD:
 * Old way:
 *   val webView = findViewById<WebView>(R.id.webView)  // Runtime lookup, can crash
 *
 * ViewBinding way:
 *   binding.webView  // Direct reference, compile-time safe!
 */

/**
 * SendMoneyFragment - Displays the Send Money form in a WebView
 *
 * This fragment shows a web-based form where users can:
 * - Enter a phone number
 * - Enter an amount to send
 * - Click "Send Money" button (shows alert for now)
 *
 * Key Android Concepts Used:
 * - WebView: A component that can display web pages and HTML content
 * - Assets folder: Where we store HTML files that are bundled with the app
 * - JavaScript: Enabled to make the HTML form interactive
 * - Local file loading: Loading HTML from app's internal storage, not internet
 */
class SendMoneyFragment : Fragment() {

    // ViewBinding setup - same pattern as HomeFragment
    private var _binding: FragmentSendmoneyBinding? = null

    // Safe accessor for binding - only use between onCreateView and onDestroyView
    private val binding get() = _binding!!

    /**
     * onCreateView - Creates and configures the WebView to display our HTML form
     *
     * What happens here:
     * 1. Create the layout from XML
     * 2. Get reference to the WebView component
     * 3. Configure WebView settings (enable JavaScript)
     * 4. Load the HTML file from assets folder
     *
     * @param inflater: Converts XML layout to View objects
     * @param container: Parent view that will contain this fragment
     * @param savedInstanceState: Previous state data (usually null)
     * @return View: The configured view ready to display
     */
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Step 1: Create binding from the XML layout file (fragment_sendmoney.xml)
        _binding = FragmentSendmoneyBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Step 2: Get reference to the WebView component from our layout
        // WebView is like a mini web browser inside our app
        val webView: WebView = binding.webView

        // Step 3: Configure WebView settings
        // Enable JavaScript so our HTML form buttons and validation work
        // By default, JavaScript is disabled for security - we enable it here
        webView.settings.javaScriptEnabled = true

        // Step 4: Load our HTML file from the assets folder
        // Let me explain this special URL in detail:
        webView.loadUrl("file:///android_asset/send_money.html")

        /*
         * UNDERSTANDING "file:///android_asset/" URL SCHEME:
         *
         * WHAT IS THIS URL?
         * - "file:///android_asset/" is Android's special URL scheme
         * - It's NOT a real file system path on your computer
         * - It's a virtual path that WebView understands
         * - Only works inside Android apps, not in regular web browsers
         *
         * BREAKING DOWN THE URL:
         * file:///android_asset/send_money.html
         * │    │  │             │
         * │    │  │             └── Your HTML file name
         * │    │  └── Android's special assets virtual directory
         * │    └── Three slashes (file protocol + empty host)
         * └── Protocol: tells WebView this is a local file
         *
         * WHERE DOES IT POINT IN YOUR PROJECT?
         * Virtual Path:     file:///android_asset/send_money.html
         * Real Project Path: app/src/main/assets/send_money.html
         *                    ↑
         *                    This is the actual folder in your Android Studio project
         *
         * FULL PROJECT PATH MAPPING:
         * Your project structure:
         * android8__api26__webview__springboot/
         * └── app/
         *     └── src/
         *         └── main/
         *             ├── assets/                    ← This is the key folder!
         *             │   ├── send_money.html       ← Referenced as: file:///android_asset/send_money.html
         *             │   └── book_car.html         ← Referenced as: file:///android_asset/book_car.html
         *             ├── java/
         *             └── res/
         *
         * WHY "android_asset" AND NOT "assets"?
         * - Android uses this special name internally
         * - It's Android's convention, not your folder name
         * - The actual folder is called "assets" but the URL uses "android_asset"
         * - Think of it as Android's internal alias for the assets folder
         *
         * WHEN IS THIS PATH CREATED?
         * - During app build process (when you run ./gradlew build)
         * - Android packages all files from app/src/main/assets/ into the APK
         * - These files become accessible via the android_asset:// URL scheme
         * - Files are embedded in the APK, no internet connection needed
         *
         * ALTERNATIVE WAYS TO REFERENCE THE SAME FILE:
         * 1. file:///android_asset/send_money.html        ← What we use
         * 2. file://android_asset/send_money.html         ← Also works (2 slashes)
         *
         * WHAT HAPPENS BEHIND THE SCENES:
         * 1. WebView sees "file:///android_asset/"
         * 2. Knows to look inside the app's packaged assets
         * 3. Finds send_money.html from your assets folder
         * 4. Loads and displays the HTML content
         * 5. Executes any JavaScript in the HTML file
         *
         * IMPORTANT NOTES:
         * - This only works for files in the assets folder
         * - Files in res/ folder use different URL schemes
         * - No folders allowed - all files must be directly in assets/
         * - Case sensitive: "Send_Money.html" ≠ "send_money.html"
         */

        // Step 5: Return the view so Android can display it
        return root
    }

    /**
     * onDestroyView - Cleanup when the fragment is destroyed
     *
     * Why this is important:
     * - WebViews can use significant memory
     * - Clearing binding prevents memory leaks
     * - Good practice for all fragments
     */
    override fun onDestroyView() {
        super.onDestroyView()
        // Clear binding to free up memory - very important for WebViews!
        _binding = null
    }
}