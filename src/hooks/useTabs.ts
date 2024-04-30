import { useEffect, useState } from "react";

const useTabs = () => {
    const [ready, setReady] = useState(false);
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
            .then((tabs) => {
                setTabData(tabs);
                setReady(true);
            })
            .catch((error) => console.log(error));
        return setTabData([]);
    }, []);

    return { tabData, isLoading: !ready };
};

export default useTabs;
