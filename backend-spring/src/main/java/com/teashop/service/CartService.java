package com.teashop.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.teashop.entity.*;
import com.teashop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final SpecOptionRepository specOptionRepository;
    private final ToppingRepository toppingRepository;
    private final ObjectMapper objectMapper;

    public List<Cart> getCart(Long userId) {
        return cartRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Cart addItem(Long userId, Long productId, Map<String, Object> specs,
                        List<Integer> toppings, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("商品不存在或已下架"));

        double unitPrice = product.getBasePrice();

        // Add spec extras
        if (specs != null) {
            for (Object v : specs.values()) {
                if (v instanceof Number) {
                    Optional<SpecOption> opt = specOptionRepository.findById(((Number) v).longValue());
                    if (opt.isPresent()) {
                        unitPrice += opt.get().getExtraPrice();
                    }
                }
            }
        }

        // Add topping prices
        List<Integer> toppingIdList = toppings != null ? toppings : new ArrayList<>();
        if (!toppingIdList.isEmpty()) {
            List<Topping> toppingsList = toppingRepository.findAllById(
                toppingIdList.stream().map(Long::valueOf).collect(Collectors.toList()));
            for (Topping t : toppingsList) {
                unitPrice += t.getPrice();
            }
        }

        try {
            String specsJson = specs != null ? objectMapper.writeValueAsString(specs) : "{}";
            String toppingsJson = objectMapper.writeValueAsString(toppingIdList);

            Cart cart = new Cart();
            cart.setUserId(userId);
            cart.setProductId(productId);
            cart.setProductName(product.getName());
            cart.setSpecs(specsJson);
            cart.setToppings(toppingsJson);
            cart.setQuantity(quantity != null ? quantity : 1);
            cart.setUnitPrice(unitPrice);

            return cartRepository.save(cart);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("数据格式错误");
        }
    }

    @Transactional
    public Cart updateQuantity(Long id, Long userId, Integer quantity) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("购物车商品不存在"));
        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Transactional
    public void removeItem(Long id, Long userId) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("购物车商品不存在"));
        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        cartRepository.delete(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}
