package com.example.android8__api26__superapp.ui.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.android8__api26__superapp.R
import com.example.android8__api26__superapp.databinding.FragmentDashboardBinding

/**
 * Dashboard fragment - placeholder for future dashboard functionality.
 */
class DashboardFragment : Fragment() {

    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Set placeholder text
        binding.textDashboard.text = getString(R.string.placeholder_dashboard)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}