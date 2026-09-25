const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = [...document.querySelectorAll(".gallery-item")];
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-img");
const closeButton = document.querySelector(".close-btn");
const previousButton = document.querySelector(".prev-btn");
const nextButton = document.querySelector(".next-btn");

let currentIndex = 0;

function visibleItems() {
	return galleryItems.filter((item) => !item.hidden);
}

function showImage(index) {
	const items = visibleItems();
	if (items.length === 0) return;

	currentIndex = (index + items.length) % items.length;
	const image = items[currentIndex].querySelector("img");
	lightboxImage.src = image.src;
	lightboxImage.alt = image.alt;
}

function openLightbox(item) {
	currentIndex = visibleItems().indexOf(item);
	showImage(currentIndex);
	lightbox.classList.remove("hidden");
	closeButton.focus();
}

function closeLightbox() {
	lightbox.classList.add("hidden");
}

filterButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const filter = button.dataset.filter;
		filterButtons.forEach((filterButton) => {
			filterButton.classList.toggle("active", filterButton === button);
		});
		galleryItems.forEach((item) => {
			item.hidden = filter !== "all" && item.dataset.category !== filter;
		});
	});
});

galleryItems.forEach((item) => {
	item.addEventListener("click", () => openLightbox(item));
});

closeButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => showImage(currentIndex - 1));
nextButton.addEventListener("click", () => showImage(currentIndex + 1));

lightbox.addEventListener("click", (event) => {
	if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
	if (lightbox.classList.contains("hidden")) return;

	if (event.key === "Escape") closeLightbox();
	if (event.key === "ArrowLeft") showImage(currentIndex - 1);
	if (event.key === "ArrowRight") showImage(currentIndex + 1);
});
