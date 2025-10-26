import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import axios from 'axios';
import './CategoryPages.css';
import './ShopPages.css';
import API_BASE_URL from '../config/api';

const ProductsPage = ({ onBack, onAddToCart, cartCount = 0 }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('${API_BASE_URL}/products');
            // Get all products - use database imageUrl as-is
            setAllProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const addToCart = (product) => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    const goBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl font-semibold text-slate-700">Loading products...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Left: Back Button + Logo */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={goBack}
                                className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back</span>
                            </button>
                            <div className="h-8 w-px bg-slate-300"></div>
                            <div className="flex flex-col">
                                <div className="text-3xl font-bold text-[#25378C] tracking-wide">
                                    Kodikara
                                </div>
                                <div className="text-xs font-semibold text-[#25378C] tracking-[0.2em] -mt-1">
                                    ENTERPRISES
                                </div>
                            </div>
                        </div>

                        {/* Right: Cart */}
                        <div className="flex items-center">
                            <div className="relative">
                                <ShoppingCart className="w-6 h-6 text-slate-700 hover:text-blue-600 cursor-pointer transition-colors" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Header */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                        All Products
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto">
                        Explore our complete collection of premium bathware products across all categories
                    </p>
                </div>
            </section>

            {/* Products Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allProducts.map(product => (
                            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative overflow-hidden aspect-square">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {product.discountPercentage && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                            -{product.discountPercentage}%
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-slate-700">
                                        {product.category}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center mb-3">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-slate-500 ml-1">({product.reviewCount})</span>
                                    </div>
                                    <div className="flex flex-col space-y-1 mb-4">
                                        <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="text-sm text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-[#25378C] to-blue-800 text-white py-8 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="flex flex-col items-center mb-4">
                        <div className="text-2xl font-bold text-white tracking-wide">
                            Kodikara
                        </div>
                        <div className="text-xs font-semibold text-blue-200 tracking-[0.2em]">
                            ENTERPRISES
                        </div>
                    </div>
                    <p className="text-blue-200 mb-4">Your trusted partner for premium bathware solutions</p>
                    <p className="text-blue-300 text-sm">&copy; 2025 Kodikara Enterprises. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProductsPage;

