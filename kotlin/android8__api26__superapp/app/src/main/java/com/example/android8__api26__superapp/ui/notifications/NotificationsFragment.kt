package com.example.android8__api26__superapp.ui.notifications

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.android8__api26__superapp.R
import com.example.android8__api26__superapp.databinding.FragmentNotificationsBinding

/**
 * Settings fragment (formerly Notifications) - placeholder for future settings functionality.
 */
class NotificationsFragment : Fragment() {

    private var _binding: FragmentNotificationsBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentNotificationsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Set placeholder text
        binding.textNotifications.text = getString(R.string.placeholder_settings)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}