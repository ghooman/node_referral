// components
import HeaderBack from '../components/unit/HeaderBack';
import InputField from '../components/unit/InputField';
import LoadingDots from '../components/unit/LoadingDots';
// style
import '../styles/pages/SignUp.scss';
// import { Link } from 'react-router-dom';



// test ing
function SignUp() {
  return (

    <>
    <HeaderBack />
    <section className="signup__wrapper page-wrapper">
      <h2>Sign Up</h2>

      <form className="signup__form">
        <fieldset className='signup__form__code'>
          <legend>Verify Invitation Code</legend>
          {/* 초대코드 인증 */}
          <div className="input-btn-field input-btn-field--error">
            <label htmlFor="invitationCode">Invitation code</label>
            <div className="input-btn-field__box">
              <input 
                type="text" 
                id="invitationCode"
                placeholder='Enter the invitation code'
                required
                maxLength={6}
              />
              <button className="btn btn--disabled">
                Confirm Code
                <LoadingDots />
              </button>
            </div>
            {/* 에러 메시지 */}
            <span className='input-btn-field__error-txt'>Invalid invitation code</span>
          </div>
        </fieldset>
        <fieldset className='signup__form__email'>
          <legend>Email Verification</legend>
          {/* 아이디 (이메일) 인증 */}
          <div className="input-btn-field">
            <label htmlFor="userEmail">E-Mail</label>
            <div className="input-btn-field__box">
              <input 
                type="email" 
                id="userEmail"
                placeholder='Enter the your E-Mail'
                required
              />
              <button className="btn btn--disabled">
                Send
                <LoadingDots />
              </button>
            </div>
          </div>

          {/* 이메일 인증번호 */}
          <div className="input-btn-field">
            <label htmlFor="authCode">Authentication code</label>
            <div className="input-btn-field__box">
              <input 
                type="text" 
                id="authCode"
                placeholder='Please enter the Code'
                required
                maxLength={6}
              />
              <button className="btn btn--disabled">
                Confirm
                {/* <LoadingDots /> */}
              </button>
            </div>
            <div className="input-btn-field__info">
              <span className="input-btn-field__resend">
                Didn’t receive the code? <button type="button">Resend Code</button>
              </span>
              <span className="input-btn-field__timer">
                <strong>05:00</strong> until code expires
              </span>
            </div>
          </div>
        </fieldset>
        <fieldset className='signup__form__pw'>
          <legend>Set Password</legend>

          {/* 비밀번호 */}
          <InputField
            id="userPw"
            label="Password"
            type="password"
            placeholder="Please enter your password"
            required
            withToggle={true}
          />

          {/* 비밀번호 조건 안내 */}
          <ul className="password-rules">
            <li className='check'>At least 8 characters</li>
            <li>Must contain at least one uppercase letter</li>
          </ul>

          {/* 비밀번호 확인 - InputField 안 쓰고 직접 마크업 */}
          <div className="input-btn-field input-btn-field--error">
            <label htmlFor="userPwConfirm">Password Again</label>
            <div className="input-btn-field__box">
              <input
                id="userPwConfirm"
                type="password"
                placeholder="Please enter the password again"
                className="error-case"
                required
              />
            </div>
            {/* 에러 메시지 */}
            <span className="input-btn-field__error-txt">Passwords do not match</span>
          </div>
        </fieldset>


        <button className="btn btn-login btn--disabled">
          Sign Up
          <LoadingDots />
        </button>
      </form>
    </section>
    </>
  );
}
export default SignUp;