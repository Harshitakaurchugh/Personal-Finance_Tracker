package com.finance.tracker.dto;

import java.math.BigDecimal;

import com.finance.tracker.entity.AccountType;

public class ModifyAccountRequest {

    private String accountholderName;

    public String getAccountholderName() {
        return accountholderName;
    }

    public void setAccountholderName(String accountholderName) {
        this.accountholderName = accountholderName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    private String branchName;

    private AccountType accountType;

    private String accountName;

}
