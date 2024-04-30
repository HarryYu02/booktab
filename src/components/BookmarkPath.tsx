import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FaSlash } from "react-icons/fa6";
import { TbSlashes } from "react-icons/tb";

const BookmarkPath = ({ path }: { path: string[] }) => {
    console.log(path);
    return (
        <Breadcrumb>
            <BreadcrumbList className="">
                {path.map((folder, index) => {
                    return (
                        <>
                            <BreadcrumbItem
                                key={index}
                                className="text-xs text-muted-foreground"
                            >
                                {folder}
                            </BreadcrumbItem>
                            {index !== path.length - 1 && (
                                <BreadcrumbSeparator className="">
                                    {/* <TbSlashes /> */}
                                </BreadcrumbSeparator>
                            )}
                        </>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default BookmarkPath;
