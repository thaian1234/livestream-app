export async function uploadToR2Bucket(signedUrl: string, file: File) {
    const resp = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type,
        },
        body: file,
    });
    return resp;
}
