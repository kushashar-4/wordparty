import { Route, Routes } from "react-router-dom";
import SocketHome from "./pages/SocketTesting";

function App() {
  return (
    <>
      <Routes>
        <Route path="/testing" element={<SocketHome></SocketHome>}></Route>
      </Routes>
    </>
  );
}

export default App;
