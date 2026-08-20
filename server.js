const express = require("express");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();

const { v2: cloudinary } = require("cloudinary");

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================================
   CLOUDINARY
========================================= */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


/* =========================================
   ПАПКИ И ЛОКАЛЬНАЯ БАЗА
========================================= */

const ROOT = __dirname;
const DATA_DIR = `${ROOT}/data`;
const DATA_FILE = `${DATA_DIR}/videos.json`;


if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {
        recursive: true
    });
}


if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
        DATA_FILE,
        "[]",
        "utf8"
    );
}


/* =========================================
   MIDDLEWARE
========================================= */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


/* =========================================
   СТАТИЧЕСКИЙ САЙТ
========================================= */

app.use(
    express.static(ROOT)
);


/* =========================================
   MULTER
   Храним загруженный файл временно
   в памяти, затем отправляем в Cloudinary
========================================= */

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        // 100 МБ
        fileSize: 100 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        /* -------------------------
           ВИДЕО
        ------------------------- */

        if (file.fieldname === "video") {

            const allowedVideos = [
                "video/mp4",
                "video/webm",
                "video/ogg",
                "video/quicktime"
            ];

            if (
                !allowedVideos.includes(
                    file.mimetype
                )
            ) {

                return cb(
                    new Error(
                        "Можно загружать только MP4, WEBM, OGG или MOV."
                    )
                );

            }
        }


        /* -------------------------
           ОБЛОЖКА
        ------------------------- */

        if (file.fieldname === "cover") {

            const allowedImages = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (
                !allowedImages.includes(
                    file.mimetype
                )
            ) {

                return cb(
                    new Error(
                        "Обложка должна быть JPG, PNG или WEBP."
                    )
                );

            }
        }


        cb(null, true);
    }

});


/* =========================================
   ФУНКЦИЯ ЗАГРУЗКИ В CLOUDINARY
========================================= */

function uploadToCloudinary(
    buffer,
    options = {}
) {

    return new Promise(
        (resolve, reject) => {

            const stream =
                cloudinary.uploader.upload_stream(
                    options,
                    (error, result) => {

                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(result);
                    }
                );


            stream.end(buffer);

        }
    );
}


/* =========================================
   ПОЛУЧИТЬ ВСЕ ВИДЕО
========================================= */

app.get(
    "/api/videos",
    (req, res) => {

        try {

            const videos =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );


            res.json(videos);

        } catch (error) {

            console.error(
                "Ошибка чтения базы:",
                error
            );


            res.status(500).json({

                error:
                    "Не удалось загрузить список видео."

            });

        }

    }
);


/* =========================================
   ПОЛУЧИТЬ ВИДЕО ПО ID
========================================= */

app.get(
    "/api/videos/:id",
    (req, res) => {

        try {

            const videos =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );


            const video =
                videos.find(
                    item =>
                        item.id ===
                        req.params.id
                );


            if (!video) {

                return res.status(
                    404
                ).json({

                    error:
                        "Видео не найдено."

                });

            }


            res.json(video);

        } catch (error) {

            console.error(error);


            res.status(500).json({

                error:
                    "Ошибка сервера."

            });

        }

    }
);


/* =========================================
   ПУБЛИКАЦИЯ ВИДЕО
========================================= */

app.post(

    "/api/videos",

    upload.fields([

        {
            name: "video",
            maxCount: 1
        },

        {
            name: "cover",
            maxCount: 1
        }

    ]),

    async (req, res) => {

        try {

            /* -------------------------
               ДАННЫЕ ФОРМЫ
            ------------------------- */

            const title =
                (
                    req.body.title ||
                    ""
                ).trim();


            const description =
                (
                    req.body.description ||
                    ""
                ).trim();


            const category =
                (
                    req.body.category ||
                    ""
                ).trim();


            /* -------------------------
               ПРОВЕРКА НАЗВАНИЯ
            ------------------------- */

            if (!title) {

                return res.status(
                    400
                ).json({

                    error:
                        "Введите название видео."

                });

            }


            /* -------------------------
               ПРОВЕРКА КАТЕГОРИИ
            ------------------------- */

            if (!category) {

                return res.status(
                    400
                ).json({

                    error:
                        "Выберите категорию."

                });

            }


            /* -------------------------
               ПРОВЕРКА ВИДЕО
            ------------------------- */

            if (
                !req.files ||
                !req.files.video ||
                !req.files.video[0]
            ) {

                return res.status(
                    400
                ).json({

                    error:
                        "Выберите видео."

                });

            }


            /* -------------------------
               ПРОВЕРКА ОБЛОЖКИ
            ------------------------- */

            if (
                !req.files.cover ||
                !req.files.cover[0]
            ) {

                return res.status(
                    400
                ).json({

                    error:
                        "Выберите обложку."

                });

            }


            const videoFile =
                req.files.video[0];


            const coverFile =
                req.files.cover[0];


            /* =================================
               ЗАГРУЖАЕМ ВИДЕО В CLOUDINARY
            ================================= */

            console.log(
                "Загрузка видео в Cloudinary..."
            );


            const uploadedVideo =
                await uploadToCloudinary(

                    videoFile.buffer,

                    {
                        resource_type: "video",

                        folder:
                            "y-fetish/videos",

                        public_id:
                            Date.now().toString(),

                        overwrite: false
                    }

                );


            console.log(
                "Видео загружено:"
            );

            console.log(
                uploadedVideo.secure_url
            );


            /* =================================
               ЗАГРУЖАЕМ ОБЛОЖКУ
            ================================= */

            console.log(
                "Загрузка обложки..."
            );


            const uploadedCover =
                await uploadToCloudinary(

                    coverFile.buffer,

                    {
                        resource_type: "image",

                        folder:
                            "y-fetish/covers",

                        public_id:
                            Date.now().toString() +
                            "-cover",

                        overwrite: false
                    }

                );


            console.log(
                "Обложка загружена:"
            );

            console.log(
                uploadedCover.secure_url
            );


            /* =================================
               ЧИТАЕМ БАЗУ
            ================================= */

            const videos =
                JSON.parse(
                    fs.readFileSync(
                        DATA_FILE,
                        "utf8"
                    )
                );


            /* =================================
               СОЗДАЁМ ПУБЛИКАЦИЮ
            ================================= */

            const newVideo = {

                id:
                    Date.now().toString(),

                title:
                    title,

                description:
                    description,

                category:
                    category,

                video:
                    uploadedVideo.secure_url,

                cover:
                    uploadedCover.secure_url,

                cloudinaryVideoId:
                    uploadedVideo.public_id,

                cloudinaryCoverId:
                    uploadedCover.public_id,

                createdAt:
                    new Date().toISOString()

            };


            /* =================================
               НОВЫЕ ВИДЕО СВЕРХУ
            ================================= */

            videos.unshift(
                newVideo
            );


            /* =================================
               СОХРАНЯЕМ БАЗУ
            ================================= */

            fs.writeFileSync(

                DATA_FILE,

                JSON.stringify(
                    videos,
                    null,
                    2
                ),

                "utf8"

            );


            /* =================================
               ОТВЕТ
            ================================= */

            res.json({

                success:
                    true,

                video:
                    newVideo

            });


        } catch (error) {

            console.error(
                "Ошибка публикации:",
                error
            );


            res.status(500).json({

                error:
                    error.message ||
                    "Ошибка при публикации видео."

            });

        }

    }

);


/* =========================================
   ОБРАБОТКА ОШИБОК
========================================= */

app.use(
    (
        err,
        req,
        res,
        next
    ) => {

        console.error(
            "Ошибка:",
            err
        );


        res.status(400).json({

            error:
                err.message ||
                "Ошибка загрузки."

        });

    }
);


/* =========================================
   ЗАПУСК СЕРВЕРА
========================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Y-FETISH запущен: http://localhost:${PORT}`
        );

    }
);