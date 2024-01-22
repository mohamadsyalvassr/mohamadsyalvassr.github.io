// Fetch data from JSON files
fetch("data/header.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("header").innerHTML = renderHeader(data);
  });

fetch("data/experience.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("experience").innerHTML = renderExperience(data);
  });

fetch("data/education.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("education").innerHTML = renderEducation(data);
  });

fetch("data/organizational_experience.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("organizationalExperience").innerHTML =
      renderOrganizationalExperience(data);
  });

fetch("data/skills_achievements.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("skillsAchievements").innerHTML =
      renderSkillsAchievements(data);
  });

fetch("data/certifications.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("certifications").innerHTML =
      renderCertifications(data);
  });

fetch("data/projects.json")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("projects").innerHTML = renderProjects(data);
  });
// Add more fetches for other sections as needed

// Function to render header section
function renderHeader(data) {
  return `
    <h1>${data.name}</h1>
    <p><a href="mailto:${data.email}">${
    data.email
  }</a> | <a href="https://wa.me/${data.phone}" target="_blank">${
    data.phone
  }</a> | <a href="${data.linkedIn}" target="_blank">${data.linkedIn}</a> | ${
    data.address
  }</p>
    <div class="about-me">
      ${data.aboutMe.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </div>
  `;
}

// Function to render experience section
function renderExperience(data) {
  let experienceHTML = "<h2>Experience</h2>";

  data.forEach((experience) => {
    const duration = calculateExperienceDuration(
      experience.startDate,
      experience.endDate
    );

    const showReadMoreButton = experience.description.length > 10;
    const starDate = handlerLocalString(experience.startDate);
    const endDate = handlerLocalString(experience.endDate);

    experienceHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${experience.position}</h5>
          <p class="card-text">
            <strong>${
              experience.company
            }</strong> <br> ${starDate} - ${endDate} (${duration})
          </p>
          <div class="description-container">
            <p class="card-text description" style="display: none;">${
              experience.description
            }</p>
            ${
              showReadMoreButton
                ? '<button class="btn btn-link read-more-btn w-100">Show Details</button>'
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });

  return experienceHTML;
}

// Function to render education section
function renderEducation(data) {
  let educationHTML = "<h2>Education</h2>";
  let showReadMoreButton = true;

  data.forEach((item) => {
    const detailsHTML = renderDetails(item.description);

    if (item.degree) {
      // Render traditional education entry
      educationHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${item.degree}</h5>
            <p class="card-text">${item.school} | ${item.location} | ${item.date}</p>
            ${detailsHTML}
          </div>
        </div>
      `;
    } else if (item.course) {
      // Render course entry
      educationHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title"><i>(Course)</i> ${item.course}</h5>
          <p class="card-text">
            <span class="institution">${item.institution}</span> |
            <span class="location">${item.location}</span> |
            <span class="date">${item.date}</span>
          </p>
            <div class="description-container">
            ${detailsHTML}
            ${
              showReadMoreButton
                ? '<button class="btn btn-link read-more-btn w-100">Show Details</button>'
                : ""
            }
          </div>
          </div>
        </div>
      `;
    }
  });
  return educationHTML;
}

function renderDetails(details) {
  let detailsHTML = "";

  // Check if details is an array
  if (Array.isArray(details)) {
    detailsHTML += `<ul class="card-text description" style="display: none;">`;
    details.forEach((detail) => {
      detailsHTML += `<li>${detail}</li>`;
    });
    detailsHTML += "</ul>";
  } else {
    detailsHTML += `<p class="card-text description" style="display: none;">${details}</p>`;
  }

  return detailsHTML;
}

// Function to render organizational experience section
function renderOrganizationalExperience(data) {
  let organizationalExperienceHTML = "<h2>Organizational Experience</h2>";
  data.forEach((item) => {
    organizationalExperienceHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${item.position}</h5>
          <p class="card-text">${item.organization} | ${item.location} | ${item.date}</p>
          <p class="card-text">${item.description}</p>
        </div>
      </div>
    `;
  });
  return organizationalExperienceHTML;
}

function renderSkillsAchievements(data) {
  let skillsAchievementsHTML =
    "<h2>Skills, Achievements & Other Experience</h2>";

  // Render Languages
  skillsAchievementsHTML += `
  <div class="card mb-3">
    <div class="card-body">
      <h5>Languages</h5>
      <p>${data.languages.join(", ")}</p>
    </div>
  </div>`;

  skillsAchievementsHTML += `
  <div class="card mb-3">
    <div class="card-body">
      <h5>Hard Skills</h5>
      <p>${data.hardSkills.join(", ")}</p>
    </div>
  </div>`;

  skillsAchievementsHTML += `
  <div class="card mb-3">
    <div class="card-body">
      <h5>Beginner</h5>
      <p>${data.beginnerSkills.join(", ")}</p>
    </div>
  </div>`;

  return skillsAchievementsHTML;
}

// Function to render certifications section
function renderCertifications(data) {
  let certificationsHTML = "<h2>Licenses & Certifications</h2>";

  data.sort((a, b) => {
    if (!a.expirationYear && !b.expirationYear) return 0; // Jika keduanya tidak memiliki tanggal kedaluwarsa
    if (!a.expirationYear) return -1; // Jika hanya sertifikat A yang tidak memiliki tanggal kedaluwarsa
    if (!b.expirationYear) return 1; // Jika hanya sertifikat B yang tidak memiliki tanggal kedaluwarsa

    const dateA = new Date(a.expirationYear);
    const dateB = new Date(b.expirationYear);

    // Urutkan dari yang terbesar (paling lama terlebih dahulu)
    const comparison = dateB - dateA;

    // Balik urutan jika sertifikat telah kedaluwarsa
    return a.expirationYear ? comparison : -comparison;
  });

  data.forEach((certification) => {
    let expirationYear;
    const expirationInfo = calculateExpirationInfo(
      certification.expirationYear
    );

    const issueYear = handlerLocalString(certification.issueYear);

    if (certification.expirationYear) {
      expirationYear = handlerLocalString(certification.expirationYear);
    } else {
      expirationYear = expirationInfo;
    }

    certificationsHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${certification.name}</h5>
          <p class="card-text">Issued by <b><i>${
            certification.issuedBy
          }</i></b> on ${issueYear} <br>${
      certification.expirationYear
        ? `Expired on ${expirationYear} (${expirationInfo})`
        : `<i>This certification does not expire</i>`
    }`;

    // Check if Credential ID exists before adding it to the paragraph
    if (certification.credentialID) {
      certificationsHTML += `<br>Credential ID: ${certification.credentialID}`;
    }

    // Check if Verification Link exists before adding it to the paragraph
    if (certification.verificationLink) {
      certificationsHTML += `<br><a href="${certification.verificationLink}" target="_blank">Verify Credential</a>`;
    }

    if (certification.description) {
      let showReadMoreButton = certification.description.length > 10;

      certificationsHTML += `<div class="description-container">
      <hr>
            <p class="card-text description" style="display: none;">${
              certification.description
            } </p>
            ${
              showReadMoreButton
                ? '<button class="btn btn-link read-more-btn w-100">Show Details</button>'
                : ""
            }
          </div>`;
    }

    certificationsHTML += `</p>
        </div>
      </div>
    `;
  });

  return certificationsHTML;
}

function renderProjects(data) {
  let projectsHTML = "<h2>Projects</h2>";

  data.forEach((project) => {
    const duration = calculateExperienceDuration(
      project.startDate,
      project.endDate
    );

    let detailsHTML = "";
    let showReadMoreButton = true;

    // Check if details is an array
    if (Array.isArray(project.details)) {
      detailsHTML += `<ul class="card-text description" style="display: none;">`;
      project.details.forEach((detail) => {
        detailsHTML += `<li>${detail}</li>`;
      });
      detailsHTML += "</ul>";
    } else {
      detailsHTML += `<p class="card-text description" style="display: none;">${project.details}</p>`;
    }

    projectsHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${project.name}</h5>
          ${
            project.url
              ? `<p class="card-text"><a href="${project.url}" target="_blank">${project.url}</a>`
              : ""
          }
          <br><i>${project.role}</i>
          <br>${project.startDate} - ${project.endDate} (${duration})</p>
          <div class="description-container">
            ${detailsHTML}
            ${
              showReadMoreButton
                ? '<button class="btn btn-link read-more-btn w-100">Show Details</button>'
                : ""
            }
          </div>
        </div>
      </div>
    `;
  });

  return projectsHTML;
}

function calculateExperienceDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end =
    endDate === "Present" || endDate === ""
      ? new Date()
      : endDate
      ? new Date(endDate)
      : null;

  if (!end) {
    return "Present";
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += lastMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  let duration = "";

  if (years > 0) {
    duration += `${years} ${years > 1 ? "years" : "year"} `;
  }

  if (months > 0) {
    duration += `${months} ${months > 1 ? "months" : "month"} `;
  }

  if (days > 0) {
    duration += `${days} ${days > 1 ? "days" : "day"}`;
  }

  return duration.trim();
}

document.addEventListener("click", function (event) {
  const readMoreBtn = event.target.closest(".read-more-btn");
  if (readMoreBtn) {
    toggleDescriptionVisibility(readMoreBtn);
  }
});

// Function to toggle visibility of description
function toggleDescriptionVisibility(button) {
  const descriptionContainer = button.closest(".description-container");
  const description = descriptionContainer.querySelector(".description");

  if (
    description.style.display === "none" ||
    description.style.display === ""
  ) {
    description.style.display = "block";
    button.textContent = "Hide Details";
  } else {
    description.style.display = "none";
    button.textContent = "Show Details";
  }
}

document.addEventListener("click", function (event) {
  const toggleBtn = event.target.closest(".toggle-btn");
  if (toggleBtn) {
    toggleCategory(toggleBtn);
  }
});

// Function untuk menangani toggle kategori
function toggleCategory(button) {
  const targetId = button.getAttribute("data-target");
  const targetCategory = document.getElementById(targetId);

  if (
    targetCategory.style.display === "none" ||
    targetCategory.style.display === ""
  ) {
    targetCategory.style.display = "block";
    button.textContent = `Hide ${
      targetId.charAt(0).toUpperCase() + targetId.slice(1)
    }`;
  } else {
    targetCategory.style.display = "none";
    button.textContent = `Show ${
      targetId.charAt(0).toUpperCase() + targetId.slice(1)
    }`;
  }
}

var birthdateString = "1997-01-08";

// Ubah format tanggal lahir ke objek Date
var birthdate = new Date(birthdateString);

// Hitung selisih detik dari tanggal lahir hingga sekarang
function updateDetik() {
  var now = new Date();
  var differenceInSeconds = Math.floor((now - birthdate) / 1000);

  // Tampilkan hasil
  document.getElementById(
    "result"
  ).innerHTML = `<i>Since my birth, more than ${differenceInSeconds} seconds have passed, allowing me to easily adapt to different tasks and responsibilities.</i>`;
}

// Update detik setiap detiknya
updateDetik(); // Update pertama kali
setInterval(updateDetik, 1000); // Update setiap 1 detik

function calculateExpirationInfo(expirationDate) {
  if (!expirationDate) {
    return "No expiration date";
  }

  const now = new Date();
  const expiration = new Date(expirationDate);

  const daysRemaining = Math.floor((expiration - now) / (1000 * 60 * 60 * 24));

  if (daysRemaining > 0) {
    return `<i>Expires in ${daysRemaining} days</i>`;
  } else if (daysRemaining === 0) {
    return "<i>Expires today</i>";
  } else {
    return "<i>Expired</i>";
  }
}

// Fungsi untuk menangani peningkatan dan penurunan ukuran teks
function changeFontSize(change) {
  const currentFontSize = parseInt(document.body.style.fontSize) || 16; // Ukuran font awal (16px jika tidak ada)
  const newFontSize = Math.max(10, currentFontSize + change); // Hindari ukuran font kurang dari 10px

  document.body.style.fontSize = `${newFontSize}px`;
}

// Fungsi event listener untuk tombol + dan -
function handleFontSizeButtonClick(event) {
  const buttonId = event.target.id;

  if (buttonId === "increase-font-size") {
    changeFontSize(2); // Peningkatan ukuran font sebesar 2px
  } else if (buttonId === "decrease-font-size") {
    changeFontSize(-2); // Penurunan ukuran font sebesar 2px
  }
}

function handlerLocalString(date) {
  if (date === "Present" || date === "") {
    return "Present";
  }

  const newFormat = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return newFormat;
}

// Tambahkan event listener untuk tombol + dan -
const increaseFontSizeButton = document.getElementById("increase-font-size");
const decreaseFontSizeButton = document.getElementById("decrease-font-size");

increaseFontSizeButton.addEventListener("click", handleFontSizeButtonClick);
decreaseFontSizeButton.addEventListener("click", handleFontSizeButtonClick);
