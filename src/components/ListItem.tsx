import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CommandItem } from "./ui/command";

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
    labels: string[];
    name: string;
    description: string;
    func: () => void;
  };
}

type ListItemProps = (BookmarkItem | TabItem | CustomItem) & {
  forceMount?: boolean;
};

const ListItem = ({ type, item, forceMount }: ListItemProps) => {
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
          .update({
            url: item.url,
          })
          .catch((error) => {
            console.log(error);
            chrome.tabs
              .create({
                url: item.url,
              })
              .catch((newTabError) => console.log(newTabError));
          });
        window.close();
        break;

      case "custom":
        item.func();
        break;

      default:
        break;
    }
  };

  return (
    <CommandItem
      className="flex w-full snap-end justify-between"
      onSelect={onSelectHandler}
      value={type === "custom" ? item.name : item.title}
      forceMount={forceMount}
      keywords={type === "custom" ? item.labels : []}
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
        <p className="truncate text-lg text-primary">
          {type === "custom" ? item.name : item.title}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {type === "custom" ? item.description : item.url}
        </p>
      </div>
    </CommandItem>
  );
};

export default ListItem;
