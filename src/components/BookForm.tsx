import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import API from '../api/axios';
import type { Book } from '../utils/types';

interface Props {
  book?: Book;
  onAdded?: () => void;
}

const BookForm: React.FC<Props> = ({ book, onAdded }) => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    publishedYear: '',
    available: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        description: book.description || '',
        category: book.category || '',
        publishedYear: book.publishedYear?.toString() || '',
        available: book.available ?? true,
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (book?._id) {
        await API.put(`/books/${book._id}`, { ...form, publishedYear: Number(form.publishedYear) });
      } else {
        await API.post('/books', { ...form, publishedYear: Number(form.publishedYear) });
      }
      if (onAdded) onAdded();
      setForm({ title: '', author: '', description: '', category: '', publishedYear: '', available: true });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField fullWidth label="Title" name="title" margin="normal" value={form.title} onChange={handleChange} />
      <TextField fullWidth label="Author" name="author" margin="normal" value={form.author} onChange={handleChange} />
      <TextField fullWidth label="Description" name="description" margin="normal" value={form.description} onChange={handleChange} />
      <TextField fullWidth label="Category" name="category" margin="normal" value={form.category} onChange={handleChange} />
      <TextField fullWidth label="Published Year" name="publishedYear" type="number" margin="normal" value={form.publishedYear} onChange={handleChange} />
      {error && <Typography color="error" mt={1}>{error}</Typography>}
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>{book ? 'Update Book' : 'Add Book'}</Button>
    </Box>
  );
};

export default BookForm;
