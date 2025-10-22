package com.springboot.ecommerce_fullstack_app.service;

import com.springboot.ecommerce_fullstack_app.dto.CartItem;
import com.springboot.ecommerce_fullstack_app.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService{
    private CartRepository cartRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public int updateQty(CartItem cartItem) {
        return cartRepository.updateQty(cartItem);
    }

    @Override
    public CartItem checkQty(CartItem cartItem) {
        return cartRepository.checkQty(cartItem);
    }

    @Override
    public int add(CartItem cartItem) {
        return cartRepository.add(cartItem);
    }
}
