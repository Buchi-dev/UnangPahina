import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Row, Col, Card, Space } from 'antd';
import { ShoppingCartOutlined, BookOutlined } from '@ant-design/icons';
import { fetchBooks } from '../store/slices/bookSlice';

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { books, loading } = useSelector((state) => state.books);

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    const featuredBooks = books.slice(0, 4);

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Hero Section */}
            <div style={{ 
                textAlign: 'center',
                padding: '60px 20px',
                background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
                borderRadius: '8px',
                color: 'white'
            }}>
                <Title style={{ color: 'white', marginBottom: 24 }}>
                    Welcome to UnangPahina
                </Title>
                <Paragraph style={{ color: 'white', fontSize: '18px', marginBottom: 32 }}>
                    Discover your next favorite book from our extensive collection
                </Paragraph>
                <Space>
                    <Button 
                        type="primary" 
                        size="large"
                        icon={<BookOutlined />}
                        onClick={() => navigate('/books')}
                        ghost
                    >
                        Browse Books
                    </Button>
                    <Button 
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => navigate('/cart')}
                    >
                        View Cart
                    </Button>
                </Space>
            </div>

            {/* Featured Books Section */}
            <div>
                <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
                    Featured Books
                </Title>
                <Row gutter={[16, 16]}>
                    {featuredBooks.map((book) => (
                        <Col xs={24} sm={12} md={6} key={book._id}>
                            <Card
                                hoverable
                                cover={
                                    <img
                                        alt={book.title}
                                        src={`https://picsum.photos/seed/${book._id}/300/400`}
                                        style={{ height: 300, objectFit: 'cover' }}
                                    />
                                }
                                onClick={() => navigate(`/books/${book._id}`)}
                            >
                                <Meta
                                    title={book.title}
                                    description={
                                        <>
                                            <p>{book.author}</p>
                                            <p style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                                ${book.price.toFixed(2)}
                                            </p>
                                        </>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Button 
                        type="primary" 
                        size="large"
                        onClick={() => navigate('/books')}
                    >
                        View All Books
                    </Button>
                </div>
            </div>
        </Space>
    );
};

export default Home; 