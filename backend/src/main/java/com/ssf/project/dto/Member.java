package com.ssf.project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Member {

    @JsonProperty("name")
    private String username;

    @JsonProperty("password")
    private String userpwd;

    @JsonProperty("")
    private String referralId; // 추천인아이디

    private String signin;
    private String signout;
    private String snsprov;
    private String snsid;

    @JsonProperty("id")
    private String email;   // 이메일
    
    private String userKey; // 회원고유번호
    private String banned;  //정지여부
}