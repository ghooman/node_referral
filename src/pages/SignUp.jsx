// components
import HeaderBack from "../components/unit/HeaderBack";
import InputField from "../components/unit/InputField";
import LoadingDots from "../components/unit/LoadingDots";
// style
import "../styles/pages/SignUp.scss";
import { Link } from "react-router-dom";
import React, { use, useState } from "react";
import axios from "axios";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

// test ing
function SignUp() {
  // 초대코드 상태
  const [inviteCode, setInviteCode] = useState("");
  // 초대코드 검증 상태
  const [isValidInviteCode, setIsValidInviteCode] = useState(null);
  // 이메일 상태
  const [emailCode, setEmailCode] = useState("");
  // 이메일 인증 코드 상태
  const [emailAuthCode, setEmailAuthCode] = useState("");
  // 초대코드 일치 함수
  const checkInviteCode = async () => {
    try {
      const res = await axios.get(`${serverAPI}/api/user/invitation/code/check`, {
        params: {
          invitation_code: inviteCode,
        },
      });
      // if 초대코드(l74kUz)가 true면 승인, 아니면 실패
      console.log("초대코드", res.data);
      const isVaildCode = res.data;
      // true면 걍 넘어가고 false면 input 빨간 테두리
      setIsValidInviteCode(isVaildCode);
      if (isVaildCode) {
        console.log("오!! 성공이오");
      } else {
        console.log("없는코드인디요");
      }
    } catch (error) {
      console.error("error입니당", error);
      setIsValidInviteCode(false); // 오류 시에도 실패로 간주
    }
  };
  // 이메일 보내는 함수
  const sendEmailCode = async () => {
    console.log("보내지고 있는 emailcode", emailCode);
    try {
      const res = await axios.post(`${serverAPI}/api/user/email/vertification/send`, null, {
        params: {
          email: emailCode,
        },
      });
      console.log("이메일 보내는 함수!", res.data);
    } catch (error) {
      console.error("error입니당", error);
    }
  };
  // 이메일 인증 코드 일치 함수
  const checkEmailAuthCode = async () => {
    try {
      const res = await axios.post(`${serverAPI}/api/user/email/vertification/check`, null, {
        params: {
          email: emailCode,
          vertification: emailAuthCode,
        },
      });
      console.log("이메일 인증 코드 일치 함수!", res.data);
    } catch (error) {
      console.error("error입니당", error);
    }
  };
  return (
    <>
      <HeaderBack />
      <section className="signup__wrapper page-wrapper">
        <h2>Sign Up</h2>

        <form className="signup__form">
          <fieldset className="signup__form__code">
            <legend>Verify Invitation Code</legend>
            {/* 초대코드 인증 */}
            <div className={`input-btn-field ${isValidInviteCode === false ? "input-btn-field--error" : ""}`}>
              <label htmlFor="invitationCode">Invitation code</label>
              <div className="input-btn-field__box">
                <input
                  type="text"
                  id="invitationCode"
                  placeholder="Enter the invitation code"
                  required
                  maxLength={6}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
                <button
                  className={`btn ${inviteCode.trim() !== "" ? "" : "btn--disabled"}`}
                  onClick={(e) => {
                    e.preventDefault(); // ✅ 폼 제출 막기
                    checkInviteCode();
                  }}
                >
                  Confirm Code
                  <LoadingDots />
                </button>
              </div>
              {/* 에러 메시지 */}
              <span className="input-btn-field__error-txt">Invalid invitation code</span>
            </div>
          </fieldset>
          <fieldset className="signup__form__email" disabled={isValidInviteCode !== true}>
            <legend>Email Verification</legend>
            {/* 아이디 (이메일) 인증 */}
            <div className="input-btn-field">
              <label htmlFor="userEmail">E-Mail</label>
              <div className="input-btn-field__box">
                <input
                  type="email"
                  id="userEmail"
                  placeholder="Enter the your E-Mail"
                  required
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                />
                <button
                  className={`btn ${emailCode.trim() !== "" ? "" : "btn--disabled"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    sendEmailCode();
                  }}
                >
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
                  placeholder="Please enter the Code"
                  required
                  maxLength={6}
                  value={emailAuthCode}
                  onChange={(e) => setEmailAuthCode(e.target.value)}
                />
                <button
                  className={`btn ${emailAuthCode.trim() !== "" ? "" : "btn--disabled"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    checkEmailAuthCode();
                  }}
                >
                  Confirm
                  {/* <LoadingDots /> */}
                </button>
              </div>
            </div>
          </fieldset>
          <fieldset className="signup__form__pw" disabled={isValidInviteCode !== true}>
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
              <li className="check">At least 8 characters</li>
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
