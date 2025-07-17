import { useState } from "react";
// img
import eyeIcon from "../../assets/images/icon-eye.svg";
import eyeOffIcon from "../../assets/images/icon-eye-off.svg";
// style
import "./InputField.scss";

function InputField({ id, label, type = "text", placeholder, required, value, onChange, withToggle = false }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword && withToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="input-field">
      <label htmlFor={id}>{label}</label>
      <div className={`input-field__box ${isPassword && withToggle ? "has-icon" : ""}`}>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        {isPassword && withToggle && (
          <button type="button" className="input-field__icon-btn" onClick={() => setShowPassword(!showPassword)}>
            <img src={showPassword ? eyeIcon : eyeOffIcon} alt="비밀번호 보기 전환" />
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;
