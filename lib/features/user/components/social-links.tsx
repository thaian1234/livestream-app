import { Globe } from "lucide-react";
import { FaInstagram, FaTwitter } from "react-icons/fa";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SocialLinks() {
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
                    />
                </div>
            </div>
        </>
    );
}
