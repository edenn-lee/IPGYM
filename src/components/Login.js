import React, { useState} from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [path,setPath] = useState("");
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://43.200.171.222:8080/auth/login", {
        email: email,
        password: password
      }, );

      console.log(response);
      localStorage.setItem('token',response.data.accessToken);
      localStorage.setItem('user',email);
      console.log(localStorage.getItem('token'))
      
      // setIsAuthenticated(true);
      if (email =='admin@1') {
        setPath('/admin')
        console.log(path);
      }
      else {
        setPath('/mainpage')
        console.log(path);
      }
    

      props.setIsAuthenticated(true);
      console.log('Login success');
    } catch (error) {
      console.error(error);
      alert("로그인에 실패하였습니다. 알맞은 이메일과 비밀번호를 입력해주세요.")
    }
  };


  if (props.IsAuthenticated) {
    return <Navigate to={path} />;
  }

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            style={{marginBottom:"1rem"}}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" onClick={handleSubmit}>로그인</button>
        <Link to="/signup">회원가입</Link>  
      </form>
      
    </div>
  );
};

export default Login;
