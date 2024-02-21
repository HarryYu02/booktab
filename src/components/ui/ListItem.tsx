import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookmarkItem {
    type: "bookmark";
    item: chrome.bookmarks.BookmarkTreeNode;
}

interface TabItem {
    type: "tab";
    item: chrome.tabs.Tab;
}

type ListItemProps = BookmarkItem | TabItem;

const ListItem = ({ type, item }: ListItemProps) => {
    const onClickHandler = () => {
        type === "tab"
            ? chrome.tabs
                  .highlight({
                      tabs: item.index,
                  })
                  .catch((error) => console.log(error))
            : chrome.tabs
                  .create({
                      url: item.url,
                  })
                  .catch((error) => console.log(error));
    };

    return (
        <li key={item.id} className="">
            <Button
                variant="outline"
                className="w-full flex justify-between gap-2 focus-visible:ring-blue-500 focus-visible:ring-2"
                onClick={onClickHandler}
            >
                <Badge className="">
                    {type === "tab" ? "Tab" : "Bookmark"}
                </Badge>
                <p className="text-ellipsis whitespace-nowrap overflow-hidden text-lg text-primary">
                    {item.title}
                </p>
            </Button>
        </li>
    );
};

export default ListItem;
