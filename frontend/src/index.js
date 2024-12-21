import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Header from "./Components/Header";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import { AuthProvider } from "./Components/AuthContext";
import SupplierList from "./Pages/Suppliers/SuppliersList";
import AddSupplier from "./Pages/Suppliers/AddSupplier";
import EditSupplier from "./Pages/Suppliers/EditSupplier";
import FinishesList from "./Pages/Finishes/FinishesList";
import AddFinish from "./Pages/Finishes/AddFinish";
import EditFinish from "./Pages/Finishes/EditFinish";
import ThicknessesList from "./Pages/Thicknesses/ThicknessesList";
import AddThickness from "./Pages/Thicknesses/AddThickness";
import EditThickness from "./Pages/Thicknesses/EditThickness";
import UsersList from "./Pages/Users/UsersList";
import AddUser from "./Pages/Users/AddUser";
import EditUser from "./Pages/Users/EditUser";
//import LogsList from "./Pages/Logs/LogsList";
import { WarehouseView } from "./Pages/WarehouseView";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<WarehouseView/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage/suppliersList" element={<SupplierList />} />
          <Route path="/add-supplier" element={<AddSupplier />} />
          <Route path="/edit-supplier/:id" element={<EditSupplier />} />
          <Route path="/manage/finishesList" element={<FinishesList />} />
          <Route path="/add-finish" element={<AddFinish />} />
          <Route path="/edit-finish/:id" element={<EditFinish />} />
          <Route path="/manage/thicknessesList" element={<ThicknessesList />} />
          <Route path="/add-thickness" element={<AddThickness />} />
          <Route path="/edit-thickness/:id" element={<EditThickness />} />
          <Route path="/manage/usersList" element={<UsersList />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
