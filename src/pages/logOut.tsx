function LogOut() {
  document.cookie = "token=";
  return <>
    <h2>Logged out</h2>
    <p>You have been logged out.</p>
    <a href="/logIn"><button>Log back in</button></a>
  </>
}

export default LogOut;
