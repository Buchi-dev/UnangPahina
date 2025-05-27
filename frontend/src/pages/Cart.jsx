import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Button, InputNumber, Card, Typography, Space, Empty, App } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { fetchCart, updateCartItem, removeFromCart, checkoutCart } from '../store/slices/cartSlice';

const { Title } = Typography;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { items, total, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const handleUpdateQuantity = (bookId, quantity) => {
        dispatch(updateCartItem({ userId: user._id, bookId, quantity }));
    };

    const handleRemoveItem = (bookId) => {
        dispatch(removeFromCart({ userId: user._id, bookId }));
    };

    const handleCheckout = () => {
        dispatch(checkoutCart(user._id)).then(() => {
            message.success('Order placed successfully!');
            navigate('/orders');
        }).catch((error) => {
            message.error('Failed to place order: ' + (error.message || 'Connection error'));
        });
    };

    const columns = [
        {
            title: 'Book',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price.toFixed(2)}`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleUpdateQuantity(record.bookId, value)}
                />
            ),
        },
        {
            title: 'Subtotal',
            key: 'subtotal',
            render: (record) => `$${(record.price * record.quantity).toFixed(2)}`,
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveItem(record.bookId)}
                />
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <Title level={2}>Shopping Cart</Title>

            {items.length === 0 ? (
                <Empty
                    description="Your cart is empty"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                    <Button type="primary" onClick={() => navigate('/books')}>
                        Continue Shopping
                    </Button>
                </Empty>
            ) : (
                <>
                    <Table
                        columns={columns}
                        dataSource={items}
                        rowKey="bookId"
                        pagination={false}
                    />

                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space direction="vertical" align="end" size="large">
                            <Title level={3}>Total: ${total.toFixed(2)}</Title>
                            <Space>
                                <Button onClick={() => navigate('/books')}>
                                    Continue Shopping
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<ShoppingOutlined />}
                                    onClick={handleCheckout}
                                    loading={loading}
                                >
                                    Checkout
                                </Button>
                            </Space>
                        </Space>
                    </div>
                </>
            )}
        </Card>
    );
};

export default Cart; 