export interface Book {
  _id?: string; // optional for new books
  title: string;
  author: string;
  description?: string;
  category?: string;
  publishedYear?: number;
  available?: boolean;
}
