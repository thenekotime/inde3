document.addEventListener("DOMContentLoaded", function () {

const sections = document.querySelectorAll(".smth");

const observer = new IntersectionObserver(function(entries, observer) {
entries.forEach(function(entry) {
if (entry.isIntersecting) {
entry.target.classList.add("visible");
observer.unobserve(entry.target); // чтобы не дёргалось повторно
}
});
}, {
threshold: 0.2
});

sections.forEach(function(section) {
observer.observe(section);
});

});

