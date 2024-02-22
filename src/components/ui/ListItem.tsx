import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
        <li className="snap-end">
            <Button
                variant="outline"
                className="flex h-full w-full justify-between gap-2 transition duration-75 ease-in-out focus-visible:border-l-4 focus-visible:border-l-blue-500 focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0"
                onClick={onClickHandler}
                tabIndex={0}
            >
                <Badge
                    className={cn(
                        "bg-teal-600",
                        type === "bookmark" && "bg-cyan-700"
                    )}
                >
                    {type === "tab" ? "Tab" : "Bookmark"}
                </Badge>
                <div className="w-3/4 text-end">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-primary">
                        {item.title}
                    </p>
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                        {item.url}
                    </p>
                </div>
            </Button>
        </li>
    );
};

export default ListItem;
