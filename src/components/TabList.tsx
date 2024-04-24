import useTabs from "@/hooks/useTabs";
import ListItem from "./ListItem";

const TabList = ({ tabData }: { tabData: chrome.tabs.Tab[] }) => {
    return (
        <>
            {tabData.map((tab) => {
                return (
                    <ListItem
                        key={`tab-${tab.id}`}
                        type="tab"
                        item={tab}
                        keywords={[tab.url ?? "", "tabs"]}
                    />
                );
            })}
        </>
    );
};

export default TabList;
