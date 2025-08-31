document.querySelectorAll(".faq__entry").forEach((faq) => {
    faq.addEventListener("click", () => {
      // Close other open FAQs (optional: remove if you want multiple open)
      document.querySelectorAll(".faq__entry").forEach((item) => {
        if (item !== faq) {
          item.classList.remove("active");
          item.querySelector(".faq__answer").style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      faq.classList.toggle("active");
      const answer = faq.querySelector(".faq__answer");

      if (faq.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px"; // fit to content
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
 document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });

    sections.forEach(section => {
      observer.observe(section);
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