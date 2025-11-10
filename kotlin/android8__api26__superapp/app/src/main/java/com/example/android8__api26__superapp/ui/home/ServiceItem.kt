package com.example.android8__api26__superapp.ui.home

/**
 * Data class representing a service item in the Super App.
 *
 * @property id Unique identifier for the service
 * @property title Display name of the service
 * @property iconResId Resource ID for the service icon
 * @property url URL to open in WebView when service is clicked
 * @property category Category the service belongs to (Finance, Telco, Utility, Travel)
 */
data class ServiceItem(
    val id: String,
    val title: String,
    val iconResId: Int,
    val url: String,
    val category: String
)
