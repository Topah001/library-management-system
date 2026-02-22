import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, BookOpen, User, Calendar } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { bookService } from '../services/bookService';
import { Book } from '../types';

const Catalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: books, isLoading } = useQuery({
    queryKey: ['books', searchQuery, category],
    queryFn: () => bookService.getAll({ 
      query: searchQuery, 
      category: category || undefined 
    }),
  });

  const categories = [
    'All Categories',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
    'History',
    'Philosophy',
    'Economics',
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-24 pb-8 bg-primary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="font-heading text-4xl font-bold mb-4">
              Online Public Access Catalogue
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Search our collection of books, journals, and digital resources
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-full p-2 flex items-center shadow-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 outline-none text-gray-700 text-lg"
              />
              <Button className="rounded-full px-8">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat === 'All Categories' ? '' : cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 skeleton h-80"></div>
              ))}
            </div>
          ) : books && books.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {books.map((book: Book, index: number) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="overflow-hidden h-full">
                      <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-semibold text-lg text-primary mb-1 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{book.category}</span>
                          <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-20 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-8 h-8 text-primary/30" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-lg text-primary">
                            {book.title}
                          </h3>
                          <p className="text-gray-600">{book.author}</p>
                          <p className="text-sm text-gray-500 mt-1">{book.category} | ISBN: {book.ISBN}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-500">{book.publisher}, {book.publishYear}</span>
                            <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Not available'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No books found matching your search</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Catalog;
