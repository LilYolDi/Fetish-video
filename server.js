const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

/* =====================================
   ПАПКА САЙТА
===================================== */

const PUBLIC_DIR = path.join(
    __dirname,
    "public"
);


/* =====================================
   ПАПКА С ВИДЕО
===================================== */

const VIDEOS_DIR = path.join(
    PUBLIC_DIR,
    "videos"
);


/* =====================================
   СОЗДАЁМ ПАПКУ VIDEOS
===================================== */

if (!fs.existsSync(VIDEOS_DIR)) {

    fs.mkdirSync(
        VIDEOS_DIR,
        {
            recursive: true
        }
    );

}


/* =====================================
   СТАТИЧЕСКИЕ ФАЙЛЫ
===================================== */

app.use(
    express.static(PUBLIC_DIR)
);


/* =====================================
   API — СПИСОК ВСЕХ ВИДЕО
===================================== */

app.get(
    "/api/videos",
    (req, res) => {

        try {

            const files =
                fs.readdirSync(
                    VIDEOS_DIR
                );


            const allowedExtensions = [
                ".mp4",
                ".webm",
                ".ogg",
                ".mov",
                ".m4v"
            ];


            const videos =
                files
                    .filter(file => {

                        const extension =
                            path.extname(
                                file
                            ).toLowerCase();

                        return allowedExtensions
                            .includes(extension);

                    })
                    .map((file, index) => {

                        return {

                            id: index + 1,

                            title:
                                path
                                    .parse(file)
                                    .name
                                    .replace(
                                        /[_-]+/g,
                                        " "
                                    ),

                            video:
                                "/videos/" +
                                encodeURIComponent(
                                    file
                                ),

                            cover: "",

                            category: "Все"

                        };

                    });


            /*
                Новые файлы сверху.
                Если хочешь порядок video1,
                video2, video3 — оставь sort.
            */

            videos.sort(
                (a, b) =>
                    a.title.localeCompare(
                        b.title,
                        undefined,
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    )
            );


            res.json(videos);

        } catch (error) {

            console.error(
                "Ошибка чтения папки videos:",
                error
            );


            res.status(500).json({

                error:
                    "Не удалось получить список видео"

            });

        }

    }
);


/* =====================================
   ПРОВЕРКА API
===================================== */

app.get(
    "/api",
    (req, res) => {

        res.json({

            status: "ok",

            message:
                "Y-FETISH API работает",

            videosFolder:
                "/public/videos"

        });

    }
);


/* =====================================
   404
===================================== */

app.use(
    (req, res) => {

        res.status(404).send(
            "Страница не найдена"
        );

    }
);


/* =====================================
   ЗАПУСК
===================================== */

app.listen(
    PORT,
    () => {

        console.log(
            `Y-FETISH запущен на порту ${PORT}`
        );

        console.log(
            `Видео находятся в: ${VIDEOS_DIR}`
        );

    }
);
