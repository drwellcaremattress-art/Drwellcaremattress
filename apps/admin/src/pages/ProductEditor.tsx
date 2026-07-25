import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Plus, Save, Trash2, Copy } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const STANDARD_SIZES = [
  // Single
  { category: 'Single', dim: '72" × 30"', sqft: 15.00, thickness: '6 Inch' },
  { category: 'Single', dim: '75" × 30"', sqft: 15.63, thickness: '6 Inch' },
  { category: 'Single', dim: '72" × 36"', sqft: 18.00, thickness: '6 Inch' },
  { category: 'Single', dim: '75" × 36"', sqft: 18.75, thickness: '6 Inch' },
  { category: 'Single', dim: '78" × 36"', sqft: 19.50, thickness: '6 Inch' },
  // Double
  { category: 'Double', dim: '72" × 48"', sqft: 24.00, thickness: '6 Inch' },
  { category: 'Double', dim: '75" × 48"', sqft: 25.00, thickness: '6 Inch' },
  { category: 'Double', dim: '78" × 48"', sqft: 26.00, thickness: '6 Inch' },
  { category: 'Double', dim: '84" × 48"', sqft: 28.00, thickness: '6 Inch' },
  // Queen
  { category: 'Queen', dim: '72" × 60"', sqft: 30.00, thickness: '6 Inch' },
  { category: 'Queen', dim: '75" × 60"', sqft: 31.25, thickness: '6 Inch' },
  { category: 'Queen', dim: '78" × 60"', sqft: 32.50, thickness: '6 Inch' },
  { category: 'Queen', dim: '84" × 60"', sqft: 35.00, thickness: '6 Inch' },
  // King
  { category: 'King', dim: '72" × 72"', sqft: 36.00, thickness: '6 Inch' },
  { category: 'King', dim: '75" × 72"', sqft: 37.50, thickness: '6 Inch' },
  { category: 'King', dim: '78" × 72"', sqft: 39.00, thickness: '6 Inch' },
  { category: 'King', dim: '84" × 72"', sqft: 42.00, thickness: '6 Inch' },
];

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Orthopaedic');
  const [firmness, setFirmness] = useState('Orthopaedic Firm');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Draft');
  const [benefits, setBenefits] = useState('');

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  
  const [basePricePerSqFt, setBasePricePerSqFt] = useState<number>(546);
  const [baseMrpPerSqFt, setBaseMrpPerSqFt] = useState<number>(800);
  
  const [variants, setVariants] = useState(
    STANDARD_SIZES.map(s => ({
      ...s,
      price: Math.round(s.sqft * 546),
      mrp: Math.round(s.sqft * 800),
      stock: 10,
    }))
  );

  const queryClient = useQueryClient();

  // Fetch existing product if editing
  const { data: product, isLoading: isFetchingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`/api/products/${id}?admin=true`);
      return res.data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Orthopaedic');
      setFirmness(product.firmness || 'Orthopaedic Firm');
      setDescription(product.description || '');
      setStatus(product.status || 'Draft');
      setBenefits((product.benefits || []).join(', '));
      
      if (product.variants && product.variants.length > 0) {
        setVariants(product.variants.map((v: any) => ({
          category: v.category || 'Custom',
          dim: v.dimensions || '',
          sqft: 0, // Not saved to DB typically, but we could reverse calc if needed
          thickness: `${v.thickness_cm || 15}cm`,
          price: v.price || 0,
          mrp: v.mrp || 0,
          stock: v.stock || 0
        })));
      }
      
      if (product.images) {
        setExistingImages(product.images);
      }
    }
  }, [product]);

  const saveProductMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const method = isEditing ? 'put' : 'post';
      const url = isEditing 
        ? `/api/products/${id}` 
        : '/api/products';
        
      const response = await axios[method](url, newProduct);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert(`Product ${isEditing ? 'updated' : 'saved'} successfully!`);
      if (!isEditing) navigate('/products');
    },
    onError: (error: any) => {
      alert(`Error saving product: ${error.message}`);
    }
  });

  const handleSave = () => {
    saveProductMutation.mutate({
      name,
      category: category.toLowerCase().replace(' ', '-'),
      firmness,
      description,
      status: status.toLowerCase(),
      benefits: benefits.split(',').map(b => b.trim()).filter(Boolean),
      variants: variants.map(v => ({
        size: v.category,
        dimensions: v.dim,
        price: v.price,
        mrp: v.mrp,
        stock: v.stock,
        sku: `SKU-${Math.floor(Math.random() * 10000)}` // Mock SKU
      })),
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { category: 'Custom', dim: '', sqft: 0, thickness: '6 Inch', price: 0, mrp: 0, stock: 0 }]);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };
  
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const applyBasePricing = () => {
    if (confirm(`This will recalculate all prices based on ₹${basePricePerSqFt}/sq.ft and MRP ₹${baseMrpPerSqFt}/sq.ft. Continue?`)) {
      setVariants(variants.map(v => {
        // Adjust multiplier based on thickness
        let multiplier = 1.0;
        if (v.thickness === '5 Inch') multiplier = 0.85;
        if (v.thickness === '8 Inch') multiplier = 1.3;
        if (v.thickness === '10 Inch') multiplier = 1.6;
        
        return {
          ...v,
          price: Math.round(v.sqft * basePricePerSqFt * multiplier),
          mrp: Math.round(v.sqft * baseMrpPerSqFt * multiplier)
        };
      }));
    }
  };

  if (isFetchingProduct) {
    return <div className="p-8 text-center text-ink-muted">Loading product details...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-ink-muted">{isEditing ? `Editing details for ${product?.name}` : 'Create a new mattress model in the catalog.'}</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saveProductMutation.isPending}
          className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save size={18} /> {saveProductMutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Variants */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Product Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none" placeholder="e.g. The Dr Well Signature" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                    <option>Latex</option>
                    <option>Memory Foam</option>
                    <option>Pocket Spring</option>
                    <option>Bonded</option>
                    <option>Luxury HR</option>
                    <option>Budget</option>
                    <option>Orthopaedic</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-1">Firmness</label>
                  <select value={firmness} onChange={e => setFirmness(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                    <option>Orthopaedic Firm</option>
                    <option>Firm</option>
                    <option>Medium Firm</option>
                    <option>Medium</option>
                    <option>Medium Soft</option>
                    <option>Soft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none resize-none" placeholder="Detailed product description..."></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="font-heading font-semibold text-lg">Variants (Detailed Pricing & Stock)</h2>
                <p className="text-xs text-ink-muted mt-1">Manage sizes, thicknesses, and prices. Pricing automatically scales by thickness when using Apply.</p>
              </div>
              <button onClick={addVariant} className="text-primary-blue text-sm font-medium flex items-center gap-1 hover:bg-primary-blue/10 px-3 py-1.5 rounded-md transition-colors border border-primary-blue/30">
                <Plus size={16} /> Add Custom Size
              </button>
            </div>
            
            {/* Base Pricing Calculator */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 flex flex-wrap items-end gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1 uppercase tracking-wider">Base Price / Sq.Ft</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                  <input type="number" value={basePricePerSqFt} onChange={e => setBasePricePerSqFt(Number(e.target.value))} className="w-32 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-blue outline-none bg-white font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1 uppercase tracking-wider">Base MRP / Sq.Ft</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                  <input type="number" value={baseMrpPerSqFt} onChange={e => setBaseMrpPerSqFt(Number(e.target.value))} className="w-32 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-blue outline-none bg-white font-medium" />
                </div>
              </div>
              <button onClick={applyBasePricing} className="bg-ink hover:bg-ink-muted text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Copy size={16} /> Apply to All
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr className="text-xs text-ink-muted uppercase tracking-wider font-semibold border-b border-slate-200">
                    <th className="p-3">Category</th>
                    <th className="p-3">Dimensions (L" x W")</th>
                    <th className="p-3 w-20">Sq.Ft</th>
                    <th className="p-3 w-28">Thickness</th>
                    <th className="p-3">Selling Price (₹)</th>
                    <th className="p-3">MRP (₹)</th>
                    <th className="p-3 w-24">Stock</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2">
                        <select 
                          value={v.category}
                          onChange={(e) => updateVariant(idx, 'category', e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white font-medium text-ink"
                        >
                          <option>Single</option>
                          <option>Double</option>
                          <option>Queen</option>
                          <option>King</option>
                          <option>Custom</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input 
                          type="text" 
                          value={v.dim} 
                          placeholder='e.g. 72" × 30"'
                          onChange={(e) => updateVariant(idx, 'dim', e.target.value)} 
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white" 
                        />
                      </td>
                      <td className="p-2">
                        <input 
                          type="number" 
                          step="0.01"
                          value={v.sqft} 
                          onChange={(e) => updateVariant(idx, 'sqft', parseFloat(e.target.value) || 0)} 
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white text-center text-ink-muted" 
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={v.thickness}
                          onChange={(e) => updateVariant(idx, 'thickness', e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white text-center"
                        >
                          <option>5 Inch</option>
                          <option>6 Inch</option>
                          <option>8 Inch</option>
                          <option>10 Inch</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                          <input 
                            type="number" 
                            value={v.price} 
                            onChange={(e) => updateVariant(idx, 'price', parseInt(e.target.value) || 0)} 
                            className="w-full border border-slate-200 rounded p-2 pl-6 text-sm font-semibold text-brand-green" 
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                          <input 
                            type="number" 
                            value={v.mrp} 
                            onChange={(e) => updateVariant(idx, 'mrp', parseInt(e.target.value) || 0)} 
                            className="w-full border border-slate-200 rounded p-2 pl-6 text-sm text-ink-muted line-through decoration-slate-300" 
                          />
                        </div>
                      </td>
                      <td className="p-2">
                        <input 
                          type="number" 
                          value={v.stock} 
                          onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)} 
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white text-center" 
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button onClick={() => removeVariant(idx)} className="text-error-red p-1.5 hover:bg-error-red/10 rounded transition-colors" title="Remove Variant">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {variants.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center p-8 text-ink-muted">No variants added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Images & Meta */}
        <div className="xl:col-span-1 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Product Images</h2>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary-blue bg-primary-blue-light/50' : 'border-slate-300 hover:border-primary-blue hover:bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-10 w-10 text-ink-muted mb-2" />
              <p className="text-sm font-medium text-ink">Drop images here</p>
              <p className="text-xs text-ink-muted mt-1">or click to browse</p>
            </div>

            {existingImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={img.url} alt={img.alt || 'Product'} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
            
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                    <img src={URL.createObjectURL(img)} alt={`Upload ${idx}`} className="object-cover w-full h-full" />
                    <button 
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-ink/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Organization</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Tags (Comma separated)</label>
                <input type="text" value={benefits} onChange={e => setBenefits(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none" placeholder="bestseller, orthopedic..." />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
