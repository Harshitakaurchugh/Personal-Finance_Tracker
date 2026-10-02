package com.finance.tracker.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.tracker.dto.AccountDetailRequest;
import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.AccountStatus;
import com.finance.tracker.entity.User;
import com.finance.tracker.repository.AccountRepository;

import lombok.AllArgsConstructor;

@Service
public class AccountService {

        private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

        private AccountRepository accountrepository;

        private ModelMapper modelMapper = new ModelMapper();

        public AccountService(AccountRepository accountrepository, ModelMapper modelMapper) {
                this.accountrepository = accountrepository;
                this.modelMapper = modelMapper;
        }

        public void addAccount(AccountDetailRequest request, User user) {
                logger.debug("AccountService.addAccount called for userId={} accountNumber={}",
                                user != null ? user.getId() : null, request.getAccountNumber());

                if (request.getAccountNumber() == null) {
                        throw new RuntimeException("Account number is required");
                }

                AccountDetails account = new AccountDetails();
                modelMapper.map(request, account);
                account.setUser(user);
                account.setAccountStatus(AccountStatus.ACTIVE);
                account.setCurrentbalance(request.getOpeningBalance());
                logger.info("hello");
                AccountDetails saved = accountrepository.save(account);
                logger.info("Saved account accountNumber={} for user={}, id={}", saved.getAccountNumber(),
                                user.getUserName(),
                                user.getId());
        }

        public AccountDetailRequest getAccountForUser(Long accountNumber, User user) {
                if (!validateaccountOwnership(accountNumber, user)) {
                        throw new RuntimeException("User does not own the account");
                }

                AccountDetails account = accountrepository.findByAccountNumberAndUser(
                                accountNumber, user);
                logger.info("Information on account for accountnumber= " + accountNumber + "account.getaccountName()="
                                + account.getAccountName() + "account.getAccountHolderName()="
                                + account.getAccountholderName() + "account.getAccountType()="
                                + account.getAccountType()
                                + "account.getCurrency()="
                                + account.getCurrency() + "account.getBankName()=" + account.getBankName()
                                + "account.getBranchName()=" + account.getBranchName() + "account.getIfscCode()="
                                + account.getIfscCode() + "account.getOpeningbalance()=" + account.getOpeningbalance()
                                + "account.getCurrentbalance()=" + account.getCurrentbalance()
                                + "account.getAccountHolderID()=" + account.getAccountHolderID()
                                + "account.getAccountStatus()=" + account.getAccountStatus());

                return modelMapper.map(account, AccountDetailRequest.class);
        }

        public boolean validateaccountOwnership(Long accountNumber, User user) {
                logger.debug("Validating account ownership for user={} and accountNumber={}", user.getUserName(),
                                accountNumber);
                Optional<AccountDetails> accountOpt = accountrepository.findByAccountNumberAndUser_Email(accountNumber,
                                user.getEmail());
                boolean isOwner = accountOpt.isPresent();
                logger.debug("Account ownership validation result for user={} and accountNumber={}: {}",
                                user.getUserName(),
                                accountNumber, isOwner);
                return isOwner;
        }

        @Transactional
        public void modifyAccount(AccountDetailRequest request, User user) {
                logger.debug("Starting modifyAccount for user={} and accountNumber={}", user.getUserName(),
                                request.getAccountNumber());

                AccountDetails account = accountrepository.findByAccountNumberAndUser(
                                request.getAccountNumber(), user);
                if (account == null) {
                        throw new IllegalArgumentException("Account not found for the authenticated user");
                }
                modelMapper.map(request, account);
                logger.info("Mapped request to account entity for accountNumber= " + account.getAccountNumber()
                                + "accountHolderName= " + account.getAccountholderName() + "accountName= "
                                + account.getAccountName() + "accountType= " + account.getAccountType() + "currency= "
                                + account.getCurrency() + "bankName= " + account.getBankName() + "branchName= "
                                + account.getBranchName() + "ifscCode= " + account.getIfscCode() + "openingBalance= "
                                + account.getOpeningbalance() + "accountHolderID= " + account.getAccountHolderID());

                AccountDetails saved = accountrepository.saveAndFlush(account);
                logger.info("Mapped request to account entity which is saved for accountNumber= "
                                + saved.getAccountNumber()
                                + "accountHolderName= " + saved.getAccountholderName() + "accountName= "
                                + saved.getAccountName() + "accountType= " + saved.getAccountType() + "currency= "
                                + saved.getCurrency() + "bankName= " + saved.getBankName() + "branchName= "
                                + saved.getBranchName() + "ifscCode= " + saved.getIfscCode() + "openingBalance= "
                                + saved.getOpeningbalance() + "accountHolderID= " + saved.getAccountHolderID());
                logger.info("Modified account accountNumber={} for user={}, id={}", saved.getAccountNumber(),
                                user.getUserName(), user.getId());
        }

}
