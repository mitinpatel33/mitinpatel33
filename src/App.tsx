import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import PrivateRoute from "./utils/PrivateRoute";
import { Container } from "@mui/material";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Container
          maxWidth={false} 
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column", 
            justifyContent: "center",
            alignItems: "center",
            px: 2, 
          }}
        >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/books"
              element={
                <PrivateRoute>
                  <BookList />
                </PrivateRoute>
              }
            />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
