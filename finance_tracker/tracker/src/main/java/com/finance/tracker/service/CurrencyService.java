package com.finance.tracker.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finance.tracker.dto.CurrencyResponse;

@Service
public class CurrencyService {

    public List<CurrencyResponse> getCurrencies() {

        List<CurrencyResponse> list = new ArrayList<>();

        list.add(new CurrencyResponse("INR", "Indian Rupee"));
        list.add(new CurrencyResponse("USD", "US Dollar"));
        list.add(new CurrencyResponse("EUR", "Euro"));
        list.add(new CurrencyResponse("GBP", "British Pound"));
        list.add(new CurrencyResponse("JPY", "Japanese Yen"));
        list.add(new CurrencyResponse("AUD", "Australian Dollar"));
        list.add(new CurrencyResponse("CAD", "Canadian Dollar"));
        list.add(new CurrencyResponse("CHF", "Swiss Franc"));
        list.add(new CurrencyResponse("CNY", "Chinese Yuan"));
        list.add(new CurrencyResponse("SGD", "Singapore Dollar"));
        list.add(new CurrencyResponse("AED", "UAE Dirham"));
        list.add(new CurrencyResponse("SAR", "Saudi Riyal"));
        list.add(new CurrencyResponse("QAR", "Qatari Riyal"));
        list.add(new CurrencyResponse("KWD", "Kuwaiti Dinar"));
        list.add(new CurrencyResponse("BHD", "Bahraini Dinar"));
        list.add(new CurrencyResponse("OMR", "Omani Rial"));
        list.add(new CurrencyResponse("PKR", "Pakistani Rupee"));
        list.add(new CurrencyResponse("BDT", "Bangladeshi Taka"));
        list.add(new CurrencyResponse("NPR", "Nepalese Rupee"));
        list.add(new CurrencyResponse("LKR", "Sri Lankan Rupee"));
        list.add(new CurrencyResponse("THB", "Thai Baht"));
        list.add(new CurrencyResponse("MYR", "Malaysian Ringgit"));
        list.add(new CurrencyResponse("IDR", "Indonesian Rupiah"));
        list.add(new CurrencyResponse("PHP", "Philippine Peso"));
        list.add(new CurrencyResponse("KRW", "South Korean Won"));
        list.add(new CurrencyResponse("ZAR", "South African Rand"));

        return list;
    }

}