import React, { useState, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, ProductVariant } from '../../types';
import { StorageService } from '../../services/storageService';
import { ApiService } from '../../services/apiService';
import { formatCurrency } from '../../utils/format';
import {
  Plus,
  Edit2,
  Trash2,
  Layers,
  Search,
  Check,
  X,
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
  Package,
  Upload,
  Loader2,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, refreshData, showToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);
  
  // Product Edit / Create Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variant Edit / Create State
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [variantForm, setVariantForm] = useState<Partial<ProductVariant>>({
    sku: '',
    size: '41',
    color: 'Trắng/Đen',
    colorHex: '#FFFFFF',
    price: 3500000,
    stockQuantity: 10,
    reservedQuantity: 0,
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open Create Product Modal
  const handleOpenCreateProduct = () => {
    setEditingProduct({
      id: `sp-${Date.now()}`,
      name: '',
      slug: '',
      brandId: 'b-nike',
      brandName: 'Nike',
      categoryId: 'cat-lifestyle',
      categoryName: 'Lifestyle',
      gender: 'Unisex',
      originalPrice: 3500000,
      salePrice: undefined,
      description: 'Giày sneaker chính hãng cao cấp với độ hoàn thiện tinh xảo.',
      mainImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
      ],
      rating: 5.0,
      reviewCount: 1,
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      isFeatured: true,
      isNew: true,
      isSale: false,
      variants: [
        {
          id: `var-${Date.now()}-1`,
          sku: `SKU-V1-${Date.now()}`,
          productId: `sp-${Date.now()}`,
          size: '41',
          color: 'Trắng/Đen',
          colorHex: '#FFFFFF',
          price: 3500000,
          stockQuantity: 10,
          reservedQuantity: 0,
        },
      ],
      createdAt: new Date().toISOString(),
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  // Handle Image Upload from local computer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const res = await ApiService.uploadImage(file);
      if (res.success && res.url) {
        setEditingProduct(prev => prev ? { ...prev, mainImage: res.url, galleryImages: [res.url, ...(prev.galleryImages || [])] } : null);
        showToast('Tải ảnh từ máy tính lên thành công!', 'success');
      } else {
        showToast(res.error || 'Không thể tải ảnh lên', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi tải ảnh', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    const slug = editingProduct.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const finalProd: Product = {
      ...editingProduct,
      slug: editingProduct.slug || slug,
      variants: editingProduct.variants || [],
    } as Product;

    // 1. Save to LocalStorage
    StorageService.saveProduct(finalProd);

    // 2. Sync to MySQL Backend if online
    ApiService.saveProduct(finalProd).catch(() => {});

    refreshData();
    setIsProductModalOpen(false);
    showToast('Đã lưu thông tin sản phẩm vào cơ sở dữ liệu thành công!', 'success');
  };

  // Delete Product
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu?')) {
      StorageService.deleteProduct(productId);
      refreshData();
      showToast('Đã xóa sản phẩm thành công!', 'info');
    }
  };

  // Manage Variants Modal
  const handleOpenVariantsModal = (prod: Product) => {
    setSelectedProductForVariants(prod);
    setIsVariantModalOpen(true);
  };

  // Add Variant
  const handleAddVariant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForVariants) return;

    const newVar: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: variantForm.sku || `SKU-${selectedProductForVariants.brandName.toUpperCase()}-${variantForm.size}-${Date.now().toString().slice(-4)}`,
      productId: selectedProductForVariants.id,
      size: variantForm.size || '41',
      color: variantForm.color || 'Trắng/Đen',
      colorHex: variantForm.colorHex || '#FFFFFF',
      price: Number(variantForm.price) || selectedProductForVariants.originalPrice,
      salePrice: variantForm.salePrice ? Number(variantForm.salePrice) : undefined,
      stockQuantity: Number(variantForm.stockQuantity) || 10,
      reservedQuantity: 0,
      soldQuantity: 0,
    };

    const updatedProd: Product = {
      ...selectedProductForVariants,
      variants: [...selectedProductForVariants.variants, newVar],
    };

    StorageService.saveProduct(updatedProd);
    setSelectedProductForVariants(updatedProd);
    refreshData();
    showToast('Đã thêm biến thể size & màu thành công!', 'success');
  };

  // Delete Variant
  const handleDeleteVariant = (variantId: string) => {
    if (!selectedProductForVariants) return;

    const updatedVariants = selectedProductForVariants.variants.filter(v => v.id !== variantId);
    if (updatedVariants.length === 0) {
      showToast('Sản phẩm phải có ít nhất 1 biến thể tồn kho!', 'error');
      return;
    }

    const updatedProd: Product = {
      ...selectedProductForVariants,
      variants: updatedVariants,
    };

    StorageService.saveProduct(updatedProd);
    setSelectedProductForVariants(updatedProd);
    refreshData();
    showToast('Đã xóa biến thể thành công!', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Space_Grotesk']">
            QUẢN LÝ SẢN PHẨM & TỒN KHO
          </h2>
          <p className="text-xs text-slate-400">Danh mục sản phẩm, biến thể size, màu sắc và mức tồn kho thực tế</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, hãng, SKU..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <button
            id="admin-add-product-btn"
            onClick={handleOpenCreateProduct}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-sky-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-900/40">
                <th className="py-3.5 px-4">Sản Phẩm</th>
                <th className="py-3.5 px-4">Thương Hiệu / Phân Loại</th>
                <th className="py-3.5 px-4">SKU Chuẩn</th>
                <th className="py-3.5 px-4">Giá Bán</th>
                <th className="py-3.5 px-4 text-center">Biến Thể (Size/Màu)</th>
                <th className="py-3.5 px-4 text-center">Tổng Tồn Kho</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {filteredProducts.map(product => {
                const totalStock = product.variants.reduce((acc, v) => acc + (v.stockQuantity - v.reservedQuantity), 0);
                const hasLowStock = product.variants.some(v => (v.stockQuantity - v.reservedQuantity) <= 3);

                return (
                  <tr key={product.id} className="hover:bg-slate-900/50 transition-colors">
                    
                    {/* Product image & name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 bg-slate-900 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-white truncate">{product.name}</div>
                          <div className="text-[11px] text-slate-500">{product.gender} • {product.categoryName}</div>
                        </div>
                      </div>
                    </td>

                    {/* Brand & badges */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{product.brandName}</div>
                      <div className="flex gap-1 mt-0.5">
                        {product.isFeatured && <span className="px-1.5 py-0.2 rounded text-[9px] bg-sky-950 text-sky-400 border border-sky-800">Hot</span>}
                        {product.isNew && <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800">New</span>}
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{product.sku}</td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-emerald-400">
                        {formatCurrency(product.salePrice || product.originalPrice)}
                      </div>
                      {product.salePrice && (
                        <div className="text-[10px] text-slate-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </div>
                      )}
                    </td>

                    {/* Variants badge & button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenVariantsModal(product)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{product.variants.length} Size / Màu</span>
                      </button>
                    </td>

                    {/* Total Stock */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md font-mono font-bold text-xs ${
                        totalStock <= 5
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-slate-900 text-slate-200 border border-slate-800'
                      }`}>
                        {totalStock} đôi
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditProduct(product)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-extrabold text-base text-white font-['Space_Grotesk']">
                {editingProduct.id ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Tên Giày Sneaker *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Thương Hiệu *</label>
                  <select
                    value={editingProduct.brandName || 'Nike'}
                    onChange={e => setEditingProduct({ ...editingProduct, brandName: e.target.value, brandId: `b-${e.target.value.toLowerCase()}` })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Jordan">Jordan</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Puma">Puma</option>
                    <option value="Asics">Asics</option>
                    <option value="Vans">Vans</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Phân Loại Giới Tính *</label>
                  <select
                    value={editingProduct.gender || 'Unisex'}
                    onChange={e => setEditingProduct({ ...editingProduct, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giá Gốc (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Giá Khuyến Mãi (Nếu có)</label>
                  <input
                    type="number"
                    value={editingProduct.salePrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="Để trống nếu không giảm"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Image Picker Section with Local File Upload */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block font-bold text-slate-300">Ảnh Bìa Đại Diện (Main Image) *</label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    {/* Thumbnail Preview */}
                    <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                      {editingProduct.mainImage ? (
                        <img
                          src={editingProduct.mainImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-600" />
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />

                      <div className="flex gap-2">
                        {/* Choose from Computer button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingImage}
                          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md transition-all shrink-0"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang Tải Lên...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>Chọn Ảnh Từ Máy Tính</span>
                            </>
                          )}
                        </button>

                        {/* URL input */}
                        <input
                          type="text"
                          required
                          placeholder="Hoặc dán link URL ảnh..."
                          value={editingProduct.mainImage || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                          className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-xs"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        💡 Bạn có thể bấm nút màu xanh để chọn ảnh trực tiếp từ ổ cứng máy tính hoặc dán link ảnh trực tiếp.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Mô Tả Sản Phẩm</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold rounded-xl shadow-lg"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: MANAGE VARIANTS & SIZES */}
      {isVariantModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 text-xs text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-base text-white font-['Space_Grotesk']">
                  Quản Lý Biến Thể Tồn Kho: {selectedProductForVariants.name}
                </h3>
                <p className="text-[11px] text-slate-400">Kiểm soát từng size và màu sắc riêng biệt</p>
              </div>
              <button onClick={() => setIsVariantModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Variants Table */}
            <div className="space-y-2">
              <div className="font-bold text-slate-300 uppercase tracking-wider">Danh Sách Biến Thể Hiện Có:</div>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Màu Sắc</th>
                      <th className="py-2.5 px-3">Mã SKU</th>
                      <th className="py-2.5 px-3">Tồn Kho Khả Dụng</th>
                      <th className="py-2.5 px-3 text-right">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {selectedProductForVariants.variants.map(v => (
                      <tr key={v.id}>
                        <td className="py-2.5 px-3 font-bold text-white">Size {v.size}</td>
                        <td className="py-2.5 px-3 flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: v.colorHex }} />
                          <span>{v.color}</span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-400">{v.sku}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">
                          {v.stockQuantity - v.reservedQuantity} đôi (Tổng: {v.stockQuantity})
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteVariant(v.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Variant Form */}
            <form onSubmit={handleAddVariant} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
              <div className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Thêm Biến Thể Size/Màu Mới Vào Kho</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Size EU *</label>
                  <select
                    value={variantForm.size}
                    onChange={e => setVariantForm({ ...variantForm, size: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    {['36', '36.5', '37.5', '38', '38.5', '39', '40', '40.5', '41', '42', '42.5', '43', '44', '44.5', '45'].map(s => (
                      <option key={s} value={s}>Size {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Tên Phối Màu *</label>
                  <input
                    type="text"
                    required
                    value={variantForm.color}
                    onChange={e => setVariantForm({ ...variantForm, color: e.target.value })}
                    placeholder="Trắng/Đen"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Mã Màu Hex</label>
                  <input
                    type="text"
                    value={variantForm.colorHex}
                    onChange={e => setVariantForm({ ...variantForm, colorHex: e.target.value })}
                    placeholder="#FFFFFF"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Số Lượng Nhập Kho *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={variantForm.stockQuantity}
                    onChange={e => setVariantForm({ ...variantForm, stockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 text-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Xác Nhận Thêm Biến Thể</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
