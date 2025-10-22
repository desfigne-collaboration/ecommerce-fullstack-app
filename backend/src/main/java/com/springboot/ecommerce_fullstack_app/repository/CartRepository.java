package com.springboot.ecommerce_fullstack_app.repository;

import com.springboot.ecommerce_fullstack_app.dto.CartItem;

import java.util.List;

public interface CartRepository {
    int updateQty(CartItem cartItem);
    CartItem checkQty(CartItem cartItem);
    int add(CartItem cartItem);
    List<CartItem> findByUserId(String id);
    int remove(String cid);
    int countByUserId(String id);
}
