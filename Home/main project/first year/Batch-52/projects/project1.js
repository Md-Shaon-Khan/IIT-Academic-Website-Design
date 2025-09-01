
  function bringToFront(clickedImg) {
    const images = document.querySelectorAll('.stack-img');
    images.forEach(img => img.style.zIndex = 1);
    clickedImg.style.zIndex = 10;
    clickedImg.style.transform = 'rotate(0deg) scale(1.05)';
  }

    function setModalImage(img) {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = img.src;
  }

   let currentZoom = 1;

  function setModalImage(img) {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = img.src;
    currentZoom = 1;
    modalImg.style.transform = `scale(${currentZoom})`;
  }

  function zoomImage(factor) {
    currentZoom *= factor;
    const modalImg = document.getElementById('modalImage');
    modalImg.style.transform = `scale(${currentZoom})`;
  }

  document.getElementById('imageModal').addEventListener('hidden.bs.modal', () => {
    const modalImg = document.getElementById('modalImage');
    currentZoom = 1;
    modalImg.style.transform = `scale(1)`;
  });

