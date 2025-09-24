package com.example.jek20250918

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
        val clientToken = "REDACTED"
        val applicationId = "REDACTED"
        val environmentName = "test"
        val appVariantName = "android8-api26-webview-springboot"

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
            .trackNonFatalAnrs(true) // Enable non-fatal ANR reporting
            .useViewTrackingStrategy(ActivityViewTrackingStrategy(true))
            .setSessionSampleRate(100.0f)
            .trackBackgroundEvents(true)
            .build()

        Rum.enable(rumConfiguration)
    }
}