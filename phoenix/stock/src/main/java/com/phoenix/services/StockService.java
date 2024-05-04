package com.phoenix.services;

import com.phoenix.config.AuthorizationUtils;
import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.kafka.StockProducer;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.*;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.phoenix.repository.IStockRepository;
import com.phoenix.repository.IUncheckHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService implements IStockService {
    @Autowired
    private IStockMapper iStockMapper;
    @Autowired
    private IProductMapper iProductMapper;

    @Autowired
    private IStockRepository iStockRepository;

    private final WebClient.Builder webClientBuilder;
    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;

    @Autowired
    private IAgentProdService iAgentProdService;

    @Autowired
    private IAgentProdMapper iAgentProdMapper;
    @Autowired
    private AuthorizationUtils authorizationUtils;

    @Autowired
    private StockProducer stockProducer;

    @Autowired
    private IProductRepository iProductRepository;
    @Autowired
    private ISoldProductRepository iSoldProductRepository;


    @Override
    public void addStock(StockDto stockDto, String campaignReference) {
        Campaigndto campaigndto = webClientBuilder.build().get()
                .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", campaignReference)
                .retrieve()
                .bodyToMono(Campaigndto.class)
                .block();
        if (campaigndto != null) {
            stockDto.setCampaignRef(campaigndto.getReference());
            stockDto.setProductTypes(campaigndto.getProducts());
            stockDto.setDueDate(stockDto.getReceivedDate().plusDays(45));
        }
        Stock stock = iStockMapper.toEntity(stockDto);
        iStockRepository.save(stock);

    }
 /*   private String addAuthorizationHeader() {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Jwt jwt = authentication.getToken();
            if (jwt != null) {
                System.out.println("jwt is :" + jwt);
                String token = jwt.getTokenValue();
                System.out.println("Token is : " +token);

                return token;
            }
        }
        return null;
    } */

    @Override
    public Page<StockDto> getStocks(String searchTerm, Pageable pageable) {
        List<Stock> stocks = iStockRepository.findAllWithoutProducts();
        List<StockDto> stockDtos = iStockMapper.toDtoList(stocks);
        List<Mono<Campaigndto>> campaignMonos = stockDtos.stream()
                .map(stockDto -> webClientBuilder.build().get()
                        .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stockDto.getCampaignRef())
                        //   .header(HttpHeaders.AUTHORIZATION, "Bearer " + authorizationUtils.addAuthorizationHeader())
                        .retrieve()
                        .bodyToMono(Campaigndto.class))
                .collect(Collectors.toList());
        Mono<List<Campaigndto>> campaignMono = Mono.zip(campaignMonos, objects ->
                Arrays.stream(objects)
                        .map(obj -> (Campaigndto) obj)
                        .collect(Collectors.toList()));
        List<Campaigndto> campaignDtos = campaignMono.block();
        for (int i = 0; i < stockDtos.size(); i++) {
            stockDtos.get(i).setCampaigndto(campaignDtos.get(i));
        }
        if (!searchTerm.isEmpty()) {
            stockDtos = stockDtos.parallelStream()
                    .filter(stockDto -> filterBySearchTerm(stockDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<StockDto> pageContent;
        if (stockDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, stockDtos.size());
            pageContent = stockDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, stockDtos.size());
    }

    private boolean filterBySearchTerm(StockDto stockDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String shippingDate = stockDto.getShippingDate() != null ? stockDto.getShippingDate().format(dateFormatter) : "";
        String receivedDate = stockDto.getReceivedDate() != null ? stockDto.getReceivedDate().format(dateFormatter) : "";
        String dueDate = stockDto.getDueDate() != null ? stockDto.getDueDate().format(dateFormatter) : "";

        return stockDto.getStockReference().toLowerCase().contains(searchString)
                || stockDto.getCampaigndto().getCampaignName().toLowerCase().contains(searchString)
                || stockDto.getCampaigndto().getClient().getCompanyName().toLowerCase().contains(searchString)
                || shippingDate.contains(searchString)
                || receivedDate.contains(searchString)
                || dueDate.contains(searchString);
    }


    @Override
    public StockDto getstockByReference(String reference) {
        Optional<Stock> stockOptional = iStockRepository.findById(reference);
        if (stockOptional.isEmpty()) {
            return null;
        }
        Stock stock = stockOptional.get();
        Campaigndto campaigndto = webClientBuilder.build().get()
                .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stock.getCampaignRef())
                .retrieve()
                .bodyToMono(Campaigndto.class)
                .block();
        StockDto stockDto = iStockMapper.toDto(stock);
        stockDto.setCampaigndto(campaigndto);
        return stockDto;
    }

    @Override
    public List<UncheckHistory> getUncheckedHistorybyStockreference(String reference) {
        Optional<List<UncheckHistory>> optionaluncheckHistories = iUncheckHistoryRepository.findByStockreference(reference);
        if (optionaluncheckHistories.isEmpty()) {
            return null;
        }
        List<UncheckHistory> uncheckHistories = optionaluncheckHistories.get();
        Collections.sort(uncheckHistories, Comparator.comparing(UncheckHistory::getCheckDate).reversed());
        List<UncheckHistory> triByDateUncheckHistories = new ArrayList<>(uncheckHistories);
        return triByDateUncheckHistories;
    }

    @Override
    public StockDto UpdateStock(String reference, StockDto stockDto) {
        Stock stock = iStockRepository.findById(reference).orElse(null);
        if (stock == null) {
            return null;
        }
        if (stockDto.getCampaignRef() != null) {
            stock.setCampaignRef(stockDto.getCampaignRef());
        }
        if (stockDto.getProducts() != null) {
            stock.setProductTypes(stockDto.getProductTypes());
        }

        if (stockDto.getShippingDate() != null) {
            stock.setShippingDate(stockDto.getShippingDate());
        }

        if (stockDto.getReceivedDate() != null) {
            stock.setReceivedDate(stockDto.getReceivedDate());
            stock.setDueDate(stockDto.getReceivedDate().plusDays(45));
            if (stock.getProducts() != null) {
                List<Product> products = stock.getProducts();
                for (Product prod : products) {
                    if (prod.getAgentProd() != null) {
                        AgentProd agentProd = prod.getAgentProd();
                        agentProd.setReceivedDate(stockDto.getReceivedDate());
                        agentProd.setDuesoldDate(stockDto.getReceivedDate().plusDays(45));
                        AgentProdDto agentProddto = iAgentProdMapper.toDto(agentProd);
                        iAgentProdService.UpdateAgentonProd(agentProd.getAgentRef(), agentProddto);
                    }
                    if (prod.getManagerProd() != null) {
                        AgentProd managerProd = prod.getManagerProd();
                        managerProd.setReceivedDate(stockDto.getReceivedDate());
                        managerProd.setDuesoldDate(stockDto.getReceivedDate().plusDays(45));
                        AgentProdDto managerProdDto = iAgentProdMapper.toDto(managerProd);
                        iAgentProdService.UpdateAgentonProd(managerProd.getAgentRef(), managerProdDto);
                    }
                }

            }

        }
        if (stockDto.isChecked()) {
            stock.setChecked(stockDto.isChecked());
        }
        if (stockDto.getNotes() != null) {
            stock.setNotes(stockDto.getNotes());
        }
        iStockRepository.save(stock);
        return stockDto;
    }

    @Override
    public List<StockDto> getStocksByCampaignRef(String campaignreference) {
        Optional<List<Stock>> optionalstocks = iStockRepository.findByCampaignRef(campaignreference);
        if (optionalstocks.isPresent()) {
            List<Stock> stocks = optionalstocks.get();
            List<StockDto> stocksdto = iStockMapper.toDtoList(stocks);
            return stocksdto;
        } else {
            return null;
        }
    }

    @Override
    public List<String> getAllstockReferences() {
        List<Stock> liststock = iStockRepository.findAll();
        if (liststock.isEmpty()) {
            return null;
        }
        List<String> liststockreferences = new ArrayList<>();
        for (Stock stock : liststock) {
            Campaigndto campaigndto = webClientBuilder.build().get()
                    .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stock.getCampaignRef())
                    .retrieve()
                    .bodyToMono(Campaigndto.class)
                    .block();
            if (!stock.getStockReference().isEmpty() && !campaigndto.getCampaignName().isEmpty()) {
                String stockPlusCampaign = stock.getStockReference() + " - " + "Stock : " + campaigndto.getCampaignName();
                liststockreferences.add(stockPlusCampaign);
            } else if (!stock.getStockReference().isEmpty()) {
                liststockreferences.add(stock.getStockReference());
            }
        }
        return liststockreferences;
    }

    @Override
    public String placeStock(String body) {
        StockEvent stockEvent = new StockEvent();
        stockEvent.setStatus("PENDING");
        stockEvent.setMessage("STOCK STATUS IS PENDING STATE");
        stockProducer.sendMessage(stockEvent);
        return "Stock placed successfully";
    }

    @Override
    public void deleteStock(String ref) {
        Optional<Stock> optionalstock = iStockRepository.findById(ref);
        if (optionalstock.isPresent()) {
            Stock stock = optionalstock.get();
            List<Product> products = stock.getProducts();
            List<SoldProduct> soldProducts = stock.getSoldproducts();
            if (products != null && !products.isEmpty()) {
                for (Product product : products) {
                    iProductRepository.delete(product);
                }
                stock.setProducts(null);
            }
            if (soldProducts != null && !soldProducts.isEmpty()) {
                for (SoldProduct soldProduct : soldProducts) {
                    iSoldProductRepository.delete(soldProduct);
                }
                stock.setSoldproducts(null);
            }
            iStockRepository.delete(stock);
        }
    }
    @Override
    public void deleteUncheckedHistory(Long id){
        Optional<UncheckHistory> optionalUncheckHistory = iUncheckHistoryRepository.findById(id);
        if(optionalUncheckHistory.isPresent()){
            UncheckHistory uncheckHistory = optionalUncheckHistory.get();
            iUncheckHistoryRepository.delete(uncheckHistory);
        }
    }
    @Override
    public void deleteaLLUncheckedHistoryinStock(String stockref) {
    List<UncheckHistory> uncheckHistories = this.getUncheckedHistorybyStockreference(stockref);
    if(uncheckHistories.isEmpty()){
        return;
    } else {
        iUncheckHistoryRepository.deleteAll(uncheckHistories);
        }
    }

}