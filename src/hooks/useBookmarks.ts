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

const fetchBookmarks = async () => {
    const allBookmarks = await chrome.bookmarks.getTree();
    const fetchedBookmarks = processBookmark(allBookmarks, []);

    return fetchedBookmarks;
};

const useBookmarks = () => {
    const [ready, setReady] = useState(false);
    const [bookmarkData, setBookmarkData] = useState<
        {
            bookmark: chrome.bookmarks.BookmarkTreeNode;
            path: string[];
        }[]
    >([]);

    const refetch = () => {
        setReady(false);
        fetchBookmarks()
            .then((bookmarks) => {
                setBookmarkData(bookmarks);
                setReady(true);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchBookmarks()
            .then((bookmarks) => {
                setBookmarkData(bookmarks);
                setReady(true);
            })
            .catch((error) => console.log(error));

        return () => setBookmarkData([]);
    }, []);

    return { bookmarkData, isLoading: !ready, refetch };
};

export default useBookmarks;
