document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =====================================
           ВИДЕО
        ===================================== */

        const videos =
            document.querySelectorAll(
                ".video-card video"
            );


        /* =====================================
           АВТОПРОИГРЫВАНИЕ
        ===================================== */

        const videoContainer =
            document.getElementById("videos");


        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            const video =
                                entry.target;

                            const card =
                                video.closest(
                                    ".video-card"
                                );


                            if (
                                entry.isIntersecting
                            ) {

                                /*
                                 Останавливаем
                                 остальные видео
                                */

                                videos.forEach(
                                    function (other) {

                                        if (
                                            other !== video
                                        ) {

                                            other.pause();

                                            other
                                                .closest(
                                                    ".video-card"
                                                )
                                                .classList
                                                .remove(
                                                    "paused"
                                                );

                                        }

                                    }
                                );


                                /*
                                 Запускаем
                                 текущее видео
                                */

                                video.muted = true;

                                video.play()
                                    .then(
                                        function () {

                                            card.classList
                                                .remove(
                                                    "paused"
                                                );

                                        }
                                    )
                                    .catch(
                                        function () {

                                            card.classList
                                                .add(
                                                    "paused"
                                                );

                                        }
                                    );

                            } else {

                                video.pause();

                                card.classList
                                    .remove(
                                        "paused"
                                    );

                            }

                        }
                    );

                },

                {
                    root:
                        videoContainer,

                    threshold:
                        0.7
                }

            );


        videos.forEach(
            function (video) {

                observer.observe(video);

            }
        );


        /* =====================================
           НАЖАТИЕ НА ВИДЕО
        ===================================== */

        videos.forEach(
            function (video) {

                video.addEventListener(
                    "click",
                    function () {

                        const card =
                            video.closest(
                                ".video-card"
                            );


                        if (video.paused) {

                            video.play()
                                .catch(
                                    function () {}
                                );

                            card.classList
                                .remove(
                                    "paused"
                                );

                        } else {

                            video.pause();

                            card.classList
                                .add(
                                    "paused"
                                );

                        }

                    }
                );

            }
        );


        /* =====================================
           КНОПКИ ЗВУКА
        ===================================== */

        const soundButtons =
            document.querySelectorAll(
                ".sound-button"
            );


        soundButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();


                        const card =
                            button.closest(
                                ".video-card"
                            );


                        const video =
                            card.querySelector(
                                "video"
                            );


                        video.muted =
                            !video.muted;


                        if (video.muted) {

                            button.textContent =
                                "🔇";

                        } else {

                            button.textContent =
                                "🔊";

                        }

                    }
                );

            }
        );


        /* =====================================
           МЕНЮ
        ===================================== */

        const menuBtn =
            document.getElementById(
                "menuBtn"
            );


        const closeBtn =
            document.getElementById(
                "closeBtn"
            );


        const sideMenu =
            document.getElementById(
                "sideMenu"
            );


        const overlay =
            document.getElementById(
                "overlay"
            );


        function openMenu() {

            sideMenu.classList.add(
                "active"
            );

            overlay.classList.add(
                "active"
            );

            document.body.classList.add(
                "menu-open"
            );

        }


        function closeMenu() {

            sideMenu.classList.remove(
                "active"
            );

            overlay.classList.remove(
                "active"
            );

            document.body.classList.remove(
                "menu-open"
            );

        }


        menuBtn.addEventListener(
            "click",
            openMenu
        );


        closeBtn.addEventListener(
            "click",
            closeMenu
        );


        overlay.addEventListener(
            "click",
            closeMenu
        );


        /* =====================================
           ЗАКРЫТИЕ МЕНЮ ESC
        ===================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeMenu();

                }

            }
        );


        /* =====================================
           СВАЙП
        ===================================== */

        let touchStartY = 0;

        let touchEndY = 0;


        videoContainer.addEventListener(
            "touchstart",
            function (event) {

                touchStartY =
                    event.touches[0].clientY;

            },
            {
                passive: true
            }
        );


        videoContainer.addEventListener(
            "touchend",
            function (event) {

                touchEndY =
                    event.changedTouches[0].clientY;


                const difference =
                    touchStartY -
                    touchEndY;


                /*
                 Маленькое движение
                 не считаем свайпом
                */

                if (
                    Math.abs(difference) < 60
                ) {

                    return;

                }


                /*
                 Сам scroll-snap
                 браузера уже листает
                 видео.

                 Здесь ничего дополнительно
                 прокручивать не нужно.
                */

            },
            {
                passive: true
            }
        );


    }
);
