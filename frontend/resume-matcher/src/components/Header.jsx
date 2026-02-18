// Header.js
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <Navbar expand="lg" className="custom-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold brand">
          Resume Matcher
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={NavLink}
              to="/history"
              className="nav-link-custom"
            >
              History
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
