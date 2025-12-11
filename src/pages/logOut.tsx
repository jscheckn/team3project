import {Link} from "react-router-dom";
import {useAuth} from "../Components/AuthProvider";

function LogOut() {
  const {setLoggedIn} = useAuth();
  document.cookie = "token=";
  setLoggedIn(false);
  return <article>
    <h2 id="title">Logged out</h2>
    <p id="textOnPage">You have been logged out.</p>
    <Link to="/logIn"><button className="button-54">Log back in</button></Link>
  </article>
}

export default LogOut;
