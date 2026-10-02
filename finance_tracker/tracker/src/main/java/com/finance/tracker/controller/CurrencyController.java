package com.finance.tracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.finance.tracker.dto.CurrencyResponse;
import com.finance.tracker.service.CurrencyService;

@RestController
@RequestMapping("/api/currencies")
@CrossOrigin(origins = "http://localhost:3000")
public class CurrencyController {

    @Autowired
    private CurrencyService service;

    @GetMapping
    public List<CurrencyResponse> getCurrencies() {
        return service.getCurrencies();
    }

}