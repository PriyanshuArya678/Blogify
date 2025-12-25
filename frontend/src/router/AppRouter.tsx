import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CreateBlog from '../pages/CreateBlog';
import BlogDetail from '../pages/BlogDetail';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="create"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route path="blogs/:id" element={<BlogDetail />} />
        <Route path="profile/:id" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

