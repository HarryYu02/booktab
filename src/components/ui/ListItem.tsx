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

type ListItemProp = BookmarkItem | TabItem;

const ListItem = ({ type, item }: ListItemProp) => {
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
    <li key={item.id}>
      <Button
        className="bg-blue-400 w-full flex justify-between gap-2"
        onClick={onClickHandler}
      >
        <Badge className="">Tab</Badge>
        <p className="text-ellipsis whitespace-nowrap overflow-hidden text-lg">
          {item.title}
        </p>
      </Button>
    </li>
  );
};

export default ListItem;
