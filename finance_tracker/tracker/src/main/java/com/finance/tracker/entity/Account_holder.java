package com.finance.tracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "AccountHolders")
public class Account_holder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

}
