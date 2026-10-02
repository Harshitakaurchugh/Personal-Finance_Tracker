package com.finance.tracker.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finance.tracker.dto.AccountDetailRequest;
import com.finance.tracker.dto.TransactionDetailRequest;
import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.TransactionDetails;
import com.finance.tracker.entity.User;
import com.finance.tracker.service.AccountService;
import com.finance.tracker.service.TransactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

        private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

        private TransactionService transactionService;
        private AccountService accountService;

        public TransactionController(TransactionService transactionService, AccountService accountService) {
                this.transactionService = transactionService;
                this.accountService = accountService;
        }

        @GetMapping("/validate/{accountNumber}")
        public ResponseEntity<Void> validateAccount(
                        @PathVariable Long accountNumber,
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();
                logger.info("Validating account ownership for accountNumber={} and userId={}",
                                accountNumber, user != null ? user.getId() : null);
                if (!accountService.validateaccountOwnership(accountNumber, user)) {
                        throw new RuntimeException("User does not own the account");
                }
                return ResponseEntity.ok().build();
        }

        @PostMapping("/addtransaction")
        public String addtransaction(@RequestBody TransactionDetailRequest transaction, Authentication authentication) {

                User user = (User) authentication.getPrincipal();
                logger.info("transaction request transactiontype " + transaction.getTransactionType()
                                + " transactionamount " + transaction.getTransactionAmount() + " accountnumber "
                                + transaction.getAccountNumber());
                transactionService.addTransaction(transaction, user);
                return "Transaction Added successfully";
        }

}
