package com.example.jek20250918.ui.bookcar

// Import statements - these bring in Android classes we need
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView  // For displaying web content in our app
import androidx.fragment.app.Fragment
// The ViewBinding system creates this class from your XML - here's the full story:
import com.example.jek20250918.databinding.FragmentBookcarBinding
// Datadog WebView tracking
import com.datadog.android.webview.WebViewTracking
/*
 * FragmentBookcarBinding - The Auto-Generated Connection to Your UI
 *
 * WHERE THIS CLASS COMES FROM:
 * Source File: app/src/main/res/layout/fragment_bookcar.xml
 * Generated Class: com.example.jek20250918.databinding.FragmentBookcarBinding
 *
 * THE TRANSFORMATION PROCESS:
 * Your XML layout file (fragment_bookcar.xml) contains:
 *
 * <?xml version="1.0" encoding="utf-8"?>
 * <androidx.constraintlayout.widget.ConstraintLayout ...>
 *     <WebView
 *         android:id="@+id/webView"     ← KEY: This ID becomes a property!
 *         android:layout_width="match_parent"
 *         android:layout_height="match_parent" />
 * </androidx.constraintlayout.widget.ConstraintLayout>
 *
 * ANDROID'S CODE GENERATION:
 * The build system sees your XML and generates this Kotlin class (conceptually):
 *
 * package com.example.jek20250918.databinding
 *
 * class FragmentBookcarBinding private constructor(
 *     private val rootView: ConstraintLayout
 * ) {
 *     val root: ConstraintLayout = rootView
 *     val webView: WebView = rootView.findViewById(R.id.webView)
 *
 *     companion object {
 *         fun inflate(
 *             inflater: LayoutInflater,
 *             parent: ViewGroup?,
 *             attachToParent: Boolean
 *         ): FragmentBookcarBinding {
 *             val view = inflater.inflate(R.layout.fragment_bookcar, parent, attachToParent)
 *             return bind(view)
 *         }
 *
 *         fun bind(rootView: View): FragmentBookcarBinding {
 *             val webView = rootView.findViewById<WebView>(R.id.webView)
 *             return FragmentBookcarBinding(rootView as ConstraintLayout)
 *         }
 *     }
 * }
 *
 * NAMING RULES FOR GENERATED CLASSES:
 * - File: fragment_bookcar.xml → Class: FragmentBookcarBinding
 * - Pattern: CamelCase + "Binding" suffix
 * - Underscores removed: fragment_book_car.xml would become FragmentBookCarBinding
 *
 * INSIDE THE GENERATED CLASS:
 * For every view with an android:id in your XML:
 * - android:id="@+id/webView" → binding.webView property
 * - android:id="@+id/my_button" → binding.myButton property (camelCase conversion)
 * - The root element becomes → binding.root
 *
 * BENEFITS OVER findViewById():
 * 1. Compile-time safety: binding.webView can never be wrong ID
 * 2. Null safety: Views are guaranteed to exist
 * 3. Performance: No runtime ID lookups needed
 * 4. Type safety: webView is already typed as WebView, no casting needed
 *
 * HOW ANDROID KNOWS TO GENERATE THIS:
 * Your app/build.gradle.kts has:
 * android {
 *     buildFeatures {
 *         viewBinding = true  ← This enables the magic!
 *     }
 * }
 */

/**
 * BookCarFragment - Displays the Book Car form in a WebView
 *
 * This fragment shows a web-based booking form where users can:
 * - Enter their current location
 * - Enter their destination
 * - Click "Book Car" button (shows alert with booking details)
 *
 * Key Learning Points for Beginners:
 * - This fragment is very similar to SendMoneyFragment (same pattern!)
 * - WebView acts like a mini browser inside your Android app
 * - HTML files in assets/ folder are packaged with your app
 * - No internet connection needed - files are stored locally
 * - JavaScript must be enabled for interactive forms
 *
 * Design Pattern: This follows the same structure as other fragments
 * 1. ViewBinding for safe view access
 * 2. onCreateView for setup
 * 3. onDestroyView for cleanup
 */
class BookCarFragment : Fragment() {

    // ViewBinding pattern - modern Android way to access views safely
    // The ? means this can be null (nullable type in Kotlin)
    private var _binding: FragmentBookcarBinding? = null

    // Property that provides safe access to binding
    // The !! means "I guarantee this is not null" - use carefully!
    // This property is only valid between onCreateView and onDestroyView.
    private val binding get() = _binding!!

    /**
     * onCreateView - The heart of the fragment where we set up our WebView
     *
     * Step-by-step process:
     * 1. Create the layout from XML file
     * 2. Find the WebView component in that layout
     * 3. Configure WebView to allow JavaScript (needed for form interactions)
     * 4. Load the HTML file that contains our booking form
     * 5. Return the complete view to Android
     *
     * @param inflater: Android tool that turns XML layouts into View objects
     * @param container: The parent view that will hold this fragment
     * @param savedInstanceState: Saved data from previous sessions (can be null)
     * @return View: The complete user interface ready to display
     */
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Step 1: Inflate (create) our layout from the XML file
        // This connects fragment_bookcar.xml to our Kotlin code
        _binding = FragmentBookcarBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Step 2: Get the WebView from our layout
        // WebView is like having Chrome or Safari embedded in your app
        val webView: WebView = binding.webView

        // Step 3: Enable JavaScript in the WebView
        // JavaScript is disabled by default for security reasons
        // Our HTML form needs it for the "Book Car" button to work
        webView.settings.javaScriptEnabled = true

        // Step 3.5: Enable Datadog WebView tracking
        // This allows Datadog to track user interactions within the WebView
        // For local HTML files, we allow all hosts (empty list)
        val allowedHosts = listOf<String>() // Empty list allows all hosts for local content
        WebViewTracking.enable(webView, allowedHosts)

        // Step 4: Load our HTML file from the assets folder
        // Let me break down this mysterious URL for you:
        webView.loadUrl("file:///android_asset/book_car.html")

        /*
         * DEMYSTIFYING THE "file:///android_asset/" URL:
         *
         * THE COMPLETE URL BREAKDOWN:
         * file:///android_asset/book_car.html
         * ├─ file://               ← URL scheme (protocol)
         * ├─ /                     ← Root directory indicator
         * ├─ android_asset         ← Android's virtual directory name
         * ├─ /                     ← Path separator
         * └─ book_car.html         ← Your actual HTML file
         *
         * REAL vs VIRTUAL PATH MAPPING:
         * Virtual (what WebView sees):    file:///android_asset/book_car.html
         * Real (in your project):         app/src/main/assets/book_car.html
         *                                 ↑
         * Physical location on your computer:
         * ~/Downloads/Github/datadog-proof/kotlin/android8__api26__webview__springboot/app/src/main/assets/book_car.html
         *
         * ANDROID'S ASSETS FOLDER SYSTEM:
         * Your Project Directory Tree:
         * android8__api26__webview__springboot/
         * └── app/
         *     ├── build.gradle.kts
         *     └── src/
         *         └── main/
         *             ├── AndroidManifest.xml
         *             ├── assets/                           ← THE MAGIC FOLDER
         *             │   ├── book_car.html                ← This file!
         *             │   └── send_money.html              ← Sister file
         *             ├── java/com/example/...
         *             └── res/
         *                 ├── layout/
         *                 ├── values/
         *                 └── ...
         *
         * WHY DOES ANDROID USE "android_asset" INSTEAD OF "assets"?
         * - Historical reasons: Android's internal naming convention
         * - Avoids conflicts with potential "assets" files in your project
         * - Clearly identifies this as Android's special virtual filesystem
         * - Similar to how "file://" is different from actual file paths
         *
         * THE BUILD PROCESS TRANSFORMATION:
         * Development (your computer):
         * app/src/main/assets/book_car.html
         *          ↓ (Android Build System)
         * APK Package:
         * assets/book_car.html (embedded in the .apk file)
         *          ↓ (WebView Runtime)
         * Virtual URL:
         * file:///android_asset/book_car.html
         *
         * WHAT HAPPENS WHEN webView.loadUrl() IS CALLED:
         * 1. WebView receives: "file:///android_asset/book_car.html"
         * 2. Recognizes "android_asset" as special virtual directory
         * 3. Looks inside the APK's embedded assets
         * 4. Extracts book_car.html content from APK
         * 5. Parses HTML, CSS, and executes JavaScript
         * 6. Renders the form in the WebView
         *
         * ALTERNATIVE VALID FORMATS (all work the same):
         * - file:///android_asset/book_car.html     ← Our choice (3 slashes)
         * - file://android_asset/book_car.html      ← Also valid (2 slashes)
         *
         * IMPORTANT CONSTRAINTS:
         * 1. Files must be directly in assets/ folder (no subdirectories)
         * 2. File names are case-sensitive
         * 3. Only works within Android WebView (not regular browsers)
         * 4. Files are read-only (bundled into APK at build time)
         * 5. No dynamic file creation - files must exist at build time
         *
         * COMPARISON WITH OTHER ANDROID URL SCHEMES:
         * - android_asset://         ← Assets folder (our case)
         * - android_res://           ← Resources folder (res/)
         * - content://               ← Content providers
         * - file:///storage/         ← External storage
         */

        // Step 5: Return the root view so Android can show it on screen
        return root
    }

    /**
     * onDestroyView - Important cleanup method
     *
     * Called when Android needs to remove this fragment from memory.
     *
     * Why cleanup matters:
     * - WebViews use lots of memory (they're basically mini browsers)
     * - Not cleaning up can cause memory leaks
     * - Memory leaks make your app slow and can crash it
     * - Always clean up in fragments - it's a best practice!
     */
    override fun onDestroyView() {
        super.onDestroyView()
        // Set binding to null to free up memory
        // This tells Android it's safe to garbage collect the WebView and layout
        _binding = null
    }
}