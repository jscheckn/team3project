import {useAuth} from "../Components/AuthProvider";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const requireLogin = () => {
  const {loggedIn} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loggedIn)
      navigate('/login');
  }, [loggedIn, navigate]);
};

export default requireLogin;