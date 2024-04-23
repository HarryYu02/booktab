import { useState, useEffect } from "react";

const useBookmarks = () => {
    const [bookmarkData, setBookmarkData] = useState<
        chrome.bookmarks.BookmarkTreeNode[]
    >([]);

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

    return bookmarkData;
};

export default useBookmarks;
