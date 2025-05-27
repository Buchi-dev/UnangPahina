import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookService } from '../../services/api';

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async (_, { rejectWithValue }) => {
        try {
            const response = await bookService.getAllBooks();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch books');
        }
    }
);

export const fetchBookById = createAsyncThunk(
    'books/fetchBookById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await bookService.getBook(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch book details');
        }
    }
);

export const searchBooks = createAsyncThunk(
    'books/searchBooks',
    async (query, { rejectWithValue }) => {
        try {
            const response = await bookService.searchBooks(query);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

const initialState = {
    books: [],
    selectedBook: null,
    loading: false,
    error: null,
    searchResults: []
};

const bookSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        clearSelectedBook: (state) => {
            state.selectedBook = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all books
            .addCase(fetchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch books';
            })
            // Fetch book by ID
            .addCase(fetchBookById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedBook = action.payload;
            })
            .addCase(fetchBookById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch book details';
            })
            // Search books
            .addCase(searchBooks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchBooks.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchBooks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Search failed';
            });
    }
});

export const { clearSelectedBook, clearSearchResults } = bookSlice.actions;
export default bookSlice.reducer;