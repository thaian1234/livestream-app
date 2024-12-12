"use client";

import { Globe } from "lucide-react";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { useLocalStorage } from "usehooks-ts";

import { useUser } from "@/lib/hooks/use-user";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SocialLinks() {
    const user = useUser();
    const [value, setValue] = useLocalStorage(user.user.id, {
        instagramUrl: "",
        twitterUrl: "",
        websiteUrl: "",
    });
    console.log(value);
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex">
                    <Globe className="mr-2 mt-3 h-4 w-4" />
                    <Input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={value.websiteUrl ? value.websiteUrl : ""}
                        onChange={(e) =>
                            setValue({ ...value, websiteUrl: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <div className="flex">
                    <FaTwitter className="mr-2 mt-3 h-4 w-4" />
                    <Input
                        id="twitter"
                        name="twitter"
                        type="url"
                        placeholder="https://twitter.com/yourusername"
                        value={value.twitterUrl ? value.twitterUrl : ""}
                        onChange={(e) =>
                            setValue({ ...value, twitterUrl: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="flex">
                    <FaInstagram className="mr-2 mt-3 h-4 w-4" />
                    <Input
                        id="instagram"
                        name="instagram"
                        type="url"
                        placeholder="https://instagram.com/yourusername"
                        value={value.instagramUrl ? value.instagramUrl : ""}
                        onChange={(e) =>
                            setValue({ ...value, instagramUrl: e.target.value })
                        }
                    />
                </div>
            </div>
        </>
    );
}
