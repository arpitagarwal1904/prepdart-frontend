// src/App.jsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";
import Header from "@/components/layout/Header";
import QuestionBank from "@/pages/QuestionBank";

const mathjaxConfig = {};

export default function App() {
  // Global Modals state can stay here if they are shared, 
  // but question-specific modals are better inside the Page component.
  
  return (
    <MathJaxContext version={3} config={mathjaxConfig}>
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<QuestionBank />} />
          <Route path="/papers" element={<div className="p-10">Saved Papers Page</div>} />
          <Route path="/templates" element={<div className="p-10">Templates Page</div>} />
          <Route path="/profile" element={<div className="p-10">Profile Page</div>} />
        </Routes>
      </div>
    </MathJaxContext>
  );
}