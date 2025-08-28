
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './Context/SocketContext';

createRoot(document.getElementById('root')).render(
    <SocketProvider>
     <HashRouter>
    <App />
</HashRouter>
    </SocketProvider>

)

