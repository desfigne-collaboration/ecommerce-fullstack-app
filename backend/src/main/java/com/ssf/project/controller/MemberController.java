package com.ssf.project.controller;

import com.ssf.project.dto.Member;
import com.ssf.project.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/member")
//@CrossOrigin(origins = {"http://localhost:3000"})
public class MemberController {

    // 서비스 객체 가져오기
    private final MemberService memberService;

    // controller 객체 생성
    @Autowired
    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/signup")
    public boolean signup(@RequestBody Member member) {
        System.out.println("member 확인 => " + member);
        boolean result = false;
        
        // 서비스 호출
        int rows = memberService.signup(member);
        if(rows == 1) result = true;
        
        return result;
    }

    @PostMapping("/login")
    public ResponseEntity<?> Login(@RequestBody Member member,
                         HttpServletRequest request) {

        ResponseEntity<?> response = null;
        boolean result = memberService.login(member);

        if(result) {
            HttpSession session = request.getSession(true);
            session.setAttribute("sid", member.getEmail());
            response = ResponseEntity.ok(Map.of("login", true));
        } else {
            response = ResponseEntity.ok(Map.of("login", false));
        }

        return response;

    }

    @PostMapping("/logout")
    public ResponseEntity<?> Logout(HttpServletRequest request,
                                    HttpServletResponse response) {

        HttpSession session = request.getSession(false);
        if(session != null) {
            session.invalidate();

            var cookie = new Cookie("JSESSIONID", null);
            cookie.setPath("/");                // <- 기존과 동일
            cookie.setMaxAge(0);                // <- 즉시 만료 (유효기간)
            cookie.setHttpOnly(true);           // 개발 중에도 HttpOnly 유지 권장
            // cookie.setSecure(true);          // HTTPS에서만. 로컬 http면 주석
            // cookie.setDomain("localhost");   // 기존 쿠키가 domain=localhost였다면 지정
            response.addCookie(cookie);
        }

        return ResponseEntity.ok(true);
    }
}
