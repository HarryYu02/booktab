import { FaSearch } from "react-icons/fa";
import ListItem from "./ListItem";

interface SearchListItemProps {
    searchText: string;
}

const SearchListItem = ({ searchText }: SearchListItemProps) => {
    return (
        <ListItem
            type="command"
            item={{
                name: `Search ${searchText}`,
                description: `Search '${searchText}'`,
                icon: FaSearch,
                func: () => {
                    if (searchText !== "") {
                        chrome.search
                            .query({ text: searchText, disposition: "NEW_TAB" })
                            .catch((error) => {
                                console.log(error);
                            });
                        window.close();
                    }
                },
            }}
            keywords={[searchText]}
            index={0}
        />
    );
};

export default SearchListItem;
