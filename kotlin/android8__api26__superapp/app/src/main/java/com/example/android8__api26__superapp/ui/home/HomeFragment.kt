package com.example.android8__api26__superapp.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import com.example.android8__api26__superapp.R
import com.example.android8__api26__superapp.databinding.FragmentHomeBinding

/**
 * Home fragment displaying all available services organized by category.
 * Each service button navigates to a WebView to display the service URL.
 */
class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

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