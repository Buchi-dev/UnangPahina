import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider, Layout, App as AntdApp } from 'antd';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import PrivateRoute from './components/PrivateRoute';

const { Content, Footer } = Layout;

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 6,
  },
};

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <AntdApp>
          <Router>
            <Layout className="min-h-screen">
              <Navbar />
              <Content className="p-6">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route
                    path="/cart"
                    element={
                      <PrivateRoute>
                        <Cart />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PrivateRoute>
                        <Orders />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/orders/:id"
                    element={
                      <PrivateRoute>
                        <OrderDetail />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                UnangPahina ©{new Date().getFullYear()} Created with Ant Design
              </Footer>
            </Layout>
          </Router>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  );
}

export default App;
