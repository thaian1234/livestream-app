"use client";

import { useState } from "react";

import { BoxChat } from "./box-chat";
import { BoxChatViewer } from "./box-chat-viewer";
import { Preview } from "./preview";

export function PrivateChat() {
    const [isOpenBoxChat, setIsOpenBoxChat] = useState(false);
    console.log("render private chat");
    return (
        <>
            {isOpenBoxChat ? (
                <BoxChat setIsOpenBoxChat={setIsOpenBoxChat} />
            ) : (
                <Preview setIsOpenBoxChat={setIsOpenBoxChat} />
            )}
        </>
    );
}
