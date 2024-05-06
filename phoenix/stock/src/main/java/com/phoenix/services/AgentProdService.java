package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgentProdService implements IAgentProdService{
    @Autowired
    private IAgentProdMapper iAgentProdMapper;
    @Autowired
    private IProductMapper iProductMapper;
    @Autowired
    private IStockMapper iStockMapper;


    @Autowired
    private IAgentProdRepository iAgentProdRepository;
    @Autowired
    private IProductRepository iProductRepository;
    @Autowired
    private ISoldProductRepository iSoldProductRepository;

    @Override
    @Transactional
    public void assignAgentandManager(AgentProdDto agentOnProds, AgentProdDto managerOnProds) {
        if (agentOnProds == null && managerOnProds == null) {
            throw new IllegalArgumentException("At least one AgentProdDto must be provided");
        }
        List<AgentProd> agentProdsToSave = new ArrayList<>();

        LocalDate currentDate = LocalDate.now();
        List<ProductDto> productsdtoToassign = agentOnProds != null ?
                agentOnProds.getProductsAssociated() : managerOnProds.getProductsManaged();
        List<Product> productsToassign = iProductMapper.toEntityList(productsdtoToassign);
        for(int i = 0; i < productsToassign.size(); i++) {
            Product product = productsToassign.get(i);
            ProductDto productDto = productsdtoToassign.get(i);

            AgentProd agentProd = null;
            AgentProd managerProd = null;
            if (agentOnProds != null && agentOnProds.getUsername() != null) {
                agentProd = iAgentProdMapper.toEntity(agentOnProds);
                agentProd.setAffectaiondate(currentDate);
            }
            if (managerOnProds != null && managerOnProds.getUsername() != null) {
                managerProd = iAgentProdMapper.toEntity(managerOnProds);
                managerProd.setAffectaiondate(currentDate);
            }
            if (agentProd != null) agentProdsToSave.add(agentProd);
            if (managerProd != null) agentProdsToSave.add(managerProd);
            if (!agentProdsToSave.isEmpty()) {
                iAgentProdRepository.saveAll(agentProdsToSave);
                AgentProd ancientAgentProd = null;
                AgentProd ancientManagerProd = null;
                if (productDto.getAgentProd() != null) {
                    AgentProdDto ancientAgentProddto = productDto.getAgentProd();
                    ancientAgentProd = iAgentProdMapper.toEntity(ancientAgentProddto);
                }
                if (productDto.getManagerProd() != null) {
                    AgentProdDto ancientManagerDtoProd = productDto.getManagerProd();
                    ancientManagerProd = iAgentProdMapper.toEntity(ancientManagerDtoProd);
                }
                if (agentProd != null && !agentProd.getUsername().isEmpty()) {
                    product.setAgentProd(agentProd);
                } else {
                    product.setAgentProd(ancientAgentProd);
                }
                if (managerProd != null && !managerProd.getUsername().isEmpty()) {
                    product.setManagerProd(managerProd);
                } else {
                    product.setManagerProd(ancientManagerProd);
                }
                if(productDto.getStock() != null) {
                    StockDto stockDto = productDto.getStock();
                    product.setStock(iStockMapper.toEntity(stockDto));
                }
                iProductRepository.save(product);
                if (ancientAgentProd != null && agentProd != null) {
                    iAgentProdRepository.delete(ancientAgentProd);
                }
                if (ancientManagerProd != null && managerProd != null) {
                    iAgentProdRepository.delete(ancientManagerProd);
                }
            }
        }
    }




    @Override
    public AgentProdDto UpdateAgentonProd(String agentRef, AgentProdDto agentProdDto) {
        AgentProd agentProd = iAgentProdRepository.findById(agentRef).orElse(null);

        if (agentProdDto.getUsername() != null) {agentProd.setUsername(agentProdDto.getUsername());}
        if (agentProdDto.getFirstname() != null) {agentProd.setFirstname(agentProdDto.getFirstname());}
        if (agentProdDto.getLastname() != null) {agentProd.setLastname(agentProdDto.getLastname());}
        if (agentProdDto.getAffectaiondate() != null) {agentProd.setAffectaiondate(agentProdDto.getAffectaiondate());}
        if (agentProdDto.getDuesoldDate() != null) {agentProd.setDuesoldDate(agentProdDto.getDuesoldDate());}
        if (agentProdDto.getReceivedDate() != null) {agentProd.setReceivedDate(agentProdDto.getReceivedDate());}
        AgentProd savedagentProd = iAgentProdRepository.save(agentProd);
        return agentProdDto;
    }

    @Override
    public void detachAgentFromProduct(String serialNumber) {
        Optional<Product> optionalProduct = iProductRepository.findById(serialNumber);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if(product.getAgentProd() != null){
                AgentProd agentProd = product.getAgentProd();
                product.setAgentProd(null);
                iProductRepository.save(product);
                iAgentProdRepository.delete(agentProd);
            }
        }
    }

    @Override
    public void detachManagerFromProduct(String serialNumber) {
        Optional<Product> optionalProduct = iProductRepository.findById(serialNumber);
        if (optionalProduct.isPresent()) {
            Product product = optionalProduct.get();
            if(product.getManagerProd() != null){
                AgentProd managerProd = product.getManagerProd();
                product.setManagerProd(null);
                iProductRepository.save(product);
                iAgentProdRepository.delete(managerProd);
            }
        }
    }

    @Override
    public List<AgentProdDto> getAssignementByusername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<AgentProdDto> agentProdDtos = new ArrayList<>();
        if(!agentProds.isEmpty()){
            agentProdDtos = iAgentProdMapper.toDtoList(agentProds);
        }
        return agentProdDtos;
    }

    @Override
    public void UpdateAgentsbyUserssignementByusername(List<AgentProdDto> agentProdDtos) {
        List<AgentProd> agentProds = iAgentProdMapper.toEntityList(agentProdDtos);
        for (int i=0 ; i < agentProds.size(); i++){
            AgentProd agentProd = agentProds.get(i);
            AgentProdDto agentProdDto = agentProdDtos.get(i);
            if (agentProdDto.getFirstname() != null) {agentProd.setFirstname(agentProdDto.getFirstname());}
            if (agentProdDto.getLastname() != null) {agentProd.setLastname(agentProdDto.getLastname());}
        }
        System.out.println("received one : " + agentProdDtos);
        System.out.println("executed one : " +agentProds);
        iAgentProdRepository.saveAll(agentProds);

    }

    @Override
    public List<String> productsInPossession(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<String> productsInPossession= new ArrayList<>();
        for (AgentProd agentProd: agentProds){
            Optional<Product> optionalproduct = iProductRepository.findByAgentProd(agentProd);
            if(optionalproduct.isPresent()){
                Product product = optionalproduct.get();
                productsInPossession.add(product.getSerialNumber());
            }
        }
        return productsInPossession;
    }

    @Override
    @Transactional
    public void deleteAgentProdsWithoutProducts() {
        List<AgentProd> agentProds = iAgentProdRepository.findAll();
        for (AgentProd agentProd : agentProds) {
            if (agentProd.getProductsManaged().isEmpty() &&
                    agentProd.getSoldproductsManaged().isEmpty() &&
                    agentProd.getProductsSoldBy().isEmpty() &&
                    agentProd.getProductsAssociated().isEmpty() &&
                    agentProd.getAgentproductsAssociated().isEmpty() &&
                    agentProd.getProductssoldAndreturnedAssociated().isEmpty() &&
                    agentProd.getProductsreturnedAssociated().isEmpty()) {
                iAgentProdRepository.delete(agentProd);
            }
        }
    }

    @Override
    @Transactional
    public void deleteAgentwithUsername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        if (agentProds.isEmpty()) {
            return;
        }

            for (AgentProd agentProd: agentProds){
                clearProductAssociations(agentProd.getProductsManaged());
                agentProd.setProductsManaged(null);
                clearProductAssociations(agentProd.getProductsAssociated());
                agentProd.setProductsAssociated(null);
                clearProductAssociations(agentProd.getProductssoldAndreturnedAssociated());
                agentProd.setProductssoldAndreturnedAssociated(null);
                clearProductAssociations(agentProd.getProductsreturnedAssociated());
                agentProd.setProductsreturnedAssociated(null);

                clearSoldProductAssociations(agentProd.getSoldproductsManaged());
                agentProd.setSoldproductsManaged(null);

                clearSoldProductAssociations(agentProd.getProductsSoldBy());
                agentProd.setProductsSoldBy(null);

                clearSoldProductAssociations(agentProd.getAgentproductsAssociated());
                agentProd.setAgentproductsAssociated(null);


                iAgentProdRepository.delete(agentProd);
            }

    }

    private void clearProductAssociations(List<Product> products) {
        if (products != null) {
            for (Product product : products) {
                product.setManagerProd(null);
                product.setAgentProd(null);
                product.setAgentwhoSoldProd(null);
                product.setAgentReturnedProd(null);
                iProductRepository.save(product);
            }
        }
    }

    private void clearSoldProductAssociations(List<SoldProduct> soldProducts) {
        if (soldProducts != null) {
            for (SoldProduct soldProduct : soldProducts) {
                soldProduct.setManagerSoldProd(null);
                soldProduct.setAgentWhoSold(null);
                soldProduct.setAgentAssociatedProd(null);
                iSoldProductRepository.save(soldProduct);
            }
        }
    }


}
