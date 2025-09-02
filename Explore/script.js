document.addEventListener("DOMContentLoaded", function () {
  const subjectCards = document.querySelectorAll(".subject-card");
  const descriptionBox = document.getElementById("subject-description");

  subjectCards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.getAttribute("data-title");
      const desc = card.getAttribute("data-desc");

      descriptionBox.innerHTML = `
        <strong>${title}</strong>
        <p>${desc}</p>
      `;

     
      descriptionBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
});
