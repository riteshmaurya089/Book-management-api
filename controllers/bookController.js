const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const newBook = new Book({ title, author, publishedYear, genre });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Retrieve all books with pagination and filtering
exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, publishedYear, genre } = req.query;
    const query = {};
    if (publishedYear) query.publishedYear = publishedYear;
    if (genre) query.genre = genre;

    const books = await Book.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Book.countDocuments(query);

    res.status(200).json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Retrieve a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const { title, author, publishedYear, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishedYear, genre },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
