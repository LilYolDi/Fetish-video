const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const PUBLIC_DIR = path.join(__dirname, "public");
const VIDEOS_DIR = path.join(PUBLIC_DIR, "videos");
const DATA_DIR = path.join(PUBLIC_DIR, "data");
const VIDEOS_JSON = path.join(DATA_DIR, "videos.json");


/* =====================================
   СОЗДАНИЕ ПАПОК
===================================== */

if (!fs.existsSync(VIDEOS_DIR)) {
    fs.mkdirSync(VIDEOS_DIR, {
        recursive: true
    });
}

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });
}


/* =====================================
   СОЗДАНИЕ JSON
===================================== */

if (!fs.existsSync(VIDEOS_JSON)) {

    fs.writeFileSync(
        VIDEOS_JSON,
        "[]",
        "utf8"
    );

}


/* =====================================
   MIDDLEWARE
===================================== */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =====================================
   СТАТИЧЕСКИЙ САЙТ
===================================== */

app.use(
    express.static(PUBLIC_DIR)
);


/* =====================================
   API: СПИСОК ВИДЕО
===================================== */

app.get(
    "/api/videos",
    (req, res) => {

        try {

            const data =
                fs.readFileSync(
                    VIDEOS_JSON,
                    "utf8"
                );

            const videos =
                JSON.parse(data);


            res.json(videos);

        } catch (error) {

            console.error(
                "Ошибка чтения videos.json:",
                error
            );

            res.status(500).json({
                error: "Не удалось загрузить видео"
            });

        }

    }
);


/* =====================================
   API: ДОБАВИТЬ ВИДЕО В JSON
===================================== */

app.post(
    "/api/videos",
    (req, res) => {

        try {

            const {
                title,
                video,
                cover,
                category
            } = req.body;


            if (!video) {

                return res.status(400).json({
                    error: "Не указана ссылка на видео"
                });

            }


            const data =
                fs.readFileSync(
                    VIDEOS_JSON,
                    "utf8"
                );


            const videos =
                JSON.parse(data);


            const newVideo = {

                id:
                    Date.now().toString(),

                title:
                    title || "Без названия",

                video:
                    video,

                cover:
                    cover || "",

                category:
                    category || "Все",

                createdAt:
                    new Date().toISOString()

            };


            videos.unshift(newVideo);


            fs.writeFileSync(
                VIDEOS_JSON,
                JSON.stringify(
                    videos,
                    null,
                    2
                ),
                "utf8"
            );


            res.json({
                success: true,
                video: newVideo
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Не удалось добавить видео"
            });

        }

    }
);


/* =====================================
   API: УДАЛИТЬ ВИДЕО
===================================== */

app.delete(
    "/api/videos/:id",
    (req, res) => {

        try {

            const data =
                fs.readFileSync(
                    VIDEOS_JSON,
                    "utf8"
                );


            let videos =
                JSON.parse(data);


            const oldLength =
                videos.length;


            videos =
                videos.filter(
                    video =>
                        video.id !== req.params.id
                );


            if (
                videos.length === oldLength
            ) {

                return res.status(404).json({
                    error: "Видео не найдено"
                });

            }


            fs.writeFileSync(
                VIDEOS_JSON,
                JSON.stringify(
                    videos,
                    null,
                    2
                ),
                "utf8"
            );


            res.json({
                success: true
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                error: "Ошибка удаления"
            });

        }

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

    }
);
