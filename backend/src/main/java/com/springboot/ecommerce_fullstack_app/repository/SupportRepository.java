package com.springboot.ecommerce_fullstack_app.repository;

import com.springboot.ecommerce_fullstack_app.dto.Support;
import java.util.List;

public interface SupportRepository {
    List<Support> findAll();
    List<Support> findAll(Support support);
}
