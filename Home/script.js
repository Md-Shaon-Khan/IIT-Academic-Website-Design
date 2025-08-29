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