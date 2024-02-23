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

interface CustomItem {
    type: "custom";
    item: {
        name: string;
        description: string;
        func: () => void;
    };
}

type ListItemProps = BookmarkItem | TabItem | CustomItem;

const ListItem = ({ type, item }: ListItemProps) => {
    const onClickHandler = () => {
        switch (type) {
            case "tab":
                chrome.tabs
                    .highlight({
                        tabs: item.index,
                    })
                    .catch((error) => console.log(error));
                break;

            case "bookmark":
                chrome.tabs
                    .create({
                        url: item.url,
                    })
                    .catch((error) => console.log(error));
                break;

            case "custom":
                item.func();
                break;

            default:
                break;
        }
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
                        type === "tab" && "bg-teal-600",
                        type === "bookmark" && "bg-cyan-700",
                        type === "custom" && "bg-amber-600"
                    )}
                >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
                <div className="w-3/4 text-end">
                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-lg text-primary">
                        {type === "custom" ? item.name : item.title}
                    </p>

                    <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
                        {type === "custom" ? item.description : item.url}
                    </p>
                </div>
            </Button>
        </li>
    );
};

export default ListItem;
