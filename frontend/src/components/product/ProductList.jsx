import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductAvatar } from './ProductAvatar.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../feature/product/productAPI.js';

export function ProductList() {
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.product.productList);
    const [number, setNumber] = useState(3);

    useEffect(()=>{  
        dispatch(getProductList(number));
    }, [number]);   
    
    return (
        <div>
                {productList && productList.map((rowArray, idx) => 
                    <div className='product-list' key={idx} >
                        {rowArray && rowArray.map((product, idx) =>
                            <Link to={`/products/${product.pid}`} key={idx}>
                                <ProductAvatar img={product.image}  />
                            </Link>                          
                        )}
                    </div>
                 )}
        </div>
    );
}
