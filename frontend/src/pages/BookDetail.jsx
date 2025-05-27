import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Button, InputNumber, Descriptions, App } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { fetchBookById } from '../store/slices/bookSlice';
import { addToCart } from '../store/slices/cartSlice';

const { Title } = Typography;

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { message } = App.useApp();
    const [quantity, setQuantity] = useState(1);
    const { selectedBook: book, loading, error } = useSelector((state) => state.books);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchBookById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const handleAddToCart = () => {
        if (!user) {
            message.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        dispatch(addToCart({
            userId: user.id,
            item: {
                bookId: book._id,
                title: book.title,
                price: book.price,
                quantity
            }
        })).then(() => {
            message.success('Added to cart successfully');
        }).catch((error) => {
            message.error('Failed to add to cart');
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!book) {
        return <div>Book not found</div>;
    }

    return (
        <Card>
            <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                    <img
                        src={`https://picsum.photos/seed/${book._id}/600/800`}
                        alt={book.title}
                        style={{ width: '100%', maxHeight: 600, objectFit: 'cover' }}
                    />
                </Col>
                <Col xs={24} md={12}>
                    <Title level={2}>{book.title}</Title>
                    <Descriptions column={1}>
                        <Descriptions.Item label="Author">{book.author}</Descriptions.Item>
                        <Descriptions.Item label="Category">{book.category}</Descriptions.Item>
                        <Descriptions.Item label="Price">${book.price.toFixed(2)}</Descriptions.Item>
                        <Descriptions.Item label="Stock">
                            <span style={{ color: book.stock > 0 ? 'green' : 'red' }}>
                                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>

                    <div style={{ marginTop: 20 }}>
                        <Title level={4}>Description</Title>
                        <p>{book.description}</p>
                    </div>

                    {book.stock > 0 && (
                        <div style={{ marginTop: 20 }}>
                            <Row gutter={16} align="middle">
                                <Col>
                                    <InputNumber
                                        min={1}
                                        max={book.stock}
                                        value={quantity}
                                        onChange={setQuantity}
                                    />
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        size="large"
                                    >
                                        Add to Cart
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default BookDetail; 