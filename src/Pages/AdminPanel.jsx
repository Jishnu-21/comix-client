// src/Pages/AdminPanel.jsx

import React, { useState } from "react";
import { 
  BarChart, Users, Package, Grid, Image, Tag, LogOut, 
  ShoppingCart, Menu, X, ChevronRight, Droplet 
} from "lucide-react";
import "../Assets/Css/Admin/AdminPanel.scss";
import DashboardContent from '../Components/Admin/DashboardContent';
import UsersContent from '../Components/Admin/UsersContent';
import OrderContent from '../Components/Admin/OrderContent';
import ProductsContent from '../Components/Admin/ProductsContent';
import CategoriesContent from '../Components/Admin/CategoriesContent';
import BannerContent from '../Components/Admin/BannerContent';
import OffersContent from "../Components/Admin/OffersContent";
import HeroIngredientsList from "../Components/Admin/HeroIngredients/HeroIngredientsList";
import EditProductForm from "../Components/Admin/EditProductForm";
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authActions';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [currentSection, setCurrentSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sidebarItems = [
    { id: "dashboard", name: "Dashboard", icon: BarChart },
    { id: "users", name: "Users", icon: Users },
    { id: "products", name: "Products", icon: Package },
    { id: "categories", name: "Categories", icon: Grid },
    { id: "banner", name: "Banner", icon: Image },
    { id: "orders", name: "Orders", icon: ShoppingCart },
    { id: "offers", name: "Offers", icon: Tag },
    { id: "hero-ingredients", name: "Hero Ingredients", icon: Droplet },
  ];

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      // Your update logic here
      handleCloseModal();
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };
  
  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardContent />;
      case "users":
        return <UsersContent />;
      case "products":
        return <ProductsContent onEditProduct={handleEditProduct} />;
      case "categories":
        return <CategoriesContent />;
      case "banner":
        return <BannerContent />;
      case "orders":
        return <OrderContent />;
      case "offers":
        return <OffersContent />;
      case "hero-ingredients":
        return <HeroIngredientsList />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="admin-panel">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="menu-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <h1>Admin Panel</h1>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentSection === item.id ? "active" : ""}`}
              onClick={() => {
                setCurrentSection(item.id);
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${isSidebarOpen ? '' : 'expanded'}`}>
        <div className="content-body">
          {renderContent()}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={24} />
            </button>
            <EditProductForm
              product={selectedProduct}
              onUpdate={handleUpdateProduct}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}