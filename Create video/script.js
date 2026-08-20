const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

// Открыть меню
menuBtn.addEventListener("click", () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
});

// Закрыть меню по крестику
closeBtn.addEventListener("click", closeMenu);

// Закрыть меню по затемненному фону
overlay.addEventListener("click", closeMenu);

function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

// Закрытие меню клавишей Esc
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeMenu();
    }
});

// При открытии одного видео остальные ставятся на паузу
const videos = document.querySelectorAll("video");

videos.forEach(video => {
    video.addEventListener("play", () => {
        videos.forEach(v => {
            if (v !== video) {
                v.pause();
            }
        });
    });
});

// Двойной клик по видео — полноэкранный режим
videos.forEach(video => {
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


const lang = document.getElementById("language");

const text = {

ru:{
home:"Главная",
video:"Видео",
cat:"Категории",
fav:"Избранное",
profile:"Профиль",
newvideo:"Новые видео"
},

ua:{
home:"Головна",
video:"Відео",
cat:"Категорії",
fav:"Обране",
profile:"Профіль",
newvideo:"Нові відео"
},

en:{
home:"Home",
video:"Videos",
cat:"Categories",
fav:"Favorites",
profile:"Profile",
newvideo:"New Videos"
}

};

lang.addEventListener("change",function(){

const l=text[this.value];

document.querySelectorAll(".side-menu a")[0].innerHTML=l.home;
document.querySelectorAll(".side-menu a")[1].innerHTML=l.video;
document.querySelectorAll(".side-menu a")[2].innerHTML=l.cat;
document.querySelectorAll(".side-menu a")[3].innerHTML=l.fav;
document.querySelectorAll(".side-menu a")[4].innerHTML=l.profile;

document.querySelector("h2").innerHTML=l.newvideo;

});


// Поиск видео по названию

const search = document.getElementById("search");
const cards = document.querySelectorAll(".card");

if(search){

search.addEventListener("input", function(){

    let value = this.value.toLowerCase();

    cards.forEach(card => {

        let title = card.dataset.title.toLowerCase();

        if(title.includes(value)){
            card.style.display = "";
        }
        else{
            card.style.display = "none";
        }

    });

});

}



// Фильтр по категориям

const categoryButtons = document.querySelectorAll(".categories button");

categoryButtons.forEach(button => {

    button.addEventListener("click", function(){

        let category = this.dataset.category;


        categoryButtons.forEach(btn=>{
            btn.classList.remove("active");
        });

        this.classList.add("active");


        cards.forEach(card=>{

            let cardCategory = card.dataset.category;


            if(
                category === "all" ||
                cardCategory === category
            ){

                card.style.display="";

            }else{

                card.style.display="none";

            }

        });

    });

});


// Категории видео

document.addEventListener("DOMContentLoaded", function(){

    const buttons = document.querySelectorAll(".categories button");
    const cards = document.querySelectorAll(".card");


    buttons.forEach(button => {

        button.addEventListener("click", function(){

            let category = this.dataset.category;


            cards.forEach(card => {

                let cardCategory = card.dataset.category;


                if(category === "all" || cardCategory === category){

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });


});