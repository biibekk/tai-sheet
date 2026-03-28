import './Navbar.css'
import { useState } from 'react'

const Navbar = () => {
    const [active, setActive] = useState(0);

    const handleTournamentClick = async () => {
        setActive(1);
        try {
            const res = await fetch('http://localhost:4000/tournaments')
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    }

    const handleStudentsClick = async () => {
        setActive(2);
        try {
            const res = await fetch('http://localhost:4000/students')
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    }

    const handleUsersClick = async () => {
        setActive(3);
        try {
            const res = await fetch('http://localhost:4000/users')
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const handleHomeClick = () => {
        setActive(0);
    }

    return (
        <nav>
            <ul>
                <li className={active === 0 ? 'active' : ''} onClick={() => setActive(0)}>Home</li>
                <li className={active === 1 ? 'active' : ''} onClick={() => handleTournamentClick()}>Tournaments</li>
                <li className={active === 2 ? 'active' : ''} onClick={() => handleStudentsClick()}>Students</li>
                <li className={active === 3 ? 'active' : ''} onClick={() => handleUsersClick()}>Users</li>
            </ul>
        </nav>
    )
}

export default Navbar;