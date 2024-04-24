import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import React, { useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";
import TabList from "./TabList";
import BookmarkList from "./BookmarkList";
import { IoIosReturnLeft } from "react-icons/io";
import { ImCtrl } from "react-icons/im";
import { Separator } from "./ui/separator";

const SearchingList = ({
    tabData,
    bookmarkData,
    searchText,
    setSearchText,
}: {
    tabData: chrome.tabs.Tab[];
    bookmarkData: chrome.bookmarks.BookmarkTreeNode[];
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const [value, setValue] = useState<string>("");

    return (
        <Command
            className="flex flex-col rounded-lg border shadow-md"
            label="BookTab"
            value={value}
            onValueChange={setValue}
        >
            <CommandInput
                autoFocus
                className="h-12"
                placeholder="Search for tabs and bookmarks..."
                value={searchText}
                onValueChange={setSearchText}
            />
            <CommandList className="h-full max-h-full">
                <CommandEmpty>No results found</CommandEmpty>
                {searchText === "" ? (
                    <>
                        <CommandGroup heading="Tabs">
                            <TabList tabData={tabData} />
                        </CommandGroup>
                        <CommandGroup heading="Bookmarks">
                            <BookmarkList bookmarkData={bookmarkData} />
                        </CommandGroup>
                    </>
                ) : (
                    <CommandGroup heading="Result">
                        <TabList tabData={tabData} />
                        <BookmarkList bookmarkData={bookmarkData} />
                    </CommandGroup>
                )}
                <CommandGroup heading="Command" forceMount>
                    <SearchListItem key="searching" searchText={searchText} />
                    <ThemeListItem key="dark-theme" targetTheme="dark" />
                    <ThemeListItem key="light-theme" targetTheme="light" />
                    <ThemeListItem key="system-theme" targetTheme="system" />
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
