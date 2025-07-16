import { Link } from 'react-router-dom';
// img
import logoImg from '../assets/images/logo/logo-affiliate-01.svg';
// Components
import InputField from '../components/unit/InputField';
import LoadingDots from '../components/unit/LoadingDots';
import ModalWrap from '../components/modal/ModalWrap';
import ConfirmModal from '../components/modal/ConfirmModal';
// style
import '../styles/pages/Login.scss';


function Login() {
  return (
    <div className="login login__wrapper">
      <div className="login__box">
        <h1 className="login__logo">
          <img src={logoImg} alt="Music On the Block Affiliate Logo" />
          <span>Welcome to our affiliate service</span>
        </h1>

        <form className="login__form">
            <fieldset>
                <InputField
                id="userId"
                label="ID"
                type="email"
                placeholder="Please enter your ID"
                required
                />
                <InputField
                id="userPw"
                label="Password"
                type="password"
                placeholder="Please enter your password"
                required
                />
            </fieldset>
            <button className="btn btn-login btn--disabled">
                Login<LoadingDots />
                {/* 비활성화--disabled / 활성화--active / 로딩 중--loading */}
            </button>
        </form>

        <Link to="/signup" className='btn btn-signup'>Sign Up</Link>
      </div>
      
      {/* 로그인 실패 시 로그인 실패 모달 띄우기 */}
      {/* <ConfirmModal
            title="Login Failed"
            message="The ID or password you entered is incorrect."
            buttonText="OK"
            onClose={() => {}}
        /> */}
    </div>
  );
}

export default Login;
