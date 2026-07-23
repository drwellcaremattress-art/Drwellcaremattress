import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Plus, Save } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function ProductEditor() {
  const [images, setImages] = useState<File[]>([]);
  const [variants, setVariants] = useState([
    { size: 'Single', price: 9999, mrp: 14999, stock: 10 },
    { size: 'Double', price: 12999, mrp: 18999, stock: 15 },
  ]);

  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      // Assuming a generic post endpoint. In a real scenario, handle FormData for images.
      const response = await axios.post('http://localhost:3001/api/products', newProduct);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      alert("Product saved successfully!");
    },
    onError: (error: any) => {
      alert(`Error saving product: ${error.message}`);
    }
  });

  const handleSave = () => {
    createProductMutation.mutate({
      variants,
      // Include other form data here...
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
    setVariants([...variants, { size: 'Queen', price: 0, mrp: 0, stock: 0 }]);
  };

  const updateVariant = (index: number, field: string, value: string | number) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-ink">Add New Product</h1>
          <p className="text-ink-muted">Create a new mattress model in the catalog.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={createProductMutation.isPending}
          className="bg-primary-blue hover:bg-primary-blue-dark text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save size={18} /> {createProductMutation.isPending ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Variants */}
        <div className="col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-heading font-semibold text-lg mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Product Name</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none" placeholder="e.g. The Dr Well Signature" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-1">Category</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                    <option>Orthopaedic</option>
                    <option>Memory Foam</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-muted mb-1">Firmness</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                    <option>Orthopaedic Firm</option>
                    <option>Firm</option>
                    <option>Medium</option>
                    <option>Soft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Description</label>
                <textarea rows={4} className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none resize-none" placeholder="Detailed product description..."></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading font-semibold text-lg">Variants (Pricing & Stock)</h2>
              <button onClick={addVariant} className="text-primary-blue text-sm font-medium flex items-center gap-1 hover:underline">
                <Plus size={16} /> Add Size
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-ink-muted">
                    <th className="pb-2 font-medium">Size</th>
                    <th className="pb-2 font-medium">Selling Price (₹)</th>
                    <th className="pb-2 font-medium">MRP (₹)</th>
                    <th className="pb-2 font-medium">Stock</th>
                    <th className="pb-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {variants.map((v, idx) => (
                    <tr key={idx}>
                      <td className="py-3 pr-2">
                        <select 
                          value={v.size}
                          onChange={(e) => updateVariant(idx, 'size', e.target.value)}
                          className="w-full border border-slate-200 rounded p-2 text-sm bg-white"
                        >
                          <option>Single</option>
                          <option>Double</option>
                          <option>Queen</option>
                          <option>King</option>
                        </select>
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={v.price} onChange={(e) => updateVariant(idx, 'price', parseInt(e.target.value))} className="w-full border border-slate-200 rounded p-2 text-sm" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={v.mrp} onChange={(e) => updateVariant(idx, 'mrp', parseInt(e.target.value))} className="w-full border border-slate-200 rounded p-2 text-sm" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value))} className="w-full border border-slate-200 rounded p-2 text-sm" />
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button className="text-error-red p-1 hover:bg-error-red/10 rounded">
                          <X size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Images & Meta */}
        <div className="col-span-1 space-y-8">
          
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

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
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
                <select className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none bg-white">
                  <option>Draft</option>
                  <option>Active</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-muted mb-1">Tags (Comma separated)</label>
                <input type="text" className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-primary-blue outline-none" placeholder="bestseller, new..." />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
