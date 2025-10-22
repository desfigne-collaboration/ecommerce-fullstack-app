import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout.jsx';
import { Products } from './pages/Products.jsx';
import { Home } from './pages/Home.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { ProductDetail } from './pages/ProductDetail.jsx';
import { Cart } from './pages/Cart.jsx';
import { CheckoutInfo } from './pages/CheckoutInfo.jsx';
import { Support } from './pages/Support.jsx';
import { ProtectedPageRoute } from './pages/ProtectedPageRoute.js';

import './styles/cgvSignup.css';
import './styles/cgv.css';
import './styles/commons.css';
import './styles/ecommerce.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home/>} />
          <Route path="/all" element={<Products/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/cart"
                  element={  <ProtectedPageRoute>
                                <Cart />
                            </ProtectedPageRoute>  } />
          <Route path="/products/:pid" element={<ProductDetail />} />
          <Route path="/checkout"
                 element={  <ProtectedPageRoute>
                                <CheckoutInfo />
                            </ProtectedPageRoute>  } />

          <Route path="/support" element={
            <ProtectedPageRoute>
              <Support />
            </ProtectedPageRoute>
            } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
