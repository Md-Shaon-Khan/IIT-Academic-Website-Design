const faqEntries = document.querySelectorAll('.faq__entry');

faqEntries.forEach(entry => {
  const question = entry.querySelector('.faq__question');

  question.addEventListener('click', () => {
    // Toggle active class on clicked entry
    entry.classList.toggle('active');

    // Optional: close others
    faqEntries.forEach(other => {
      if (other !== entry) {
        other.classList.remove('active');
      }
    });
  });
});


// document.addEventListener("DOMContentLoaded", () => {
//   const icons = document.querySelectorAll(".about__icon");

//   window.addEventListener("scroll", () => {
//     const rotation = window.scrollY % 360; // scroll position mapped to degrees
//     icons.forEach((icon, i) => {
//       // each icon rotates slightly offset
//       icon.style.transform = `rotate(${rotation + i * 60}deg)`;
//     });
//   });
// });

const iconButtons = document.querySelectorAll(".about__icon-btn");

iconButtons.forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    // Get the corresponding text id
    const textId = "text-" + btn.dataset.text;
    const textElement = document.getElementById("text-" + btn.dataset.text);
    
    // Add active class to show text
    if (!textElement.classList.contains("active")) {
      textElement.classList.add("active");
    }
  });
});