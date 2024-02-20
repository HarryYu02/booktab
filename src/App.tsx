import { useEffect, useState } from "react";

import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { ScrollBar } from "./components/ui/scroll-bar";

function App() {
  const [tabData, setTabData] = useState<chrome.tabs.Tab[]>([]);
  const [bookmarkData, setBookmarkData] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);
  const [searchText, setSearchText] = useState<string>("");
  // const [option, setOption] = useState<string>("");

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
            tempBookmarks = [...tempBookmarks, ...processBookmark(folder)];
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
      (document.getElementById("search_bar") as HTMLInputElement)?.focus();
    }, 100);

    return () => clearTimeout(autofocus);
  }, []);

  return (
    <div className="w-full h-full flex flex-col min-w-0 min-h-0 p-4">
      <Input
        id="search_bar"
        className="w-full h-[10%] text-[18px]"
        onFocus={(e) => {
          e.target.select();
        }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className="w-full h-[85%] max-w-full flex flex-col mt-2 overflow-auto">
        <ul className="flex flex-col gap-2 w-full p-2">
          {tabData.map((tab) => {
            return tab.title
              ?.toUpperCase()
              .includes(searchText.toUpperCase()) ||
              tab.url?.toUpperCase().includes(searchText.toUpperCase()) ? (
              <li key={tab.id}>
                <Button
                  className="bg-blue-400 w-full flex justify-between gap-2"
                  onClick={() => {
                    chrome.tabs.highlight({
                      tabs: tab.index,
                    });
                  }}
                >
                  <Badge className="">Tab</Badge>
                  <p className="text-ellipsis whitespace-nowrap overflow-hidden">
                    {tab.title}
                  </p>
                </Button>
              </li>
            ) : (
              <></>
            );
          })}
          {bookmarkData.map((bookmark) => {
            return bookmark.title
              ?.toUpperCase()
              .includes(searchText.toUpperCase()) ||
              bookmark.url?.toUpperCase().includes(searchText.toUpperCase()) ? (
              <li key={bookmark.id}>
                <Button
                  className="bg-blue-400 w-full flex justify-between gap-2"
                  onClick={() => {
                    chrome.tabs.create({
                      url: bookmark.url,
                    });
                  }}
                >
                  <Badge>Bookmark</Badge>
                  <p className="text-ellipsis whitespace-nowrap overflow-hidden">
                    {bookmark.title}
                  </p>
                </Button>
              </li>
            ) : (
              <></>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
