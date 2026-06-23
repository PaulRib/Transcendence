import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from '../components/Layout';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import RegisterPage from './RegisterPage';
import ClassicGamePage from './ClassicGamePage';
import InfiniteGamePage from './InfiniteGamePage';
import RankedGamePage from './RankedGamePage';
import Debug from '../components/debug';
import SelectGame from './selectGame';
import SettingsPage from './settingsPage';
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { GuestRoute } from "../auth/GuestRoute";
import FriendsList from "./FriendsList";
import LeaderboardPage from "./LeaderboardPage";
import CountrydlePage from './countrydle/CountrydlePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage/>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="friends" element={<FriendsList />} />
            <Route path="leaderboard" element={<LeaderboardPage/>} />
          </Route>
          <Route path="classic" element={<ClassicGamePage/>}/>
          <Route path="infinite" element={<InfiniteGamePage/>}/>
          <Route path="ranked" element={<RankedGamePage/>}/>
          <Route path="debug" element={<Debug/>}/>
          <Route path="selectGame" element={<SelectGame/>}/>
          <Route path="countrydle" element={<CountrydlePage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
