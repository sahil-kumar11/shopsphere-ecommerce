import { useEffect, useState } from "react";
import { X, CheckCircle } from "lucide-react";
import "./Toast.css";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${isVisible ? "toast-enter" : "toast-exit"}`}>
      <div className="toast-content">
        <CheckCircle size={20} className="toast-icon" />
        <span 
          className="toast-message"
          dangerouslySetInnerHTML={{ __html: message }} // ← ADD THIS
        />
      </div>
      <button className="toast-close" onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}>
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;