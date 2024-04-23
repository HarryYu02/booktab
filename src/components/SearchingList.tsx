import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import ListItem from "./ListItem";
import React, { useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";

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
                <CommandGroup heading="Tabs">
                    {tabData.map((tab) => {
                        return (
                            <ListItem
                                key={tab.id}
                                type="tab"
                                item={tab}
                                keywords={[tab.url ?? ""]}
                            />
                        );
                    })}
                </CommandGroup>
                <CommandGroup heading="Bookmarks">
                    {bookmarkData.map((bookmark) => {
                        return (
                            <ListItem
                                key={bookmark.id}
                                type="bookmark"
                                item={bookmark}
                                keywords={[bookmark.url ?? ""]}
                            />
                        );
                    })}
                </CommandGroup>
                <CommandGroup heading="Command" forceMount>
                    <SearchListItem key="searching" searchText={searchText} />
                    <ThemeListItem key="dark-theme" targetTheme="dark" />
                    <ThemeListItem key="light-theme" targetTheme="light" />
                    <ThemeListItem key="system-theme" targetTheme="system" />
                </CommandGroup>
            </CommandList>
            <div className="flex items-center justify-end border-t p-1">
                <Button
                    className="flex items-center gap-2 text-lg hover:cursor-default"
                    variant={"ghost"}
                >
                    Open
                    <CommandShortcut className="rounded-lg bg-secondary p-2">
                        ⌘B
                    </CommandShortcut>
                </Button>
            </div>
        </Command>
    );
};

export default SearchingList;
