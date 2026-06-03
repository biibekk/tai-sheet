import AuthPage from "./authentication";

function Home({ isLoggedIn, setIsLoggedIn, setPage }) {
    if (!isLoggedIn) {
        return <AuthPage setIsLoggedIn={setIsLoggedIn} setPage={setPage} />;
    }

    return (
        <div>
            <h1>Welcome Admin</h1>
            <p>Select an option from the navbar.</p>
        </div>
    );
}

export default Home;