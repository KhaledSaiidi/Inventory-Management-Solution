package com.phoenix.services;

import com.phoenix.mapper.IStockMapper;
import com.phoenix.repository.IStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StockService implements IStockService{
    @Autowired
    private IStockMapper iStockMapper;
    @Autowired
    private IStockRepository iStockRepository;



}
