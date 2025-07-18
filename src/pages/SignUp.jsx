// components
import HeaderBack from "../components/unit/HeaderBack";
import InputField from "../components/unit/InputField";
import LoadingDots from "../components/unit/LoadingDots";
// style
import "../styles/pages/SignUp.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { use, useState, useEffect } from "react";
import axios from "axios";
import { is } from "date-fns/locale";

const serverAPI = process.env.REACT_APP_NODE_SERVER_API;

// test ing
function SignUp() {
  // 회원가입 성공하고 로그인으로 화면 이동
  const navigate = useNavigate();
  // 초대코드 상태
  const [inviteCode, setInviteCode] = useState("");
  // 초대코드 검증 상태
  const [isValidInviteCode, setIsValidInviteCode] = useState(null);
  // 이메일 상태
  const [emailCode, setEmailCode] = useState("");
  // 이메일 인증 코드 상태
  const [emailAuthCode, setEmailAuthCode] = useState("");
  // 비밀번호 상태
  const [passWord, setPassWord] = useState("");
  // 비밀번호 확인
  const [confirmPassword, setConfirmPassword] = useState("");
  // 버튼 확정 상태 (다시 비활성화)
  const [isCodeConfirmed, setIsCodeConfirmed] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  // 이메일 인증 타이머 상태
  const [timeLeft, setTimeLeft] = useState(180); // 3분(180초)
  const [timerActive, setTimerActive] = useState(false);

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
        setIsCodeConfirmed(true); // 성공했으니 버튼 비활성화되도록
      } else {
        console.log("없는코드인디요");
        setIsCodeConfirmed(false); // 실패했으니 버튼 그대로 활성화
      }
    } catch (error) {
      console.error("초대코드 error입니당", error);
      setIsValidInviteCode(false); // 오류 시에도 실패로 간주
      setIsCodeConfirmed(false);
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
      setIsEmailSent(true); // 성공했으니 버튼 비활성화되도록
      setTimeLeft(180); // 시간 초기화
      setTimerActive(true); // 타이머 시작
    } catch (error) {
      console.error("이메일 보내는 함수 error입니당", error);
      setIsEmailSent(false); // 실패했으니 버튼 그대로 활성화
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
      console.log("emailAuthCode 상태", emailAuthCode);
      setIsEmailVerified(true); // 성공했으니 버튼 비활성화되도록
    } catch (error) {
      console.error("이메일 인증 코드 일치 함수 error입니당", error);
      setIsEmailVerified(false); // 실패했으니 버튼 그대로 활성화
    }
  };
  // 비민번호 조건 체크
  const lengthOk = passWord.length >= 8;
  const upperCaseOk = /[A-Z]/.test(passWord);
  // 비밀번호 확인란 작성 중 && 비밀번호와 일치하지 않을 때
  const isMismatch = confirmPassword !== "" && passWord !== confirmPassword;
  // 모든 텍스트를 다 적었으며 각 조건들에 부합하는가? (회원가입 Send 버튼 활성화 위함)
  const isFormValid =
    isCodeConfirmed && isEmailSent && isEmailVerified && lengthOk && upperCaseOk && passWord === confirmPassword;
  // 회원가입을 위한 최종 Send 버튼 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 이거 없으면 무조건 새로고침 됨..
    try {
      await axios.post(`${serverAPI}/api/user/join`, {
        email: emailCode,
        password: passWord,
        invitation_code: inviteCode,
      });
      console.log("회원가입 성공~!");
      navigate("/Login");
    } catch (error) {
      console.error("회원가입 error입니당", error);
    }
  };
  // useEffect 사용해서 이메일 인증 타이머 작동시키기!
  useEffect(() => {
    let timer;

    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    // 시간이 끝나면 멈추기
    if (timeLeft === 0) {
      setTimerActive(false);
    }

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);
  // 이메일 인증 타이머 시간 표시 포맷 함수
  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };
  return (
    <>
      <HeaderBack />
      <section className="signup__wrapper page-wrapper">
        <h2>Sign Up</h2>

        <form className="signup__form" onSubmit={handleSubmit}>
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
                  disabled={isCodeConfirmed} // 성공 시 비활성화
                />
                <button
                  className={`btn ${inviteCode.trim() !== "" ? "" : "btn--disabled"} ${
                    isCodeConfirmed ? "btn--disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault(); // ✅ 폼 제출 막기
                    checkInviteCode();
                  }}
                >
                  {isCodeConfirmed ? "Confirmed" : "Confirm Code"}
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
                  className={`btn ${emailCode.trim() !== "" ? "" : "btn--disabled"}${
                    isEmailSent ? "btn--disabled" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    sendEmailCode();
                  }}
                >
                  {isEmailSent ? "Send Confirmed" : "Send"}
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
                  disabled={timeLeft === 0 || isEmailVerified} // ⛔ 타임아웃 시 비활성화
                />
                <button
                  className={`btn ${emailAuthCode.trim() !== "" ? "" : "btn--disabled"} ${
                    isEmailVerified ? "btn--disabled" : ""
                  } ${timeLeft === 0 ? "btn--disabled" : ""}`}
                  disabled={timeLeft === 0 || isEmailVerified || emailAuthCode.trim() === ""}
                  onClick={(e) => {
                    e.preventDefault();
                    checkEmailAuthCode();
                  }}
                >
                  {isEmailVerified ? "Confirmed" : "Confirm"}
                  {/* <LoadingDots /> */}
                </button>
              </div>
              {isEmailSent && !isEmailVerified && (
                <div className="input-btn-field__info">
                  <span className="input-btn-field__resend">
                    Didn’t receive the code?{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        sendEmailCode(); // ✅ 인증 이메일 다시 보내는 함수
                      }}
                    >
                      Resend Code
                    </button>
                  </span>
                  <span className="input-btn-field__timer">
                    <strong>{formatTime(timeLeft)}</strong> until code expires
                  </span>
                </div>
              )}
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
              value={passWord}
              onChange={(e) => setPassWord(e.target.value)}
            />

            {/* 비밀번호 조건 안내 */}
            <ul className="password-rules">
              <li className={`${lengthOk ? "check" : ""}`}>At least 8 characters</li>
              <li className={`${upperCaseOk ? "check" : ""}`}>Must contain at least one uppercase letter</li>
            </ul>

            {/* 비밀번호 확인 - InputField 안 쓰고 직접 마크업 */}
            <div className={`input-btn-field ${isMismatch ? "input-btn-field--error" : ""}`}>
              <label htmlFor="userPwConfirm">Password Again</label>
              <div className="input-btn-field__box">
                <InputField
                  id="userPwConfirm"
                  type="password"
                  placeholder="Please enter the password again"
                  required
                  withToggle={true}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {/* 에러 메시지 */}
              <span className="input-btn-field__error-txt">Passwords do not match</span>
            </div>
          </fieldset>

          <button
            type="submit"
            className={`btn btn-login ${isFormValid ? "" : "btn--disabled"}`}
            disabled={!isFormValid}
          >
            Sign Up
            <LoadingDots />
          </button>
        </form>
      </section>
    </>
  );
}
export default SignUp;
