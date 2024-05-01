async function signup(username: string, email: string, password: string) {
    try {
        const res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username, email, password})
        });

        const data = await res.json();
        console.log(data);
    } catch (e) {

    }
}

const authService = {
    signup
}

export {authService}