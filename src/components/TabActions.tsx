import {
    MdDelete,
    MdFolderCopy,
    MdPushPin,
    MdVerticalSplit,
} from "react-icons/md";
import { CommandItem } from "./ui/command";
import { RiUnpinFill } from "react-icons/ri";

const TabActions = ({ tab }: { tab: chrome.tabs.Tab | null }) => {
    return (
        <>
            <CommandItem
                onSelect={() => {
                    chrome.tabs
                        .remove(tab?.id ?? chrome.tabs.TAB_ID_NONE)
                        .catch((error) => {
                            console.log(error);
                        });
                    window.close();
                }}
                className="flex items-center gap-2"
            >
                <MdDelete className="size-4 p-0" />
                Close
            </CommandItem>
            <CommandItem
                onSelect={() => {
                    chrome.tabs
                        .duplicate(tab?.id ?? chrome.tabs.TAB_ID_NONE)
                        .catch((error) => {
                            console.log(error);
                        });
                    window.close();
                }}
                className="flex items-center gap-2"
            >
                <MdFolderCopy className="size-4 p-0" />
                Duplicate
            </CommandItem>
            <CommandItem
                onSelect={() => {
                    chrome.tabs
                        .ungroup(tab?.id ?? chrome.tabs.TAB_ID_NONE)
                        .catch((error) => {
                            console.log(error);
                        });
                    window.close();
                }}
                className="flex items-center gap-2"
            >
                <MdVerticalSplit className="size-4 p-0" />
                Ungroup
            </CommandItem>
            <CommandItem
                onSelect={() => {
                    chrome.tabs
                        .update(tab?.id ?? chrome.tabs.TAB_ID_NONE, {
                            pinned: !tab?.pinned,
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                    window.close();
                }}
                className="flex items-center gap-2"
            >
                {tab?.pinned ? (
                    <RiUnpinFill className="size-4 p-0" />
                ) : (
                    <MdPushPin className="size-4 p-0" />
                )}
                {tab?.pinned ? "Unpin" : "Pin"}
            </CommandItem>
        </>
    );
};

export default TabActions;
