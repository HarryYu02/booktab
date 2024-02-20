import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import ListItem from "@/components/ui/ListItem";

const strIncludeInsensitive = (
  target: string,
  str: string | undefined
): boolean => {
  return str ? str.toUpperCase().includes(target.toUpperCase()) : false;
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
            tempBookmarks = [...tempBookmarks, ...processBookmark(folder)];
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
      (document.getElementById("search_bar") as HTMLInputElement)?.focus();
    }, 100);

    return () => clearTimeout(autofocus);
  }, []);

  return (
    <div className="w-full h-full flex flex-col min-w-0 min-h-0 p-4">
      <Input
        id="search_bar"
        className="w-full h-[10%] text-lg"
        onFocus={(e) => {
          e.target.select();
        }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div className="w-full h-[85%] max-w-full flex flex-col mt-2 overflow-auto">
        <ul className="flex flex-col gap-2 w-full p-2">
          {tabData.map((tab) => {
            return (
              (tab &&
                (strIncludeInsensitive(searchText, tab.title) ||
                  strIncludeInsensitive(searchText, tab.url))) ?? (
                <ListItem type="tab" item={tab} />
              )
            );
          })}
          {bookmarkData.map((bookmark) => {
            return (
              (bookmark &&
                (strIncludeInsensitive(searchText, bookmark.title) ||
                  strIncludeInsensitive(searchText, bookmark.url))) ?? (
                <ListItem type="bookmark" item={bookmark} />
              )
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;
