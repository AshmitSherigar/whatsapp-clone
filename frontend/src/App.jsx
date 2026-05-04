import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
// import Chat from "./components/Chat";

import Register from "./components/Register";
import Root from "./components/Root";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/" element={<Root />} />
    </Routes>
  );
};

export default App;
