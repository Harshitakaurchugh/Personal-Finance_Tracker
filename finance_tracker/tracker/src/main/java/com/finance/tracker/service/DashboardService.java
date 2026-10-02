package com.finance.tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.tracker.dto.DashboardResponse;
import com.finance.tracker.dto.DashboardResponse.AccountSummary;
import com.finance.tracker.dto.DashboardResponse.CategorySpending;
import com.finance.tracker.dto.DashboardResponse.MonthlySummary;
import com.finance.tracker.dto.DashboardResponse.RecentTransaction;
import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.TransactionDetails;
import com.finance.tracker.entity.TransactionType;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.AccountRepository;
import com.finance.tracker.repository.TransactionRepository;

@Service
public class DashboardService {

    private static final int MONTH_COUNT = 6;
    private static final int RECENT_TRANSACTION_COUNT = 8;

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public DashboardService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public DashboardResponse getDashboard(User user) {
        return getDashboard(user, "1W");
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(User user, String requestedRange) {
        String selectedRange = normalizeRange(requestedRange);
        List<AccountDetails> accounts = accountRepository.findAllByUser_IdOrderByCreatedAtDesc(user.getId());
        List<TransactionDetails> transactions = transactionRepository
                .findAllByUser_IdOrderByTransactionDateDescTransactionIdDesc(user.getId());
        YearMonth currentMonth = YearMonth.now();
        YearMonth firstMonth = currentMonth.minusMonths(MONTH_COUNT - 1);

        List<AccountSummary> summaries = accounts.stream()
                .map(account -> summarizeAccount(account, transactions, selectedRange, currentMonth, firstMonth))
                .toList();

        return new DashboardResponse(summaries.size(), selectedRange, summaries);
    }

    private AccountSummary summarizeAccount(
            AccountDetails account,
            List<TransactionDetails> transactions,
            String selectedRange,
            YearMonth currentMonth,
            YearMonth firstMonth) {
        Map<YearMonth, MonthlyAmounts> monthlyAmounts = new HashMap<>();
        for (int monthOffset = 0; monthOffset < MONTH_COUNT; monthOffset++) {
            monthlyAmounts.put(firstMonth.plusMonths(monthOffset), new MonthlyAmounts());
        }

        BigDecimal totalCredit = BigDecimal.ZERO;
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalAmount = account.getCurrentbalance() == null ? BigDecimal.ZERO : account.getCurrentbalance();
        Map<String, BigDecimal> categoryTotals = new HashMap<>();
        Map<String, Integer> categoryCounts = new HashMap<>();
        List<RecentTransaction> recentTransactions = new ArrayList<>();

        for (TransactionDetails transaction : transactions) {
            if (!account.getAccountNumber().equals(transaction.getAccountNumber())
                    || !isWithinRange(transaction.getTransactionDate(), selectedRange)) {
                continue;
            }

            BigDecimal amount = transaction.getTransactionAmount() == null
                    ? BigDecimal.ZERO
                    : transaction.getTransactionAmount();

            if (transaction.getTransactionType() == TransactionType.CREDIT) {
                totalCredit = totalCredit.add(amount);
            } else if (transaction.getTransactionType() == TransactionType.DEBIT) {
                totalDebit = totalDebit.add(amount);
                String categoryName = transaction.getTransactionCategory() == null ? "Other"
                        : transaction.getTransactionCategory().name();
                categoryTotals.put(categoryName,
                        categoryTotals.getOrDefault(categoryName, BigDecimal.ZERO).add(amount));
                categoryCounts.put(categoryName, categoryCounts.getOrDefault(categoryName, 0) + 1);
            }

            YearMonth transactionMonth = parseMonth(transaction.getTransactionDate());
            if (transactionMonth != null) {
                MonthlyAmounts amounts = monthlyAmounts.get(transactionMonth);
                if (amounts != null) {
                    addAmount(amounts, transaction.getTransactionType(), amount);
                }
            }

            if (recentTransactions.size() < RECENT_TRANSACTION_COUNT) {
                recentTransactions.add(new RecentTransaction(
                        transaction.getTransactionId(),
                        transaction.getTransactionDate(),
                        transaction.getTransactionType() == null ? null : transaction.getTransactionType().name(),
                        transaction.getTransactionCategory() == null ? null
                                : transaction.getTransactionCategory().name(),
                        transaction.getComment(),
                        amount));
            }
        }

        List<MonthlySummary> monthlyTrend = monthlyAmounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> new MonthlySummary(
                        entry.getKey().toString(),
                        entry.getValue().income,
                        entry.getValue().expenses))
                .toList();

        List<CategorySpending> categorySpending = categoryTotals.entrySet().stream()
                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                .map(entry -> new CategorySpending(
                        entry.getKey(),
                        entry.getValue(),
                        categoryCounts.getOrDefault(entry.getKey(), 0)))
                .toList();

        return new AccountSummary(
                account.getAccountNumber(),
                account.getAccountName(),
                account.getCurrency(),
                totalAmount,
                totalAmount,
                totalCredit,
                totalDebit,
                totalCredit,
                totalDebit,
                categorySpending,
                monthlyTrend,
                recentTransactions);
    }

    private void addAmount(MonthlyAmounts amounts, TransactionType type, BigDecimal amount) {
        if (type == TransactionType.CREDIT) {
            amounts.income = amounts.income.add(amount);
        } else if (type == TransactionType.DEBIT) {
            amounts.expenses = amounts.expenses.add(amount);
        }
    }

    private String normalizeRange(String requestedRange) {
        if (requestedRange == null || requestedRange.isBlank()) {
            return "1W";
        }

        String normalized = requestedRange.trim().toUpperCase();
        if (normalized.equals("1W") || normalized.equals("WEEK") || normalized.equals("WEEKLY")) {
            return "1W";
        }
        if (normalized.equals("1M") || normalized.equals("MONTH") || normalized.equals("MONTHLY")) {
            return "1M";
        }
        if (normalized.equals("6M") || normalized.equals("HALF_YEAR") || normalized.equals("6MONTHS")) {
            return "6M";
        }
        return "1W";
    }

    private boolean isWithinRange(String transactionDate, String selectedRange) {
        if (transactionDate == null || transactionDate.isBlank()) {
            return false;
        }

        try {
            LocalDate date = LocalDate.parse(transactionDate);
            LocalDate today = LocalDate.now();

            if ("1W".equals(selectedRange)) {
                return !date.isBefore(today.minusDays(7));
            }
            if ("1M".equals(selectedRange)) {
                return !date.isBefore(today.minusMonths(1));
            }
            if ("6M".equals(selectedRange)) {
                return !date.isBefore(today.minusMonths(6));
            }
        } catch (DateTimeParseException ignored) {
            return false;
        }

        return true;
    }

    private YearMonth parseMonth(String transactionDate) {
        if (transactionDate == null || transactionDate.isBlank()) {
            return null;
        }
        try {
            return YearMonth.from(LocalDate.parse(transactionDate));
        } catch (DateTimeParseException exception) {
            return null;
        }
    }

    private static class MonthlyAmounts {
        private BigDecimal income = BigDecimal.ZERO;
        private BigDecimal expenses = BigDecimal.ZERO;
    }
}