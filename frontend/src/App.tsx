import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import GamePage from './pages/GamePage';
import Debug from './components/debug';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="register" element={<RegisterPage/>} />
          <Route path="game" element={<GamePage/>}/>
          <Route path="debug" element={<Debug/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;