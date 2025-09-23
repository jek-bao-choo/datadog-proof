package com.example.jek20250918.ui.home

// Import statements - these bring in the classes we need from Android libraries
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
// This is a VERY IMPORTANT import - let me explain ViewBinding in detail:
import com.example.jek20250918.databinding.FragmentHomeBinding
/*
 * ViewBinding Explanation for Beginners:
 *
 * WHAT IS FragmentHomeBinding?
 * - It's a class that Android automatically generates for you
 * - It's created from your XML layout file: app/src/main/res/layout/fragment_home.xml
 * - The name follows a pattern: [XmlFileName] + "Binding"
 * - fragment_home.xml → FragmentHomeBinding
 *
 * WHERE DOES IT COME FROM?
 * - Android's build system scans your layout XML files
 * - For each XML file, it generates a corresponding Binding class
 * - These generated classes live in the "databinding" package
 * - You never write these classes manually - Android creates them!
 *
 * WHAT'S INSIDE FragmentHomeBinding?
 * Looking at your fragment_home.xml file:
 * - <Button android:id="@+id/btn_send_money" ... /> becomes binding.btnSendMoney
 * - <Button android:id="@+id/btn_book_car" ... /> becomes binding.btnBookCar
 * - The root ConstraintLayout becomes binding.root
 *
 * HOW DOES THE NAMING WORK?
 * - XML IDs with underscores become camelCase properties
 * - btn_send_money → btnSendMoney
 * - btn_book_car → btnBookCar
 *
 * WHY USE VIEWBINDING INSTEAD OF findViewById()?
 * Old way (findViewById - error-prone):
 *   val button = findViewById<Button>(R.id.btn_send_money)  // Can crash if ID wrong!
 *
 * New way (ViewBinding - safe):
 *   binding.btnSendMoney  // Compile-time safe, can't crash from wrong ID!
 *
 * HOW TO ENABLE VIEWBINDING:
 * It's already enabled in your app's build.gradle.kts file with:
 * android {
 *     buildFeatures {
 *         viewBinding = true
 *     }
 * }
 */

/**
 * HomeFragment - The main screen of our app
 *
 * This fragment displays the home screen with two buttons:
 * - "Send Money" button that navigates to the Send Money WebView
 * - "Book Car" button that navigates to the Book Car WebView
 *
 * Key Android Concepts:
 * - Fragment: A piece of UI that can be reused across activities
 * - ViewBinding: A way to safely access views without findViewById()
 * - Navigation: Android's way of moving between screens
 */
class HomeFragment : Fragment() {

    // ViewBinding variables - this is the modern Android way to access views
    // The underscore prefix (_binding) indicates this is a private nullable variable
    private var _binding: FragmentHomeBinding? = null

    // This property creates a safe way to access binding
    // The !! operator says "I'm sure this is not null" - only use when certain!
    // This property is only valid between onCreateView and onDestroyView.
    private val binding get() = _binding!!

    /**
     * onCreateView - This method is called when Android needs to create the view
     * Think of this as "building" the screen layout and setting up button clicks
     *
     * @param inflater: Tool that converts XML layout files into View objects
     * @param container: The parent view that will hold this fragment
     * @param savedInstanceState: Data saved from previous app sessions (can be null)
     * @return View: The complete view that will be shown on screen
     */
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Step 1: Create the binding object from our XML layout file
        // This connects our Kotlin code to the XML layout (fragment_home.xml)
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        val root: View = binding.root

        // Step 2: Set up click listeners for our buttons
        // When user taps "Send Money" button, navigate to SendMoney screen
        binding.btnSendMoney.setOnClickListener {
            // findNavController() gets the navigation controller for this fragment
            // navigate() tells Android to move to a different screen
            findNavController().navigate(com.example.jek20250918.R.id.action_navigation_home_to_sendMoneyFragment)
        }

        // When user taps "Book Car" button, navigate to BookCar screen
        binding.btnBookCar.setOnClickListener {
            findNavController().navigate(com.example.jek20250918.R.id.action_navigation_home_to_bookCarFragment)
        }

        // Step 3: Return the root view so Android can display it
        return root
    }

    /**
     * onDestroyView - Cleanup method called when the view is destroyed
     * This prevents memory leaks by clearing the binding reference
     *
     * Memory Management: Always set binding to null when done to free memory
     */
    override fun onDestroyView() {
        super.onDestroyView()
        // Clear the binding reference to prevent memory leaks
        // This is important - forgetting this can cause your app to use too much memory!
        _binding = null
    }
}