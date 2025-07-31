import "../../styles/Main.scss";
import "./ModalWrap.scss";

const ModalWrap = ({ children, onClose, disableOverlayClose = false }) => {
  const handleOverlayClick = () => {
    // if (!disableOverlayClose){
    //   onClose();
    // }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrap;
