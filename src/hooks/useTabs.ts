import { useEffect, useState } from "react";

const useTabs = () => {
    const [tabData, setTabData] = useState<chrome.tabs.Tab[]>([]);

    useEffect(() => {
        const fetchTabs = async () => {
            const tabs = await chrome.tabs.query({
                url: ["http://*/*", "https://*/*"],
                currentWindow: true,
            });
            return tabs;
        };
        fetchTabs()
            .then((tabs) => setTabData(tabs))
            .catch((error) => console.log(error));
        return setTabData([]);
    }, []);

    return tabData;
};

export default useTabs;
