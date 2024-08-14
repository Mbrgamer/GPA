let warningCount = 0;

function addSemesters() {
    const semestersContainer = document.getElementById('semesters-container');
    const numberOfSemesters = document.getElementById('semesters').value;
    semestersContainer.innerHTML = '';

    for (let sem = 1; sem <= numberOfSemesters; sem++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester';

        semesterDiv.innerHTML = `
            <h2>Semester ${sem}</h2>
            <label for="subjects${sem}">Enter Number Of Subjects: </label>
            <input type="number" id="subjects${sem}" min="1" onchange="addSubjects(${sem})">
            <div id="subjects-container${sem}"></div>
        `;

        semestersContainer.appendChild(semesterDiv);
    }
    document.getElementById('calculate-gpa-button').classList.remove('hidden');
}

function addSubjects(sem) {
    const subjectsContainer = document.getElementById(`subjects-container${sem}`);
    const numberOfSubjects = document.getElementById(`subjects${sem}`).value;
    subjectsContainer.innerHTML = '';

    for (let subj = 1; subj <= numberOfSubjects; subj++) {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject';

        subjectDiv.innerHTML = `
            <label for="subjectName${sem}_${subj}">Course  Name : </label>
            <input type="text" id="subjectName${sem}_${subj}">
            <label for="credits${sem}_${subj}"> Credit: </label>
            <input type="number" id="credits${sem}_${subj}" min="0">
            <label for="grade${sem}_${subj}"> Grade: </label>
            <input type="text" id="grade${sem}_${subj}">
        `;

        subjectsContainer.appendChild(subjectDiv);
    }
}

function calculateGPA() {
    const numberOfSemesters = document.getElementById('semesters').value;
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    let totalCumulativeCreditAttempted = 0;
    let totalCumulativeCreditEarned = 0;

    for (let sem = 1; sem <= numberOfSemesters; sem++) {
        const numberOfSubjects = document.getElementById(`subjects${sem}`).value;
        let totalCreditAttempted = 0;
        let totalCreditEarned = 0;

        let semesterResults = `<div class="semester-result">
                                 <h3>Semester ${sem}</h3>
                                 <table>
                                   <thead>
                                     <tr>
                                       <th>Course</th>
                                       <th>Cr.Attained</th>
                                       <th>Grade</th>
                                       <th>Cr.Earned</th>
                                       </tr>
                                   </thead>
                                   <tbody>`;

        for (let subj = 1; subj <= numberOfSubjects; subj++) {
            const subjectName = document.getElementById(`subjectName${sem}_${subj}`).value.trim();
            const credits = parseInt(document.getElementById(`credits${sem}_${subj}`).value);
            const grade = document.getElementById(`grade${sem}_${subj}`).value.trim().toUpperCase();

            let creditEarned = 0;
            totalCreditAttempted += credits;

            if (grade === "A+") {
                creditEarned = credits * 4.33;
            } else if (grade === "A") {
                creditEarned = credits * 4.00;
            } else if (grade === "A-") {
                creditEarned = credits * 3.67;
            } else if (grade === "B+") {
                creditEarned = credits * 3.33;
            } else if (grade === "B") {
                creditEarned = credits * 3.00;
            } else if (grade === "B-") {
                creditEarned = credits * 2.67;
            } else if (grade === "C+") {
                creditEarned = credits * 2.33;
            } else if (grade === "C") {
                creditEarned = credits * 2.00;
            } else if (grade === "C-") {
                creditEarned = credits * 1.67;
            } else if (grade === "D+") {
                creditEarned = credits * 1.33;
            } else if (grade === "D") {
                creditEarned = credits * 1.00;
            } else if (grade === "D-") {
                creditEarned = credits * 0.67;
            } else if (grade === "P") {
                totalCreditAttempted -= credits;
            } else if (grade === "F") {
                creditEarned = 0;
                warningCount += 1;
            } else {
                semesterResults += `<tr style="color: red;">
                                     <td>${subjectName ? subjectName : `Subject ${subj}`}</td>
                                     <td colspan="3">Invalid grade "${grade}"</td>
                                   </tr>`;
                continue;
            }

            totalCreditEarned += creditEarned;

            semesterResults += `<tr>
                                 <td>${subjectName ? subjectName : `Subject ${subj}`}</td>
                                 <td>${credits}</td>
                                 <td>${grade}</td>
                                 <td>${creditEarned.toFixed(2)}</td>
                               </tr>`;
        }

        const sgpa = totalCreditEarned / totalCreditAttempted;
        totalCumulativeCreditAttempted += totalCreditAttempted;
        totalCumulativeCreditEarned += totalCreditEarned;
        const cgpa = totalCumulativeCreditEarned / totalCumulativeCreditAttempted;

        semesterResults += `</tbody>
                             <tfoot>
                               <tr>
                                 <td>Total</td>
                                 <td>${totalCreditAttempted}</td>
                                 <td></td>
                                 <td>${totalCreditEarned.toFixed(2)}</td>
                               </tr>
                               <tr>
                                 <td>SGPA</td>
                                 <td colspan="3">${sgpa.toFixed(2)}</td>
                               </tr>
                               <tr>
                                 <td>CGPA</td>
                                 <td colspan="3">${cgpa.toFixed(2)}</td>
                               </tr>
                             </tfoot>
                             </table>
                             </div>`;

        if (cgpa >= 2.0) {
            warningCount = 0;
        }

        if (warningCount >= 3) {
            semesterResults += `<p style="color: red;">Warning: You have 3 or more warnings. Please consider readmission.</p>`;
            resultDiv.innerHTML += semesterResults;
            break;
        } else if (cgpa < 2.0) {
            semesterResults += `<p style="color: red;">Warning: Your CGPA is below 2.0. If this happens again, you will not be allowed to register for new courses and must repeat courses with grades less than C.</p>`;
        }

        resultDiv.innerHTML += semesterResults;
    }
}
