import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface InstructionGuideProps {}

export function InstructionGuide({}: InstructionGuideProps) {
    return (
        <Card className="rounded-lg border border-slate-200 shadow-md transition-shadow duration-300 hover:shadow-lg">
            <CardHeader className="text-white">
                <CardTitle className="flex items-center text-2xl font-bold">
                    <InfoIcon className="mr-3" size={28} />
                    OBS Integration Guide
                </CardTitle>
                <CardDescription className="text-slate-100">
                    Follow these steps to configure OBS for streaming
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="border-l-4 border-teal-400 bg-slate-50">
                    <AlertTitle className="mb-3 text-xl font-bold text-slate-700">
                        Configuration Instructions
                    </AlertTitle>
                    <AlertDescription>
                        <ul className="list-inside space-y-4">
                            {[
                                "Launch OBS Studio application",
                                "Navigate to Settings > Stream in the main menu",
                                'In the Service dropdown, select "Custom"',
                                'Copy the RTMP URL from above and paste it into the "Server" field',
                                'Copy the Stream Key from above and paste it into the "Stream Key" field',
                                'Click "Apply" to save the changes',
                                'Click "OK" to close the Settings window',
                                "Your OBS is now configured and ready for streaming",
                            ].map((step, index) => (
                                <li
                                    key={index}
                                    className="text-sm text-slate-700 transition-colors duration-200 hover:text-teal-600"
                                >
                                    <span className="mr-2 font-semibold">{`Step ${index + 1}:`}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
