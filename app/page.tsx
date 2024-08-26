import { cookies } from "next/headers";

import { client } from "@/server/api/client";

export default async function Page() {
    const $get = client.api.users.$get;
    const resp = await $get();
    if (!resp.ok) {
        const err = (await resp.json()).status;
        return <div>{err}</div>;
    }
    const allUsers = (await resp.json()).data;
    const myResp = await fetch("http://localhost:3000/api/users", {
        method: "GET",
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data);
        });

    return (
        <div>
            {allUsers.map((u) => (
                <div key={u.id}>
                    Name: {u.username}, id: {u.id}
                </div>
            ))}
        </div>
    );
}
