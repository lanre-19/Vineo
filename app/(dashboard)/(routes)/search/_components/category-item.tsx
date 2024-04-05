"use client";

import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";
import qs from "query-string";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
    label: string;
    value: string;
}

const CategoryItem = ({ label, value }: CategoryItemProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? null : value
            }
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
          onClick={onClick}
          className={cn(
            "py-2 px-3 text-sm border border-slate-200 bg-slate-50 rounded-full flex items-center hover:border-blue-700 transition",
            isSelected && "border-blue-700 bg-blue-300/20 text-blue-800"
            
          )}
          type="button"
        >
            <div className="truncate">
                {label}
            </div>
        </button>
    );
}
 
export default CategoryItem;