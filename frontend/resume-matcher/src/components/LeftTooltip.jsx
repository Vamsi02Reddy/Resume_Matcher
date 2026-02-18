import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "../pages/pages.css"; // make sure to add the CSS below

function LeftTooltip() {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="tooltip-top">
          You can add optional JD skills to improve matching!
        </Tooltip>
      }
    >
      <button className="pro-tip-btn">
        💡 Pro Tip
      </button>
    </OverlayTrigger>
  );
}

export default LeftTooltip;
