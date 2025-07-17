import "./FullModalWrap.scss";

function FullModalWrap({ children }) {
  return (
    <div className="full-modal-wrap">
      <div className="full-modal-content">{children}</div>
    </div>
  );
}
export default FullModalWrap;
