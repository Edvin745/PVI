function loadData(tableBody) {
    const storedStudents = JSON.parse(localStorage.getItem("students"));

    if (!storedStudents || storedStudents.length === 0) {
        tableBody.innerHTML = '';
        return;
    }

    tableBody.innerHTML = ''; // Clear the table first

    storedStudents.forEach((value, index) => { // <-- Додаємо index тут
        let newRow = tableBody.insertRow();

        newRow.innerHTML = `
         <td style="text-align: center;"><input type="checkbox" class="studentCheckbox" data-index="${index}" aria-label="Select student ${value.fullName}"></td>
         <td>${value.group}</td>
         <td>${value.fullName}</td>
         <td>${value.gender}</td>
         <td>${value.birthday}</td>
         <td align="center"><span class="status"/></td>
         <td>
           <button type="button" class="edit_button" onclick="openEditStudentModal('${value.id}')">
             <img src="./images/edit.png" alt="edit button"/>
           </button>
           <button type="button" class="remove_button" onclick="showConfirmDeleteModal(['${value.id}'])">-</button>
         </td>
       `;
    });
}

document.getElementById('selectAll').addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.studentCheckbox');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

function removeStudent(id) {
    const storedStudents = JSON.parse(localStorage.getItem("students"));
    const filteredStudents = storedStudents.filter((v) => v.id !== id);

    localStorage.setItem('students', JSON.stringify(filteredStudents));

    let tableBody = document
        .getElementById("students_table")
        .getElementsByTagName("tbody")[0];

    loadData(tableBody);
}

let studentsToDelete = [];

function showConfirmDeleteModal(ids) {
    studentsToDelete = ids; // зберігаємо id для видалення
    document.getElementById("confirm_delete_modal").classList.add("active");
}

document.getElementById('remove_student_button').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.studentCheckbox:checked');
    const storedStudents = JSON.parse(localStorage.getItem('students')) || [];

    const idsToRemove = Array.from(checkboxes).map(cb => {
        const index = parseInt(cb.getAttribute('data-index'));
        return storedStudents[index]?.id;
    }).filter(id => id); // фільтруємо undefined

    if (idsToRemove.length === 0) {
        alert('Будь ласка, виберіть студентів для видалення.');
        return;
    }

    studentsToDelete = idsToRemove;
    document.getElementById("confirm_delete_modal").classList.add("active");
});

function openEditStudentModal(id) {
    document.getElementById('edit_student_modal').classList.add('active');

    const storedStudents = JSON.parse(localStorage.getItem("students"));
    const currentStudent = storedStudents.find((value) => value.id === id);

    // Set the ID field
    document.getElementById('edit_id').value = currentStudent.id;

    // Handle the full name
    const nameParts = currentStudent.fullName.split(' ');
    document.getElementById('edit_firstName').value = nameParts[0] || '';
    document.getElementById('edit_lastName').value = nameParts[1] || '';

    // Set other fields
    document.getElementById('edit_group').value = currentStudent.group;
    document.getElementById('edit_gender').value = currentStudent.gender;
    document.getElementById('edit_birthday').value = currentStudent.birthday;
}

document.addEventListener("DOMContentLoaded", (event) => {
    var columnsIndex = { group: 0, name: 1, gender: 2, birthday: 3 };
    const form = document.getElementById("add_student_form");
    const addStudentModal = document.getElementById("add_student_modal");
    const editStudentModal = document.getElementById("edit_student_modal");
    let tableBody = document
        .getElementById("students_table")
        .getElementsByTagName("tbody")[0];

    function getFormValues(formData) {
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    const bellImage = document.querySelector('.bell img');

    if (bellImage) {
        bellImage.addEventListener('click', function () {
            // Add the shake class
            this.classList.add('shake');

            // Remove the class after the animation completes
            setTimeout(() => {
                this.classList.remove('shake');
            }, 500); // 500ms matches our animation duration
        });
    }

    function addStudent() {
        const id = crypto.randomUUID();
        const formData = new FormData(form);
        const storedStudents = JSON.parse(localStorage.getItem("students")) || [];

        const { firstName, lastName, ...values } = getFormValues(formData);
        const fullName = `${firstName} ${lastName}`;

        if (!firstName || !lastName || !values.group) {
            alert("Будь ласка, заповніть усі обов’язкові поля.");
            return;
        }

        storedStudents.push({ id, fullName, ...values });
        localStorage.setItem("students", JSON.stringify(storedStudents));

        loadData(tableBody); // оновити таблицю
        form.reset(); // очистити форму
        addStudentModal.classList.remove("active"); // закрити модалку
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        addStudent();
    });

    document
        .getElementById("add_student_button")
        .addEventListener("click", () => {
            addStudentModal.classList.add("active");
        });

    document.getElementById('close_button')
        .addEventListener('click', () => {
            addStudentModal.classList.remove("active");
        });

    document.getElementById('close_modal_button')
        .addEventListener('click', () => {
            editStudentModal.classList.remove('active');
        })

    function saveEditedStudent() {
        const id = document.getElementById('edit_id').value;
        const group = document.getElementById('edit_group').value;
        const firstName = document.getElementById('edit_firstName').value;
        const lastName = document.getElementById('edit_lastName').value;
        const fullName = `${firstName} ${lastName}`;
        const gender = document.getElementById('edit_gender').value;
        const birthday = document.getElementById('edit_birthday').value;

        const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
        const index = storedStudents.findIndex(student => student.id === id);

        if (!firstName || !lastName || !birthday || !group || !gender) {
            alert("Уведіть усі обов'язкові поля");
        }

        if (index !== -1) {
            storedStudents[index] = {
                ...storedStudents[index],
                group,
                fullName,  // Store the combined name
                gender,
                birthday
            };

            localStorage.setItem('students', JSON.stringify(storedStudents));

            // Refresh the table
            tableBody.innerHTML = '';
            loadData(tableBody);

            // Close the modal
            document.getElementById('edit_student_modal').classList.remove('active');
        } else {
            alert('Student not found');
        }
    }

    document.getElementById("confirm_delete_btn").addEventListener("click", () => {
        const storedStudents = JSON.parse(localStorage.getItem("students")) || [];
        const updated = storedStudents.filter(student => !studentsToDelete.includes(student.id));
        localStorage.setItem("students", JSON.stringify(updated));

        let tableBody = document.getElementById("students_table").getElementsByTagName("tbody")[0];
        loadData(tableBody);

        document.getElementById("confirm_delete_modal").classList.remove("active");
        studentsToDelete = [];
    });

    document.getElementById("cancel_delete_btn").addEventListener("click", () => {
        document.getElementById("confirm_delete_modal").classList.remove("active");
        studentsToDelete = [];
    });

    // Add this outside the saveEditedStudent function
    document.getElementById("save_student_button")
        .addEventListener("click", saveEditedStudent);

    loadData(tableBody);
});
