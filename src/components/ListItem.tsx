import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
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

interface CmdItem {
    type: "command";
    item: {
        name: string;
        description: string;
        icon: IconType;
        func: () => void;
    };
    keywords: string[];
}

type ListItemProps = (BookmarkItem | TabItem | CmdItem) & {
    forceMount?: boolean;
    index: number;
};

const ListItem = ({
    type,
    item,
    forceMount,
    keywords,
    index,
}: ListItemProps) => {
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
            value={
                (type === "command"
                    ? `command-${item.name}`
                    : `${type}-${item.title}`) + `-${index}`
            }
            forceMount={forceMount}
            keywords={keywords}
        >
            <div className="flex w-3/4 items-center gap-2 ">
                {type === "command" ? (
                    <item.icon className="size-6" />
                ) : type === "bookmark" ? (
                    <FaBookmark className="size-6" />
                ) : (
                    <img
                        src={item.favIconUrl}
                        className="size-6"
                        alt={`${item.title}-favicon`}
                    />
                )}
                <div className="w-full flex-grow overflow-hidden text-start">
                    <p className="truncate text-lg text-primary">
                        {type === "command" ? item.name : item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
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
