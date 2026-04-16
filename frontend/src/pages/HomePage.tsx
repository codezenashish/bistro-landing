import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { logout } from "../features/auth/authSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 ">
      <h1 className="text-4xl font-bold text-orange-600">Bistro Home</h1>
      <p className="mt-4 text-xl">Welcome, {user?.username}!</p>

      <button
        onClick={() => dispatch(logout())}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
