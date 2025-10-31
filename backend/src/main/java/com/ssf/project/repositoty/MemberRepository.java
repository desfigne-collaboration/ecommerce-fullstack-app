package com.ssf.project.repositoty;

import com.ssf.project.dto.Member;

public interface MemberRepository {
    public int save(Member member);
    String findByIdnPwd(String id);
}
