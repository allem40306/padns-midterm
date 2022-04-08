import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import services from "../services";

function Logout() {
  let history = useHistory();
  useEffect(() => {
    services.auth.loginCheck().then((response) => {
      if (response.data.loggedIn === true) {
        services.auth.logout();
      }
      history.push("/login");
      history.go(0);
    });
  }, [history]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>This is log out page!</div>
    </div>
  );
}

export default Logout;
