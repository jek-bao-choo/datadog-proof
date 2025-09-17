## TASK:
* Instrument an Android writtin in Kotlin application called android__api24__helloworld with datadog-sdk-android and datadog-sdk-android-gradle-plugin
* Datadog provided a sample Java code and instruct that I initialize the library in my application context as early as possible. Here is the Java code snippet provided by Datadog:
```java
class SampleApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // Hard-coding credentials is not recommended and present security risks. We recommend that you secure your credentials via the step above.
        val applicationId = "<REDACTED_APPLICATION_ID>"
        val clientToken = "<REDACTED_CLIENT_TOKEN>"

        val environmentName = "test"
        val appVariantName = "jek-android7-api24-helloworld"

        val configuration = Configuration.Builder(
            clientToken = clientToken,
            env = environmentName,
            variant = appVariantName
        )
            .useSite(DatadogSite.US1)
            .build()
        Datadog.initialize(this, configuration, trackingConsent)

        
        val rumConfiguration = RumConfiguration.Builder(applicationId)
            .trackUserInteractions()
            .trackLongTasks(durationThreshold)
            .useViewTrackingStrategy(strategy)
            .setSessionSampleRate(100.0f)
            .build()
        Rum.enable(rumConfiguration)
    }
}
```
* Please take note that my application code is written in Kotlin, not Java. 
* Additionally, set the 
* Please research and write down a research plan on how to go about instrumenting and initiating my Android application written in Kotlin with Datadog SDK Android.

## USE CONTEXT7
* use library id /datadog/dd-sdk-android
* use library id /datadog/dd-sdk-android-gradle-plugin

## OTHER CONSIDERATIONS:
* Run the project on MacOS bash terminal
* Append setup, deployment, verification, and cleanup steps in README.md
* Explain the steps you would take in clear, beginner-friendly language
* Write the research on performing the task
* Save the research to `2-RESEARCH.md`