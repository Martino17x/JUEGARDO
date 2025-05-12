function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Cierra el dropdown si hacés clic afuera
window.onclick = function (e) {
  const dropdown = document.getElementById('userDropdown');
  if (!e.target.closest('.nav-right')) {
    dropdown.style.display = 'none';
  }
};
