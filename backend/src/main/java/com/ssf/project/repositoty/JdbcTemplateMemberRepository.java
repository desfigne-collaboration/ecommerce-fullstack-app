package com.ssf.project.repositoty;

import com.ssf.project.dto.Member;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;

@Repository
public class JdbcTemplateMemberRepository implements MemberRepository{

    private final JdbcTemplate jdbcTemplate;

    // 생성자
    // @Autowired의 경우 임의로 생성한 생성자에만 붙임
    public JdbcTemplateMemberRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);   // 커넥션 생성
    };

    @Override
    public int save(Member member) {
        // jdbcTemplate객체를 이용하여 DB의 member 테이블에 insert
        String sql = """
                INSERT INTO ssf_user (user_key, email, username, userpwd, banned, signout, signin, snsprov, snsid, referralId)
                  VALUES ( UUID() , ?, ?, ?, 'N', 'N', now(), ?, ?, ?)
                """;  // 보안 이슈로 prepareStatement
        Object[] param = {  member.getEmail(),
                            member.getUsername(),
                            member.getUserpwd(),
                            member.getSnsprov(),
                            member.getSnsid(),
                            member.getReferralId()
                          };

        int rows = jdbcTemplate.update(sql, param);
        System.out.println("rows ==> " + rows);
        return rows;
    }

    @Override
    public String findByIdnPwd(String id) {

        String sql = "select ifnull(MAX(userpwd), null) as userpwd from ssf_user where email = ?";
        Member member = jdbcTemplate.queryForObject(sql,
                        new BeanPropertyRowMapper<>(Member.class), id);

        return member.getUserpwd();
    }
}
