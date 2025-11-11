package com.example.android8__api26__superapp.ui.home

import com.example.android8__api26__superapp.R

/**
 * Object containing all available services in the Super App.
 * Each service maps to a category and has a placeholder URL.
 */
object Services {

    // Service Categories
    const val CATEGORY_FINANCE = "Finance"
    const val CATEGORY_TELCO = "Telco"
    const val CATEGORY_UTILITY = "Utility"
    const val CATEGORY_TRAVEL = "Travel"

    // Finance Services
    val SEND_MONEY = ServiceItem(
        id = "send_money",
        title = "Send money",
        iconResId = R.drawable.ic_send_money,
        url = "https://example.com/finance/send",
        category = CATEGORY_FINANCE
    )

    val TRADE_STOCK = ServiceItem(
        id = "trade_stock",
        title = "Trade Stock",
        iconResId = R.drawable.ic_trade_stock,
        url = "https://example.com/finance/trade",
        category = CATEGORY_FINANCE
    )

    // Telco Services
    val VIEW_DATA_USAGE = ServiceItem(
        id = "view_data_usage",
        title = "View Data Usage",
        iconResId = R.drawable.ic_data_usage,
        url = "https://example.com/telco/usage",
        category = CATEGORY_TELCO
    )

    // Utility Services
    val PAY_BILL = ServiceItem(
        id = "pay_bill",
        title = "Pay Bill",
        iconResId = R.drawable.ic_pay_bill,
        url = "https://example.com/utility/paybill",
        category = CATEGORY_UTILITY
    )

    val SUBMIT_METER_READING = ServiceItem(
        id = "submit_meter_reading",
        title = "Submit Meter Reading",
        iconResId = R.drawable.ic_meter_reading,
        url = "https://main.d26h2mys5it3o4.amplifyapp.com/",
        category = CATEGORY_UTILITY
    )

    // Travel Services
    val PLAN_HOLIDAY = ServiceItem(
        id = "plan_holiday",
        title = "Plan Holiday",
        iconResId = R.drawable.ic_plan_holiday,
        url = "https://example.com/travel/plan",
        category = CATEGORY_TRAVEL
    )

    /**
     * Get all services as a list
     */
    fun getAllServices(): List<ServiceItem> = listOf(
        SEND_MONEY,
        TRADE_STOCK,
        VIEW_DATA_USAGE,
        PAY_BILL,
        SUBMIT_METER_READING,
        PLAN_HOLIDAY
    )

    /**
     * Get services by category
     */
    fun getServicesByCategory(category: String): List<ServiceItem> {
        return getAllServices().filter { it.category == category }
    }
}
