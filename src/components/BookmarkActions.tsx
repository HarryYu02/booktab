import { MdOpenInBrowser } from "react-icons/md";
import { CommandItem } from "./ui/command";

const BookmarkActions = ({
    bookmark,
    refetchBookmarks,
}: {
    bookmark: chrome.bookmarks.BookmarkTreeNode | null;
    refetchBookmarks: () => void;
}) => {
    return (
        <>
            <CommandItem
                onSelect={() => {
                    chrome.tabs
                        .update({
                            url: bookmark?.url,
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    window.close();
                }}
                className="flex items-center gap-2"
            >
                <MdOpenInBrowser className="size-4" />
                Open in current tab
            </CommandItem>
        </>
    );
};

export default BookmarkActions;
