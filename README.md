# GitHub Dashboard
## Содержание
1. [Описание](#description)
2. [Запуск проекта](#StartProject)

## <a name="description"> Описание: </a>
Dashboard GitHub разработанный с помошью API GitHub. 

Проект состоит из двух страниц: главная страница и страница с карточкой репозитория.

GitHub Dashboard Позволяет:

1) Выводить топ репозиториев GitHub;

2) Искать репозитории с сортировкой по кол-ву звезд;

3) Получать детальную информацию по репозиторию (кол-во звезд, дата последнего commit(а), ник владельца, топ активных контрибьютеров и т.п);

### Главная страница:
![](https://i.ibb.co/Cn01t9S/1.jpg)

На данной странице, по умолчанию, выводится топ репозиториев. Вверху страницы есть поиск репозиториев, внизу страницы располагается paginator. Колличество записей на одной странице равняется 10. 

Каждая запись выводит краткую информацию по репозиторию ( Название репозитория( при клике открывается карточка репозитория), кол-во звезд на GitHub, ссылка на Github и дату последнего commit(а)).

### Карточка репозитория: 
![](https://i.ibb.co/cT9QLS8/2.jpg)

На данной странице представлена более развернутая информация о репозитории ( Аватар владельца профиля, название репозитория, дата последнего commit(а), ник владельца репозитория (при клике открывается его профиль на GitHub), кол-во звезд, используемые языки, описание репозитория и топ самыйх активных контрибьютеров).

## <a name="StartProject"> Запуск проекта: </a>

1. Для запуска проекта необходимо запустить сервер Node Js. Для запуска сервера Node Js необходимо иметь уже установленный Node Js (Скачать Node Js можно по ссылке: https://nodejs.org/ru/);
2. Ввести `npm install` для установки всех необходимых пакетов;
3. Ввести `npm start` для старта сервера;
4. Открыть страницу проекта в браузере по адресу: `http://localhost:3000`(Главная страница).
