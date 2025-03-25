document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const form = e.target;
  let valid = true;

  // Clear previous errors
  document.querySelectorAll(".error").forEach(el => el.remove());

  // Custom validation for each field
  valid &= validateField("fullName", "Full Name must contain only letters and be at least 3 characters long");
  valid &= validateField("email", "Invalid email format", isValidEmail);
  valid &= validateField("phoneNumber", "Phone Number must be 10 to 15 digits", isValidPhone);
  valid &= validateField("address", "Address is required");
  valid &= validateField("cardNumber", "Credit Card Number must be exactly 16 digits", isValidCardNumber);
  valid &= validateField("expiryDate", "Expiry Date must be in the future", isFutureDate);
  valid &= validateField("cvv", "CVV must be exactly 3 digits", isValidCVV);

  if (valid) {
      alert("Payment Successful! ✅");
      form.reset();
  }
});

function validateField(id, errorMessage, validator = defaultValidator) {
  const input = document.getElementById(id);
  const value = input.value.trim();
  const isValid = validator(value, input);

  if (!isValid) {
      showError(id, errorMessage);
  }

  return isValid;
}

function defaultValidator(value, input) {
  return input.checkValidity();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10,15}$/.test(phone);
}

function isValidCardNumber(card) {
  return /^\d{16}$/.test(card);
}

function isValidCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

function isFutureDate(expiry) {
  const today = new Date();
  const selectedDate = new Date(expiry + "-01");
  return selectedDate > today;
}

function showError(inputId, message) {
  const inputBox = document.getElementById(inputId).parentElement;
  const errorMessage = document.createElement("div");
  errorMessage.className = "error";
  errorMessage.innerText = message;
  inputBox.appendChild(errorMessage);
}


// document.getElementById("signupForm").addEventListener("submit", function (e) {
//     e.preventDefault(); 
  
//     const fullName = document.getElementById("fullName").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value.trim();
  
    
//     document.querySelectorAll(".error").forEach(el => el.remove());
  
//     let valid = true;
  
  
//     if (fullName === "") {
//       showError("fullName", "Full Name is required");
//       valid = false;
//     } else if (fullName.length < 3) {
//       showError("fullName", "Full Name must be at least 3 characters");
//       valid = false;
//     }
  
   
//     if (email === "") {
//       showError("email", "Email is required");
//       valid = false;
//     } else if (!isValidEmail(email)) {
//       showError("email", "Invalid email format");
//       valid = false;
//     }
  
    
//     if (password === "") {
//       showError("password", "Password is required");
//       valid = false;
//     } else if (password.length < 6) {
//       showError("password", "Password must be at least 6 characters");
//       valid = false;
//     }
  
//     if (valid) {
//       alert("Account Created Successfully! ✅");
//       document.getElementById("signupForm").reset();
//     }
//   });
  

//   function showError(inputId, message) {
//     const inputBox = document.getElementById(inputId).parentElement;
//     const errorMessage = document.createElement("div");
//     errorMessage.className = "error";
//     errorMessage.innerText = message;
//     inputBox.appendChild(errorMessage);
//   }
  
  
//   function isValidEmail(email) {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   }
  