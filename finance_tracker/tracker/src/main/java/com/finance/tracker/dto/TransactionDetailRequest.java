package com.finance.tracker.dto;

import java.math.BigDecimal;

import com.finance.tracker.entity.TransactionCategory;
import com.finance.tracker.entity.TransactionType;

import lombok.*;

@Getter
@Setter
public class TransactionDetailRequest {

    private Long accountNumber;
    private BigDecimal transactionAmount;
    private TransactionType transactionType;
    private String transactionDate;
    private TransactionCategory transactionCategory;
    private String comment;

}
