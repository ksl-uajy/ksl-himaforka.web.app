import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { useIsAuthenticated, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { graphConfig, loginRequest } from "../authConfig";

function DaftarKSL() {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState<{ [key: string]: any; }>({});
    const isAuthenticated = useIsAuthenticated();

    async function fetchData() {
        let graphToken: any = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        });
        graphToken = graphToken.accessToken;

        let fetchedData: any = await fetch(graphConfig.graphMeEndpoint, {
            headers: {
                Authorization: `Bearer ${graphToken}`
            }
        });
        fetchedData = await fetchedData.json();

        let graphData = {
            npm: fetchedData.mail.split("@")[0],
            full_name: fetchedData.displayName,
            email: fetchedData.mail,
            is_registered: false
        };

        fetchedData = await fetch(`http://localhost:3000/api/anggota-ksl?email=${fetchedData.mail}`);
        fetchedData = await fetchedData.json();
        if (fetchedData["status"] == "ok") {
            graphData["is_registered"] = true;
        }

        setGraphData(graphData);
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);


    function handleLogin(): void {
        instance.loginRedirect(loginRequest);
    }

    function handleLogout(): void {
        instance.logoutRedirect({ postLogoutRedirectUri: "/", });
    }

    async function handleRegister() {
        let resp: any = await fetch("http://localhost:3000/api/anggota-ksl", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(graphData),
        });
        resp = await resp.json();
        if (resp.status == "ok") {
            alert("Berhasil mendaftarkan anggota KSL!");
            fetchData();
        }
    };


    return (
        <>
            <div className="select-none bg-gray-900 flex flex-row items-center justify-center min-h-screen">
                <div className="bg-gray-800 flex flex-col items-center justify-center w-9/12 pt-4 pb-4">
                    <nav className="flex flex-row items-center justify-center">
                        <Link className="text-xl text-white tracking-wide p-4 transition-all hover:scale-110" to="/">Home</Link>
                    </nav>

                    <main>
                        <AuthenticatedTemplate>
                            {graphData && graphData["email"] &&
                                <div className="flex flex-col items-center justify-center">
                                    <div className="p-2 text-center">
                                        <div className="overflow-x-auto">
                                            <span className="font-bold text-white"> NPM </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <span className="font-normal text-white"> <>{graphData["npm"]}</> </span>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <div className="overflow-x-auto">
                                            <span className="font-bold text-white"> Nama </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <span className="font-normal text-white"> <>{graphData["full_name"]}</> </span>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <div className="overflow-x-auto">
                                            <span className="font-bold text-white"> Email </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <span className="font-normal text-white"> <>{graphData["email"]}</> </span>
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <div className="overflow-x-auto">
                                            <span className="font-bold text-white"> Status </span>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <span className="font-normal text-white"> <>{graphData["is_registered"] ? "Registered" : "Not Registered"}</> </span>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        {!graphData["is_registered"] &&
                                            <button className="bg-green-400 p-2" onClick={handleRegister}>Register</button>
                                        }
                                    </div>
                                    <div className="pt-4">
                                        <button className="bg-red-400 p-2" onClick={handleLogout}>Logout</button>
                                    </div>
                                </div>
                            }
                        </AuthenticatedTemplate>

                        <UnauthenticatedTemplate>
                            <div>
                                <button className="bg-green-400 p-2" onClick={handleLogin}>Join KSL</button>
                            </div>
                        </UnauthenticatedTemplate>
                    </main>
                </div>
            </div>
        </>
    );
}

export default DaftarKSL;
