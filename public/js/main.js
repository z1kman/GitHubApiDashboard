const client_id = '14df7ada7023554a566a';
const client_secret = '2742ae585c57aceacc8686e098e1a43afa13f521';
const AuthKey = "client_id=" + client_id + "&client_secret=" + client_secret;
const Start = debounce(function () { SetSearchQuery() }, 250);
let NumberOfPage = 1;

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

window.onload = function () {
    let SearchInput = document.getElementById('SearchInput');
    //проверка сессионого хранилища на наличие значений
    if (sessionStorage.getItem('SearchInput')) {
        SearchInput.value = sessionStorage.getItem('SearchInput');
    }
    if (sessionStorage.getItem('NumberOfPage')) {
        NumberOfPage = sessionStorage.getItem('NumberOfPage');
    }
    SetSearchQuery();//установка запроса
}

function SetSearchQuery() {//установка запроса 
    let LabelContainer = document.getElementById('LabelContainer');//надпись у контейнера
    let SearchInput = document.getElementById('SearchInput');//поле поиска
    //url для топ 10 репозиториев
    let url = "https://api.github.com/search/repositories?q=stars:>=10000&sort=stars&order=desc&page=" + NumberOfPage + "&per_page=10&" + AuthKey; 
    //проверка на наличие символов в поисковой строке
    if (SearchInput.value != '') {
        //url для запроса из поисковой строки
        url = "https://api.github.com/search/repositories?q=" + SearchInput.value + "&sort=stars&order=desc&page=" + NumberOfPage + "&per_page=10&" + AuthKey;
    }
    LabelContainer.innerText = "Загрузка";//изменение надписи у контейнера
    //запись в sessionStorage значение поисковой строки и номера страницы
    sessionStorage.setItem('SearchInput', SearchInput.value);
    sessionStorage.setItem('NumberOfPage', NumberOfPage);
    SearchRepos(url);
}

async function SearchRepos(url) {//поиск репозиториев
    let LabelContainer = document.getElementById('LabelContainer');
    DeletePaginator();//удаление старого paginator(а)
    DeleteReposList();//удаление старых репозиториев
    let response = await fetch(url);
    let result = await response.json();
    if (response.status == 403) {
        LabelContainer.innerText = "Превышен лимит запросов на единицу времени (Ошибка 403).\n Через минуту доступ будет восстановлен."
    } else if (result.total_count == 0) {
        LabelContainer.innerText = "По вашему запросу ничего не найдено."
    } else {
        CreateReposList(response, result);//создание списка репозиториев
    }
}

function CreateReposList(Response, Result) {//создание списка репозиториев
    let LabelContainer = document.getElementById('LabelContainer');
    let MaxPageCount = 1;
    let ReposList = document.getElementById('ReposList');//список репозиториев
    let HeadersLink = Response.headers.get('link');//заголовок ответа
    //получение максимального кол-ва страниц 
    if (HeadersLink != null) {
        MaxPageCount = Number(HeadersLink.split('rel="last"')[0].split('rel="next"')[1].split('page=')[1].split('&')[0])
    } else {
        MaxPageCount = 2;
    }
    //удаление всех элементов в списке репозиториев
    DeleteReposList();

    //фоомирование нового списка репозиториев
    for (let i = 0; i < Result.items.length; i++) {
        let Repos = document.createElement('li');
        let LeftSide = document.createElement('div');
        let RightSide = document.createElement('div');

        //создание панели репозитория
        Repos.className = "Repos";
        LeftSide.className = "LeftSide";
        RightSide.className = "RightSide";
        Repos.append(LeftSide);
        Repos.append(RightSide);

        //запонлнение панели репозитория
        LeftSide.innerHTML = "<div class = \"NameRepos\" Link = \"" + Result.items[i].url + "\" onclick=\"OpenRepos(this)\">" + Result.items[i].name + "</div>" +
            "<div class = \"CountStars\">Звезд:" + Result.items[i].stargazers_count + "</div>";
        RightSide.innerHTML = "<div class = \"LinkRepos\"><a href=\"" + Result.items[i].owner.repos_url + "\">ссылка</a></div>" +
            "<div class = \"DataUpdate\">Загрузка commit(ов)...</div>";
        if (Result.items[i].size > 0) {//если commit(ы) существуют
            CheckLastCommit(Result.items[i].commits_url.split('{')[0]).then(result => {
                RightSide.innerHTML = "<div class = \"LinkRepos\"><a href=\"" + Result.items[i].html_url + "\">Cсылка на GitHub</a></div>" +
                    "<div class = \"DataUpdate\">Последний commit: " + result + "</div>";
            }).then(ReposList.append(Repos))
        } else {//если нет ни одного commit(а)
            RightSide.innerHTML = "<div class = \"LinkRepos\"><a href=\"" + Result.items[i].html_url + "\">Cсылка на GitHub</a></div>" +
                "<div class = \"DataUpdate\">Сommit(ов) не существует</div>";
            ReposList.append(Repos);
        }

    }
    LabelContainer.innerText = "Список репозиториев";
    CreatePaginator(MaxPageCount);//создание paginator(а)
}

async function CheckLastCommit(url) {//поиск последнего commit(а)
    try {
        let response = await fetch(url + "?per_page=1&" + AuthKey);
        let result = await response.json();
        return (result[0].commit.author.date.split('T')[0]);
    } catch{
        return ("Не сущетсвует");
    }
}
function DeleteReposList() {//удаление репозиториев
    let ReposList = document.getElementById('ReposList');//список репозиториев
    while (ReposList.firstChild) {
        ReposList.removeChild(ReposList.firstChild);
    }
}
function DeletePaginator() {//удаление Paginator(а)
    let Paginator = document.getElementById('Paginator');
    while (Paginator.firstChild) {
        Paginator.removeChild(Paginator.firstChild);
    }
}
function CreatePaginator(MaxPageCount) {//создание Paginator(а)
    let Paginator = document.getElementById('Paginator');
    DeletePaginator();//удаление старого Paginator(а)
    //создание нового Paginator(а)
    if (NumberOfPage < 6) {
        for (let i = 1; i < MaxPageCount && i <= 10; i++) {
            let Button = document.createElement('input');
            Button.type = "button";
            Button.className = "NumberOfPage";
            Button.value = i;
            Button.setAttribute('onclick', 'GoToPage(this)');
            if (NumberOfPage == i) {
                Button.classList.add('ActivePage');
            }
            Paginator.append(Button);
        }
    } else {
        for (let i = Number(NumberOfPage) + 4 >= MaxPageCount ? Number(NumberOfPage) - 6 : Number(NumberOfPage) - 4; i < MaxPageCount && i < Number(NumberOfPage) + 6; i++) {
            let Button = document.createElement('input');
            Button.type = "button";
            Button.className = "NumberOfPage";
            Button.value = i;
            Button.setAttribute('onclick', 'GoToPage(this)');
            if (NumberOfPage == i) {
                Button.classList.add('ActivePage');
            }
            Paginator.append(Button);
        }
    }
}
function GoToPage(btn) { //переход по страницам
    //снятие флага с предыдущей кнопки
    let BtnFlag = document.getElementsByClassName('ActivePage');
    BtnFlag[0].classList.remove('ActivePage');
    //установка флага на текущей кнопке
    btn.classList.add('ActivePage');
    //если текущая страница не совпадает с желаемой
    if (NumberOfPage != btn.value) {
        NumberOfPage = btn.value;//текущая = желаемая
        sessionStorage.setItem('NumberOfPage', NumberOfPage);
        SetSearchQuery();//вызов функции поиска
    }
}
function OpenRepos(NameRepos) { //открыть страницу карточки репозитория
    localStorage.setItem('link', NameRepos.getAttribute('link')) // запись значения в localStorage
    location.href  = "/repository";
}
