import { useEffect, useState } from "react";

const fetchTabGroup = async (groupId: number) => {
    if (groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) return null;

    const tabGroup = await chrome.tabGroups.get(groupId);
    return tabGroup;
};

const fetchTabs = async () => {
    const tabs = await chrome.tabs.query({
        url: ["http://*/*", "https://*/*"],
        currentWindow: true,
    });

    const tabsWithGroups = [];
    for (let i = 0; i < tabs.length; ++i) {
        const tab = tabs[i];
        const group = await fetchTabGroup(tab.groupId);
        tabsWithGroups.push({
            tab,
            group,
        });
    }

    return tabsWithGroups;
};

const useTabs = () => {
    const [ready, setReady] = useState(false);
    const [tabData, setTabData] = useState<
        {
            tab: chrome.tabs.Tab;
            group: chrome.tabGroups.TabGroup | null;
        }[]
    >([]);

    useEffect(() => {
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
