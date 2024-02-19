import { useEffect, useState } from "react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
    const [tabData, setTabData] = useState<chrome.tabs.Tab[]>([]);
    const [bookmarkData, setBookmarkData] = useState<
        chrome.bookmarks.BookmarkTreeNode[]
    >([]);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        // Fetch tabs
        const fetchTabs = async () => {
            const tabs = await chrome.tabs.query({
                url: ["http://*/*", "https://*/*"],
                currentWindow: true,
            });
            setTabData(tabs);
        };
        fetchTabs();

        return () => setTabData([]);
    }, []);

    useEffect(() => {
        // Fetch bookmarks
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
            setBookmarkData(fetchedBookmarks);
        };
        fetchBookmarks();

        return () => setBookmarkData([]);
    }, []);

    useEffect(() => {
        // Set up command listener
        const commandListener = (command: string) => {
            console.log(command);
            document.getElementById("search_bar")?.focus();
        };
        chrome.commands.onCommand.addListener(commandListener);

        return () => chrome.commands.onCommand.removeListener(commandListener);
    }, []);

    useEffect(() => {
        // Auto-focus on the search bar
        const autofocus = setTimeout(() => {
            (
                document.getElementById("search_bar") as HTMLInputElement
            )?.focus();
        }, 100);

        return () => clearTimeout(autofocus);
    }, []);

    return (
        <div className="w-screen h-screen scroll-smooth overflow-auto flex flex-col m-0">
            <Input
                id="search_bar"
                className="w-full m-0"
                onFocus={(e) => e.target.select()}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <ScrollArea className="rounded-md border m-0">
                <ul className="flex flex-col gap-2">
                    {tabData.map((tab) => {
                        return tab.title
                            ?.toUpperCase()
                            .includes(searchText.toUpperCase()) ? (
                            <li
                                className="px-5 justify-between flex items-center"
                                key={tab.id}
                            >
                                <Badge>Tab</Badge>
                                <p className="max-w-[75%]">{tab.title}</p>
                                <Button
                                    className="bg-blue-500"
                                    onClick={() => {
                                        chrome.tabs.highlight({
                                            tabs: tab.index,
                                        });
                                    }}
                                >
                                    go
                                </Button>
                            </li>
                        ) : (
                            <></>
                        );
                    })}
                </ul>
                <ul className="flex flex-col gap-2 mt-2">
                    {bookmarkData.map((bookmark) => {
                        return bookmark.title
                            ?.toUpperCase()
                            .includes(searchText.toUpperCase()) ? (
                            <li
                                className="px-5 justify-between flex items-center"
                                key={bookmark.id}
                            >
                                <Badge>Bookmark</Badge>
                                <p className="max-w-[75%]">{bookmark.title}</p>
                                <Button
                                    className="bg-blue-500"
                                    onClick={() => {
                                        chrome.tabs.create({
                                            url: bookmark.url,
                                        });
                                    }}
                                >
                                    go
                                </Button>
                            </li>
                        ) : (
                            <></>
                        );
                    })}
                </ul>
            </ScrollArea>
        </div>
    );
}

export default App;
