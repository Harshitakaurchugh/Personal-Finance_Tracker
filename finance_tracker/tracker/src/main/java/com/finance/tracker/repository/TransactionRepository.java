package com.finance.tracker.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.finance.tracker.entity.TransactionDetails;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionDetails, Long> {

    Optional<TransactionDetails> findByAccountNumberAndUser_Email(Long accountNumber, String userEmail);

    List<TransactionDetails> findAllByUser_IdOrderByTransactionDateDescTransactionIdDesc(Long userId);

}
