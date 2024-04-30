import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter, cn, faviconURL } from "@/lib/utils";
import { CommandItem } from "./ui/command";
import { IconType } from "react-icons";
import BookmarkPath from "./BookmarkPath";

interface BookmarkItem {
    type: "bookmark";
    item: { bookmark: chrome.bookmarks.BookmarkTreeNode; path: string[] };
}

interface TabItem {
    type: "tab";
    item: chrome.tabs.Tab;
}

interface CmdItem {
    type: "command";
    item: {
        name: string;
        description: string;
        icon: IconType;
        func: () => void;
    };
}

type ListItemProps = (BookmarkItem | TabItem | CmdItem) & {
    forceMount?: boolean;
    index: number;
    keywords: string[];
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
                        url: item.bookmark.url,
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
                type === "command"
                    ? `command-${item.name}`
                    : type === "tab"
                      ? `${type}-${item.title}-${index}`
                      : `${type}-${item.bookmark.title}-${index}`
            }
            forceMount={forceMount}
            keywords={keywords}
        >
            <div className="flex w-3/4 items-center gap-2 ">
                {type === "command" ? (
                    <item.icon className="size-6" />
                ) : type === "bookmark" ? (
                    // <FaBookmark className="size-6" />
                    <img
                        src={faviconURL(item.bookmark.url ?? "")}
                        className="size-6"
                        alt={`${item.bookmark.title}-favicon`}
                    />
                ) : (
                    <img
                        src={item.favIconUrl}
                        className="size-6"
                        alt={`${item.title}-favicon`}
                    />
                )}
                <div className="w-full flex-grow overflow-hidden text-start">
                    {type === "bookmark" ? (
                        <BookmarkPath
                            path={item.path}
                            identifier={item.bookmark.id}
                        />
                    ) : type === "tab" ? (
                        <p className="text-sm text-muted-foreground">"Tab"</p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            "Command"
                        </p>
                    )}
                    <p className="flex items-center gap-2 truncate text-xl text-primary">
                        {type === "command"
                            ? item.name
                            : type === "tab"
                              ? item.title
                              : item.bookmark.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                        {type === "command"
                            ? item.description
                            : type === "tab"
                              ? item.url
                              : item.bookmark.url}
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
