import { Theme } from "@/providers/ThemeProvider";
import ListItem from "./ListItem";
import { useTheme } from "@/hooks/useTheme";
import { capitalizeFirstLetter } from "@/lib/utils";
import { FaComputer, FaMoon, FaSun } from "react-icons/fa6";

const ThemeListItem = ({ targetTheme }: { targetTheme: Theme }) => {
    const { theme, setTheme } = useTheme();

    if (theme === targetTheme) return null;

    return (
        <ListItem
            type="command"
            item={{
                name: `${capitalizeFirstLetter(targetTheme)} theme`,
                description: `Change from ${theme} to ${targetTheme} theme`,
                icon:
                    targetTheme === "light"
                        ? FaSun
                        : targetTheme === "dark"
                          ? FaMoon
                          : FaComputer,
                func: () => {
                    setTheme(targetTheme);
                },
            }}
            keywords={[`${targetTheme} mode`]}
        />
    );
};

export default ThemeListItem;
