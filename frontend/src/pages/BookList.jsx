import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Input, Space, App, Empty, Spin } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { fetchBooks, searchBooks } from '../store/slices/bookSlice';
import { addToCart } from '../store/slices/cartSlice';

const { Meta } = Card;
const { Search } = Input;

const BookList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const { books, loading, error, searchResults } = useSelector((state) => state.books);
    const { user } = useSelector((state) => state.auth);
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchBooks());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
        }
    }, [error, message]);

    const handleAddToCart = (book) => {
        if (!user) {
            message.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }

        dispatch(addToCart({
            userId: user._id,
            item: {
                bookId: book._id,
                title: book.title,
                price: book.price,
                quantity: 1
            }
        })).then(() => {
            message.success('Added to cart successfully');
        }).catch((error) => {
            message.error('Failed to add item to cart');
        });
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        setIsSearching(true);
        
        if (value) {
            dispatch(searchBooks(value))
                .unwrap()
                .then(() => {
                    // Search completed successfully
                    setIsSearching(false);
                })
                .catch((error) => {
                    message.error('Search failed. Please try again.');
                    setIsSearching(false);
                    // Fall back to all books on error
                    dispatch(fetchBooks());
                });
        } else {
            // If search query is empty, show all books
            dispatch(fetchBooks());
            setIsSearching(false);
        }
    };

    // Determine which books to display - search results or all books
    const displayBooks = searchQuery && searchResults.length > 0 ? searchResults : books;

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h1>UnangPahina Bookstore</h1>
                    <p>Find your next favorite book</p>
                </div>

                <Search
                    placeholder="Search books by title, author, or category..."
                    enterButton={<SearchOutlined />}
                    size="large"
                    onSearch={handleSearch}
                    loading={loading}
                    style={{ maxWidth: 600, margin: '0 auto', display: 'block' }}
                    allowClear
                />

                {isSearching && <Spin style={{ display: 'block', margin: '20px auto' }}><div className="ant-spin-text">Searching...</div></Spin>}
                
                {searchQuery && searchResults.length > 0 && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <p>Found {searchResults.length} results for "{searchQuery}"</p>
                    </div>
                )}
                
                {searchQuery && searchResults.length === 0 && !isSearching && !loading && (
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <p>No results found for "{searchQuery}". Showing all books instead.</p>
                    </div>
                )}

                <Row gutter={[16, 16]}>
                    {displayBooks.length > 0 ? (
                        displayBooks.map((book) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={book._id}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            alt={book.title}
                                            src={`https://picsum.photos/seed/${book._id}/300/400`}
                                            style={{ height: 300, objectFit: 'cover' }}
                                        />
                                    }
                                    actions={[
                                        <Button 
                                            type="link" 
                                            onClick={() => navigate(`/books/${book._id}`)}
                                        >
                                            View Details
                                        </Button>,
                                        <Button
                                            type="primary"
                                            icon={<ShoppingCartOutlined />}
                                            onClick={() => handleAddToCart(book)}
                                            disabled={book.stock === 0}
                                        >
                                            Add to Cart
                                        </Button>
                                    ]}
                                >
                                    <Meta
                                        title={book.title}
                                        description={
                                            <>
                                                <p>{book.author}</p>
                                                <p style={{ color: '#1890ff', fontWeight: 'bold' }}>
                                                    ${book.price.toFixed(2)}
                                                </p>
                                                <p style={{ color: book.stock > 0 ? 'green' : 'red' }}>
                                                    {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                                                </p>
                                            </>
                                        }
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Empty description="No books found" />
                        </Col>
                    )}
                </Row>
            </Space>
        </div>
    );
};

export default BookList;