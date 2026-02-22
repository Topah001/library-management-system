import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowLeftRight, 
  Settings,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../components/UI/Card';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Books', active: false },
    { icon: <Users className="w-5 h-5" />, label: 'Members', active: false },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: 'Circulation', active: false },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', active: false },
  ];

  const stats = [
    { label: 'Total Books', value: '12,450', icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-500' },
    { label: 'Total Members', value: '3,280', icon: <Users className="w-6 h-6" />, color: 'bg-green-500' },
    { label: 'Currently Borrowed', value: '1,240', icon: <ArrowLeftRight className="w-6 h-6" />, color: 'bg-yellow-500' },
    { label: 'Overdue Books', value: '85', icon: <AlertCircle className="w-6 h-6" />, color: 'bg-red-500' },
  ];

  const recentActivity = [
    { type: 'borrow', book: 'Introduction to Algorithms', user: 'John Doe', time: '2 mins ago' },
    { type: 'return', book: 'Clean Code', user: 'Jane Smith', time: '15 mins ago' },
    { type: 'renew', book: 'Design Patterns', user: 'Mike Johnson', time: '1 hour ago' },
    { type: 'borrow', book: 'The Pragmatic Programmer', user: 'Sarah Wilson', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-primary transition-transform ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              {sidebarOpen && (
                <span className="font-heading text-xl font-bold text-white">LibraryHub</span>
              )}
            </Link>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/70 hover:text-white">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-3 py-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-secondary text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-white font-semibold text-sm">{user?.name || 'Admin'}</p>
                  <p className="text-white/60 text-xs">Administrator</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <h1 className="font-heading text-2xl font-bold text-primary">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome back, {user?.name || 'Admin'}</span>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-primary mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                      {stat.icon}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'borrow' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'return' ? 'bg-green-100 text-green-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {activity.type === 'borrow' ? <TrendingUp className="w-5 h-5" /> :
                       activity.type === 'return' ? <CheckCircle className="w-5 h-5" /> :
                       <Clock className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{activity.book}</p>
                      <p className="text-gray-500 text-sm">Borrowed by {activity.user}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="font-heading text-xl font-bold text-primary mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-primary/10 rounded-lg text-primary hover:bg-primary hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Add Book</span>
                </button>
                <button className="p-4 bg-green-100 rounded-lg text-green-600 hover:bg-green-600 hover:text-white transition-colors">
                  <Users className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Add Member</span>
                </button>
                <button className="p-4 bg-yellow-100 rounded-lg text-yellow-600 hover:bg-yellow-600 hover:text-white transition-colors">
                  <ArrowLeftRight className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">Issue Book</span>
                </button>
                <button className="p-4 bg-red-100 rounded-lg text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <span className="font-semibold">View Overdue</span>
                </button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
