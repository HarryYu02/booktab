import ListItem from "./ListItem";

const TabList = ({ tabData }: { tabData: chrome.tabs.Tab[] }) => {
    return (
        <>
            {tabData.map((tab, index) => {
                return (
                    <ListItem
                        key={`tab-${tab.id}`}
                        type="tab"
                        item={tab}
                        keywords={[tab.title ?? "", tab.url ?? "", "tabs"]}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default TabList;
