"use client";

import { clientAPI } from "@/lib/features";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";

export default function Page() {
    const { data, isPending, error } = clientAPI.users.useGetAllUser();
    const { mutate, isPending: isUpdating } =
        clientAPI.users.useUpdateUserById();
    if (!data?.data) {
        return <div>{error?.message}</div>;
    }
    const updateAction = () => {
        mutate({
            json: {
                username: "hello-xyz",
            },
            param: {
                id: "46bad427-731a-40e1-a7a6-d1d0d476c09a",
            },
        });
    };
    return (
        <>
            <div>
                {data.data.map((item) => (
                    <div key={item.id}>
                        <p>{item.id}</p>
                        <p>{item.username}</p>
                    </div>
                ))}
                <LoginButton />
                <Button onClick={updateAction} disabled={isUpdating}>
                    Update
                </Button>
            </div>
        </>
    );
}
