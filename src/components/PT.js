import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PT.css';
import {useNavigate} from "react-router-dom";

function PT() {
  const [PTsubscription, setPTsubscription] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservation, setReservation] = useState('');
  const [reservationHistory, setReservationHistory] = useState([]);
  const [trainerlist, setTrainerList] = useState([]); // PT 트레이너 목록
  const [reservationTrainerId, setReservationTrainerId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [showConfirmCheck, setShowConfirmCheck] = useState(false);
  
  const Navigate = useNavigate();

  const handleGoBack = () => {
    Navigate('/MainPage');
  };

  const token = localStorage.getItem('token');

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log(reservation);
  }, [reservation]);


  useEffect(() => {
    handlePTsubscriptionLoad();
    console.log(reservationDate);
  }, []);

  useEffect(() => {
    console.log(reservationTrainerId);
  }, [reservationTrainerId]);

  useEffect(() => {
    handleReservationHistory();
    console.log(reservationHistory);
  }, []);

  const handlePTsubscriptionLoad = () => {
    axios
      .get("http://43.200.171.222:8080/api/pt-subscriptions/user", {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      .then(response => {
        setPTsubscription(response.data.availableCount);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }

  const handlePTreservationSubmit = () => {
    if (reservationTrainerId && reservationDate && reservation) {
      axios
        .post("http://43.200.171.222:8080/api/reservations", {
          reservationTime: reservation,
          reservationTrainerId: reservationTrainerId
        }, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
        .then(response => {
          handleReservationHistory();
          console.log(response);
          setReservationDate(""); 
          setReservation(""); 
          setReservationTrainerId(""); 
          setShowConfirmModal(false);
        })
        .catch(error => {
          console.error(error);
        });
    }
    else{
    alert("Error : 트레이너, 날짜, 시간이 모두 제대로 입력되었는지 확인해주세요.");
    }
  };

  const handleReservationHistory = () => {
    axios
      .get("http://43.200.171.222:8080/api/user", {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      .then(response => {
        console.log(response.data);
        setReservationHistory(response.data);
        console.log(reservationHistory);
      })
      .catch(error => console.log(error));
  }

  const handleTimeSlotClick = (hour) => {
    const selectedDateTime = new Date(reservationDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
    const formattedDateTime = [
      selectedDateTime.getFullYear(),
      selectedDateTime.getMonth() + 1,
      selectedDateTime.getDate(),
      selectedDateTime.getHours(),
      selectedDateTime.getMinutes()
    ];
    console.log(formattedDateTime);
    setReservation(formattedDateTime);
    
  };

  const handleReservationDateChange = (event) => {
    setReservationDate(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    axios
      .get("http://43.200.171.222:8080/api/trainer", {
        headers: {
          Authorization: 'Bearer ' + token,
        }
      })
      .then(response => {
        setTrainerList(response.data);
        console.log(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleConfirmModal=()=>{
    setShowConfirmModal(1);
  }


  return (
    <>
    <button className="goBackButton" onClick={handleGoBack}>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
  뒤로가기
</button>
    <div className="pt-component">
      <div className="pt-box">
        <h2>남은 PT 이용권</h2>
        <h3>{PTsubscription}</h3>
        <h2>담당 트레이너 선택</h2>

        <div>
          <select
            style={{ marginBottom: "2rem" }}
            value={reservationTrainerId}
            onChange={(e) => setReservationTrainerId(e.target.value)}
          >
            <option value="">트레이너 선택</option>
            {trainerlist.map(trainer => (
              <option key={trainer.id} value={trainer.id}>{trainer.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p>날짜 선택:</p>
          <input
            type="date"
            value={reservationDate}
            min={getCurrentDate()}
            onChange={handleReservationDateChange}
            style={{ marginBottom: "1.5rem" }}
          />
        </div>

        <div className="time-slots">
          {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
            <div
              key={hour}
              className={`time-slot ${reservation && reservation[3] === hour ? 'selected' : ''}`}
              onClick={() => handleTimeSlotClick(hour)}
            >
              {hour}:00 - {hour + 1}:00
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirmModal}
          disabled={!(reservationTrainerId && reservationDate && reservation)}
        >
          예약하기
        </button>

        {showConfirmModal && (
        <div className="modaal">
          <div className="modaal-content">
            <h3>예약 확인</h3>
            <p>
              예약 일시 : {reservation[0]}년{" "}
              {reservation[1]}월{" "}
              {reservation[2]}일{" "}
              {reservation[3]}{' ~ '}{reservation[3]+1}시
            </p>
            <p>PT예약을 등록하시겠습니까?</p>
            <div className="modaal-buttons">
              <button onClick={handlePTreservationSubmit}>확인</button>
              <button onClick={() => setShowConfirmModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
}

export default PT;