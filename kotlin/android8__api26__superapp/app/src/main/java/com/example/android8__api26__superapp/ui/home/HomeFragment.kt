package com.example.android8__api26__superapp.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.android8__api26__superapp.R
import com.example.android8__api26__superapp.databinding.FragmentHomeBinding
import com.datadog.android.okhttp.DatadogInterceptor
import com.datadog.android.okhttp.trace.TracingInterceptor
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

/**
 * Home fragment displaying all available services organized by category.
 * Each service button navigates to a WebView to display the service URL.
 */
class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    private val BASE_URL = "https://34.8.246.70.nip.io"
    private val LOCAL_BASE_URL = "http://10.0.2.2:8080"

    private val localClient: OkHttpClient by lazy {
        OkHttpClient.Builder()
            .addInterceptor(DatadogInterceptor.Builder(listOf("10.0.2.2")).build())
            .addNetworkInterceptor(TracingInterceptor.Builder(listOf("10.0.2.2")).build())
            .build()
    }

    private val unsafeClient: OkHttpClient by lazy {
        val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) {}
            override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) {}
            override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
        })
        val sslContext = SSLContext.getInstance("TLS")
        sslContext.init(null, trustAllCerts, SecureRandom())
        OkHttpClient.Builder()
            .addInterceptor(DatadogInterceptor.Builder(listOf("34.8.246.70.nip.io")).build())
            .addNetworkInterceptor(TracingInterceptor.Builder(listOf("34.8.246.70.nip.io")).build())
            .sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
            .hostnameVerifier { _, _ -> true }
            .build()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Setup click listeners for all service buttons
        setupServiceButtons()
    }

    /**
     * Setup click listeners for all service buttons
     */
    private fun setupServiceButtons() {
        // Finance services
        binding.btnSendMoney.setOnClickListener {
            navigateToWebView(Services.SEND_MONEY.title, Services.SEND_MONEY.url)
        }

        binding.btnTradeStock.setOnClickListener {
            navigateToWebView(Services.TRADE_STOCK.title, Services.TRADE_STOCK.url)
        }

        // Telco services
        binding.btnDataUsage.setOnClickListener {
            navigateToWebView(Services.VIEW_DATA_USAGE.title, Services.VIEW_DATA_USAGE.url)
        }

        // Utility services
        binding.btnPayBill.setOnClickListener {
            navigateToWebView(Services.PAY_BILL.title, Services.PAY_BILL.url)
        }

        binding.btnMeterReading.setOnClickListener {
            navigateToWebView(Services.SUBMIT_METER_READING.title, Services.SUBMIT_METER_READING.url)
        }

        // Travel services
        binding.btnPlanHoliday.setOnClickListener {
            navigateToWebView(Services.PLAN_HOLIDAY.title, Services.PLAN_HOLIDAY.url)
        }

        // Testing services
        binding.btnTestApi.setOnClickListener {
            testApiEndpoints()
        }

        binding.btnTestApiV2.setOnClickListener {
            testApiEndpointsV2()
        }
    }

    private fun testApiEndpoints() {
        Thread {
            val results = StringBuilder()

            // GET /api/data
            try {
                val getRequest = Request.Builder()
                    .url("$BASE_URL/api/data")
                    .get()
                    .build()
                val getResponse = unsafeClient.newCall(getRequest).execute()
                results.append("GET /api/data\nStatus: ${getResponse.code}\nBody: ${getResponse.body?.string()}\n\n")
            } catch (e: Exception) {
                results.append("GET /api/data\nError: ${e.message}\n\n")
            }

            // POST /api/submit
            try {
                val jsonBody = """{"user":"jek","action":"login"}"""
                val postRequest = Request.Builder()
                    .url("$BASE_URL/api/submit")
                    .post(jsonBody.toRequestBody("application/json".toMediaType()))
                    .build()
                val postResponse = unsafeClient.newCall(postRequest).execute()
                results.append("POST /api/submit\nStatus: ${postResponse.code}\nBody: ${postResponse.body?.string()}\n\n")
            } catch (e: Exception) {
                results.append("POST /api/submit\nError: ${e.message}\n\n")
            }

            // PUT /api/update
            try {
                val putRequest = Request.Builder()
                    .url("$BASE_URL/api/update")
                    .put("".toRequestBody(null))
                    .build()
                val putResponse = unsafeClient.newCall(putRequest).execute()
                results.append("PUT /api/update\nStatus: ${putResponse.code}\nBody: ${putResponse.body?.string()}")
            } catch (e: Exception) {
                results.append("PUT /api/update\nError: ${e.message}")
            }

            activity?.runOnUiThread {
                if (isAdded) {
                    AlertDialog.Builder(requireContext())
                        .setTitle("API Test Results")
                        .setMessage(results.toString())
                        .setPositiveButton("OK", null)
                        .show()
                }
            }
        }.start()
    }

    private fun testApiEndpointsV2() {
        Thread {
            val results = StringBuilder()

            // GET /api/data
            try {
                val getRequest = Request.Builder()
                    .url("$LOCAL_BASE_URL/api/data")
                    .get()
                    .build()
                val getResponse = localClient.newCall(getRequest).execute()
                results.append("GET /api/data\nStatus: ${getResponse.code}\nBody: ${getResponse.body?.string()}\n\n")
            } catch (e: Exception) {
                results.append("GET /api/data\nError: ${e.message}\n\n")
            }

            // POST /api/submit
            try {
                val jsonBody = """{"user":"jek","action":"login"}"""
                val postRequest = Request.Builder()
                    .url("$LOCAL_BASE_URL/api/submit")
                    .post(jsonBody.toRequestBody("application/json".toMediaType()))
                    .build()
                val postResponse = localClient.newCall(postRequest).execute()
                results.append("POST /api/submit\nStatus: ${postResponse.code}\nBody: ${postResponse.body?.string()}\n\n")
            } catch (e: Exception) {
                results.append("POST /api/submit\nError: ${e.message}\n\n")
            }

            // PUT /api/update
            try {
                val putRequest = Request.Builder()
                    .url("$LOCAL_BASE_URL/api/update")
                    .put("".toRequestBody(null))
                    .build()
                val putResponse = localClient.newCall(putRequest).execute()
                results.append("PUT /api/update\nStatus: ${putResponse.code}\nBody: ${putResponse.body?.string()}")
            } catch (e: Exception) {
                results.append("PUT /api/update\nError: ${e.message}")
            }

            activity?.runOnUiThread {
                if (isAdded) {
                    AlertDialog.Builder(requireContext())
                        .setTitle("API v2 Test Results")
                        .setMessage(results.toString())
                        .setPositiveButton("OK", null)
                        .show()
                }
            }
        }.start()
    }

    /**
     * Navigate to WebView fragment with the given service name and URL
     */
    private fun navigateToWebView(serviceName: String, url: String) {
        val bundle = bundleOf(
            "serviceName" to serviceName,
            "url" to url
        )
        findNavController().navigate(R.id.webViewFragment, bundle)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
