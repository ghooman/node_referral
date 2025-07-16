import ModalWrap from './ModalWrap';
import './ModalWrap.scss';
import './ConfirmModal.scss';

const TwowayConfirmModal = ({
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel
}) => {
  return (
    <ModalWrap onClose={onCancel}>
      <h2 className="modal__title">{title}</h2>
      <p className="modal__txt">{message}</p>
      <div className="modal__btn-box">
        <button className="modal__button modal__button--cancel" onClick={onCancel}>
          {cancelText}
        </button>
        <button className="modal__button modal__button--confirm" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </ModalWrap>
  );
};

export default TwowayConfirmModal;
