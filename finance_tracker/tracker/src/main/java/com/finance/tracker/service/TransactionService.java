package com.finance.tracker.service;

import java.sql.SQLException;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.finance.tracker.service.AccountService;
import com.finance.tracker.dto.AccountDetailRequest;
import com.finance.tracker.dto.TransactionDetailRequest;
import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.AccountStatus;
import com.finance.tracker.entity.TransactionDetails;
import com.finance.tracker.entity.TransactionType;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.AccountRepository;
import com.finance.tracker.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    private TransactionRepository transactionrepository;
    private ModelMapper modelMapper = new ModelMapper();
    private AccountService service;

    public TransactionService(TransactionRepository transactionrepository, ModelMapper modelMapper,
            AccountService service) {
        this.transactionrepository = transactionrepository;
        this.modelMapper = modelMapper;
        this.service = service;
    }

    @Transactional
    public void addTransaction(TransactionDetailRequest transactionrequest, User user) {

        if (!service.validateaccountOwnership(transactionrequest.getAccountNumber(), user)) {
            throw new RuntimeException("User does not own the account");
        }

        logger.info("inside transaction service add transaction method");

        TransactionDetails transaction = new TransactionDetails();
        logger.info("transaction type " + transactionrequest.getTransactionType());

        if (TransactionType.DEBIT == transactionrequest.getTransactionType()) {
            AccountDetailRequest account = service.getAccountForUser(transactionrequest.getAccountNumber(), user);
            if (account.getCurrentbalance().compareTo(transactionrequest.getTransactionAmount()) < 0) {
                throw new RuntimeException("Insufficient balance for the transaction");
            } else {
                account.setCurrentbalance(
                        account.getCurrentbalance().subtract(transactionrequest.getTransactionAmount()));
                service.modifyAccount(account, user);
            }
        } else if (TransactionType.CREDIT == transactionrequest.getTransactionType()) {
            AccountDetailRequest account = service.getAccountForUser(transactionrequest.getAccountNumber(), user);
            account.setCurrentbalance(account.getCurrentbalance().add(transactionrequest.getTransactionAmount()));
            service.modifyAccount(account, user);
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
        logger.info("TransactionAmount: " + transactionrequest.getTransactionAmount());
        modelMapper.map(transactionrequest, transaction);
        logger.info("transaction amount" + transaction.getTransactionAmount());
        transaction.setUser(user);

        try {
            transactionrepository.save(transaction);
        } catch (RuntimeException e) {
            throw new RuntimeException("Error saving transaction: " + e.getMessage());
        }
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        logger.error("Runtime exception occurred: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(e.getMessage());
    }
}
