import { useState } from "react";
import useTabs from "./hooks/useTabs";
import useBookmarks from "./hooks/useBookmarks";
import SearchingList from "./components/SearchingList";
import { ThemeProvider } from "./providers/ThemeProvider";

const App = () => {
    const tabData = useTabs();
    const bookmarkData = useBookmarks();
    const [searchText, setSearchText] = useState<string>("");

    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="flex h-screen flex-col items-center justify-center p-2">
                <SearchingList
                    tabData={tabData}
                    bookmarkData={bookmarkData}
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            </div>
        </ThemeProvider>
    );
};

export default App;
