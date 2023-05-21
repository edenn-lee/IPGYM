import React, { useState } from "react";
import Button from "./Button";
import { NavLink } from "react-router-dom";
import "./MainPage.css"; // CSS 파일 import

const MainPage = () => {
  const handleButtonClick = (feature) => {
    console.log(`Clicked ${feature}`);
  };

  const [showSignupForm, setShowSignupForm] = useState(false); // 회원가입 폼을 나타내는 상태 변수

  const toggleSignupForm = () => {
    setShowSignupForm(!showSignupForm);
  };

  return (
    <div className="main-page">
      <h1 className="main-title">Main Page</h1>
      <div className="button-container">
        <NavLink exact to="/signup" activeClassName="active">
          <Button
            text="회원 가입"
            onClick={() => handleButtonClick("회원 가입")}
          />
        </NavLink>
        <NavLink exact to="/login" activeClassName="active">
          <Button text="로그인" onClick={() => handleButtonClick("로그인")} />
        </NavLink>
        <NavLink exact to="/mypage" activeClassName="active">
          <Button
            text="마이페이지"
            onClick={() => handleButtonClick("마이페이지")}
          />
        </NavLink>
        <NavLink exact to="/ptticket" activeClassName="active">
          <Button
            text="PT 이용권"
            onClick={() => handleButtonClick("PT 이용권")}
          />
        </NavLink>
        <NavLink exact to="/ptreservation" activeClassName="active">
          <Button text="PT 예약" onClick={() => handleButtonClick("PT 예약")} />
        </NavLink>
        <NavLink exact to="/membership" activeClassName="active">
          <Button
            text="헬스장 이용권"
            onClick={() => handleButtonClick("헬스장 이용권")}
          />
        </NavLink>
      </div>
    </div>
  );
};

export default MainPage;
