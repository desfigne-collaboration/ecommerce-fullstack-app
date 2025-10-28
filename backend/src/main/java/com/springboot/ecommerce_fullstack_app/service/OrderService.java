package com.springboot.ecommerce_fullstack_app.service;

import com.springboot.ecommerce_fullstack_app.dto.KakaoPay;

public interface OrderService {
    int save(KakaoPay kakaoPay);
}
