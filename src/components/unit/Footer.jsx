import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

// img
import logoImg from "../../assets/images/logo/logo-affiliate-02.svg";
import iconNaver from "../../assets/images/footer/footer-icon-naver.svg";
import iconThread from "../../assets/images/footer/footer-icon-thread.svg";
import iconMedium from "../../assets/images/footer/footer-icon-medium.svg";
import iconDiscord from "../../assets/images/footer/footer-icon-discord.svg";
import iconX from "../../assets/images/footer/footer-icon-x.svg";
import iconMob from "../../assets/images/footer/footer-icon-mob.svg";
import iconHash from "../../assets/images/footer/footer-icon-hash.svg";
import iconPol from "../../assets/images/footer/footer-icon-pol.svg";

// swipe
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// style
import "./Footer.scss";
import "swiper/css";
import "swiper/css/autoplay";

function Footer() {
  const dummyData = [
    {
      id: 1,
      coin: "polygon",
      coinLogo: iconHash, // 상단 import 된 아이콘
      hash: "0xeC9012345678b354",
      method: "Transfer",
      block: "#54,443,433",
    },
    {
      id: 2,
      coin: "polygon",
      coinLogo: iconPol,
      hash: "0xaB1234567890cdef",
      method: "Transfer",
      block: "64,494,473",
    },
    {
      id: 3,
      coin: "polygon",
      coinLogo: iconPol,
      hash: "0xaB1234567890cdef",
      method: "Transfer",
      block: "64,494,473",
    },
    {
      id: 4,
      coin: "polygon",
      coinLogo: iconPol,
      hash: "0xaB1234567890cdef",
      method: "Transfer",
      block: "64,494,473",
    },
  ];
  const formatHash = (hash) => {
    if (typeof hash !== "string" || hash.length < 10) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  return (
    <footer className="node-footer">
      <div className="node-footer__inner">
        <div className="node-footer__top">
          <h3 className="node-footer__top__logo">
            <Link to="/affiliate/dashboard">
              <img src={logoImg} alt="Music On the Block Affiliate Logo" />
            </Link>
          </h3>
          <ul className="node-footer__top__sns">
            <li>
              <Link to="https://blog.naver.com/musicontheblock" target="_blank" rel="noopener noreferrer">
                <img src={iconNaver} alt="Naver Blog Icon" />
              </Link>
            </li>
            <li>
              <Link to="https://www.threads.com/@musicaiblock?hl=ko" target="_blank" rel="noopener noreferrer">
                <img src={iconThread} alt="Thread Icon" />
              </Link>
            </li>
            <li>
              <Link to="https://medium.com/@musicontheblock." target="_blank" rel="noopener noreferrer">
                <img src={iconMedium} alt="Mediium Icon" />
              </Link>
            </li>
            <li>
              <Link to="https://discord.com/invite/7zm6bcn76H" target="_blank" rel="noopener noreferrer">
                <img src={iconDiscord} alt="Discord Icon" />
              </Link>
            </li>
            <li>
              <Link to="https://x.com/musicaiblock" target="_blank" rel="noopener noreferrer">
                <img src={iconX} alt="X Icon" />
              </Link>
            </li>
          </ul>
        </div>
        <div className="node-footer__bottom">
          {/* <div className="node-footer__bottom__left">
            <address className="address-content">
              <p>
                <b>대표</b>
                <span>김낙일</span>
                <small>|</small>
                <b>사업자등록번호</b>
                <span>230-87-02707</span>
              </p>
              <p>
                <b>주소</b>
                <span>서울 동작구 어딘가</span>
              </p>
              <p>
                <b>문의</b>
                <span>02-0000-0000</span>
              </p>
            </address>
            <div className="link-content">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                회사소개
              </Link>
              <small>|</small>
              <Link to="/" target="_blank" rel="noopener noreferrer">
                이용약관
              </Link>
              <small>|</small>
              <Link to="/" target="_blank" rel="noopener noreferrer">
                개인정보처리방침
              </Link>
              <small>|</small>
              <Link to="/" target="_blank" rel="noopener noreferrer">
                마케팅 수신
              </Link>
            </div>
          </div> */}

          <div className="node-footer__bottom__right">
            <div className="token-ui mob-token">
              <div className="token-ui__mob-info">
                <div className="token-ui__mob-info__img-com">
                  <img src={iconMob} alt="Mob Icon" />
                  <dl className="token-ui__mob-info__img-com__tit">
                    <dt>MOB</dt>
                    <dd>MUSIC ON THE BLOCK Token</dd>
                  </dl>
                </div>
                <dl className="token-ui__mob-info__txt-com">
                  <dt>$0.03</dt>
                  <dd>-1.55%</dd>
                </dl>
              </div>
              <ul className="token-ui__mob-info-list">
                <li>
                  <h4>Transactions</h4>
                  <span>64,494,473</span>
                </li>
                <li>
                  <h4>Cirulationg supply</h4>
                  <span>-</span>
                  {/* 데이터 값이 없는 경우 '-'로 표현 */}
                </li>
                <li>
                  <h4>Market Cap</h4>
                  <span>-</span>
                </li>
              </ul>
            </div>
            <div className="token-ui">
              <Swiper
                modules={[Autoplay]}
                direction="vertical"
                slidesPerView={3}
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                className="hash-swiper"
              >
                {dummyData.map((item, index) => (
                  <SwiperSlide key={item.id}>
                    {({ isActive }) => (
                      <div className="slide-item">
                        <div className="slide-item__img-com">
                          <img src={isActive ? iconHash : iconPol} alt="Coin Icon" />
                          <dl className="slide-item__img-com__tit">
                            <dt>
                              hash : <span>{formatHash(item.hash)}</span>
                            </dt>
                            <dd>Method : {item.method}</dd>
                          </dl>
                        </div>
                        <p className="slide-item__txt-com">
                          <b>{item.block}</b>
                        </p>
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
