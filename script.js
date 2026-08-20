const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");


// ==============================
// МЕНЮ
// ==============================

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        sideMenu.classList.add("active");
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });
}


function closeMenu() {

    if (sideMenu) {
        sideMenu.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.style.overflow = "auto";
}


if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
}


if (overlay) {
    overlay.addEventListener("click", closeMenu);
}


document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeMenu();
    }

});


// ==============================
// ПОИСК
// ==============================

const search = document.getElementById("search");


if (search) {

    search.addEventListener("input", function () {

        const value =
            this.value.trim().toLowerCase();


        const cards =
            document.querySelectorAll(".card");


        cards.forEach(card => {

            const title =
                (card.dataset.title || "")
                .toLowerCase();


            if (title.includes(value)) {

                card.style.display = "";

            } else {

                card.style.display = "none";

            }

        });

    });

}


// ==============================
// ВИДЕО
// ==============================

function setupVideos() {

    const videos =
        document.querySelectorAll("video");


    videos.forEach(video => {

        // Остановить остальные видео
        video.addEventListener("play", () => {

            document
                .querySelectorAll("video")
                .forEach(otherVideo => {

                    if (otherVideo !== video) {
                        otherVideo.pause();
                    }

                });

        });


        // Двойной клик — полный экран
        video.addEventListener("dblclick", () => {

            if (video.requestFullscreen) {

                video.requestFullscreen();

            } else if (video.webkitRequestFullscreen) {

                video.webkitRequestFullscreen();

            } else if (video.msRequestFullscreen) {

                video.msRequestFullscreen();

            }

        });

    });

}


// Запускаем для уже существующих видео
setupVideos();


// ==============================
// ЯЗЫК
// ==============================

const lang =
    document.getElementById("language");


const text = {

    ru: {
        home: "Главная",
        add: "Добавить видео",
        profile: "Профиль",
        newvideo: "Новые видео"
    },

    ua: {
        home: "Головна",
        add: "Додати відео",
        profile: "Профіль",
        newvideo: "Нові відео"
    },

    en: {
        home: "Home",
        add: "Add video",
        profile: "Profile",
        newvideo: "New Videos"
    }

};


if (lang) {

    lang.addEventListener("change", function () {

        const current =
            text[this.value];


        const menuLinks =
            document.querySelectorAll(".side-menu a");


        if (menuLinks[0]) {
            menuLinks[0].textContent =
                current.home;
        }


        if (menuLinks[1]) {
            menuLinks[1].textContent =
                current.add;
        }


        if (menuLinks[2]) {
            menuLinks[2].textContent =
                current.profile;
        }


        const heading =
            document.querySelector("h2");


        if (heading) {
            heading.textContent =
                current.newvideo;
        }

    });

}










const videosContainer = document.getElementById("videos");

async function loadVideos() {

    try {

        const response = await fetch("/api/videos");

        const videos = await response.json();

        videosContainer.innerHTML = "";

        videos.forEach(video => {

            const card = document.createElement("div");

            card.className = "card";

            card.dataset.title = video.title;

            card.dataset.category = video.category || "";

            card.innerHTML = `
                <video
                    controls
                    preload="metadata"
                    poster="${video.cover}"
                >
                    <source
                        src="${video.video}"
                        type="video/mp4"
                    >
                </video>

                <p>${video.title}</p>
            `;

            videosContainer.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Ошибка загрузки видео:",
            error
        );

    }

}

loadVideos();