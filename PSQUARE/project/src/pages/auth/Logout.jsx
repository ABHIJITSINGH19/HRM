import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Logout = ({ onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch({ type: "auth/logout" });
    navigate("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div
        className="relative bg-white rounded-3xl shadow-lg p-0 flex flex-col"
        style={{ width: 1080, height: 223 }}
      >
        <div
          className="flex items-center justify-center bg-purple-900 rounded-t-3xl px-8"
          style={{
            height: 64,
            borderTopLeftRadius: "1.5rem",
            borderTopRightRadius: "1.5rem",
          }}
        >
          <h2 className="text-lg font-medium text-white">Log Out</h2>
        </div>

        <div
          className="flex flex-1 flex-col justify-between items-center px-4 py-0"
          style={{ minHeight: "calc(223px - 64px)" }}
        >
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            <p className="text-base text-gray-800 text-center">
              Are you sure you want to log out?
            </p>
          </div>
          <div
            className="relative w-full"
            style={{ height: 38, marginBottom: 24 }}
          >
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px 40px",
                gap: 8,
                position: "absolute",
                width: 130,
                height: 38,
                left: "calc(50% - 130px/2 - 74px)",
                top: 0,
                background: "#4D007D",
                boxShadow: "0px 4px 20px rgba(18, 18, 18, 0.15)",
                borderRadius: 50,
                color: "white",
                fontSize: 18,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                outline: "none",
                transition: "background 0.2s",
              }}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "8px 40px",
                gap: 8,
                position: "absolute",
                width: 130,
                height: 38,
                left: "calc(50% - 130px/2 + 74px)",
                top: 0,
                background: "#fff",
                color: "#B91C1C",
                fontSize: 18,
                fontWeight: 500,
                border: "2px solid #B91C1C",
                borderRadius: 50,
                boxShadow: "0px 4px 20px rgba(18, 18, 18, 0.15)",
                cursor: "pointer",
                outline: "none",
                transition: "background 0.2s",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
