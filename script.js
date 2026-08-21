const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

// ==========================================
// МЕНЮ
// ==========================================

function openMenu() {

```
if (sideMenu) {
    sideMenu.classList.add("active");
}

if (overlay) {
    overlay.classList.add("active");
}

document.body.classList.add("menu-open");
```

}

function closeMenu() {

```
if (sideMenu) {
    sideMenu.classList.remove("active");
}

if (overlay) {
    overlay.classList.remove("active");
}

document.body.classList.remove("menu-open");
```

}

if (menuBtn) {

```
menuBtn.addEventListener("click", function () {

    if (sideMenu.classList.contains("active")) {
        closeMenu();
    } else {
        openMenu();
    }

});
```

}

if (closeBtn) {
closeBtn.addEventListener("click", closeMenu);
}

if (overlay) {
overlay.addEventListener("click", closeMenu);
}

// Закрытие клавишей Escape

document.addEventListener("keydown", function (event) {

```
if (event.key === "Escape") {
    closeMenu();
}
```

});

// Закрываем меню после перехода по ссылке

document.querySelectorAll(".side-menu a").forEach(function (link) {

```
link.addEventListener("click", function () {
    closeMenu();
});
```

});

// ==========================================
// ПОИСК
// ==========================================

const search = document.getElementById("search");

if (search) {

```
search.addEventListener("input", function () {

    const value =
        this.value
            .trim()
            .toLowerCase();


    document
        .querySelectorAll(".card")
        .forEach(function (card) {

            const title =
                (card.dataset.title || "")
                    .toLowerCase();


            card.style.display =
                title.includes(value)
                    ? ""
                    : "none";

        });

});
```

}

// ==========================================
// ВИДЕО
// ==========================================

function setupVideos() {

```
const videos =
    document.querySelectorAll("video");


videos.forEach(function (video) {


    // Останавливаем остальные видео

    video.addEventListener("play", function () {

        document
            .querySelectorAll("video")
            .forEach(function (otherVideo) {

                if (otherVideo !== video) {
                    otherVideo.pause();
                }

            });

    });


    // Двойной клик — полный экран

    video.addEventListener("dblclick", function () {

        if (video.requestFullscreen) {

            video.requestFullscreen();

        } else if (video.webkitRequestFullscreen) {

            video.webkitRequestFullscreen();

        }

    });

});
```

}

// ==========================================
// ЯЗЫК
// ==========================================

const lang =
document.getElementById("language");

const text = {

```
ru: {
    home: "🏠 Главная",
    add: "➕ Добавить видео",
    profile: "👤 Профиль",
    newvideo: "Новые видео"
},

ua: {
    home: "🏠 Головна",
    add: "➕ Додати відео",
    profile: "👤 Профіль",
    newvideo: "Нові відео"
},

en: {
    home: "🏠 Home",
    add: "➕ Add video",
    profile: "👤 Profile",
    newvideo: "New Videos"
}
```

};

if (lang) {

```
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
```

}

// ==========================================
// ЗАГРУЗКА ВИДЕО
// ==========================================

const videosContainer =
document.getElementById("videos");

async function loadVideos() {

```
if (!videosContainer) {
    return;
}


try {

    const response =
        await fetch("/api/videos");


    if (!response.ok) {
        throw new Error(
            "Не удалось загрузить видео."
        );
    }


    const videos =
        await response.json();


    videosContainer.innerHTML = "";


    if (
        !Array.isArray(videos) ||
        videos.length === 0
    ) {

        videosContainer.innerHTML = `
            <p class="no-videos">
                Пока нет опубликованных видео.
            </p>
        `;

        return;
    }


    videos.forEach(function (video) {

        const card =
            document.createElement("div");


        card.className =
            "card";


        card.dataset.title =
            video.title || "";


        card.dataset.category =
            video.category || "";


        card.innerHTML = `

            <video
                controls
                preload="metadata"
                poster="${video.cover || ""}"
            >

                <source
                    src="${video.video || ""}"
                    type="video/mp4"
                >

                Ваш браузер
                не поддерживает видео.

            </video>


            <p>
                ${escapeHTML(video.title || "")}
            </p>

        `;


        videosContainer.appendChild(card);

    });


    setupVideos();


} catch (error) {

    console.error(
        "Ошибка загрузки видео:",
        error
    );


    videosContainer.innerHTML = `
        <p class="no-videos">
            Не удалось загрузить видео.
        </p>
    `;

}
```

}

// ==========================================
// ЗАЩИТА ТЕКСТА
// ==========================================

function escapeHTML(text) {

```
const element =
    document.createElement("div");


element.textContent =
    text;


return element.innerHTML;
```

}

// ==========================================
// ЗАПУСК
// ==========================================

document.addEventListener(
"DOMContentLoaded",
loadVideos
);
