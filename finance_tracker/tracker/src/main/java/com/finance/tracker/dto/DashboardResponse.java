package com.finance.tracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(int accountCount, String selectedRange, List<AccountSummary> accounts) {

    public record AccountSummary(
            Long accountNumber,
            String accountName,
            String currency,
            BigDecimal currentBalance,
            BigDecimal totalAmount,
            BigDecimal totalCredit,
            BigDecimal totalDebit,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            List<CategorySpending> categorySpending,
            List<MonthlySummary> monthlyTrend,
            List<RecentTransaction> recentTransactions) {
    }

    public record CategorySpending(String category, BigDecimal totalAmount, int transactionCount) {
    }

    public record MonthlySummary(String month, BigDecimal income, BigDecimal expenses) {
    }

    public record RecentTransaction(
            Long transactionId,
            String transactionDate,
            String transactionType,
            String transactionCategory,
            String comment,
            BigDecimal amount) {
    }
}