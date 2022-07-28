import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function JadwalKSL() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchData(): Promise<void> {
            let fetchedData: any = await fetch("https://ksl-himaforka.web.app/api/v1/jadwal-ksl");
            fetchedData = await fetchedData.json();
            setData(fetchedData);
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="select-none bg-gray-900 flex flex-row items-center justify-center min-h-screen">
                <div className="bg-gray-800 flex flex-col items-center justify-center w-9/12 pt-4 pb-4">
                    <nav className="flex flex-row items-center justify-center">
                        <Link className="text-xl text-white tracking-wide p-4 transition-all hover:scale-110" to="/">Home</Link>
                    </nav>

                    <main>
                        {data && data.length > 0 &&
                            <div className="p-2 text-center">
                                {data.map(data => (
                                    <div className="p-2" key={data[1]}>
                                        <div className="overflow-x-auto">
                                            <span className="font-bold text-white"> {data[1]} </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <span className="font-normal text-white"> {data[2]} </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </main>
                </div>
            </div>
        </>
    );
}

export default JadwalKSL;
