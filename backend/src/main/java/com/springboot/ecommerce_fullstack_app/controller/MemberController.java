package com.springboot.ecommerce_fullstack_app.controller;

import com.springboot.ecommerce_fullstack_app.dto.Member;
import com.springboot.ecommerce_fullstack_app.service.MemberService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
//@CrossOrigin(origins = {"http://localhost:3000"})
public class MemberController {
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/idcheck")
    public String idcheck(@RequestBody Member member) {
        boolean result = memberService.idCheck(member.getId());  //아이디 O: 1, X: 0
        String msg = "";
        if(result) msg = "이미 사용중인 아이디 입니다.";
        else msg = "사용이 가능한 아이디 입니다.";
        return msg;
    }

    @PostMapping("/signup")
    public boolean signup(@RequestBody Member member) {
        boolean result = false;
        int rows = memberService.signup(member);
        if(rows == 1) result = true;
        return result;
    }


    @PostMapping("/login")
    public boolean login(@RequestBody Member member) {
        return memberService.login(member);
    }

}
