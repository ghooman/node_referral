import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// img
import logoImg from '../../assets/images/logo/logo-affiliate-02.svg';
import iconBack from '../../assets/images/icon-arrow-back.svg';
import iconLang from '../../assets/images/icon-language.svg';
// style
import './Header.scss';
import './HeaderBack.scss';

function BackHeader() {
  const navigate = useNavigate();

  return (
      <header className='header header--back'>
        <div className="header__inner">
          <h1 className='header__inner__logo'>
              <button type="button" className="header-back__btn-back" onClick={() => navigate(-1)} aria-label="Go back">
                  <img src={iconBack} alt="Back" />
              </button>
              <Link to="/">
                <img src={logoImg} alt="Music On The Block Affiliate Logo" />
              </Link>
          </h1>
          <button type="button" className='header__inner__btn-lang' aria-label='Change language'>
            <img src={iconLang} alt="" aria-hidden="true" />
            <span>ENG</span>
          </button>
        </div>
    </header>
  );
}

export default BackHeader;