import { useEffect, useState } from "react";
import useTabs from "./hooks/useTabs";
import useBookmarks from "./hooks/useBookmarks";
import SearchingList from "./components/SearchingList";

const App = () => {
    const tabData = useTabs();
    const bookmarkData = useBookmarks();
    const [searchText, setSearchText] = useState<string>("");

    // Set up command listener
    useEffect(() => {
        const commandListener = (command: string) => {
            console.log(command);
            document.getElementById("search_bar")?.focus();
        };
        chrome.commands.onCommand.addListener(commandListener);

        return () => chrome.commands.onCommand.removeListener(commandListener);
    }, []);

    return (
        <div className="flex h-screen flex-col items-center justify-center p-2">
            <SearchingList
                tabData={tabData}
                bookmarkData={bookmarkData}
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </div>
    );
};

export default App;
