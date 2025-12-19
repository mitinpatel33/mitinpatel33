import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TableSortLabel,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../api/axios';
import BookForm from './BookForm';
import type { Book } from '../utils/types';

type Order = 'asc' | 'desc';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Book>('title');

  // Delete confirmation modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingBook, setDeletingBook] = useState<Book | undefined>(undefined);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await API.get<Book[]>('/books', {
        params: { search, sortField: orderBy, sortOrder: order },
      });
      setBooks(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, order, orderBy]);

  const handleSort = (property: keyof Book) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpenForm = (book?: Book) => {
    setEditingBook(book);
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);

  const handleBookAddedOrUpdated = () => {
    fetchBooks(); // refresh
    handleCloseForm();
  };

  // Open delete confirmation dialog
  const handleDeleteDialogOpen = (book: Book) => {
    setDeletingBook(book);
    setDeleteOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeletingBook(undefined);
    setDeleteOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingBook?._id) return;
    try {
      await API.delete(`/books/${deletingBook._id}`);
      fetchBooks();
    } catch (err) {
      console.error(err);
    } finally {
      handleDeleteDialogClose();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>Book List</Typography>

      <Button variant="contained" onClick={() => handleOpenForm()} sx={{ mb: 2 }}>
        Add Book
      </Button>
      <TextField
        placeholder="Search by Title or Author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, ml: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><TableSortLabel active={orderBy === 'title'} direction={order} onClick={() => handleSort('title')}>Title</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'author'} direction={order} onClick={() => handleSort('author')}>Author</TableSortLabel></TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.category || '-'}</TableCell>
                <TableCell>{book.publishedYear || '-'}</TableCell>
                <TableCell>{book.available ? 'Available' : 'Unavailable'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(book)}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteDialogOpen(book)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
            {books.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">{loading ? 'Loading...' : 'No books found'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Book Modal */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <BookForm book={editingBook} onAdded={handleBookAddedOrUpdated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deletingBook?.title}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>No</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookList;
