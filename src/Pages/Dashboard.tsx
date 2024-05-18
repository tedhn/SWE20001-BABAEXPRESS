import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "~/Context/UserContext";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useUser();

  useEffect(() => {
    if (!user) {
			console.log("SDFSdf");
      navigate("login");
    }
  }, []);

  return <div>Welcome Home {user?.name}</div>;
};

export default Dashboard;
