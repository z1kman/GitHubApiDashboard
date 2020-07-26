
const client_id = '14df7ada7023554a566a';
const client_secret = '2742ae585c57aceacc8686e098e1a43afa13f521';
const AuthKey = `client_id=${client_id}&client_secret=${client_secret}`;

document.addEventListener("DOMContentLoaded", function () {
    let Link;
    if (localStorage.getItem('link')) { // проверяем, есть ли значение в localStorage
        Link = localStorage.getItem('link')
        localStorage.removeItem('link');//удаление ссылки из локального хранилища
        RepositoryCardGeneration(Link);//создание карточки репозитория
    } else {//если нет то redirect на главную страницу
        document.location.href = "/";
    }
});

function RepositoryCardGeneration(Link) {//создание карточки репозитория
    const ImgProfile = document.getElementById('ImgProfile');//изображение профиля
    const NameRepos = document.getElementById('NameRepos');//имя репозитория
    const LastCommit = document.getElementById('LastCommit');//дата последнего commit(а)
    const NameProfile = document.getElementById('NameProfile');//имя владельца
    const StarCount = document.getElementById('StarCount');//кол-во звезд
    const Language = document.getElementById('Language');//языки
    const Description = document.getElementById('Description');//описание
    const Contributors = document.getElementById('Contributors');//топ контрибьютеров
    let Size = 0;//размер репозитория

    fetch(Link + "?" + AuthKey).then(response => response.json()).then(result => {//поиск и создание основной информации
        ImgProfile.src = result.owner.avatar_url;//аватар
        NameRepos.innerText = result.name;//имя репозитория
        NameProfile.href = result.owner.html_url;//ссылка на профиль
        NameProfile.innerText = result.owner.login;//имя профиля
        StarCount.innerText = result.stargazers_count;//кол-во звезд
        //проверка на наличие описания
        result.description != null ? Description.innerText = result.description : Description.innerText = "Не найдено"
        //размер репозитория
        Size = result.size;
    }).then(function () {
        //если в репозитории хоть что-то существует
        if (Size > 0) {
            //поиск и создание даты последнего commit(а)
            fetch(`${Link}/commits?per_page=1&${AuthKey}`).then(response => response.json()).then(result => {
                LastCommit.innerText = result[0].commit.author.date.split('T')[0];
            })
            //поиск и создание списка языков
            fetch(`${Link}/languages?${AuthKey}`).then(response => response.json()).then(result => {
                //проверка наличия языка/языков
                if (Object.keys(result).length == 1) {
                    Language.innerHTML = "Язык: "
                } else if (Object.keys(result).length > 1) {
                    Language.innerHTML = "Языки: ";
                } else {
                    Language.innerHTML = "Языки: ни одного языка не найдено";
                }
                //создание списка языков(если он есть)
                for (let i = 0; i < Object.keys(result).length; i++) {
                    if (i + 1 < Object.keys(result).length)//если не последний элемент
                        Language.innerHTML += `<li class='LiLanguage'>${Object.keys(result)[i]},</li>`;
                    else
                        Language.innerHTML += `<li class='LiLanguage'> ${Object.keys(result)[i]}</li>`;
                }
            })
            //поиск и создание списка контрибьютеров
            fetch(`${Link}/contributors?per_page=10&${AuthKey}`).then(response => response.ok ? response.json() : response.text()).then(result => {
                Contributors.innerHTML = "Топ самых активных контрибьютеров";
                for (let i = 0; i < result.length; i++) {
                    if (i + 1 < result.length) {
                        Contributors.innerHTML += `<li class = 'LiContributors'>${result[i].login}<li>`;
                    } else {
                        Contributors.innerHTML += `<li class = 'LiContributors Last'>${result[i].login}<li>`;
                    }
                }
            })
            //если репозиторий пустой
        } else {
            LastCommit.innerText = "Не существует";
            Language.innerHTML = "Языки: ни одного языка не найдено";
            Contributors.innerHTML = "Ни одного контрибьютера не найдено";
        }
    })
}
