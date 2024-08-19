document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn'); // Assuming the submit button has this id

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${year}-${month}-${day}`;
    };

    const validateField = (input) => {
        const value = input.value.trim();
        const id = input.id;
        const errorSpan = document.getElementById(id + 'Error');
        
        let isValid = true;
        switch (id) {
            case 'name':
                isValid = /^[a-zA-Z\s]{3,}$/.test(value);
                errorSpan.textContent = isValid ? '' : 'Name must be at least 3 characters long and contain only letters and spaces.';
                break;
            case 'email':
                isValid = /^\S+@\S+\.\S+$/.test(value);
                errorSpan.textContent = isValid ? '' : 'Please enter a valid email address.';
                break;
            case 'password':
                isValid = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value);
                errorSpan.textContent = isValid ? '' : 'Password must be at least 8 characters long and include both letters and numbers.';
                break;
            case 'confirmPassword':
                isValid = value === document.getElementById('password').value;
                errorSpan.textContent = isValid ? '' : 'Passwords do not match.';
                break;
            case 'dob':
                // Validate the date format (YYYY-MM-DD)
                const today = new Date();
                const birthDate = new Date(value);
                isValid = value !== '' && birthDate <= today;
                const age = isValid ? calculateAge(value) : 0;
                isValid = isValid && age >= 18;

                errorSpan.textContent = isValid 
                    ? '' 
                    : (value === '' ? 'Date of birth is required.' : 
                       birthDate > today ? 'Date of birth cannot be in the future.' : 
                       age < 18 ? 'You must be at least 18 years old.' : 'Invalid date format.');
                
                submitBtn.disabled = !isValid; // Disable submit button if invalid
                break;
        }
        input.classList.remove('success', 'error');
        input.classList.add(isValid ? 'success' : 'error');
    };

    form.addEventListener('input', (event) => {
        if (event.target.tagName === 'INPUT') {
            validateField(event.target);
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let isValid = true;

        // Validate each field
        ['name', 'email', 'password', 'confirmPassword', 'dob'].forEach(id => {
            const input = document.getElementById(id);
            validateField(input);
            if (input.classList.contains('error')) {
                isValid = false;
            }
        });

        if (isValid) {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const dob = document.getElementById('dob');
            const formattedDob = dob.value; // The input type="date" ensures the format is YYYY-MM-DD
            const modalBody = document.getElementById('modalBody');
            modalBody.innerHTML = `
                <p><strong>Name:</strong> ${name.value.trim()}</p>
                <p><strong>Email:</strong> ${email.value.trim()}</p>
                <p><strong>Date of Birth:</strong> ${formattedDob}</p>
            `;

            const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
            confirmationModal.show();
        }
    });

    document.getElementById('okBtn').addEventListener('click', function() {
        document.getElementById('registrationForm').reset();
        const confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        confirmationModal.hide();
    });
});
