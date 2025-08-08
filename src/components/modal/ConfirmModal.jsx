import ModalWrap from "./ModalWrap";
import "./ModalWrap.scss";
import "./ConfirmModal.scss";

const ConfirmModal = ({ title, message, buttonText = "OK", onClose, onClick, onConfirm }) => {
  return (
    <ModalWrap onClose={onClose}>
      <h2 className="modal__title">{title}</h2>
      <p className="modal__txt">{message}</p>
      <button
        className="modal__button"
        onClick={() => {
          if (onConfirm) {
            onConfirm(); // ✅ 확인 작업 실행 (예: handleChangeState)
          } else if (onClick) {
            onClick(); // 👈 기존 버튼 이벤트
          } else {
            onClose(); // 👈 기본 동작
          }
        }}
      >
        {buttonText}
      </button>
    </ModalWrap>
  );
};

export default ConfirmModal;
