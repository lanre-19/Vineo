"use client";

import Link from "next/link";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";

import FormErrors from "./form-errors";

import { cn } from "@/lib/utils";
import { unsplash } from "@/lib/unsplash";

import { defaultImages } from "@/constants/images";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

const FormPicker = ({
    id,
    errors
}: FormPickerProps) => {
    const { pending } = useFormStatus();

    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedImgId, setSelectedImgId] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Makes the API call to Unsplash endpoint to get the collectionIds and the number of images to fetch
                const result = await unsplash.photos.getRandom({
                    collectionIds: ["317099"],
                    count: 9
                });

                // Checks if there are results(images). Also modify the response and set the images state to the modified response
                if (result && result.response) {
                    const newImages = (result.response as Array<Record<string, any>>);

                    setImages(newImages);
                }
            } catch (error) {
                console.log(error);
                setImages(defaultImages);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (isLoading) {
        return (
            <div
              className="flex items-center justify-center p-6"
            >
                <Loader2
                  className="w-6 h-6 text-blue-700 animate-spin"
                />
            </div>
        )
    }
    
    return (
        <div
          className="relative"
        >
            <div
              className="grid grid-cols-3 gap-2 mb-2"
            >
                {images.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => {
                        if (pending) {
                            return;
                        }
                        
                        setSelectedImgId(image.id)
                      }}
                      className={cn(
                        "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
                        pending && "opacity-50 hover:opacity-50 cursor-auto"
                      )}
                    >
                        <input
                          type="radio"
                          name={id}
                          id={id}
                          className="hidden"
                          checked={selectedImgId === image.id}
                          disabled={pending}
                          value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
                        />
                        <Image
                          src={image.urls.thumb}
                          alt="Unsplash Image"
                          fill
                          className="object-cover rounded-sm"
                        />
                        {selectedImgId === image.id && (
                            <div
                              className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center"
                            >
                                <Check
                                  className="w-4 h-4 text-white"
                                />
                            </div>
                        )}

                        <Link
                          href={image.links.html}
                          target="_blank"
                          className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
                        >
                            {image.user.name}
                        </Link>
                    </div>
                ))}
            </div>

            <FormErrors
              id="image"
              errors={errors}
            />
        </div>
    );
}
 
export default FormPicker;