import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaCog,
  FaRegCalendarAlt,
  FaAngleLeft,
  FaAngleRight,
  FaUsers,
  FaTh,
  FaUserCog,
} from "react-icons/fa";

import Nav from "../Nav/nav";
import "./layout.css";
import { useSelector } from "react-redux";

const Layout = (props) => {
  let user = useSelector((state) => state.user.user);
  const [minItems, setMinItems] = useState(false);
  const handleMinItems = () => {
    setMinItems(!minItems);
  };
  return (
    <div className="layout">
      <Nav></Nav>
      <main className="main">
        <div className={`sidebar ${minItems ? "full" : "mini"}`}>
          <button className="sidebar__item--cta" onClick={handleMinItems}>
            {minItems ? <FaAngleRight /> : <FaAngleLeft />}
          </button>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "item__detail item__active" : "item__detail"
            }
          >
            <FaUserCog className="material__icon" />
            <span className="icon-text">Perfil</span>
          </NavLink>
          <br />
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "item__detail item__active" : "item__detail"
            }
          >
            <FaTh className="material__icon" />
            <span className="icon-text">Dashboard</span>
          </NavLink>
          {user.role === "superadmin" && (
            <>
              <br />
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? "item__detail item__active" : "item__detail"
                }
              >
                <FaCog className="material__icon" />
                <span className="icon-text">Configuración</span>
              </NavLink>
            </>
          )}
          <br />
          <NavLink
            className={({ isActive }) =>
              isActive ? "item__detail item__active" : "item__detail"
            }
            to="/lessons"
          >
            <FaRegCalendarAlt className="material__icon" />
            <span className="icon-text">Clases</span>
          </NavLink>
          <br />
          <NavLink
            to="/students"
            className={({ isActive }) =>
              isActive ? "item__detail item__active" : "item__detail"
            }
          >
            <FaUsers className="material__icon" />
            <span className="icon-text">Alumnos</span>
          </NavLink>
        </div>
        <section
          className={`main__content ${minItems && "main__content--full"}`}
        >
          {props.children}
        </section>
      </main>
      <footer className="footer">FOOTER</footer>
    </div>
  );
};

export default Layout;
