import ListItem from "./ListItem";

const TabList = ({
    tabData,
}: {
    tabData: {
        tab: chrome.tabs.Tab;
        group: chrome.tabGroups.TabGroup | null;
    }[];
}) => {
    return (
        <>
            {tabData.map((tab, index) => {
                return (
                    <ListItem
                        key={`tab-${tab.tab.id}`}
                        type="tab"
                        item={tab}
                        keywords={[
                            tab.tab.title ?? "",
                            tab.tab.url ?? "",
                            "tabs",
                        ]}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default TabList;
