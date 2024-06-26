import ListItem from "./ListItem";

const BookmarkList = ({
    bookmarkData,
}: {
    bookmarkData: {
        bookmark: chrome.bookmarks.BookmarkTreeNode;
        path: string[];
    }[];
}) => {
    return (
        <>
            {bookmarkData.map((bookmark, index) => {
                return (
                    <ListItem
                        key={`bookmark-${bookmark.bookmark.id}`}
                        type="bookmark"
                        item={{
                            bookmark: bookmark.bookmark,
                            path: bookmark.path,
                        }}
                        keywords={[
                            ...bookmark.path,
                            bookmark.bookmark.title,
                            bookmark.bookmark.url ?? "",
                            "bookmarks",
                        ].filter((x) => x !== "")}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default BookmarkList;
