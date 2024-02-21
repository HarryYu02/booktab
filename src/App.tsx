import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import ListItem from "@/components/ui/ListItem";

const strIncludeInsensitive = (target: string, str: string): boolean => {
    return str.toUpperCase().includes(target.toUpperCase());
};

const App = () => {
    const [tabData, setTabData] = useState<chrome.tabs.Tab[]>([]);
    const [bookmarkData, setBookmarkData] = useState<
        chrome.bookmarks.BookmarkTreeNode[]
    >([]);
    const [searchText, setSearchText] = useState<string>("");
    // const [option, setOption] = useState<string>("");

    // Fetch tabs
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

        return () => setTabData([]);
    }, []);

    // Fetch bookmarks
    useEffect(() => {
        const fetchBookmarks = async () => {
            const processBookmark = (
                bookmarks: chrome.bookmarks.BookmarkTreeNode[]
            ) => {
                let tempBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [];
                for (let i = 0; i < bookmarks.length; i++) {
                    const bookmark = bookmarks[i];
                    // link
                    if (bookmark.url) {
                        tempBookmarks.push(bookmark);
                    }
                    // folder
                    if (bookmark.children) {
                        const folder = bookmark.children;
                        tempBookmarks = [
                            ...tempBookmarks,
                            ...processBookmark(folder),
                        ];
                    }
                }
                return tempBookmarks;
            };
            const allBookmarks = await chrome.bookmarks.getTree();
            const fetchedBookmarks = processBookmark(allBookmarks);

            return fetchedBookmarks;
        };
        fetchBookmarks()
            .then((bookmarks) => setBookmarkData(bookmarks))
            .catch((error) => console.log(error));

        return () => setBookmarkData([]);
    }, []);

    // Set up command listener
    useEffect(() => {
        const commandListener = (command: string) => {
            console.log(command);
            document.getElementById("search_bar")?.focus();
        };
        chrome.commands.onCommand.addListener(commandListener);

        return () => chrome.commands.onCommand.removeListener(commandListener);
    }, []);

    // Auto-focus on the search bar
    useEffect(() => {
        const autofocus = setTimeout(() => {
            (
                document.getElementById("search_bar") as HTMLInputElement
            )?.focus();
        }, 100);

        return () => clearTimeout(autofocus);
    }, []);

    return (
        <div className="flex h-full w-full min-w-0 flex-col justify-between">
            <div className="h-auto bg-background p-4">
                <Input
                    id="search_bar"
                    className="h-auto w-full select-all text-lg ring-1 ring-primary selection:bg-gray-400 selection:text-white focus-visible:ring-2"
                    onFocus={(e) => {
                        e.target.select();
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    tabIndex={1}
                    placeholder="Start typing..."
                />
            </div>
            <ul className="h-full w-full snap-y snap-mandatory snap-always overflow-auto scroll-smooth">
                {tabData.map((tab) => {
                    return (
                        tab.title &&
                        tab.url &&
                        (strIncludeInsensitive(searchText, tab.title) ||
                            strIncludeInsensitive(searchText, tab.url)) && (
                            <ListItem key={tab.id} type="tab" item={tab} />
                        )
                    );
                })}
                {bookmarkData.map((bookmark) => {
                    return (
                        bookmark.title &&
                        bookmark.url &&
                        (strIncludeInsensitive(searchText, bookmark.title) ||
                            strIncludeInsensitive(
                                searchText,
                                bookmark.url
                            )) && (
                            <ListItem
                                key={bookmark.id}
                                type="bookmark"
                                item={bookmark}
                            />
                        )
                    );
                })}
            </ul>
        </div>
    );
};

export default App;
