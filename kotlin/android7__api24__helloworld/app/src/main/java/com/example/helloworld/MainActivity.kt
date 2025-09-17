package com.example.helloworld

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.helloworld.ui.theme.Android7__api24__helloworldTheme

// Add for mocking my code
import androidx.compose.foundation.clickable

// Add Datadog lib
import com.datadog.android.rum.GlobalRumMonitor
import com.datadog.android.rum.RumActionType



class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Android7__api24__helloworldTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Greeting(
                        name = "YYYAndroidJek",
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {

    Text(
        text = "Hello $name! This is Jek",
        //    add for Datadog custom event
        modifier = modifier.clickable {
            // Track custom RUM action
            GlobalRumMonitor.get().addAction(
                type = RumActionType.TAP,
                name = "greeting_tapped_by_Jek",
                attributes = mapOf(
                    "greeting_name" to name,
                    "timestamp" to System.currentTimeMillis()
                )
            )
        }
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    Android7__api24__helloworldTheme {
        Greeting("XAndroid created by Jek")
    }
}