import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Descriptions, Table, Typography, Button, Tag, Space, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { fetchOrderById } from '../store/slices/orderSlice';

const { Title } = Typography;

const statusColors = {
    pending: 'gold',
    confirmed: 'blue',
    completed: 'green'
};

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message } = App.useApp();
    const { selectedOrder: order, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const columns = [
        {
            title: 'Book',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price.toFixed(2)}`
        },
        {
            title: 'Subtotal',
            key: 'subtotal',
            render: (record) => `$${(record.price * record.quantity).toFixed(2)}`
        }
    ];

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/orders')}
            >
                Back to Orders
            </Button>

            <Card>
                <Title level={2}>Order Details #{order._id.slice(-6).toUpperCase()}</Title>

                <Descriptions column={2} bordered>
                    <Descriptions.Item label="Order Date">
                        {new Date(order.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={statusColors[order.status]}>
                            {order.status.toUpperCase()}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Items">
                        {order.items.length}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Amount">
                        ${order.total.toFixed(2)}
                    </Descriptions.Item>
                </Descriptions>

                <Title level={4} style={{ marginTop: 24 }}>Order Items</Title>
                <Table
                    columns={columns}
                    dataSource={order.items}
                    rowKey="bookId"
                    pagination={false}
                    summary={(pageData) => {
                        const total = pageData.reduce(
                            (sum, item) => sum + (item.price * item.quantity),
                            0
                        );

                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3}>
                                    <strong>Total</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <strong>${total.toFixed(2)}</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </Card>
        </Space>
    );
};

export default OrderDetail; 