//DATA
const budjet = []; //все данные будут в виде массива объектов record

//DOM
const form = document.querySelector("#form");

const type = document.querySelector("#type");
const title = document.querySelector("#title");
const value = document.querySelector("#value");

const incomesList = document.querySelector("#incomes-list");
const expenseList = document.querySelector("#expenses-list");

const budjetEl = document.querySelector('#budget');
const totalInconeEl = document.querySelector('#total-income');
const totalExpenseEl = document.querySelector('#total-expense');
const percentWrapper = document.querySelector('#expense-percents-wrapper');

const monthEl = document.querySelector('#month');
const yearEl = document.querySelector('#year');
//форматирование суммы
const priceFormater = new Intl.NumberFormat('ru-RU', {
   style: 'currency',
   currency: 'RUB',
   maximumFractionDigits: 0
})


//Тестовые данные
function insertTestData() {
   const testData = [
      { type: 'inc', title: 'фриланс', value: 15000 },
      { type: 'inc', title: 'аванс', value: 35000 },
      { type: 'inc', title: 'зарплата', value: 50000 },
      { type: 'exp', title: 'транспорт', value: 200 },
      { type: 'exp', title: 'квартплата', value: 8000 },
      { type: 'exp', title: 'детский сад', value: 6000 },
   ];
   //получаем рандомный индекс от 0 до 7 testData.lenght-1
   function getRandomInt(max) {
      return Math.floor(Math.random() * max)
   }
   const randomIndex = getRandomInt(testData.length);
   //console.log(testData[randomIndex]);
   const randomData = testData[randomIndex];
   type.value = randomData.type;
   title.value = randomData.title;
   value.value = randomData.value;
}
function clearForm() {
   form.reset()
}

//считаем бюджет складываем весь type="inc"
function calcBudjet() {
   const totalIncone = budjet.reduce(function (total, element) {
      //считаем доход
      if (element.type === 'inc') {
         return total + element.value;
      } else {
         return total;
      }
   }, 0);

   const totalExpance = budjet.reduce(function (total, element) {
      //считаем расходы
      if (element.type === 'exp') {
         return total + element.value;
      } else {
         return total;
      }
   }, 0)

   // console.log('totalIncone', totalIncone);
   // console.log('totalExpance', totalExpance);

   const totalBudjet = totalIncone - totalExpance;

   //считаем бюджет и %
   let expensePercents;
   if (totalIncone) {
      expensePercents = Math.round((totalExpance * 100) / totalIncone);
   }
   budjetEl.innerHTML = priceFormater.format(totalBudjet);
   totalInconeEl.innerHTML = '+ ' + priceFormater.format(totalIncone);

   totalExpenseEl.innerHTML = '- ' + priceFormater.format(totalExpance);
   if (expensePercents) {
      const html = `<div class="badge">${expensePercents}%</div>`;
      percentWrapper.innerHTML = html;
   } else {
      percentWrapper.innerHTML = '';
   }
}
//вывод месяца и года
function displayMonth() {
   const now = new Date();
   const yeare = now.getUTCFullYear();
   const timeFormater = new Intl.DateTimeFormat('ru-RU', {
      month: 'long'
   })
   const month = timeFormater.format(now);
   monthEl.innerHTML = month;
   yearEl.innerHTML = yeare;
}

//Добавление записи
displayMonth();
insertTestData();
calcBudjet();
form.addEventListener("submit", function (e) {
   e.preventDefault();

   //проверка формы на заполненность
   if (title.value.trim() === "") {
      //trim() обрезает пустые символы
      title.classList.add("form__input--error");
      return;
   } else {
      title.classList.remove("form__input--error");
   }
   if (value.value.trim() === "" || +value.value <= 0) {
      value.classList.add("form__input--error");
      return;
   } else {
      value.classList.remove("form__input--error");
   }
   //формируем id
   let id = 1;
   if (budjet.length > 0) {
      //найти посл эл в массиве
      const lastElement = budjet[budjet.length - 1];
      //узнать его id
      const lastElementId = lastElement.id;
      //сформировать нов id = старый+1
      id = lastElementId + 1;
   }
   //запись расх/дох
   const record = {
      id: id,
      type: type.value.trim(),
      title: title.value,
      value: +value.value,
   };
   //Добавляем запись в бюджет
   budjet.push(record); //добавляем в массив
   //отображаем доход на стр
   if (record.type === "inc") {
      const html = `<li data-id="${record.id}" class="budget-list__item item item--income">
    <div class="item__title">${record.title}</div>
    <div class="item__right">
      <div class="item__amount">+ ${priceFormater.format(record.value)}</div>
      <button class="item__remove">
        <img src="./img/circle-green.svg" alt="delete" />
      </button>
    </div>
  </li>`;
      incomesList.insertAdjacentHTML("afterbegin", html);
   }
   //отображаем расходы на стр
   if (record.type === "exp") {
      const html = ` <li data-id="${record.id}" class="budget-list__item item item--expense">
    <div class="item__title">${record.title}</div>
    <div class="item__right">
      <div class="item__amount">- ${priceFormater.format(record.value)}</div>
      <button class="item__remove">
        <img src="./img/circle-red.svg" alt="delete" />
      </button>
    </div>
  </li>`;
      expenseList.insertAdjacentHTML("afterbegin", html);
   }
   clearForm();
   insertTestData();
   calcBudjet();
});

//Удаление записи

document.body.addEventListener('click', function (e) {
   //усл для кнопки удалить
   //console.log(e.target);
   // console.log(e.target.closest('button.item__remove'));
   if (e.target.closest('button.item__remove')) {

      const recordElement = e.target.closest('li.budget-list__item');
      //получаем id от li на который кликнули   
      const id = +recordElement.dataset.id;
      //  console.log(id);
      //поиск в массиве по id
      const index = budjet.findIndex(function (element) {
         if (id === element.id) {
            return true;
         }
      });
      console.log(index);
      //удаляем из массива по индексу
      budjet.splice(index, 1);
      //удаляем со страницы
      recordElement.remove();
      calcBudjet();
   }
});
