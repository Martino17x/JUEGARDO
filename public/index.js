document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById('profileIcon');
  const dropdown = document.getElementById('userDropdown');

  icon.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });

  window.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-right')) {
      dropdown.style.display = 'none';
    }
  });
});
