package com.springboot.ecommerce_fullstack_app.controller;

import com.springboot.ecommerce_fullstack_app.dto.CartItem;
import com.springboot.ecommerce_fullstack_app.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/updateQty")
    public int  updateQty(@RequestBody CartItem cartItem) {
        return cartService.updateQty(cartItem);
    }

    @PostMapping("/checkQty")
    public CartItem checkQty(@RequestBody CartItem cartItem) {
        return cartService.checkQty(cartItem);
    }

    @PostMapping("/add")
    public int add(@RequestBody CartItem cartItem) {
        return cartService.add(cartItem);
    }
}
