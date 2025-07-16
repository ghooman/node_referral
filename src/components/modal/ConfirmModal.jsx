import ModalWrap from './ModalWrap';
import './ModalWrap.scss';
import './ConfirmModal.scss';

const ConfirmModal = ({ title, message, buttonText = 'OK', onClose }) => {
  return (
    <ModalWrap onClose={onClose}>
      <h2 className="modal__title">{title}</h2>
      <p className="modal__txt">{message}</p>
      <button className="modal__button" onClick={onClose}>
        {buttonText}
      </button>
    </ModalWrap>
  );
};

export default ConfirmModal;