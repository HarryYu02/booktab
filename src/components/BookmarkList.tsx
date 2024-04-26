import ListItem from "./ListItem";

const BookmarkList = ({
    bookmarkData,
}: {
    bookmarkData: chrome.bookmarks.BookmarkTreeNode[];
}) => {
    return (
        <>
            {bookmarkData.map((bookmark, index) => {
                return (
                    <ListItem
                        key={`bookmark-${bookmark.id}`}
                        type="bookmark"
                        item={bookmark}
                        keywords={[bookmark.url ?? "", "bookmarks"]}
                        index={index}
                    />
                );
            })}
        </>
    );
};

export default BookmarkList;
