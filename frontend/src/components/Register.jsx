import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import TopBar from "./TopBar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { register } = useAuth();

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
      await register(username, password);
      navigate("/");
    } catch (error) {
      console.log(`Register Error : ${error}`);
    }
  };

  return (
    <>
      <TopBar isLoginVisible={false} />
      <div className="h-screen w-full flex items-center justify-center bg-[#FCF5EB]">
        <div className="items-center justify-center border h-150 w-150 bg-gray-50 flex flex-col gap-2 rounded-2xl">
          <h1 className="text-5xl">Register</h1>
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
          <div className="flex items-center justify-center">
            <button
              className="rounded-xl border w-50 h-10 bg-blue-400 hover:cursor-pointer"
              onClick={handleClick}
            >
              Submit
            </button>
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div className="text-center">
            Already have a Account ?{" "}
            <Link replace to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
