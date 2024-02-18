import "./App.css";
import { useEffect, useState } from "react";

function App() {
    const [tabData, setTabData] = useState<chrome.tabs.Tab[]>([]);

    useEffect(() => {
        const fetchTabs = async () => {
            // get all opened tabs
            const tabs = await chrome.tabs.query({
                url: ["http://*/*", "https://*/*"],
            });
            setTabData(tabs);
        };
        fetchTabs();

        return () => {
            setTabData([]);
        };
    }, []);

    return (
        <>
            <ul className="flex flex-col">
                {tabData.map((tab) => {
                    return (
                        <li className="py-3 justify-between flex items-center w-full">
                            {tab.title}
                            <button
                                className="bg-blue-500"
                                onClick={() => {
                                    chrome.tabs.highlight({
                                        tabs: tab.index,
                                    });
                                }}
                            >
                                navigate
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}

export default App;
