import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <div className="select-none bg-gray-900 flex flex-row items-center justify-center min-h-screen">
        <main className="bg-gray-800 flex flex-row items-center justify-center w-9/12 pt-4 pb-4">
          <Link className="text-xl text-white tracking-wide p-4 transition-all hover:scale-110" to="/jadwal-ksl">Jadwal KSL</Link>
          <Link className="text-xl text-white tracking-wide p-4 transition-all hover:scale-110" to="/daftar-ksl">Daftar KSL</Link>
        </main>
      </div>
    </>
  );
}

export default App;
