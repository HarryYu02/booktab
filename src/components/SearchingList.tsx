import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandShortcut,
} from "@/components/ui/command";
import SearchListItem from "./SearchListItem";
import { ElementRef, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ThemeListItem from "./ThemeListItem";
import TabList from "./TabList";
import BookmarkList from "./BookmarkList";
import { IoIosReturnLeft } from "react-icons/io";
import { Separator } from "./ui/separator";
import useTabs from "@/hooks/useTabs";
import useBookmarks from "@/hooks/useBookmarks";
import CommandActions from "./CommandActions";
import Loading from "./Loading";

const itemTypes = {
    tab: "tab",
    bookmark: "bookmark",
    command: "command",
} as const;

type ItemType = (typeof itemTypes)[keyof typeof itemTypes];

const SearchingList = () => {
    const [currentItem, setCurrentItem] = useState("");
    const [searchText, setSearchText] = useState("");
    const [openActions, setOpenActions] = useState(false);
    const [commands, setCommands] = useState<chrome.commands.Command[]>([]);
    const tabData = useTabs();
    const bookmarkData = useBookmarks();
    const listRef = useRef<ElementRef<typeof CommandList>>(null);
    const inputRef = useRef<ElementRef<typeof CommandInput>>(null);

    useEffect(() => {
        const onCommandHandler = (command: string) => {
            // console.log(`Command "${command}" triggered`);
            if (command === "command_actions") {
                setOpenActions((prev) => !prev);
            }
        };

        const getCommandShortcuts = async () => {
            const defaultCommands = await chrome.commands.getAll();
            setCommands(defaultCommands);
            return defaultCommands;
        };

        getCommandShortcuts().catch((error) => {
            console.log(error);
        });

        chrome.commands.onCommand.addListener(onCommandHandler);

        return () => {
            setOpenActions(false);
            chrome.commands.onCommand.removeListener(onCommandHandler);
        };
    }, []);

    useEffect(() => {
        const commandList = listRef.current;
        commandList?.scrollTo(0, 0);
    }, [searchText]);

    useEffect(() => {
        if (openActions === false) {
            // console.log(inputRef);
            inputRef.current?.focus();
        }
    }, [openActions]);

    const prefixIndex = currentItem.indexOf("-");
    const suffixIndex = currentItem.lastIndexOf("-");
    const itemType = currentItem.slice(0, prefixIndex) as ItemType;
    const itemValue = currentItem.slice(prefixIndex + 1, suffixIndex);
    // const itemIdentifier = currentItem.slice(suffixIndex + 1);

    if (bookmarkData.length === 0 || tabData.length === 0) return <Loading />;

    return (
        <Command
            className="flex flex-col rounded-lg border shadow-md"
            label="BookTab"
            value={currentItem}
            onValueChange={setCurrentItem}
            vimBindings
        >
            <CommandInput
                autoFocus
                id="command-input"
                ref={inputRef}
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
                defaultValue={""}
            >
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup heading="Result">
                    <TabList tabData={tabData} />
                    <BookmarkList bookmarkData={bookmarkData} />
                    <ThemeListItem key="dark-theme" targetTheme="dark" />
                    <ThemeListItem key="light-theme" targetTheme="light" />
                    <SearchListItem
                        key="search-google"
                        searchText={searchText}
                    />
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
                <CommandActions
                    itemName={itemValue}
                    openActions={openActions}
                    setOpenActions={setOpenActions}
                    shortcut={
                        commands.find(
                            (command) => command.name === "command_actions"
                        ) ?? null
                    }
                    {...(itemType === "tab"
                        ? {
                              itemType,
                              tab: tabData.find(
                                  (tab) => tab.title === itemValue
                              ),
                          }
                        : itemType === "bookmark"
                          ? {
                                itemType,
                                bookmark: bookmarkData.find(
                                    (bookmark) => bookmark.title === itemValue
                                ),
                            }
                          : { itemType, command: "command" })}
                />
            </div>
        </Command>
    );
};

export default SearchingList;
