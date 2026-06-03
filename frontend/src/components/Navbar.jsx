import './Navbar.css'
import { useState } from 'react'

// receiving props
const Navbar = ({ isLoggedIn, setIsLoggedIn, setPage }) => {
    const [active, setActive] = useState(0);

    const handleHomeClick = () => {
        setActive(0);
        const categorySelect = document.querySelector('.student-category-selection');
        categorySelect.style.display = 'none';
        const searchCategoryStudentBtn = document.querySelector('.search-student-category-btn');
        searchCategoryStudentBtn.style.display = 'none';
        const searchCategoryStudentResult = document.querySelector('.search-student-category-result');
        searchCategoryStudentResult.style.display = 'none';
        const display = document.querySelector('.infodisplay');
        display.innerHTML = '';
        setPage("home");
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
                ${Object.entries(data[0]).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
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
            const res = await fetch('http://localhost:4000/students',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    user: localStorage.getItem("user")
                }
            })
            const data = await res.json();
            const display = document.querySelector('.infodisplay');
            if (!data.success) {
                display.innerHTML = data.message;
                return;
            }
            const ultemplate = `
            <ul>
                ${Object.entries(data.message[0]).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
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
            // getting the JWT token from local storage and sending it in the request headers.
            const token = localStorage.getItem("token");

            // Bearer token authentication
            // JWT authentication because the token happens to be a JWT
            // stateless authentication, because the server doesn't keep a session; it verifies the token on every request.
            const res = await fetch('http://localhost:4000/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = await res.json();
            // console.log(data)
            const display = document.querySelector('.infodisplay');
            if (!data.success) {
                display.innerHTML = data.message;
                return;
            }

            const ultemplate = `
            ${data.message.map(row => `
                <ul>
                    ${Object.entries(row).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
                </ul>
            `).join('')}
            `;
            {/* 
            2nd method
            let ultemplate = '';
            data.message.forEach(row => {
                ultemplate += `
                    <ul>
                        ${Object.entries(row).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
                    </ul>
                `;
            })
            */}
            display.innerHTML = ultemplate;
            // display.innerHTML = JSON.stringify(data[0]);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const handleCategoryClick = async () => {
        setActive(4);
        try {
            const res = await fetch('http://localhost:4000/categories')
            const data = await res.json();


            const categorySelect = document.querySelector('.student-category-selection');
            categorySelect.style.display = 'block';
            const options = data.map(row => `
                <option value="${row.id}">${row.display_name}</option>
            `).join('');
            categorySelect.innerHTML = options;

            const searchCategoryStudentBtn = document.querySelector('.search-student-category-btn');
            searchCategoryStudentBtn.style.display = 'block';

            const searchCategoryStudentResult = document.querySelector('.search-student-category-result');
            searchCategoryStudentResult.style.display = 'block';

            searchCategoryStudentBtn.addEventListener('click', async () => {
                const categoryId = categorySelect.value;
                // console.log(categoryId);
                const result = await fetch(`http://localhost:4000/draw/categories/${categoryId}/generate-draw`, {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    // body: JSON.stringify({
                    //     categoryId: categoryId
                    // })
                });
                if (result.ok) {
                    const studentsDrawResult = await result.json();
                    const drawTemplate = `
                    <h3>Total Participants: ${studentsDrawResult.totalParticipants}</h3>
                    ${studentsDrawResult.students.map(row => `
                        <ul style ="list-style-type: square;">
                            ${Object.entries(row).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
                        </ul>
                    `).join('')}

                    `;
                    searchCategoryStudentResult.innerHTML = drawTemplate;
                } else {
                    searchCategoryStudentResult.innerHTML = 'Error generating draw';
                }

            })


            const display = document.querySelector('.infodisplay');
            const ultemplate = `
            ${data.map(row => `
                <ul>
                    ${Object.entries(row).map(([key, value]) => `<li><b>${key}:</b>${value}</li>`).join('')}
                </ul>
            `).join('')}

            `;
            display.innerHTML = ultemplate;
            // display.innerHTML = JSON.stringify(data[0]);
            console.log(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
    }

    return (
        <nav>
            <ul className='navul'>
                <li className={active === 0 ? 'active' : ''} onClick={() => handleHomeClick()}>Home</li>
                {isLoggedIn && (
                    <>
                        <li className={active === 1 ? 'active' : ''} onClick={() => handleTournamentClick()}>Tournaments</li>
                        <li className={active === 2 ? 'active' : ''} onClick={() => handleStudentsClick()}>Students</li>
                        <li className={active === 3 ? 'active' : ''} onClick={() => handleUsersClick()}>Users</li>
                        <li className={active === 4 ? 'active' : ''} onClick={() => handleCategoryClick()}>Categories</li>
                        <li onClick={handleLogoutClick}>Logout</li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;