package com.finance.tracker.dto;

import java.math.BigDecimal;

import com.finance.tracker.entity.AccountType;

import lombok.*;

@Getter
@Setter
public class AccountDetailRequest {
    private Long accountNumber;

    private String accountHolderName;

    private String accountName;

    private AccountType accountType;

    private String currency;

    private String bankName;

    private String branchName;

    private String ifscCode;

    private BigDecimal openingBalance;

    private Integer accountHolderID;

    private boolean primary;

    private BigDecimal currentbalance;

}
