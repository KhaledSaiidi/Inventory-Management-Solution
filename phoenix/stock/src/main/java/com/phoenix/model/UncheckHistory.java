package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "t_uncheckhistory")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UncheckHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 5000)  // Set the desired length
    private List<String> notFoundserialNumbers;
    private LocalDate checkDate;
    private String stockreference;

    public UncheckHistory(List<String> notFoundserialNumbers, LocalDate checkDate, String stockreference) {
        this.notFoundserialNumbers = notFoundserialNumbers;
        this.checkDate = checkDate;
        this.stockreference = stockreference;
    }

}
