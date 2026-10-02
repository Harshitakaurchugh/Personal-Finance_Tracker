package com.finance.tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finance.tracker.entity.AccountDetails;
import com.finance.tracker.entity.User;

@Repository
public interface AccountRepository extends JpaRepository<AccountDetails, Long> {

    Optional<AccountDetails> findByAccountNumber(Long accountNumber);

    Optional<AccountDetails> findByAccountNumberAndUser_Email(Long accountNumber,
            String email);

    AccountDetails findByAccountNumberAndUser(Long accountNumber, User user);

    List<AccountDetails> findAllByUser_IdOrderByCreatedAtDesc(Long userId);
}
