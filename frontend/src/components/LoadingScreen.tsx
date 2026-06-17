import './LoadingScreen.css';
import logo from '../assets/logo/logo.png';

export default function LoadingScreen() {
    return (
        <div className="loading-container">
            <img src={logo} alt="Loading..." className="loading-logo" />
        </div>
    );
}
