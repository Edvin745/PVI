document.addEventListener("DOMContentLoaded", (event) => {
    var students = [];
    const form = document.getElementById("add_student_form");
    const addStudentModal = document.getElementById("add_student_modal");
    let tableBody = document
        .getElementById("students_table")
        .getElementsByTagName("tbody")[0];

    function addStudent() {
        // const form = document.getElementById("add_student_form");

        const formData = new FormData(form);
        // console.log("form", form);
        // console.log(data);
        let newRow = tableBody.insertRow();

        formData.values().forEach((v, index) => {
            let cell = newRow.insertCell(index);
            cell.textContent = v;
        });

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        addStudentModal.classList.remove("active");
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
});
