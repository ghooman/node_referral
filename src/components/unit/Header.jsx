import { Link } from 'react-router-dom';
// img
import logoImg from '../../assets/images/logo/logo-affiliate-02.svg';
import iconLang from '../../assets/images/icon-language.svg';
// style
import './Header.scss';

function Header(){
  return (
    <header className='header'>
      <div className="header__inner">
        <h1 className='header__inner__logo'>
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
  )
}

export default Header