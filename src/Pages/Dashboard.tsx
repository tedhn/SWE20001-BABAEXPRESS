import { Link } from "react-router-dom";
import heroImage from "../assets/heroImage.jpg";
import { useUser } from "~/Context/UserContext";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div
      className="bg-transparent min-h-screen flex flex-col "
      // style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="max-w-4xl mx-auto text-center p-6 mt-20 ">
        <img
          src={heroImage}
          alt="Bus"
          className="mb-8 rounded-lg shadow-md w-96 mx-auto"
          style={{ maxWidth: "100%" }}
        />

        <h1 className="text-4xl font-bold mb-4">Welcome to BaBa Express</h1>
        <p className="text-lg mb-8">
          Book your bus tickets hassle-free with us!
        </p>
        {user ? (
          <p className="text-lg mb-8">Start booking your tickets now!</p>
        ) : (
          <div>
            <p className="text-lg mb-4">
              Sign in or create an account to start booking your tickets!
            </p>
            <div className="flex justify-center">
              <Link
                to="/login"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg mr-4"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
