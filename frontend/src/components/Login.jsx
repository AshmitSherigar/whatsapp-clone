import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TopBar from "./TopBar";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleClick = async () => {
    try {
      // Checks : Invalid or Blank Characters
      if (!username || !password) {
        setError("Invalid Input : Username or Password");
      }
      await login(username, password);
      navigate("/");
    } catch (error) {
      console.log(`Login Error : ${error}`);
    }
  };

  return (
    <>
      <TopBar isLoginVisible={false} />
      <div className="h-screen w-full flex items-center justify-center bg-[#FCF5EB]">
        <div className="items-center justify-center border h-150 w-150 bg-gray-50 flex flex-col gap-2 rounded-2xl">
          <h1 className="text-5xl">LOGIN</h1>
          <input
            className="border h-12 px-5 rounded-2xl"
            value={username}
            type="text"
            placeholder="Username"
            onChange={handleUsername}
          />
          <input
            className="border h-12 px-5 rounded-2xl"
            value={password}
            type="password"
            placeholder="Password"
            onChange={handlePassword}
          />
          <div className="flex flex-col items-center justify-center">
            <button
              className="rounded-xl border w-30 h-10 bg-blue-400 hover:cursor-pointer"
              onClick={handleClick}
            >
              Next
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="text-center">
            Dont have a Account ?{" "}
            <Link replace to={"/register"}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
