import React, { useState, useEffect } from "react";

import "./BMI.css";
import {useNavigate} from "react-router-dom";


const BMI = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBMI] = useState(0);

  const Navigate = useNavigate();

  const handleGoBack = () => {
    Navigate('/MainPage');
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const handleWeightChange = (e) => {
    setWeight(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  useEffect(() => {
    if (height && weight) {
      const heightInMeter = height / 100;
      const bmiValue = weight / (heightInMeter * heightInMeter);
      setBMI(bmiValue.toFixed(2));
    }
  }, [height, weight]);

  const getBMIResult = () => {
    if (bmi < 18.5) return "저체중";
    if (bmi >= 18.5 && bmi < 23) return "정상 체중";
    if (bmi >= 23 && bmi < 25) return "과체중";
    if (bmi >= 25 && bmi < 30) return "비만";
    return "고도비만";
  };

  const bmiResult = getBMIResult();

  const bmiTable = [
    { category: "저체중", range: "< 18.5" },
    { category: "정상 체중", range: "18.5 - 23" },
    { category: "과체중", range: "23 - 25" },
    { category: "비만", range: "25 - 30" },
    { category: "고도 비만", range: "≥ 30" },
  ];

  return (
<>
<button className="goBackButton" onClick={handleGoBack}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
  뒤로가기
</button>
    <div className="container">
      <div className="header">
        <div>BMI 계산기</div>
      </div>

      <div className="measurement">
        <h2>키와 체중 입력</h2>
        <div>
          <label>
            키(cm):
            <input type="text" value={height} onChange={handleHeightChange} />
          </label>
        </div>
        <div>
          <label>
            체중(kg):
            <input type="text" value={weight} onChange={handleWeightChange} />
          </label>
        </div>
        <div>
          <label>
            나이(만):
            <input type="text" value={age} onChange={handleAgeChange} />
          </label>
        </div>
      </div>

      <div className="bmi">
        <h2>BMI 계산</h2>
        <p>BMI: {bmi}</p>
        <p>결과: {bmiResult}</p>
      </div>

      <div className="bmi-table">
        <h2>BMI 기준표</h2>
        <table>
          <thead>
            <tr>
              <th>범주</th>
              <th>범위</th>
            </tr>
          </thead>
          <tbody>
            {bmiTable.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>
                <td>{item.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>);
};

export default BMI;
