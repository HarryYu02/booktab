import { Theme } from "@/providers/ThemeProvider";
import ListItem from "./ListItem";
import { useTheme } from "@/hooks/useTheme";
import { capitalizeFirstLetter } from "@/lib/utils";

const ThemeListItem = ({ targetTheme }: { targetTheme: Theme }) => {
    const { theme, setTheme } = useTheme();

    if (theme === targetTheme) return null;

    return (
        <ListItem
            type="custom"
            item={{
                name: `${capitalizeFirstLetter(targetTheme)} theme`,
                description: `Change from ${theme} to ${targetTheme} theme`,
                func: () => {
                    setTheme(targetTheme);
                },
            }}
            keywords={[]}
        />
    );
};

export default ThemeListItem;
