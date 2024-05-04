import { Route, Routes } from "react-router-dom";
import WordPartyTesting from "./pages/WordPartyTesting";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/wordpartytesting"
          element={<WordPartyTesting></WordPartyTesting>}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
