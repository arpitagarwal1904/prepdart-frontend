// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";
import Header from "@/components/layout/Header";
import QuestionBank from "@/pages/QuestionBank";
import { Toaster } from "react-hot-toast";
import SavedPapers from "@/pages/SavedPapers";
import Templates from "./pages/Templates";

const mathjaxConfig = {};

export default function App() {
  // Global Modals state can stay here if they are shared, 
  // but question-specific modals are better inside the Page component.
  
  return (
    <MathJaxContext version={3} config={mathjaxConfig}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<QuestionBank />} />
          <Route path="/papers" element={<SavedPapers />} />
          <Route path="/templates" element={<Templates/>} />
          <Route path="/profile" element={<div className="p-10">Profile Page</div>} />
        </Routes>
      </div>
    </MathJaxContext>
  );
}