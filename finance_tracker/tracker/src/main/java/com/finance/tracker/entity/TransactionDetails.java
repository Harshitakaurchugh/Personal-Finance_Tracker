package com.finance.tracker.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Transactions")
@Getter
@Setter
public class TransactionDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = false)
    private User user;

    @Column(name = "account_number", nullable = false)
    private Long accountNumber;

    @Column(name = "transaction_amount")
    private BigDecimal transactionAmount;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private String transactionDate;

    @Enumerated(EnumType.STRING)
    private TransactionCategory transactionCategory;

    private String comment;

}
