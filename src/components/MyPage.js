import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPage.css";

const MyPage = () => {
  const [exerciseGoal, setExerciseGoal] = useState("");

  const handleGoalChange = (e) => {
    setExerciseGoal(e.target.value);
  };

  const [expirationDate, setExpirationDate] = useState("");
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [usageHistory, setUsageHistory] = useState([]);
  const [selectedUsage, setSelectedUsage] = useState(null);

  const handleButtonClick = (feature) => {
    console.log(`Clicked ${feature}`);
  };

  // 헬스장 이용내역
  const membershipData = {
    expirationDate: "2023-12-31",
    usageHistory: [
      { date: "2023-01-15", time: "10:30" },
      { date: "2023-02-05", time: "15:45" },
      { date: "2023-03-20", time: "18:20" },
      { date: "2023-04-01", time: "13:00" },
      { date: "2023-04-13", time: "13:20" },
    ],
  };

  useEffect(() => {
    // 만료 날짜와 사용 기록 초기화
    setExpirationDate(membershipData.expirationDate);
    setUsageHistory(membershipData.usageHistory);

    // 남은 일 수 계산
    const today = new Date();
    const expiration = new Date(membershipData.expirationDate);
    const diffTime = Math.abs(expiration - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysRemaining(diffDays);
  }, []);

  const handleUsageClick = (index) => {
    setSelectedUsage(index === selectedUsage ? null : index);
  };

  //pt예약부분
  const [PTsubscription, setPTsubscription] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservation, setReservation] = useState("");
  const [reservationHistory, setReservationHistory] = useState([]);
  const [trainers, setTrainers] = useState([]); // PT 트레이너 목록

  const token = localStorage.getItem("token");

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    handlePTsubscriptionLoad();
    console.log(reservationDate);
  }, []);

  useEffect(() => {
    handleReservationHistory();
  }, []);

  const handlePTsubscriptionLoad = () => {
    axios
      .get("http://43.200.171.222:8080/api/pt-subscriptions/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        setPTsubscription(response.data.availableCount);
        console.log(response);
      })
      .catch((error) => console.log(error));
  };

  const handlePTreservationSubmit = () => {
    axios
      .post(
        "http://43.200.171.222:8080/api/reservations",
        {
          reservationTime: reservation,
          reservationTrainerId: trainers, // 선택한 트레이너 ID 사용
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
    }
      )
      .then((response) => {
        handleReservationHistory();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReservationHistory = () => {
    axios
      .get("http://43.200.171.222:8080/api/user", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((response) => {
        console.log(response.data);
        setReservationHistory([response.data]);
        console.log(reservationHistory);
      })
      .catch((error) => console.log(error));
  };

  const handleTimeSlotClick = (hour) => {
    const selectedDateTime = new Date(reservationDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setReservation(selectedDateTime);
    console.log(selectedDateTime);
  };

  const handleReservationDateChange = (event) => {
    setReservationDate(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://43.200.171.222:8080/api/trainers")
      .then((response) => {
        setTrainers(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div>회원님😊</div>
      </div>

      <div className="exercise-goal">
        <h2>운동 목적</h2>
        <select value={exerciseGoal} onChange={handleGoalChange}>
          <option value="">선택하세요</option>
          <option value="건강">건강</option>
          <option value="바디프로필">바디프로필</option>
          <option value="몸매 유지">몸매 유지</option>
          <option value="다이어트">다이어트</option>
        </select>
      </div>
      <div className="membership-container">
        <h3 className="usage-heading">이용 기록</h3>
        <p className="usage-allday">사용 일 수 : {usageHistory.length}일</p>
        <ul className="usage-history">
          {usageHistory.map((usage, index) => (
            <li
              key={index}
              onClick={() => handleUsageClick(index)}
              className={index === selectedUsage ? "selected" : ""}
            >
              {usage.date} (
              {new Date(usage.date).toLocaleDateString("ko-KR", {
                weekday: "long",
              })}
              ){index === selectedUsage && <span> - {usage.time}</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-box reservation-history">
        <h2>PT 예약 내역</h2>

        {reservationHistory.map((reservation, index) => (
          <div
            key={index}
            className={`reservation-item ${
              reservation.date < getCurrentDate() ? "past" : "current"
            }`}
          >
            <p>
              일시: {reservation.reservationTime[0]}년{" "}
              {reservation.reservationTime[1]}월{" "}
              {reservation.reservationTime[2]}일{" "}
              {reservation.reservationTime[3]}시
            </p>
            <p>담당 트레이너: {reservation.trainerName} 비응신</p>
          </div>
            ))}
      </div>
    </div>
  );
};

export default MyPage;
