// PageNotFound.js
import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./pages.css";

const PageNotFound = () => {
  return (
    <div className="premium-bg d-flex align-items-center justify-content-center">
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="pnf-title">404</h1>
            <h3 className="pnf-subtitle">Oops! Page Not Found</h3>
            <p className="pnf-text">
              The page you are looking for does not exist or has been moved.
            </p>
            <Button as={Link} to="/" className="btn-primary-glow mt-3">
              Go Back Home
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PageNotFound;
