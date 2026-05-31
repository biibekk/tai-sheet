import './Navbar.css'
import { useState } from 'react'

const Navbar = () => {
    const [active, setActive] = useState(0);

    const handleHomeClick = () => {
        setActive(0);
        const display = document.querySelector('.infodisplay');
        display.innerHTML = '';
    }

    const handleTournamentClick = async () => {
        setActive(1);
        try {
            const res = await fetch('http://localhost:4000/tournaments')
            const data = await res.json();
            const display = document.querySelector('.infodisplay');
            // display.innerHTML = JSON.stringify(data[0], null, 2);
            const ultemplate = `
            <ul>
                ${Object.entries(data[0]).map(([key,value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
            </ul>
            `;
            display.innerHTML = ultemplate;
            console.log(data[0]);
        } catch (error) {
            console.error("Error fetching tournaments:", error);
        }
    }

    const handleStudentsClick = async () => {
        setActive(2);
        try {
            const res = await fetch('http://localhost:4000/students')
            const data = await res.json();
            const display = document.querySelector('.infodisplay');
            const ultemplate = `
            <ul>
                ${Object.entries(data[0]).map(([key,value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
            </ul>
            `;
            display.innerHTML = ultemplate;
            // display.innerHTML = JSON.stringify(data[0], null, 2);
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
            const display = document.querySelector('.infodisplay');
            const ultemplate = `
            <ul>
                ${Object.entries(data[0]).map(([key,value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
            </ul>
            `;
            display.innerHTML = ultemplate;
            // display.innerHTML = JSON.stringify(data[0]);
            console.log(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    return (
        <nav>
            <ul className='navul'>
                <li className={active === 0 ? 'active' : ''} onClick={() => handleHomeClick()}>Home</li>
                <li className={active === 1 ? 'active' : ''} onClick={() => handleTournamentClick()}>Tournaments</li>
                <li className={active === 2 ? 'active' : ''} onClick={() => handleStudentsClick()}>Students</li>
                <li className={active === 3 ? 'active' : ''} onClick={() => handleUsersClick()}>Users</li>
            </ul>
        </nav>
    )
}

export default Navbar;