import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Users, Calendar, ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Card from '../components/UI/Card';

const Home: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Online Catalog',
      description: 'Search our vast collection of books, journals, and digital resources from anywhere.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Member Services',
      description: 'Easy registration and management of your library account and borrowing history.',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Easy Borrowing',
      description: 'Borrow books online and pick them up at your convenience.',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Digital Resources',
      description: 'Access e-books, journals, and databases remotely.',
    },
  ];

  const stats = [
    { label: 'Books & Resources', value: '50,000+' },
    { label: 'Active Members', value: '5,000+' },
    { label: 'Books Borrowed Monthly', value: '10,000+' },
    { label: 'Digital Resources', value: '15,000+' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Welcome to LibraryHub
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Your gateway to knowledge. Discover, learn, and grow with our vast collection of resources.
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-full p-2 flex items-center shadow-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN, or subject..."
                className="flex-1 px-4 py-3 outline-none text-gray-700 text-lg"
              />
              <Link
                to="/catalog"
                className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Search
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Link to="/catalog" className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full backdrop-blur-sm transition-colors">
              Browse Catalog
            </Link>
            <Link to="/register" className="bg-secondary hover:bg-secondary-light text-white px-6 py-2 rounded-full transition-colors">
              Become a Member
            </Link>
            <Link to="/services" className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full backdrop-blur-sm transition-colors">
              View Services
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        >
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive range of library services to support your learning and research needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-12 text-center text-white">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Start Your Learning Journey Today
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of members who have access to our extensive collection of resources.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-secondary hover:bg-secondary-light text-white px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center"
              >
                Register Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/catalog"
                className="bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-primary mb-6">Opening Hours</h2>
              <div className="space-y4">
                {[
                  { day: 'Monday - Friday', time: '8:00 AM - 10:00 PM' },
                  { day: 'Saturday', time: '9:00 AM - 8:00 PM' },
                  { day: 'Sunday', time: '10:00 AM - 6:00 PM' },
                  { day: 'Holidays', time: 'Closed' },
                ].map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-700">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-3xl font-bold text-primary mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">LibraryHub Main Building</p>
                    <p className="text-gray-600">123 Library Avenue, Knowledge City</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <p className="font-semibold text-gray-700">Reference Desk</p>
                    <p className="text-gray-600">reference@libraryhub.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
