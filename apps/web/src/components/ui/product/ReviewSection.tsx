"use client";

import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizeBought?: string;
  likes: number;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Rajesh K.',
    rating: 5,
    date: '2 days ago',
    title: 'Instant relief for my chronic back pain!',
    comment: 'I was skeptical at first, but after sleeping on the Dr.Well Care Bonded Series for 3 nights, my morning lower back stiffness is 90% gone. Outstanding firmness and edge support.',
    verified: true,
    sizeBought: 'King (78" × 72")',
    likes: 24,
  },
  {
    id: '2',
    author: 'Priya Sharma',
    rating: 5,
    date: '1 week ago',
    title: 'Premium luxury feel without the crazy markup',
    comment: 'The memory foam layer cradles the shoulders perfectly. Extremely breathable and doesn\'t get hot at night. Delivery to Chennai was super smooth.',
    verified: true,
    sizeBought: 'Queen (75" × 60")',
    likes: 18,
  },
  {
    id: '3',
    author: 'Dr. Anand Raman',
    rating: 5,
    date: '2 weeks ago',
    title: 'As an Orthopaedic physician, I highly recommend this',
    comment: 'The dual-density core aligns the lumbar spine in a neutral position. Excellent weight distribution and posture maintenance during sleep.',
    verified: true,
    sizeBought: 'King (72" × 72")',
    likes: 42,
  },
  {
    id: '4',
    author: 'Suresh Kumar',
    rating: 4,
    date: '3 weeks ago',
    title: 'Great firmness and durable construction',
    comment: 'The mattress is nice and firm. Takes about 2 days to get used to if you came from a soft spring bed, but now I sleep like a baby.',
    verified: true,
    sizeBought: 'Double (75" × 48")',
    likes: 9,
  }
];

export function ReviewSection({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  const [showForm, setShowForm] = useState(false);

  // New Review Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const filteredReviews = activeFilter === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === activeFilter);

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);

  const handleLike = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !comment) return;

    const newRev: Review = {
      id: Date.now().toString(),
      author: name,
      rating,
      date: 'Just now',
      title,
      comment,
      verified: true,
      sizeBought: 'Verified Purchase',
      likes: 0,
    };

    setReviews([newRev, ...reviews]);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowForm(false);
      setName('');
      setTitle('');
      setComment('');
      setRating(5);
    }, 2000);
  };

  return (
    <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800 font-body">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0682E4] bg-[#0682E4]/10 px-3 py-1 rounded-full">
            Verified Feedback
          </span>
          <h2 className="text-3xl font-extrabold text-[#0B1A2A] dark:text-white mt-2">
            Customer Reviews & Ratings
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real feedback from verified {productName} owners.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center gap-2 bg-[#0B1A2A] hover:bg-[#16273B] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg transition-transform hover:-translate-y-0.5 shrink-0"
        >
          <MessageSquare className="w-4 h-4 text-[#7cb93e]" />
          Write a Review
        </button>
      </div>

      {/* Review Summary Breakdown Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 md:p-8 border border-slate-100 dark:border-slate-800 mb-10">
        
        {/* Rating Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
          <div className="text-5xl md:text-6xl font-extrabold text-[#0B1A2A] dark:text-white font-heading">
            {averageRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-sm text-slate-500 font-medium">Based on {reviews.length} customer reviews</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-3 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200/50">
            <CheckCircle className="w-3.5 h-3.5" />
            98% Recommended by buyers
          </div>
        </div>

        {/* Rating Bars & Filters */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(r => r.rating === stars).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <button
                key={stars}
                onClick={() => setActiveFilter(activeFilter === stars ? 'all' : stars)}
                className={`flex items-center gap-3 w-full text-left text-xs font-semibold p-1.5 rounded-xl transition-colors ${
                  activeFilter === stars ? 'bg-white dark:bg-slate-800 shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="w-12 text-slate-600 dark:text-slate-300 shrink-0 font-mono font-bold flex items-center gap-1">
                  {stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-grow bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
                <span className="w-10 text-right text-slate-400 shrink-0 font-mono">{count}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Write Review Form Modal / Slide */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10 overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-[#0682E4]/30 shadow-xl relative">
              <h3 className="text-xl font-bold text-[#0B1A2A] dark:text-white mb-4">
                Write Your Review for {productName}
              </h3>

              {submittedSuccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center font-bold border border-emerald-200">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-500 animate-bounce" />
                  Thank you! Your review has been submitted successfully.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star className={`w-7 h-7 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 ml-2">
                        {rating} out of 5 Stars
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0682E4]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Review Headline / Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Extremely comfortable mattress!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0682E4]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Detailed Review
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Share your experience regarding comfort, back support, heat dissipation, delivery..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-[#0682E4]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#0682E4] hover:bg-[#0682E4]/90 text-white font-bold text-sm shadow-md flex items-center gap-2"
                    >
                      Submit Review <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => (
          <div 
            key={rev.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0682E4]/10 text-[#0682E4] font-bold flex items-center justify-center text-base">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#0B1A2A] dark:text-white">{rev.author}</h4>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        <CheckCircle className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  {rev.sizeBought && (
                    <span className="text-xs text-slate-400 block font-medium mt-0.5">Purchased: {rev.sizeBought}</span>
                  )}
                </div>
              </div>

              <span className="text-xs text-slate-400 font-medium shrink-0">{rev.date}</span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>

            {/* Title & Comment */}
            <h5 className="font-bold text-base text-[#0B1A2A] dark:text-white mb-1.5">{rev.title}</h5>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{rev.comment}</p>

            {/* Helpful Counter */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <span>Was this review helpful?</span>
              <button
                onClick={() => handleLike(rev.id)}
                className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold hover:text-[#0682E4] transition-colors bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#0682E4]" /> Helpful ({rev.likes})
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
