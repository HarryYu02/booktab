import { useEffect, useState } from "react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

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
        <div className="w-screen p-10 scroll-smooth overflow-auto">
            <Input />
            <ul className="flex flex-col">
                {tabData.map((tab) => {
                    return (
                        <li className="py-3 justify-between flex items-center">
                            {tab.title}
                            <Button
                                className="bg-blue-500"
                                onClick={() => {
                                    chrome.tabs.highlight({
                                        tabs: tab.index,
                                    });
                                }}
                            >
                                navigate
                            </Button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default App;
