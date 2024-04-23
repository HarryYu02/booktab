import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import ListItem from "./ListItem";
import React from "react";

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
    return (
        <Command
            className="flex flex-col rounded-lg border shadow-md"
            label="BookTab"
        >
            <CommandInput
                autoFocus
                className="h-12"
                placeholder="Start typing..."
                value={searchText}
                onValueChange={setSearchText}
            />
            <CommandList className="h-full max-h-full">
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading="Tabs">
                    {tabData.map((tab) => {
                        return <ListItem key={tab.id} type="tab" item={tab} />;
                    })}
                </CommandGroup>
                <CommandGroup heading="Bookmarks">
                    {bookmarkData.map((bookmark) => {
                        return (
                            <ListItem
                                key={bookmark.id}
                                type="bookmark"
                                item={bookmark}
                            />
                        );
                    })}
                </CommandGroup>
                <CommandGroup heading="Command" forceMount>
                    <SearchListItem searchText={searchText} key="searching" />
                </CommandGroup>
            </CommandList>
        </Command>
    );
};

export default SearchingList;
