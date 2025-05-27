import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Badge, Avatar, Button } from 'antd';
import { 
    ShoppingCartOutlined, 
    UserOutlined, 
    BookOutlined,
    ShoppingOutlined,
    LoginOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { logout } from '../store/slices/authSlice';

const { Header } = Layout;

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        {
            key: 'books',
            icon: <BookOutlined />,
            label: <Link to="/books">Books</Link>,
        }
    ];

    if (isAuthenticated) {
        menuItems.push(
            {
                key: 'cart',
                icon: (
                    <Badge count={items.length} size="small">
                        <ShoppingCartOutlined style={{ fontSize: '18px' }} />
                    </Badge>
                ),
                label: <Link to="/cart">Cart</Link>,
            },
            {
                key: 'orders',
                icon: <ShoppingOutlined />,
                label: <Link to="/orders">Orders</Link>,
            },
            {
                key: 'profile',
                icon: <Avatar size="small" icon={<UserOutlined />} />,
                label: <Link to="/profile">Profile</Link>,
            },
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: handleLogout,
            }
        );
    } else {
        menuItems.push(
            {
                key: 'login',
                icon: <LoginOutlined />,
                label: <Link to="/login">Login</Link>,
            }
        );
    }

    return (
        <Header style={{ display: 'flex', alignItems: 'center', padding: '0 20px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ fontSize: '24px', color: '#fff', marginRight: '10px' }} />
                <h1 style={{ color: '#fff', margin: 0 }}>UnangPahina</h1>
            </Link>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[]}
                items={menuItems}
                style={{ marginLeft: 'auto', minWidth: '400px' }}
            />
        </Header>
    );
};

export default Navbar; 