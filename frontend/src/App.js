import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./components/Register.jsx";
import UpdateFormAndDeleteForm from './components/UpdateFormAndDeleteForm.jsx';

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-[#eaf1fe]">
            <Router>
                <Navbar />
               
                <Routes>
                    <Route path="/" element={<Home />}/>                                            {/*首頁*/}
                    <Route path="/login" element={<Login />}/>                                      {/*登入*/}
                    <Route path="/register" element={<Register />}/>                                {/*註冊*/}
                    <Route path="/updateformanddeleteform" element={<UpdateFormAndDeleteForm />}/>  {/*預約*/}
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
