import { useState, useEffect } from "react";

const processBookmark = (
    bookmarks: chrome.bookmarks.BookmarkTreeNode[],
    path: string[]
) => {
    let tempBookmarks: {
        bookmark: chrome.bookmarks.BookmarkTreeNode;
        path: string[];
    }[] = [];

    // loop over current node for all childrens
    for (let i = 0; i < bookmarks.length; i++) {
        const bookmark = bookmarks[i];

        // link
        if (bookmark.url) {
            tempBookmarks.push({ bookmark, path });
        }

        // folder
        if (bookmark.children) {
            const folder = bookmark.children;
            tempBookmarks = [
                ...tempBookmarks,
                ...processBookmark(
                    folder,
                    bookmark.title === "" ? path : [...path, bookmark.title]
                ),
            ];
        }
    }

    return tempBookmarks;
};

const useBookmarks = () => {
    const [bookmarkData, setBookmarkData] = useState<
        {
            bookmark: chrome.bookmarks.BookmarkTreeNode;
            path: string[];
        }[]
    >([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            const allBookmarks = await chrome.bookmarks.getTree();
            const fetchedBookmarks = processBookmark(allBookmarks, []);

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
