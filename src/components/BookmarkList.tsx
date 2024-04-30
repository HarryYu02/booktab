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
                        item={bookmark.bookmark}
                        keywords={[
                            ...bookmark.path,
                            bookmark.bookmark.title,
                            bookmark.bookmark.url ?? "",
                            "bookmarks",
                        ]}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default BookmarkList;
