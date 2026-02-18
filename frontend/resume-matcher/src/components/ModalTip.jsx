import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalTip({ title = "Extracted Resume Text", content = "", triggerLabel = "Preview" }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="info" size='sm' onClick={handleShow}>
        {triggerLabel}
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{ maxHeight: "400px", overflowY: "auto", whiteSpace: "pre-wrap" }}>
            {content || "No text extracted yet."}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalTip;
