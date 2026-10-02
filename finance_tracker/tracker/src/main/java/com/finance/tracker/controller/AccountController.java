package com.finance.tracker.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.finance.tracker.dto.AccountDetailRequest;
import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.User;
import com.finance.tracker.service.AccountService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

        private static final Logger logger = LoggerFactory.getLogger(AccountController.class);

        private AccountService service;

        public AccountController(AccountService service) {
                this.service = service;
        }

        @PostMapping("/addaccount")
        public String addaccount(@RequestBody AccountDetailRequest account, Authentication authentication) {

                logger.debug("AccountController.addaccount called with accountNumber={} and auth={}",
                                account.getAccountNumber(), authentication != null);

                User user = (User) authentication.getPrincipal();

                logger.debug("AccountController.addaccount authenticated user id={} email={}",
                                user != null ? user.getId() : null, user != null ? user.getEmail() : null);

                service.addAccount(account, user);
                logger.info("AccountController.addaccount completed for accountNumber={} userId={}",
                                account.getAccountNumber(),
                                user != null ? user.getId() : null);
                return "Account Added successfully";
        }

        @GetMapping("/{accountNumber}")
        public ResponseEntity<AccountDetailRequest> getAccount(
                        @PathVariable Long accountNumber,
                        Authentication authentication) {

                User user = (User) authentication.getPrincipal();

                AccountDetailRequest account = service.getAccountForUser(
                                accountNumber, user);

                logger.debug("getAccount response: accountNumber={}, accountHolderName={}, accountName={}, "
                                + "accountType={}, currency={}, bankName={}, branchName={}, ifscCode={}, "
                                + "openingBalance={}, accountHolderID={}, primary={}",
                                account.getAccountNumber(), account.getAccountHolderName(), account.getAccountName(),
                                account.getAccountType(), account.getCurrency(), account.getBankName(),
                                account.getBranchName(), account.getIfscCode(), account.getOpeningBalance(),
                                account.getAccountHolderID(), account.isPrimary());

                return ResponseEntity.ok(account);
        }

        @PatchMapping("/modifyaccount/accounts/{accountNumber}")
        public String modifyAccount(@RequestBody AccountDetailRequest account, @AuthenticationPrincipal User user,
                        @PathVariable(required = true) Long accountNumber) {
                logger.info("Received modify account request for accountNumber={} from user={} ({})",
                                accountNumber, user.getUserName(), user.getId());
                logger.debug("Modify request payload: {}", account);
                boolean isvalid = service.validateaccountOwnership(accountNumber, user);
                if (!isvalid) {
                        logger.warn("User {} is not the owner of account {}", user.getUserName(), accountNumber);
                        return "Wrong account number or unauthorized to modify this account";
                }
                logger.info("accountrelatedinformation accountholderName={} accountName={} accountType={} currency={} bankName={} branchName={} ifscCode={} openingBalance={} accountHolderID={}",
                                account.getAccountHolderName(), account.getAccountName(), account.getAccountType(),
                                account.getCurrency(), account.getBankName(), account.getBranchName(),
                                account.getIfscCode(), account.getOpeningBalance(), account.getAccountHolderID());
                account.setAccountNumber(accountNumber);
                service.modifyAccount(account, user);
                logger.info("Account {} modified successfully for user={}", account.getAccountNumber(),
                                user.getUserName());
                return "Account modified successfully";
        }

}
