import React, { Suspense } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { persistor, store } from "./store";

import Login from "./pages/Login/login";
import { PersistGate } from "redux-persist/integration/react";
// import Home from "./pages/Home/home";
// import Settings from "./pages/Settings/Settings";
// import Lessons from "./pages/Lessons/lessons";
// import Students from "./pages/Students/students";
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const Home = React.lazy(() => import("./pages/Home/home"));
const Settings = React.lazy(() => import("./pages/Settings/Settings"));
const Students = React.lazy(() => import("./pages/Students/Students"));
const Lessons = React.lazy(() => import("./pages/Lessons/lessons"));

import "./App.css";

let Error404 = () => {
  return (
    <>
      <Link to="/videos">Ir a inicio</Link>
      <h1>Esta página no existe. 404</h1>
    </>
  );
};

let NotImplemented = () => {
  return (
    <>
      <Link to="/videos">Ir a videos</Link>

      <h1>Esta página aún no se encuentra disponible</h1>
    </>
  );
};

const AuthRoute = (props) => {
  let user = useSelector((state) => state.user.user);
  if (user.role !== "admin" && user.role !== "superadmin") {
    return <Navigate to="/" />;
  }
  return props.children;
};

const AuthSuperadminRoute = (props) => {
  let user = useSelector((state) => state.user.user);
  if (user.role !== "superadmin") {
    return <Navigate to="/" />;
  }
  return props.children;
};

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<div />}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <AuthRoute>
                    <Profile />
                  </AuthRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <AuthRoute>
                    <Home />
                  </AuthRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthSuperadminRoute>
                    <Settings />
                  </AuthSuperadminRoute>
                }
              />
              <Route
                path="/lessons"
                element={
                  <AuthRoute>
                    <Lessons />
                  </AuthRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <AuthRoute>
                    <Students />
                  </AuthRoute>
                }
              />

              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
