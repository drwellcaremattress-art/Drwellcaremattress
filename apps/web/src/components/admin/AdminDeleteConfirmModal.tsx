'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';
import { ProductType } from './AdminProductTable';

interface Props {
  open: boolean;
  product: ProductType | null;
  onClose: () => void;
  onDeleted: (productId: string) => void;
}

export default function AdminDeleteConfirmModal({ open, product, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!product) return;
    setDeleting(true);
    setError(null);
    try {
      const identifier = product._id || product.slug;
      const res = await fetch(`/api/products/${identifier}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete product');
      }

      onDeleted(product._id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && product && (
        <>
          {/* Backdrop */}
          <motion.div
            key="delete-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-100 pointer-events-auto relative">
              {/* Close */}
              <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                <AlertTriangle size={26} className="text-red-500" />
              </div>

              <h3 className="text-xl font-extrabold text-[#0B1A2A] text-center mb-2">
                Delete Product?
              </h3>
              <p className="text-sm text-slate-500 text-center mb-1">
                You are about to permanently delete:
              </p>
              <p className="text-base font-bold text-[#0B1A2A] text-center mb-5 bg-red-50 py-2 px-4 rounded-xl border border-red-100">
                {product.name}
              </p>

              <p className="text-xs text-slate-400 text-center mb-6">
                This action <span className="font-bold text-red-500">cannot be undone</span>. The product will be permanently removed from the MongoDB database and will no longer appear on the website.
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  disabled={deleting}
                  className="flex-1 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-lg shadow-red-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deleting ? (
                    <><Loader2 size={16} className="animate-spin" /> Deleting…</>
                  ) : (
                    <><Trash2 size={16} /> Delete Permanently</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
