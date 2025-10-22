package com.springboot.ecommerce_fullstack_app.service;

import com.springboot.ecommerce_fullstack_app.dto.CartItem;

import java.util.List;

public interface CartService {
    int updateQty(CartItem cartItem);
    CartItem checkQty(CartItem cartItem);
    int add(CartItem cartItem);
    List<CartItem> getCartList(String id);
    int remove(String cid);
    int getCartCount(String id);
}
