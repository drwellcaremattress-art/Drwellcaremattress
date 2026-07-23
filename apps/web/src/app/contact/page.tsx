"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  MessageSquare,
  Clock
} from "lucide-react";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      title: "Our Headquarters",
      details: ["No.551, Sivapragasam Nagar,", "Surapet, Chennai-600066."],
      color: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-100 dark:border-blue-800"
    },
    {
      icon: <Phone className="w-6 h-6 text-green-500" />,
      title: "Call Us",
      details: ["+91 93429 22044", "Mon-Fri, 9am - 6pm IST"],
      color: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-100 dark:border-green-800"
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-500" />,
      title: "Email Us",
      details: ["drwellcaremattress@gmail.com"],
      color: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-100 dark:border-purple-800"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Store Hours",
      details: ["Everyday: 10am - 8pm", "Holidays: Closed"],
      color: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-100 dark:border-orange-800"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 relative overflow-hidden">
      
      {/* Background Logo */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Image src="/images/logo.png" alt="Dr Well Care Background Logo" fill className="object-contain p-10 md:p-32" />
      </div>

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-6"
        >
          <MessageSquare className="w-4 h-4" />
          Get in Touch
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
        >
          We're here to help you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">sleep better.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-600 dark:text-slate-400"
        >
          Whether you have a question about our mattresses, need help with your order, or just want to talk about sleep science, our team is ready to listen.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
        
        {/* Contact Info Grid */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`flex items-start p-6 rounded-2xl border ${info.borderColor} ${info.color} transition-colors`}
              >
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm mr-4 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-blue-900/5 dark:shadow-none border border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative background element for form */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formState.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white transition-all outline-none resize-none"
                placeholder="Tell us everything..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-600/30"
              }`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Message <Send className="w-5 h-5" />
                </>
              )}
            </motion.button>
            
            {/* Success Message Animation */}
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.2 }}
                  >
                    <Send className="w-10 h-10" />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Thanks for reaching out. Our sleep experts will get back to you shortly.
                </p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
