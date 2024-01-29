import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import SocketHome from "./pages/SocketTesting";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/game" element={<Game></Game>}></Route>
        <Route path="/testing" element={<SocketHome></SocketHome>}></Route>
      </Routes>
    </>
  );
}

export default App;
