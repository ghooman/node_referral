import { useState } from 'react';
// img
import eyeIcon from '../../assets/images/icon-eye.svg';
import eyeOffIcon from '../../assets/images/icon-eye-off.svg';
// style
import './InputField.scss';

function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  value,
  onChange,
  withToggle = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const inputType = isPassword && withToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="node-input-field">
      <label htmlFor={id}>{label}</label>
      <div className={`node-input-field__box ${isPassword && withToggle ? 'node-has-icon' : ''}`}>
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        {isPassword && withToggle && (
          <span
            className="node-input-field__icon-btn"
            // style={{ backgroundColor: 'none !important' }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? eyeIcon : eyeOffIcon} alt="비밀번호 보기 전환" />
          </span>
        )}
      </div>
    </div>
  );
}

export default InputField;

