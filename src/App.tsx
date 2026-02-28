import "./App.css";
import InputContainer from "./components/inputContainer";


import "./index.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY);

export default function App() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [claims, setClaims] = useState(null);

    // Check URL params on initial render
    const params = new URLSearchParams(window.location.search);
    const hasTokenHash = params.get("token_hash");

    const [verifying, setVerifying] = useState(!!hasTokenHash);
    const [authError, setAuthError] = useState(null);
    const [authSuccess, setAuthSuccess] = useState(false);

    useEffect(() => {
        // Check if we have token_hash in URL (magic link callback)
        const params = new URLSearchParams(window.location.search);
        const token_hash = params.get("token_hash");
        const type = params.get("type");

        if (token_hash) {
            // Verify the OTP token
            supabase.auth.verifyOtp({
                token_hash,
                type: type || "email",
            }).then(({ error }) => {
                if (error) {
                    setAuthError(error.message);
                } else {
                    setAuthSuccess(true);
                    // Clear URL params
                    window.history.replaceState({}, document.title, "/");
                }
                setVerifying(false);
            });
        }

        // Check for existing session using getClaims
        supabase.auth.getClaims().then(({ data: { claims } }) => {
            setClaims(claims);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            supabase.auth.getClaims().then(({ data: { claims } }) => {
                setClaims(claims);
            });
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });
        if (error) {
            alert(error.error_description || error.message);
        } else {
            alert("Check your email for the login link!");
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setClaims(null);
    };

    // Show verification state
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full mx-auto space-y-6 bg-white p-6 rounded-3xl shadow text-center">
                    <h1 className="text-2xl md:text-3xl font-semibold">Authentication</h1>
                    <p className="text-gray-600">Confirming your magic link...</p>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Show auth error
    if (authError) {
        return (
            <div className="bg-white p-6 sm:p-10 md:p-15 rounded-3xl mt-6 sm:mt-10">
                <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-3xl shadow">
                    <h1 className="text-2xl md:text-3xl font-semibold">Authentication</h1>
                    <p className="text-red-600">✗ Authentication failed</p>
                    <p className="text-gray-600">{authError}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
                        onClick={() => {
                            setAuthError(null);
                            window.history.replaceState({}, document.title, "/");
                        }}
                    >
                        Return to login
                    </button>
                </div>
            </div>
        );
    }

    // Show auth success (briefly before claims load)
    if (authSuccess && !claims) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-3xl shadow">
                    <h1 className="text-2xl md:text-3xl font-semibold">Authentication</h1>
                    <p className="text-green-600">✓ Authentication successful!</p>
                    <p className="text-gray-600">Loading your account...</p>
                </div>
            </div>
        );
    }

    // If user is logged in, show welcome screen
    if (claims) {
        return (
            <div>
                <div className="rounded-lg p-4 mb-6 text-center flex justify-center">
                    <h1 className="text-lg md:text-xl font-semibold ml-4">Welcome: </h1>
                    <p className="text-lg ml-4">{(claims as any)?.email}</p>
                    <button
                        className="ml-14 px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-green-700"
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>
                </div>
                
            <div className="mt-20">
                
                <InputContainer/>
            </div>

            </div>
        );
    }

    // Show login form
    return (
        // <InputContainer/>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full mx-auto space-y-7 bg-white p-12 rounded-3xl shadow text-center">
                <h1 className="text-2xl md:text-3xl font-semibold">Alternate Food Login</h1>
                <p className="text-gray-600">Sign in via magic link with your email below</p>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                        disabled={loading}
                    >
                        {loading ? <span>Loading</span> : <span>Send magic link</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}