import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, cn, faviconURL } from "@/lib/utils";
import { CommandItem } from "./ui/command";
import { FaBookmark } from "react-icons/fa6";
import { IconType } from "react-icons";

interface BookmarkItem {
    type: "bookmark";
    item: chrome.bookmarks.BookmarkTreeNode;
    keywords: string[];
}

interface TabItem {
    type: "tab";
    item: chrome.tabs.Tab;
    keywords: string[];
}

interface CommandItem {
    type: "command";
    item: {
        name: string;
        description: string;
        icon: IconType;
        func: () => void;
    };
    keywords: string[];
}

type ListItemProps = (BookmarkItem | TabItem | CommandItem) & {
    forceMount?: boolean;
};

const ListItem = ({ type, item, forceMount, keywords }: ListItemProps) => {
    const onSelectHandler = () => {
        switch (type) {
            case "tab":
                chrome.tabs
                    .highlight({
                        tabs: item.index,
                    })
                    .catch((error) => console.log(error));
                window.close();
                break;

            case "bookmark":
                chrome.tabs
                    .create({
                        url: item.url,
                    })
                    .catch((newTabError) => console.log(newTabError));
                window.close();
                break;

            case "command":
                item.func();
                break;

            default:
                break;
        }
    };

    return (
        <CommandItem
            className="flex w-full items-center justify-between"
            onSelect={onSelectHandler}
            value={type === "command" ? item.name : item.title}
            forceMount={forceMount}
            keywords={keywords}
        >
            <div className="flex w-3/4 items-center gap-2 truncate">
                {type === "command" ? (
                    <item.icon className="size-6" />
                ) : type === "bookmark" ? (
                    // item.url ? (
                    //   <img src={faviconURL(item.url)} className="size-6" />
                    // ) : (
                    <FaBookmark className="size-6" />
                ) : (
                    // )
                    <img src={item.favIconUrl} className="size-6" />
                )}
                <div className="w-full flex-grow truncate text-start">
                    <p className="text-lg text-primary">
                        {type === "command" ? item.name : item.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {type === "command" ? item.description : item.url}
                    </p>
                </div>
            </div>
            <Badge
                className={cn(
                    type === "tab" && "bg-teal-600 dark:bg-teal-400",
                    type === "bookmark" && "bg-cyan-700 dark:bg-cyan-400",
                    type === "command" && "bg-amber-600 dark:bg-amber-400"
                )}
            >
                {capitalizeFirstLetter(type)}
            </Badge>
        </CommandItem>
    );
};

export default ListItem;
