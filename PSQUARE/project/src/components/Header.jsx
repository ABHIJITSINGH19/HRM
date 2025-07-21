import React from "react";

const Header = ({ children, style, className = "", ...props }) => {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 0,
        gap: 347,
        position: "relative",
        height: 38,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Header;
