
import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch('http://localhost:3000/profile', {
                    method: "GET",
                    credentials: "include"
                })

                if (!response.ok) { throw new Error("User is not authenticated") }
                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                setUser(null);
                // alert("Somthing wrong",err)
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    },[])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}