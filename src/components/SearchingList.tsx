import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";
import TabList from "./TabList";
import BookmarkList from "./BookmarkList";
import { IoIosReturnLeft } from "react-icons/io";
import { ImCtrl } from "react-icons/im";
import { Separator } from "./ui/separator";
import useTabs from "@/hooks/useTabs";
import useBookmarks from "@/hooks/useBookmarks";

const SearchingList = () => {
  const tabData = useTabs();
  const bookmarkData = useBookmarks();
  const [searchText, setSearchText] = useState("");

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const commandList = listRef.current;
    console.log(commandList);
    commandList?.scrollTo(0, 0);
  }, [searchText]);

  return (
    <Command
      className="flex flex-col rounded-lg border shadow-md"
      label="BookTab"
    >
      <CommandInput
        autoFocus
        className="h-12"
        placeholder="Search for tabs and bookmarks..."
        value={searchText}
        onValueChange={(value) => {
          setSearchText(value);
        }}
      />
      <CommandList
        ref={listRef}
        className="h-full max-h-full [overflow-anchor:auto]"
      >
        <CommandEmpty>No results found</CommandEmpty>
        <CommandGroup heading="Result">
          <TabList tabData={tabData} />
          <BookmarkList bookmarkData={bookmarkData} />
          <ThemeListItem key="dark-theme" targetTheme="dark" />
          <ThemeListItem key="light-theme" targetTheme="light" />
          <ThemeListItem key="system-theme" targetTheme="system" />
          <SearchListItem key="search-google" searchText={searchText} />
        </CommandGroup>
      </CommandList>
      <div className="flex items-center justify-end border-t p-1">
        <Button
          className="flex items-center gap-2 px-2 text-base hover:cursor-default"
          variant={"ghost"}
        >
          Open
          <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
            <IoIosReturnLeft className="size-4" />
          </CommandShortcut>
        </Button>
        <Separator orientation="vertical" className="m-2 h-3/4" />
        <Button
          className="flex items-center gap-2 px-2 text-base text-muted-foreground hover:cursor-default"
          variant={"ghost"}
        >
          Actions
          <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
            <ImCtrl className="size-4" />
          </CommandShortcut>
          <CommandShortcut className="size-8 rounded-lg bg-secondary p-2">
            <span className="size-4">K</span>
          </CommandShortcut>
        </Button>
      </div>
    </Command>
  );
};

export default SearchingList;
