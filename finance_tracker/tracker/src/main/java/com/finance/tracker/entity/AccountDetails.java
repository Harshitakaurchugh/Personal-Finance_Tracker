package com.finance.tracker.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Accounts")
@Getter
@Setter
public class AccountDetails {
    @Id
    @Column(nullable = false, unique = true)
    private Long accountNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = false)
    private User user;

    private String accountholderName;
    private String accountName;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    private String currency;
    private String bankName;
    private String branchName;
    private String ifscCode;
    private BigDecimal openingbalance;
    private BigDecimal currentbalance;
    private int accountHolderID;

    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private boolean isprimary;
}
