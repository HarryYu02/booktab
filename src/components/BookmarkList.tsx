import ListItem from "./ListItem";

const BookmarkList = ({
    bookmarkData,
}: {
    bookmarkData: chrome.bookmarks.BookmarkTreeNode[];
}) => {
    return (
        <>
            {bookmarkData.map((bookmark) => {
                return (
                    <ListItem
                        key={bookmark.id}
                        type="bookmark"
                        item={bookmark}
                        keywords={[bookmark.url ?? ""]}
                    />
                );
            })}
        </>
    );
};

export default BookmarkList;
