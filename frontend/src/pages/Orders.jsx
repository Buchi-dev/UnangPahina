import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Card, Typography, Tag, Space, Button, App } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { fetchUserOrders } from '../store/slices/orderSlice';

const { Title } = Typography;

const statusColors = {
    pending: 'gold',
    confirmed: 'blue',
    completed: 'green'
};

const Orders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { orders, loading, error } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserOrders(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const columns = [
        {
            title: 'Order ID',
            key: 'orderId',
            render: (record) => `#${record._id.slice(-6).toUpperCase()}`
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Items',
            key: 'items',
            render: (record) => record.items.length
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (total) => `$${total.toFixed(2)}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/orders/${record._id}`)}
                >
                    View Details
                </Button>
            )
        }
    ];

    return (
        <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2}>My Orders</Title>
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter']
                    }}
                />
            </Space>
        </Card>
    );
};

export default Orders; 