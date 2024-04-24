import ListItem from "./ListItem";

const TabList = ({ tabData }: { tabData: chrome.tabs.Tab[] }) => {
    return (
        <>
            {tabData.map((tab) => {
                return (
                    <ListItem
                        key={tab.id}
                        type="tab"
                        item={tab}
                        keywords={[tab.url ?? ""]}
                    />
                );
            })}
        </>
    );
};

export default TabList;
