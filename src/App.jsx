// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { MathJaxContext } from "better-react-mathjax";
import Header from "@/components/layout/Header";
import QuestionBank from "@/pages/QuestionBank";
import { Toaster } from "react-hot-toast";
import SavedPapers from "@/pages/SavedPapers";
import Templates from "./pages/Templates";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const mathjaxConfig = {};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <QuestionBank />
          </ProtectedRoute>
        }
      />
      <Route
        path="/papers"
        element={
          <ProtectedRoute>
            <SavedPapers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <div className="p-10">Profile Page</div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  // Global Modals state can stay here if they are shared, 
  // but question-specific modals are better inside the Page component.
  
  return (
    <MathJaxContext version={3} config={mathjaxConfig}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
        <Header />
        <AppContent />
      </div>
    </MathJaxContext>
  );
}