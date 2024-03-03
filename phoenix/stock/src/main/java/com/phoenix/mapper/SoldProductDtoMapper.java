package com.phoenix.mapper;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.model.SoldProduct;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class SoldProductDtoMapper implements ISoldProductDtoMapper{
    @Override
    public SoldProductDto toDto(SoldProduct soldProduct) {
        SoldProductDto soldProductDto = new SoldProductDto();
        soldProductDto.setSerialNumber(soldProduct.getSerialNumber());
        soldProductDto.setSimNumber(soldProduct.getSimNumber());
        soldProductDto.setSoldDate(soldProduct.getSoldDate());
        soldProductDto.setCheckedSell(soldProduct.isCheckedSell());
        soldProductDto.setProductType(soldProduct.getProductType());
        soldProductDto.setBrand(soldProduct.getBrand());
        soldProductDto.setProdName(soldProduct.getProdName());
        soldProductDto.setComments(soldProduct.getComments());
        soldProductDto.setPrice(soldProduct.getPrice());
        return soldProductDto;
    }

    @Override
    public SoldProduct toEntity(SoldProductDto soldProductDto) {
        SoldProduct soldProduct = new SoldProduct();
        soldProduct.setSerialNumber(soldProductDto.getSerialNumber());
        soldProduct.setSimNumber(soldProductDto.getSimNumber());
        soldProduct.setSoldDate(soldProductDto.getSoldDate());
        soldProduct.setCheckedSell(soldProductDto.isCheckedSell());
        soldProduct.setProductType(soldProductDto.getProductType());
        soldProduct.setBrand(soldProductDto.getBrand());
        soldProduct.setProdName(soldProductDto.getProdName());
        soldProduct.setComments(soldProductDto.getComments());
        soldProduct.setPrice(soldProductDto.getPrice());
        return soldProduct;
    }


    @Override
    public List<SoldProductDto> toDtoList(List<SoldProduct> soldProducts) {
        return soldProducts.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SoldProduct> toEntityList(List<SoldProductDto> soldProductDtos) {
        return soldProductDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

}
