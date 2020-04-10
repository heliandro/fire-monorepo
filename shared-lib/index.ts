export interface User {
    uid: string;
    name: string;
    email: string;
}

export function createID() {
    return 'YOUR_APP-' + Date.now().toString();
}
