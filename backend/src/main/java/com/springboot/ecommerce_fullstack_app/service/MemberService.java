package com.springboot.ecommerce_fullstack_app.service;

import com.springboot.ecommerce_fullstack_app.dto.Member;

public interface MemberService {
    boolean login(Member member);
    int signup(Member member);
    boolean idCheck(String id);
}
