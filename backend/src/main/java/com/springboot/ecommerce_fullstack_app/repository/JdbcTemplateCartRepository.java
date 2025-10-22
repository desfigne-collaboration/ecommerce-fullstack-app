package com.springboot.ecommerce_fullstack_app.repository;

import com.springboot.ecommerce_fullstack_app.dto.CartItem;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.util.List;

@Repository
public class JdbcTemplateCartRepository implements CartRepository{
    private JdbcTemplate jdbcTemplate;

    public JdbcTemplateCartRepository(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public int updateQty(CartItem cartItem) {
        String sql = "";
        if(cartItem.getType().equals("+")) {
            sql = " update cart set qty = qty + 1 where cid =? ";
        } else {
            sql = " update cart set qty = qty - 1 where cid =? ";
        }
        return jdbcTemplate.update(sql, cartItem.getCid());
    }

    @Override
    public CartItem checkQty(CartItem cartItem) {
        String sql = """
                SELECT cid, sum(pid=? AND size=? and id=?) AS checkQty
                	FROM cart
                	GROUP BY cid, id
                	order by checkQty desc
                	limit 1
                """;
        Object[] params = { cartItem.getPid(), cartItem.getSize(), cartItem.getId() };
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(CartItem.class), params);
    }

    @Override
    public int add(CartItem cartItem) {
        String sql = """
                insert into cart(size, qty, pid, id, cdate)
                    values(?, ?, ?, ?, now())                
                """;
        Object [] params = {
                cartItem.getSize(),
                cartItem.getQty(),
                cartItem.getPid(),
                cartItem.getId()
        };
        return jdbcTemplate.update(sql, params);
    }

    @Override
    public List<CartItem> findByUserId(String id) {
        String sql = """
                SELECT c.cid, c.size, c.qty, c.pid, c.id, c.cdate,
                       p.image, p.name, p.price
                FROM cart c
                INNER JOIN product p ON c.pid = p.pid
                WHERE c.id = ?
                ORDER BY c.cdate DESC
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(CartItem.class), id);
    }

    @Override
    public int remove(String cid) {
        String sql = "DELETE FROM cart WHERE cid = ?";
        return jdbcTemplate.update(sql, cid);
    }

    @Override
    public int countByUserId(String id) {
        String sql = "SELECT IFNULL(SUM(qty), 0) FROM cart WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, id);
    }
}
